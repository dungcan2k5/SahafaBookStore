const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Xử lý thanh toán
 */

/**
 * @swagger
 * /api/payment/sepay-webhook:
 *   post:
 *     summary: Nhận Webhook từ SePay (Hệ thống tự động gọi)
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gateway:
 *                 type: string
 *               transactionDate:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               transferAmount:
 *                 type: number
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã nhận dữ liệu thành công
 */
router.post('/sepay-webhook', paymentController.handleSepayWebhook);

/**
 * @swagger
 * /api/payment/transactions:
 *   get:
 *     summary: Lấy lịch sử giao dịch thanh toán (Admin/Employee)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách giao dịch
 *       403:
 *         description: Không có quyền
 */
router.get('/transactions', verifyToken, authorize(['admin', 'employee']), paymentController.getAllTransactions);
router.put('/transactions/:id/approve', verifyToken, authorize(['admin', 'employee']), paymentController.approveTransaction);

module.exports = router;
