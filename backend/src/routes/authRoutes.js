// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Đăng ký / đăng nhập
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/change-password', verifyToken, authController.changePassword);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Chưa đăng nhập
 *
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.get('/me', verifyToken, authController.getProfile);
router.put('/me', verifyToken, authController.updateProfile);

module.exports = router;
