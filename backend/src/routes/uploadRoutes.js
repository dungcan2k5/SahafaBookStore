const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

/**
 * @swagger
 * components:
 *   schemas:
 *     ImageFile:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Tên file ảnh
 *         url:
 *           type: string
 *           description: Đường dẫn truy cập ảnh
 *         folder:
 *           type: string
 *           description: "Tên thư mục chứa ảnh (ví dụ 'Sách ID: 101' hoặc 'Ảnh chung')"
 */

/**
 * @swagger
 * /api/uploads/images:
 *   get:
 *     summary: Lấy danh sách tất cả ảnh đã upload lên server
 *     tags: [Uploads]
 *     responses:
 *       200:
 *         description: Danh sách ảnh thành công
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
 *                     $ref: '#/components/schemas/ImageFile'
 *       500:
 *         description: Lỗi server
 */
router.get('/images', uploadController.listImages);

module.exports = router;
