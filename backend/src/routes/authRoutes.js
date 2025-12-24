// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Đăng ký / đăng nhập
router.post('/register', authController.register);
router.post('/login', authController.login);

// Lấy thông tin user hiện tại (cần token)
router.get('/me', verifyToken, authController.getProfile);

// Cập nhật profile (cần token)
router.put('/me', verifyToken, authController.updateProfile);

module.exports = router;
