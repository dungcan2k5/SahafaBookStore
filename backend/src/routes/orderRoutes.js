const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

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

/**
 * @swagger
 * /api/orders/admin:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng (Admin/Employee)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *       403:
 *         description: Không có quyền
 */
router.get('/admin', authorize(['admin', 'employee']), orderController.getAllOrders);

/**
 * @swagger
 * /api/orders/admin/{id}:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng (Admin/Employee)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *               payment_status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       403:
 *         description: Không có quyền
 */
router.put('/admin/:id', authorize(['admin', 'employee']), orderController.updateOrderStatus);

module.exports = router;