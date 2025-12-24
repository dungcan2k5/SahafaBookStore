// src/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const upload = require('../middleware/uploadMiddleware');

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

router.post('/', upload.single('image'), bookController.createBook);
router.put('/:id', upload.single('image'), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// --- ROUTE TÁC GIẢ ---
router.post('/authors', bookController.createAuthor);
router.put('/authors/:id', bookController.updateAuthor);
router.delete('/authors/:id', bookController.deleteAuthor);

// --- ROUTE THỂ LOẠI ---
router.post('/genres', bookController.createGenre);
router.put('/genres/:id', bookController.updateGenre);
router.delete('/genres/:id', bookController.deleteGenre);

// --- QUẢN LÝ NHẬP KHO ---
router.post('/import', bookController.importStock);

module.exports = router;
