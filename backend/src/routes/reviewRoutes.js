const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Quản lý đánh giá, bình luận sách
 */

/**
 * @swagger
 * /api/reviews/book/{bookId}:
 *   get:
 *     summary: Lấy danh sách review của sách
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List review
 */
router.get('/book/:bookId', reviewController.getReviewsByBook);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Viết đánh giá mới
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book_id
 *               - rating
 *             properties:
 *               book_id:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đánh giá thành công
 */
router.post('/', verifyToken, reviewController.addReview);

module.exports = router;
