const { models, sequelize } = require('../config/database');
const { Order, OrderItem, Cart, CartItem, Book, Address, Voucher, User, Transaction } = models;
const { BaseOrderPrice, VoucherDecorator, ShippingFeeDecorator } = require('../patterns/PricingDecorators');

// helper: normalize payment method để khỏi lệch chuỗi
const normalizePaymentMethod = (m) => String(m || '').trim().toLowerCase();

// [POST] /api/orders - Tạo đơn hàng từ giỏ hàng
const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      payment_method,
      voucher_code,
      address_id,
      recipient_name,
      phone,
      address_detail
    } = req.body;

    const user_id = req.user_id;
    let finalAddressId = address_id;

    // 1) Địa chỉ
    if (!finalAddressId) {
      if (!recipient_name || !phone || !address_detail) {
        await t.rollback();
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin địa chỉ giao hàng' });
      }

      const newAddress = await Address.create({
        user_id,
        recipient_name,
        phone,
        address_detail,
        is_default: false
      }, { transaction: t });

      finalAddressId = newAddress.address_id;
    }

    // 2) Giỏ hàng
    const cart = await Cart.findOne({
      where: { user_id },
      include: [{ model: CartItem, include: [Book] }]
    });

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống!' });
    }

    // 3) Check kho
    for (const item of cart.CartItems) {
      if (item.Book.stock_quantity < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Sách "${item.Book.book_title}" không đủ hàng (Còn: ${item.Book.stock_quantity})`
        });
      }
    }

    // 4) Tính giá
    let priceCalculator = new BaseOrderPrice(cart.CartItems);

    let voucher = null;
    if (voucher_code) {
      voucher = await Voucher.findOne({ where: { code: voucher_code } });
      if (voucher) priceCalculator = new VoucherDecorator(priceCalculator, voucher);
    }

    priceCalculator = new ShippingFeeDecorator(priceCalculator, 30000);
    const finalAmount = await priceCalculator.calculate();

    const baseCalc = new BaseOrderPrice(cart.CartItems);
    const totalAmount = await baseCalc.calculate();

    // 5) Tạo Order
    const newOrder = await Order.create({
      user_id,
      shipping_address: finalAddressId,
      total_amount: totalAmount,
      final_amount: finalAmount,
      voucher_id: voucher ? voucher.voucher_id : null,
      payment_status: 'unpaid',
      order_status: 'pending'
      // ⚠️ Không set payment_method vào Order vì DB bạn đang thiếu cột đó (đã từng lỗi SQLITE)
    }, { transaction: t });

    // ✅ 6) Tạo Transaction PENDING nếu là “chuyển khoản” (normalize để không lệch chuỗi)
    const pm = normalizePaymentMethod(payment_method);

    const isBankTransfer =
      pm === 'bank_transfer' ||
      pm === 'bank-transfer' ||
      pm === 'transfer' ||
      pm === 'sepay' ||
      pm === 'bank' ||
      pm === 'qr' ||
      pm === 'vnpay_bank' ||
      pm === 'online';

    if (isBankTransfer) {
      await Transaction.create({
        order_id: newOrder.order_id,
        user_id: user_id,
        amount: finalAmount,
        payment_method: 'bank_transfer',
        status: 'pending'
      }, { transaction: t });
    }

    // 7) Tạo OrderItem & trừ kho
    for (const item of cart.CartItems) {
      await OrderItem.create({
        order_id: newOrder.order_id,
        book_id: item.book_id,
        quantity: item.quantity,
        unit_price: item.Book.price,
        subtotal: item.quantity * item.Book.price
      }, { transaction: t });

      await Book.decrement('stock_quantity', {
        by: item.quantity,
        where: { book_id: item.book_id },
        transaction: t
      });

      await Book.increment('total_sold', {
        by: item.quantity,
        where: { book_id: item.book_id },
        transaction: t
      });
    }

    // 8) Xóa giỏ
    await CartItem.destroy({
      where: { cart_id: cart.cart_id },
      transaction: t
    });

    await t.commit();

    // 9) Payment factory info (nếu có)
    let paymentInfo = null;
    try {
      const { PaymentFactory } = require('../patterns/PaymentFactory');
      const factory = PaymentFactory.getFactory(payment_method, models, sequelize);
      if (factory) {
        const processor = factory.createProcessor();
        paymentInfo = processor.generatePaymentInfo(newOrder);
      }
    } catch (err) {
      console.error("Payment Factory Error:", err);
    }

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công!',
      order_id: newOrder.order_id,
      final_amount: finalAmount,
      payment_info: paymentInfo
    });

  } catch (error) {
    await t.rollback();
    console.error("Order Error:", error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tạo đơn hàng' });
  }
};

// [GET] /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user_id },
      order: [['created_at', 'DESC']],
      include: [{ model: OrderItem, include: [{ model: Book, attributes: ['book_title'] }] }]
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [GET] /api/orders/admin
// src/controllers/orderController.js

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['order_id', 'ASC']],
      include: [
        { model: OrderItem, include: [{ model: Book, attributes: ['book_title'] }] },
        { model: models.User, attributes: ['full_name', 'email', 'phone'] },
        { model: Address, attributes: ['address_detail', 'recipient_name', 'phone'] },
        
        // --- THÊM DÒNG NÀY ---
        // Để lấy danh sách các giao dịch gắn với đơn hàng này
        { model: Transaction, attributes: ['transaction_id', 'status', 'payment_method'] } 
      ]
    });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [PUT] /api/orders/admin/:id
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });

    const updateData = {};
    if (order_status) updateData.order_status = order_status;
    if (payment_status) updateData.payment_status = payment_status;

    await order.update(updateData);

    res.status(200).json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [POST] /api/orders/admin/fake
const createFakeOrder = async (req, res) => {
  try {
    let user = await User.findByPk(1);
    if (!user) user = await User.findOne();
    if (!user) return res.status(400).json({ success: false, message: 'Chưa có User nào trong DB để gán đơn hàng!' });

    let fakeAddress = await models.Address.findOne({ where: { user_id: user.user_id } });
    if (!fakeAddress) {
      fakeAddress = await models.Address.create({
        user_id: user.user_id,
        recipient_name: 'Khách Test Admin',
        phone: '0999999999',
        address_detail: 'Số 1 Đường Test, Hà Nội',
        is_default: true
      });
    }

    const newOrder = await Order.create({
      user_id: user.user_id,
      total_amount: 500000,
      final_amount: 530000,
      shipping_address: fakeAddress.address_id,
      payment_status: 'unpaid',
      order_status: 'pending'
    });

    res.status(201).json({ success: true, message: 'Đã tạo đơn giả thành công!', data: newOrder });
  } catch (error) {
    console.error("Lỗi tạo đơn giả:", error);
    res.status(500).json({ success: false, message: 'Lỗi Server: ' + error.message });
  }
};

// [DELETE] /api/orders/admin/:id (xóa cứng)
const deleteOrderAdmin = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
    }

    await OrderItem.destroy({ where: { order_id: id }, transaction: t });
    await Transaction.destroy({ where: { order_id: id }, transaction: t });
    await Order.destroy({ where: { order_id: id }, transaction: t });

    await t.commit();
    return res.status(200).json({ success: true, message: 'Đã xóa đơn hàng (xóa cứng)' });
  } catch (error) {
    await t.rollback();
    console.error('Delete order error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi xóa đơn hàng' });
  }
};

module.exports = {
  createOrder, getMyOrders, getAllOrders, updateOrderStatus,
  createFakeOrder,
  deleteOrderAdmin
};
