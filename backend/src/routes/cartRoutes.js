const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Quản lý giỏ hàng
 */

// Tất cả route giỏ hàng đều cần đăng nhập
router.use(verifyToken);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Lấy thông tin giỏ hàng của người dùng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin giỏ hàng
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Thêm thành công
 *       400:
 *         description: Lỗi đầu vào
 *       401:
 *         description: Chưa đăng nhập
 */
router.post('/add', cartController.addToCart);

/**
 * @swagger
 * /api/cart/item/{id}:
 *   delete:
 *     summary: Xóa một sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của sản phẩm trong giỏ hàng (cart_item_id)
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Chưa đăng nhập
 *       404:
 *         description: Không tìm thấy sản phẩm trong giỏ hàng
 */
router.delete('/item/:id', cartController.removeCartItem);

module.exports = router;