const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

/**
 * @swagger
 * /api/stats/dashboard:
 *   get:
 *     summary: Lấy thống kê dashboard (Doanh thu, Đơn hàng, Chart)
 *     tags: [Stats]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *         description: Khoảng thời gian (mặc định month)
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/dashboard', statsController.getDashboardStats);

module.exports = router;
