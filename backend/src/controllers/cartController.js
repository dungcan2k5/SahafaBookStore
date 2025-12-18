const { models } = require('../config/database');
const { Cart, CartItem, Book, BookImage } = models;

// [GET] /api/cart - Lấy giỏ hàng của user đang login
const getCart = async (req, res) => {
    try {
        // Tìm Cart của user
        const cart = await Cart.findOne({
            where: { user_id: req.user_id },
            include: [
                {
                    model: CartItem,
                    include: [
                        {
                            model: Book,
                            attributes: ['book_id', 'book_title', 'price'],
                            include: [{ model: BookImage, attributes: ['book_image_url'], limit: 1 }]
                        }
                    ]
                }
            ]
        });

        if (!cart) {
            // Case hiếm: User chưa có cart thì tạo mới trả về rỗng
            const newCart = await Cart.create({ user_id: req.user_id });
            return res.status(200).json({ success: true, data: { ...newCart.toJSON(), CartItems: [] } });
        }

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [POST] /api/cart/add - Thêm sách vào giỏ
const addToCart = async (req, res) => {
    try {
        const { book_id, quantity } = req.body;
        const qty = parseInt(quantity) || 1;

        // 1. Lấy Cart ID
        let cart = await Cart.findOne({ where: { user_id: req.user_id } });
        if (!cart) {
            cart = await Cart.create({ user_id: req.user_id });
        }

        // 2. Check xem sách đã có trong cart chưa
        const existingItem = await CartItem.findOne({
            where: { cart_id: cart.cart_id, book_id }
        });

        if (existingItem) {
            // Nếu có rồi -> Tăng số lượng
            existingItem.quantity += qty;
            await existingItem.save();
        } else {
            // Chưa có -> Tạo mới item
            await CartItem.create({
                cart_id: cart.cart_id,
                book_id,
                quantity: qty
            });
        }

        res.status(200).json({ success: true, message: 'Đã thêm vào giỏ' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [DELETE] /api/cart/item/:id - Xóa item khỏi giỏ
const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params; // Đây là cart_item_id
        await CartItem.destroy({ where: { cart_item_id: id } });
        res.status(200).json({ success: true, message: 'Đã xóa sản phẩm' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = { getCart, addToCart, removeCartItem };