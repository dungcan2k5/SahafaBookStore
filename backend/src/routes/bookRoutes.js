const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Quản lý sách
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Lấy danh sách tất cả sách
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Danh sách sách
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       book_id:
 *                         type: integer
 *                       book_title:
 *                         type: string
 *                       price:
 *                         type: number
 */
router.get('/', bookController.getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Lấy chi tiết sách
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của sách
 *     responses:
 *       200:
 *         description: Chi tiết sách
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 book_id:
 *                   type: integer
 *                 book_title:
 *                   type: string
 *                 price:
 *                   type: number
 *       404:
 *         description: Không tìm thấy sách
 */
router.get('/:id', bookController.getBookDetail);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Tạo sách mới
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_title:
 *                 type: string
 *               price:
 *                 type: number
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo sách thành công
 *       400:
 *         description: Lỗi đầu vào
 */
router.post('/', bookController.createBook);

module.exports = router;