const { models, sequelize } = require('../config/database');
const { Order, OrderItem, Cart, CartItem, Book, Address } = models;

// [POST] /api/orders - Tạo đơn hàng từ giỏ hàng
const createOrder = async (req, res) => {
    const t = await sequelize.transaction(); // <--- Bắt đầu giao dịch (Transaction)

    try {
        const { address_id, payment_method } = req.body;
        const user_id = req.user_id;

        // 1. Lấy giỏ hàng
        const cart = await Cart.findOne({
            where: { user_id },
            include: [{ model: CartItem, include: [Book] }]
        });

        if (!cart || cart.CartItems.length === 0) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Giỏ hàng trống!' });
        }

        // 2. Tính tổng tiền & Kiểm tra tồn kho
        let totalAmount = 0;
        
        for (const item of cart.CartItems) {
            // Check kho ngay lập tức
            if (item.Book.stock_quantity < item.quantity) {
                await t.rollback(); // Hủy hết
                return res.status(400).json({ 
                    success: false, 
                    message: `Sách "${item.Book.book_title}" không đủ hàng (Còn: ${item.Book.stock_quantity})` 
                });
            }
            totalAmount += parseFloat(item.Book.price) * item.quantity;
        }

        // 3. Tạo Order
        const newOrder = await Order.create({
            user_id,
            shipping_address: address_id, // Giả sử user đã chọn address có sẵn
            total_amount: totalAmount,
            final_amount: totalAmount, // Chưa tính voucher, tạm thời bằng total
            payment_status: 'unpaid',
            order_status: 'pending'
        }, { transaction: t }); // Gắn transaction vào

        // 4. Tạo OrderItem & Trừ kho
        for (const item of cart.CartItems) {
            await OrderItem.create({
                order_id: newOrder.order_id,
                book_id: item.book_id,
                quantity: item.quantity,
                unit_price: item.Book.price,
                subtotal: item.quantity * item.Book.price
            }, { transaction: t });

            // Trừ stock sách
            await Book.decrement('stock_quantity', { 
                by: item.quantity, 
                where: { book_id: item.book_id },
                transaction: t 
            });
            
            // Tăng số lượng đã bán (total_sold)
             await Book.increment('total_sold', { 
                by: item.quantity, 
                where: { book_id: item.book_id },
                transaction: t 
            });
        }

        // 5. Xóa sạch giỏ hàng
        await CartItem.destroy({
            where: { cart_id: cart.cart_id },
            transaction: t
        });

        // 6. Chốt đơn thành công
        await t.commit(); 
        
        res.status(201).json({ 
            success: true, 
            message: 'Đặt hàng thành công!', 
            order_id: newOrder.order_id 
        });

    } catch (error) {
        await t.rollback(); // Có lỗi bất kỳ đâu -> Hủy toàn bộ thao tác nãy giờ
        console.error("Order Error:", error);
        res.status(500).json({ success: false, message: 'Lỗi server khi tạo đơn hàng' });
    }
};

// [GET] /api/orders/my-orders - Lấy lịch sử đơn hàng của mình
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user_id },
            order: [['created_at', 'DESC']], // Mới nhất lên đầu
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

module.exports = { createOrder, getMyOrders };