const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// --- CÁC ROUTE LẤY DỮ LIỆU (GET) ---

// Lấy danh sách sách (có tìm kiếm, lọc)
router.get('/', bookController.getAllBooks);

// Lấy danh sách thể loại
router.get('/genres', bookController.getGenres);

// Lấy danh sách NXB
router.get('/publishers', bookController.getPublishers);

// Lấy danh sách tác giả
router.get('/authors', bookController.getAuthors);

// Route Flash Sale (Phải đặt TRƯỚC route /:id để tránh bị nhầm 'flash-sale' là id)
router.get('/flash-sale', bookController.getFlashSaleBooks);

// Lấy chi tiết 1 cuốn sách
router.get('/:id', bookController.getBookDetail);


// --- CÁC ROUTE ADMIN (THÊM / SỬA / XÓA) ---


// Tạo sách mới
router.post('/', bookController.createBook);




// Cập nhật sách (Sửa)
router.put('/:id', bookController.updateBook);

// Xóa sách
router.delete('/:id', bookController.deleteBook);

// --- ROUTE TÁC GIẢ ---
router.post('/authors', bookController.createAuthor);       // Thêm
router.put('/authors/:id', bookController.updateAuthor);    // Sửa
router.delete('/authors/:id', bookController.deleteAuthor); // Xóa


// --- ROUTE THỂ LOẠI (BẠN ĐANG THIẾU ĐOẠN NÀY) ---
router.post('/genres', bookController.createGenre);       // Thêm
router.put('/genres/:id', bookController.updateGenre);    // Sửa
router.delete('/genres/:id', bookController.deleteGenre); // Xóa


// --- QUẢN LÝ NHẬP KHO ---
router.post('/import', bookController.importStock);




module.exports = router;