// src/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { upload } = require('../middleware/uploadMiddleware');

// --- CÁC ROUTE LẤY DỮ LIỆU (GET) ---

router.get('/', bookController.getAllBooks);
router.get('/genres', bookController.getGenres);
router.get('/publishers', bookController.getPublishers);
router.get('/authors', bookController.getAuthors);

// Flash Sale (đặt trước /:id)
router.get('/flash-sale', bookController.getFlashSaleBooks);

// Chi tiết sách
router.get('/:id', bookController.getBookDetail);

// --- CÁC ROUTE ADMIN (THÊM / SỬA / XÓA) ---

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Thêm sách mới (Hỗ trợ upload nhiều ảnh)
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               book_title:
 *                 type: string
 *               isbn:
 *                 type: string
 *               price:
 *                 type: number
 *               stock_quantity:
 *                 type: integer
 *               author_id:
 *                 type: integer
 *               genre_id:
 *                 type: integer
 *               publisher_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Danh sách file ảnh upload (chọn nhiều file)
 *               # Ngoài ra có thể gửi kèm danh sách URL ảnh (nếu đã có sẵn)
 *               # images (text/array): ['url1', 'url2'] - Cái này Swagger khó mô tả chung field name, nhưng backend hỗ trợ
 *     responses:
 *       201:
 *         description: Tạo sách thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', upload.array('images', 10), bookController.createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Cập nhật thông tin sách (Hỗ trợ upload thêm ảnh và đồng bộ danh sách ảnh)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của sách
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               book_title:
 *                 type: string
 *               price:
 *                 type: number
 *               stock_quantity:
 *                 type: integer
 *               # Các field khác tương tự...
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Danh sách file ảnh MỚI muốn upload thêm
 *               # Để xóa ảnh hoặc sắp xếp lại, gửi kèm field images (dạng text/json) chứa danh sách URL cuối cùng
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy sách
 */
router.put('/:id', upload.array('images', 10), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// --- ROUTE TÁC GIẢ ---

/**
 * @swagger
 * /api/books/authors:
 *   post:
 *     summary: Thêm tác giả mới
 *     tags: [Books - Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author_name
 *             properties:
 *               author_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/authors', bookController.createAuthor);

/**
 * @swagger
 * /api/books/authors/{id}:
 *   put:
 *     summary: Cập nhật thông tin tác giả
 *     tags: [Books - Authors]
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
 *               author_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa tác giả (Chỉ xóa được nếu chưa có sách)
 *     tags: [Books - Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: Không thể xóa vì đang có sách liên kết
 */
router.put('/authors/:id', bookController.updateAuthor);
router.delete('/authors/:id', bookController.deleteAuthor);

// --- ROUTE THỂ LOẠI ---

/**
 * @swagger
 * /api/books/genres:
 *   post:
 *     summary: Thêm thể loại mới
 *     tags: [Books - Genres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - genre_name
 *             properties:
 *               genre_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/genres', bookController.createGenre);

/**
 * @swagger
 * /api/books/genres/{id}:
 *   put:
 *     summary: Cập nhật thể loại
 *     tags: [Books - Genres]
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
 *               genre_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa thể loại (Chỉ xóa được nếu chưa có sách)
 *     tags: [Books - Genres]
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
router.put('/genres/:id', bookController.updateGenre);
router.delete('/genres/:id', bookController.deleteGenre);

// --- QUẢN LÝ NHẬP KHO ---

/**
 * @swagger
 * /api/books/import:
 *   post:
 *     summary: Nhập kho (Cộng dồn số lượng tồn kho cho sách)
 *     tags: [Books - Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book_id
 *               - quantity
 *             properties:
 *               book_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 description: Số lượng nhập thêm (phải > 0)
 *     responses:
 *       200:
 *         description: Nhập kho thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/import', bookController.importStock);

module.exports = router;
