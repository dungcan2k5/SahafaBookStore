const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Quản lý bài viết, tin tức
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Lấy danh sách bài viết
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List bài viết
 *   post:
 *     summary: Tạo bài viết mới (Admin/Employee)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - post_slug
 *             properties:
 *               title:
 *                 type: string
 *               post_slug:
 *                 type: string
 *               thumbnail_url:
 *                 type: string
 *               content:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *       403:
 *         description: Không có quyền
 */
router.get('/', postController.getAllPosts);
router.post('/', verifyToken, authorize(['admin', 'employee']), postController.createPost);

/**
 * @swagger
 * /api/posts/categories:
 *   get:
 *     summary: Lấy danh sách danh mục bài viết
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List danh mục
 */
router.get('/categories', postController.getPostCategories);

/**
 * @swagger
 * /api/posts/slug/{slug}:
 *   get:
 *     summary: Chi tiết bài viết theo slug
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nội dung bài viết
 */
router.get('/slug/:slug', postController.getPostBySlug);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Chi tiết bài viết
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nội dung bài viết
 *   put:
 *     summary: Cập nhật bài viết (Admin/Employee)
 *     tags: [Posts]
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa bài viết (Admin/Employee)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.get('/:id', postController.getPostDetail);
router.put('/:id', verifyToken, authorize(['admin', 'employee']), postController.updatePost);
router.delete('/:id', verifyToken, authorize(['admin', 'employee']), postController.deletePost);

module.exports = router;
