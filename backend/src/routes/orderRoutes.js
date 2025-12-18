const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Quản lý đơn hàng
 */

// Order thì chắc chắn phải login rồi
router.use(verifyToken);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo một đơn hàng mới từ giỏ hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *       400:
 *         description: Giỏ hàng trống hoặc lỗi khác
 *       401:
 *         description: Chưa đăng nhập
 */
router.post('/', orderController.createOrder); // Tạo đơn

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Lấy lịch sử mua hàng của người dùng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lịch sử mua hàng
 *       401:
 *         description: Chưa đăng nhập
 */
router.get('/my-orders', orderController.getMyOrders); // Xem lịch sử

module.exports = router;