const { models } = require('../config/database');
const { Book, Author, Genre, BookImage } = models; // Lấy các model cần dùng

// [GET] /api/books - Lấy danh sách sách
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            include: [
                { model: Author, attributes: ['author_name'] },
                { model: Genre, attributes: ['genre_name'] },
                { model: BookImage, attributes: ['book_image_url'] }
            ]
        });
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách sách' });
    }
};

// [GET] /api/books/:id - Lấy chi tiết 1 cuốn
const getBookDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id, {
            include: [Author, Genre, BookImage]
        });

        if (!book) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
        }

        res.status(200).json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [POST] /api/books - Tạo sách mới (Admin only - sau này thêm middleware auth)
const createBook = async (req, res) => {
    try {
        // Dữ liệu thô từ client gửi lên, validation (check lỗi) tao để sau nhé
        const newBook = await Book.create(req.body); 
        res.status(201).json({ success: true, data: newBook });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { getAllBooks, getBookDetail, createBook };