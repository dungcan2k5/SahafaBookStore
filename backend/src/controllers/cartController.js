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
// [PUT] /api/cart/item/:id - Cập nhật số lượng
const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params; // cart_item_id
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ success: false, message: 'Số lượng không hợp lệ' });
        }

        // Tìm item trong giỏ
        const item = await CartItem.findOne({ where: { cart_item_id: id } });
        
        if (!item) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        }

        // Cập nhật số lượng mới
        item.quantity = quantity;
        await item.save();

        res.status(200).json({ success: true, message: 'Cập nhật thành công', data: item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server khi update' });
    }
};

// [DELETE] /api/cart/clear - Xóa tất cả giỏ hàng
const clearCart = async (req, res) => {
    try {
        // 1. Tìm Cart của user hiện tại
        const cart = await Cart.findOne({ where: { user_id: req.user_id } });
        
        if (cart) {
            // 2. Xóa tất cả CartItem thuộc về cart_id này
            await CartItem.destroy({ where: { cart_id: cart.cart_id } });
        }

        res.status(200).json({ success: true, message: 'Đã làm sạch giỏ hàng' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server khi clear cart' });
    }
};
module.exports = { getCart, addToCart, removeCartItem, updateCartItem, clearCart };