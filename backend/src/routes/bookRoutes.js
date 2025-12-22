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
 *     summary: Lấy danh sách tất cả sách (có hỗ trợ tìm kiếm và lọc)
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên sách
 *       - in: query
 *         name: genre
 *         schema:
 *           type: integer
 *         description: ID của danh mục (thể loại) để lọc
 *       - in: query
 *         name: author
 *         schema:
 *           type: integer
 *         description: ID của tác giả để lọc
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
 *                       Author:
 *                         type: object
 *                         properties:
 *                           author_name:
 *                             type: string
 *                       Genre:
 *                         type: object
 *                         properties:
 *                           genre_name:
 *                             type: string
 */
router.get('/', bookController.getAllBooks);

/**
 * @swagger
 * /api/books/genres:
 *   get:
 *     summary: Lấy danh sách danh mục (thể loại)
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Danh sách danh mục
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
 *                       genre_id:
 *                         type: integer
 *                       genre_name:
 *                         type: string
 *                       genre_slug:
 *                         type: string
 */
router.get('/genres', bookController.getGenres);

/**
 * @swagger
 * /api/books/publishers:
 *   get:
 *     summary: Lấy danh sách nhà xuất bản
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Danh sách nhà xuất bản
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
 *                       publisher_id:
 *                         type: integer
 *                       publisher_name:
 *                         type: string
 *                       publisher_slug:
 *                         type: string
 */
router.get('/publishers', bookController.getPublishers);

/**
 * @swagger
 * /api/books/authors:
 *   get:
 *     summary: Lấy danh sách tác giả
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Danh sách tác giả
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
 *                       author_id:
 *                         type: integer
 *                       author_name:
 *                         type: string
 *                       author_slug:
 *                         type: string
 */
router.get('/authors', bookController.getAuthors);

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
