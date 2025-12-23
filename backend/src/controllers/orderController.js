// const { models, sequelize } = require('../config/database');
// const { Order, OrderItem, Cart, CartItem, Book, Address, Voucher } = models;
// const { BaseOrderPrice, VoucherDecorator, ShippingFeeDecorator } = require('../patterns/PricingDecorators');

// // [POST] /api/orders - Tạo đơn hàng từ giỏ hàng
// const createOrder = async (req, res) => {
//     const t = await sequelize.transaction(); // <--- Bắt đầu giao dịch (Transaction)

//     try {
//         const { address_id, payment_method, voucher_code } = req.body;
//         const user_id = req.user_id;

//         // 1. Lấy giỏ hàng
//         const cart = await Cart.findOne({
//             where: { user_id },
//             include: [{ model: CartItem, include: [Book] }]
//         });

//         if (!cart || cart.CartItems.length === 0) {
//             await t.rollback();
//             return res.status(400).json({ success: false, message: 'Giỏ hàng trống!' });
//         }

//         // 2. Check kho hàng (Validation logic)
//         for (const item of cart.CartItems) {
//             if (item.Book.stock_quantity < item.quantity) {
//                 await t.rollback();
//                 return res.status(400).json({ 
//                     success: false, 
//                     message: `Sách "${item.Book.book_title}" không đủ hàng (Còn: ${item.Book.stock_quantity})` 
//                 });
//             }
//         }

//         // 3. Áp dụng Decorator Pattern để tính giá
//         // B1: Giá gốc
//         let priceCalculator = new BaseOrderPrice(cart.CartItems);
        
//         // B2: Áp dụng Voucher (nếu có)
//         let voucher = null;
//         if (voucher_code) {
//             voucher = await Voucher.findOne({ where: { code: voucher_code } });
//             // Cần check hạn sử dụng voucher ở đây nếu kỹ
//             if (voucher) {
//                 priceCalculator = new VoucherDecorator(priceCalculator, voucher);
//             }
//         }

//         // B3: Áp dụng Ship (Ví dụ mặc định 30k)
//         priceCalculator = new ShippingFeeDecorator(priceCalculator, 30000);

//         // Tính toán
//         const finalAmount = await priceCalculator.calculate();
        
//         // Lấy totalAmount gốc để lưu DB (cho đẹp report)
//         const baseCalc = new BaseOrderPrice(cart.CartItems);
//         const totalAmount = await baseCalc.calculate();


//         // 4. Tạo Order
//         const newOrder = await Order.create({
//             user_id,
//             shipping_address: address_id, 
//             total_amount: totalAmount,
//             final_amount: finalAmount, 
//             voucher_id: voucher ? voucher.voucher_id : null,
//             payment_status: 'unpaid',
//             order_status: 'pending'
//         }, { transaction: t });

//         // 5. Tạo OrderItem & Trừ kho
//         for (const item of cart.CartItems) {
//             await OrderItem.create({
//                 order_id: newOrder.order_id,
//                 book_id: item.book_id,
//                 quantity: item.quantity,
//                 unit_price: item.Book.price,
//                 subtotal: item.quantity * item.Book.price
//             }, { transaction: t });

//             // Trừ stock sách
//             await Book.decrement('stock_quantity', { 
//                 by: item.quantity, 
//                 where: { book_id: item.book_id },
//                 transaction: t 
//             });
            
//             // Tăng số lượng đã bán (total_sold)
//              await Book.increment('total_sold', { 
//                 by: item.quantity, 
//                 where: { book_id: item.book_id },
//                 transaction: t 
//             });
//         }

//         // 6. Xóa sạch giỏ hàng
//         await CartItem.destroy({
//             where: { cart_id: cart.cart_id },
//             transaction: t
//         });

//         // 7. Chốt đơn thành công
//         await t.commit(); 

//         // --- Payment Factory Usage ---
//         let paymentInfo = null;
//         try {
//             const { PaymentFactory } = require('../patterns/PaymentFactory');
//             // Lấy Factory tương ứng dựa trên payment_method client gửi lên
//             const factory = PaymentFactory.getFactory(payment_method, models, sequelize);

//             if (factory) {
//                 const processor = factory.createProcessor();
//                 paymentInfo = processor.generatePaymentInfo(newOrder);
//             }
//         } catch (err) {
//             console.error("Payment Factory Error:", err);
//         }
//         // -----------------------------
        
//         res.status(201).json({ 
//             success: true, 
//             message: 'Đặt hàng thành công!', 
//             order_id: newOrder.order_id,
//             final_amount: finalAmount,
//             payment_info: paymentInfo
//         });

//     } catch (error) {
//         await t.rollback(); // Có lỗi bất kỳ đâu -> Hủy toàn bộ thao tác nãy giờ
//         console.error("Order Error:", error);
//         res.status(500).json({ success: false, message: 'Lỗi server khi tạo đơn hàng' });
//     }
// };

// // [GET] /api/orders/my-orders - Lấy lịch sử đơn hàng của mình
// const getMyOrders = async (req, res) => {
//     try {
//         const orders = await Order.findAll({
//             where: { user_id: req.user_id },
//             order: [['created_at', 'DESC']], // Mới nhất lên đầu
//             include: [
//                 { 
//                     model: OrderItem,
//                     include: [{ model: Book, attributes: ['book_title'] }] 
//                 }
//             ]
//         });
//         res.status(200).json({ success: true, data: orders });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Lỗi server' });
//     }
// };

// // [GET] /api/orders/admin - Lấy danh sách toàn bộ đơn hàng (Admin/Employee)
// const getAllOrders = async (req, res) => {
//     try {
//         // Có thể thêm filter theo status, date... sau này
//         const orders = await Order.findAll({
//             order: [['created_at', 'DESC']],
//             include: [
//                 { 
//                     model: OrderItem,
//                     include: [{ model: Book, attributes: ['book_title'] }] 
//                 },
//                 {
//                     model: models.User,
//                     attributes: ['full_name', 'email', 'phone']
//                 },
//                 {
//                     model: Address,
//                     attributes: ['address_detail', 'recipient_name', 'phone']
//                 }
//             ]
//         });
//         res.status(200).json({ success: true, data: orders });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Lỗi server' });
//     }
// };

// // [PUT] /api/orders/admin/:id - Cập nhật trạng thái đơn hàng
// const updateOrderStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { order_status, payment_status } = req.body;

//         const order = await Order.findByPk(id);
//         if (!order) {
//             return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
//         }

//         const updateData = {};
//         if (order_status) updateData.order_status = order_status;
//         if (payment_status) updateData.payment_status = payment_status;

//         await order.update(updateData);

//         res.status(200).json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Lỗi server' });
//     }
// };

// module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };





const { models, sequelize } = require('../config/database');
const { Order, OrderItem, Cart, CartItem, Book, Address, Voucher } = models;
const { BaseOrderPrice, VoucherDecorator, ShippingFeeDecorator } = require('../patterns/PricingDecorators');

// [POST] /api/orders - Tạo đơn hàng từ giỏ hàng
const createOrder = async (req, res) => {
    const t = await sequelize.transaction(); // <--- Bắt đầu giao dịch

    try {
        const { 
            payment_method, 
            voucher_code,
            // Nhận thêm các trường này từ Frontend
            address_id, 
            recipient_name, 
            phone, 
            address_detail 
        } = req.body;
        
        const user_id = req.user_id;
        let finalAddressId = address_id;

        // --- 1. XỬ LÝ ĐỊA CHỈ (Logic Mới) ---
        // Nếu Frontend không gửi ID (hoặc gửi null), ta sẽ tạo địa chỉ mới
        if (!finalAddressId) {
            // Validate dữ liệu
            if (!recipient_name || !phone || !address_detail) {
                await t.rollback();
                return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin địa chỉ giao hàng' });
            }

            // Tạo bản ghi Address mới
            const newAddress = await Address.create({
                user_id,
                recipient_name,
                phone,
                address_detail,
                is_default: false // Địa chỉ này tạm thời không set mặc định
            }, { transaction: t });

            finalAddressId = newAddress.address_id; // Lấy ID vừa tạo ra để dùng
        }
        // -------------------------------------

        // 2. Lấy giỏ hàng
        const cart = await Cart.findOne({
            where: { user_id },
            include: [{ model: CartItem, include: [Book] }]
        });

        if (!cart || cart.CartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Giỏ hàng trống!' });
        }

        // 3. Check kho hàng
        for (const item of cart.CartItems) {
            if (item.Book.stock_quantity < item.quantity) {
                await t.rollback();
                return res.status(400).json({ 
                    success: false, 
                    message: `Sách "${item.Book.book_title}" không đủ hàng (Còn: ${item.Book.stock_quantity})` 
                });
            }
        }

        // 4. Tính toán giá (Decorator Pattern)
        let priceCalculator = new BaseOrderPrice(cart.CartItems);
        
        // Áp dụng Voucher
        let voucher = null;
        if (voucher_code) {
            voucher = await Voucher.findOne({ where: { code: voucher_code } });
            if (voucher) {
                // TODO: Nên check thêm hạn sử dụng voucher tại đây
                priceCalculator = new VoucherDecorator(priceCalculator, voucher);
            }
        }

        // Áp dụng Ship (30k)
        priceCalculator = new ShippingFeeDecorator(priceCalculator, 30000);
        const finalAmount = await priceCalculator.calculate();
        
        // Tính giá gốc để lưu
        const baseCalc = new BaseOrderPrice(cart.CartItems);
        const totalAmount = await baseCalc.calculate();

        // 5. Tạo Order (Dùng finalAddressId đã xử lý ở trên)
        const newOrder = await Order.create({
            user_id,
            shipping_address: finalAddressId, // <--- ID chuẩn (dù cũ hay mới)
            total_amount: totalAmount,
            final_amount: finalAmount, 
            voucher_id: voucher ? voucher.voucher_id : null,
            payment_status: 'unpaid',
            order_status: 'pending'
        }, { transaction: t });

        // 6. Tạo OrderItem & Trừ kho
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

        // 7. Xóa giỏ hàng
        await CartItem.destroy({
            where: { cart_id: cart.cart_id },
            transaction: t
        });

        // 8. Chốt đơn (Commit Transaction)
        await t.commit(); 

        // --- 9. Payment Factory ---
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
            // Không rollback ở đây vì đơn hàng đã tạo thành công rồi, chỉ lỗi bước lấy QR thôi
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

// [GET] /api/orders/my-orders - Lấy lịch sử đơn hàng
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user_id },
            order: [['created_at', 'DESC']],
            include: [
                { 
                    model: OrderItem,
                    include: [{ model: Book, attributes: ['book_title'] }] 
                }
            ]
        });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [GET] /api/orders/admin - Lấy toàn bộ đơn (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            order: [['created_at', 'DESC']],
            include: [
                { 
                    model: OrderItem,
                    include: [{ model: Book, attributes: ['book_title'] }] 
                },
                {
                    model: models.User,
                    attributes: ['full_name', 'email', 'phone']
                },
                {
                    model: Address,
                    attributes: ['address_detail', 'recipient_name', 'phone']
                }
            ]
        });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [PUT] /api/orders/admin/:id - Cập nhật trạng thái
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { order_status, payment_status } = req.body;

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
        }

        const updateData = {};
        if (order_status) updateData.order_status = order_status;
        if (payment_status) updateData.payment_status = payment_status;

        await order.update(updateData);

        res.status(200).json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };