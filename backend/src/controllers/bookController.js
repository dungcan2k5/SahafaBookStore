const { models } = require('../config/database');
const { Book, Author, Genre, BookImage } = models; // Lấy các model cần dùng
const { Op } = require('sequelize');

// [GET] /api/books - Lấy danh sách sách (có tìm kiếm và lọc)
const getAllBooks = async (req, res) => {
    try {
        const { search, genre, author } = req.query;
        const whereClause = {};

        // Tìm kiếm theo tên sách
        if (search) {
            whereClause.book_title = { [Op.like]: `%${search}%` };
        }

        // Lọc theo danh mục (Genre)
        if (genre) {
            whereClause.genre_id = genre;
        }

        // Lọc theo tác giả
        if (author) {
            whereClause.author_id = author;
        }

        const books = await Book.findAll({
            where: whereClause,
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

// [GET] /api/books/genres - Lấy danh sách danh mục (thể loại)
const getGenres = async (req, res) => {
    try {
        const genres = await Genre.findAll();
        res.status(200).json({ success: true, data: genres });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách thể loại' });
    }
};

// [GET] /api/books/authors - Lấy danh sách tác giả
const getAuthors = async (req, res) => {
    try {
        const authors = await Author.findAll();
        res.status(200).json({ success: true, data: authors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách tác giả' });
    }
};

// [GET] /api/books/publishers - Lấy danh sách nhà xuất bản
const getPublishers = async (req, res) => {
    try {
        const publishers = await models.Publisher.findAll();
        res.status(200).json({ success: true, data: publishers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách NXB' });
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

module.exports = { getAllBooks, getBookDetail, createBook, getGenres, getAuthors, getPublishers };