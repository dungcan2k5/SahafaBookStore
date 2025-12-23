const { models } = require('../config/database');
const { Book, Author, Genre, BookImage } = models; 
const { Op } = require('sequelize');

// [GET] /api/books - Lấy danh sách
const getAllBooks = async (req, res) => {
    try {
        const { search, genre, author } = req.query;
        const whereClause = {};

        if (search) whereClause.book_title = { [Op.like]: `%${search}%` };
        if (genre) whereClause.genre_id = genre;
        if (author) whereClause.author_id = author;

        const books = await Book.findAll({
            where: whereClause,
            
            // 👇 SỬA DÒNG NÀY: Đổi 'DESC' thành 'ASC'
            order: [['book_id', 'ASC']], 
            
            include: [
                { model: Author, attributes: ['author_name'] },
                { model: Genre, attributes: ['genre_name'] },
                { model: BookImage, attributes: ['book_image_url'] }
            ]
        });
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [GET] /api/books/:id - Chi tiết
const getBookDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id, { include: [Author, Genre, BookImage] });
        if (!book) return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
        res.status(200).json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [POST] /api/books - Tạo mới
const createBook = async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        
        // Nếu có ảnh, tạo luôn bản ghi ảnh
        if (req.body.image_url) {
            await BookImage.create({
                book_id: newBook.book_id,
                book_image_url: req.body.image_url
            });
        }
        
        res.status(201).json({ success: true, data: newBook });
    } catch (error) {
        console.error("Lỗi tạo sách:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// [PUT] /api/books/:id - Cập nhật (MỚI THÊM)
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Book.update(req.body, { where: { book_id: id } });
        
        if (updated) {
            // Cập nhật ảnh nếu có
            if (req.body.image_url) {
                const img = await BookImage.findOne({ where: { book_id: id } });
                if (img) {
                    await img.update({ book_image_url: req.body.image_url });
                } else {
                    await BookImage.create({ book_id: id, book_image_url: req.body.image_url });
                }
            }
            return res.status(200).json({ success: true, message: 'Cập nhật thành công' });
        }
        throw new Error('Không tìm thấy sách');
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [DELETE] /api/books/:id - Xóa sách (MỚI THÊM)
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Xóa ảnh trước (Tránh lỗi khóa ngoại)
        await BookImage.destroy({ where: { book_id: id } });
        
        // 2. Xóa sách
        const deleted = await Book.destroy({ where: { book_id: id } });

        if (deleted) {
            return res.status(200).json({ success: true, message: 'Đã xóa sách' });
        }
        throw new Error('Sách không tồn tại');
    } catch (error) {
        console.error("Lỗi xóa sách:", error);
        res.status(500).json({ success: false, message: 'Lỗi server hoặc sách đang có đơn hàng' });
    }
};

// Các hàm phụ (Giữ nguyên)
const getGenres = async (req, res) => {
    const genres = await Genre.findAll();
    res.status(200).json({ success: true, data: genres });
};
const getAuthors = async (req, res) => {
    const authors = await Author.findAll();
    res.status(200).json({ success: true, data: authors });
};
const getPublishers = async (req, res) => {
    const pub = await models.Publisher.findAll();
    res.status(200).json({ success: true, data: pub });
};


// --- QUẢN LÝ TÁC GIẢ (THÊM MỚI) ---

// [POST] Thêm tác giả
const createAuthor = async (req, res) => {
    try {
        const newAuthor = await Author.create(req.body);
        res.status(201).json({ success: true, data: newAuthor });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [PUT] Sửa tác giả
const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        await Author.update(req.body, { where: { author_id: id } });
        res.status(200).json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [DELETE] Xóa tác giả
const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        // Kiểm tra xem tác giả này có sách chưa? Nếu có thì không cho xóa ẩu.
        const count = await Book.count({ where: { author_id: id } });
        if (count > 0) {
            return res.status(400).json({ success: false, message: 'Không thể xóa: Tác giả này đang có sách!' });
        }
        
        await Author.destroy({ where: { author_id: id } });
        res.status(200).json({ success: true, message: 'Đã xóa tác giả' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- QUẢN LÝ THỂ LOẠI (GENRE) ---

// [POST] Thêm thể loại
const createGenre = async (req, res) => {
    try {
        const newGenre = await Genre.create(req.body);
        res.status(201).json({ success: true, data: newGenre });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [PUT] Sửa thể loại
const updateGenre = async (req, res) => {
    try {
        const { id } = req.params;
        await Genre.update(req.body, { where: { genre_id: id } });
        res.status(200).json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [DELETE] Xóa thể loại
const deleteGenre = async (req, res) => {
    try {
        const { id } = req.params;
        // Chặn xóa nếu đang có sách thuộc thể loại này
        const count = await Book.count({ where: { genre_id: id } });
        if (count > 0) {
            return res.status(400).json({ success: false, message: 'Không thể xóa: Đang có sách thuộc thể loại này!' });
        }
        
        await Genre.destroy({ where: { genre_id: id } });
        res.status(200).json({ success: true, message: 'Đã xóa thể loại' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [POST] Nhập kho (Cộng dồn số lượng sách)
const importStock = async (req, res) => {
    try {
        const { book_id, quantity } = req.body;

        // 1. Kiểm tra đầu vào
        if (!book_id || !quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Dữ liệu nhập kho không hợp lệ!' });
        }

        // 2. Tìm sách
        const book = await Book.findByPk(book_id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Sách không tồn tại' });
        }

        // 3. Cập nhật tồn kho (Cũ + Mới)
        // Ép kiểu số nguyên để tránh lỗi cộng chuỗi
        const newStock = parseInt(book.stock_quantity) + parseInt(quantity);
        
        await book.update({ stock_quantity: newStock });

        res.status(200).json({ 
            success: true, 
            message: `Đã nhập thêm ${quantity} cuốn. Tồn kho hiện tại: ${newStock}`,
            data: book 
        });

    } catch (error) {
        console.error("Lỗi nhập kho:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = { 
    getAllBooks, getBookDetail, createBook, updateBook, deleteBook, 
    getGenres, getAuthors, getPublishers,
    createAuthor, updateAuthor, deleteAuthor,
    createGenre, updateGenre, deleteGenre,
    importStock
};