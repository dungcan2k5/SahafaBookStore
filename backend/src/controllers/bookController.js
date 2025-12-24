const db = require('../config/database');

// 👇 KIỂM TRA QUAN TRỌNG:
// Nếu db.models không tồn tại, nghĩa là file models.js hoặc database.js bị lỗi export
if (!db.models) {
    console.error("❌ LỖI NGHIÊM TRỌNG: Không tìm thấy Models! Kiểm tra lại file database.js và models.js");
    process.exit(1); // Dừng app để báo lỗi ngay
}

const { Book, Author, Genre, BookImage } = db.models;
const { Op } = require('sequelize');

// [GET] /api/books - Lấy danh sách sách
const getAllBooks = async (req, res) => {
    try {
        const { search, genre, author } = req.query;
        const whereClause = {};

        if (search) whereClause.book_title = { [Op.like]: `%${search}%` };
        if (genre) whereClause.genre_id = genre;
        if (author) whereClause.author_id = author;

        const books = await Book.findAll({
            where: whereClause,
            // Sắp xếp ID tăng dần (cũ nhất lên trước)
            order: [['book_id', 'ASC']], 
            include: [
                { model: Author, attributes: ['author_name'] },
                { model: Genre, attributes: ['genre_name'] },
                { model: BookImage, attributes: ['book_image_url'] }
            ]
        });
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        console.error("Get All Books Error:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [GET] /api/books/:id - Chi tiết sách
const getBookDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id, { 
            include: [Author, Genre, BookImage] 
        });
        
        if (!book) return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
        
        res.status(200).json({ success: true, data: book });
    } catch (error) {
        console.error("Get Book Detail Error:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [POST] /api/books - Tạo sách mới
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
        console.error("Create Book Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// [PUT] /api/books/:id - Cập nhật sách
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        // Sequelize update trả về mảng [số_dòng_được_update]
        const [updatedCount] = await Book.update(req.body, { where: { book_id: id } });
        
        // Cập nhật ảnh (kể cả khi thông tin sách không đổi nhưng muốn đổi ảnh)
        if (req.body.image_url) {
            const img = await BookImage.findOne({ where: { book_id: id } });
            if (img) {
                await img.update({ book_image_url: req.body.image_url });
            } else {
                await BookImage.create({ book_id: id, book_image_url: req.body.image_url });
            }
        }

        if (updatedCount > 0 || req.body.image_url) {
            return res.status(200).json({ success: true, message: 'Cập nhật thành công' });
        }
        
        // Nếu không tìm thấy sách để update
        const exists = await Book.findByPk(id);
        if (!exists) return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });

        return res.status(200).json({ success: true, message: 'Không có thay đổi nào' });

    } catch (error) {
        console.error("Update Book Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// [DELETE] /api/books/:id - Xóa sách
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Xóa ảnh trước (Tránh lỗi khóa ngoại nếu DB setup chặt)
        await BookImage.destroy({ where: { book_id: id } });
        
        // 2. Xóa sách
        const deleted = await Book.destroy({ where: { book_id: id } });

        if (deleted) {
            return res.status(200).json({ success: true, message: 'Đã xóa sách' });
        }
        return res.status(404).json({ success: false, message: 'Sách không tồn tại' });
    } catch (error) {
        console.error("Delete Book Error:", error);
        // Lỗi thường gặp: Sách đang nằm trong Order hoặc Cart -> Không xóa được do khóa ngoại
        res.status(500).json({ success: false, message: 'Không thể xóa sách (Có thể sách đang có trong đơn hàng)' });
    }
};

// --- CÁC HÀM PHỤ ---

const getGenres = async (req, res) => {
    try {
        const genres = await Genre.findAll();
        res.status(200).json({ success: true, data: genres });
    } catch (e) { res.status(500).json({ error: e.message }) }
};
const getAuthors = async (req, res) => {
    try {
        const authors = await Author.findAll();
        res.status(200).json({ success: true, data: authors });
    } catch (e) { res.status(500).json({ error: e.message }) }
};
const getPublishers = async (req, res) => {
    try {
        const pub = await db.models.Publisher.findAll();
        res.status(200).json({ success: true, data: pub });
    } catch (e) { res.status(500).json({ error: e.message }) }
};

// --- QUẢN LÝ TÁC GIẢ & THỂ LOẠI ---

const createAuthor = async (req, res) => {
    try {
        const newAuthor = await Author.create(req.body);
        res.status(201).json({ success: true, data: newAuthor });
    } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        await Author.update(req.body, { where: { author_id: id } });
        res.status(200).json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        const count = await Book.count({ where: { author_id: id } });
        if (count > 0) return res.status(400).json({ success: false, message: 'Không thể xóa: Tác giả này đang có sách!' });
        await Author.destroy({ where: { author_id: id } });
        res.status(200).json({ success: true, message: 'Đã xóa tác giả' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const createGenre = async (req, res) => {
    try {
        const newGenre = await Genre.create(req.body);
        res.status(201).json({ success: true, data: newGenre });
    } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

const updateGenre = async (req, res) => {
    try {
        const { id } = req.params;
        await Genre.update(req.body, { where: { genre_id: id } });
        res.status(200).json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const deleteGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const count = await Book.count({ where: { genre_id: id } });
        if (count > 0) return res.status(400).json({ success: false, message: 'Không thể xóa: Đang có sách thuộc thể loại này!' });
        await Genre.destroy({ where: { genre_id: id } });
        res.status(200).json({ success: true, message: 'Đã xóa thể loại' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const importStock = async (req, res) => {
    try {
        const { book_id, quantity } = req.body;
        if (!book_id || !quantity || quantity <= 0) return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ!' });

        const book = await Book.findByPk(book_id);
        if (!book) return res.status(404).json({ success: false, message: 'Sách không tồn tại' });

        const newStock = parseInt(book.stock_quantity) + parseInt(quantity);
        await book.update({ stock_quantity: newStock });

        res.status(200).json({ success: true, message: `Đã nhập thêm ${quantity}. Tồn kho: ${newStock}`, data: book });
    } catch (error) { 
        console.error("Import Stock Error:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' }); 
    }
};

// [GET] /api/books/flash-sale - Lấy sách Flash Sale
const getFlashSaleBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            limit: 10,
            order: [['book_id', 'DESC']], 
            include: [
                // Sequelize thường trả về alias là BookImages (số nhiều)
                { model: BookImage, attributes: ['book_image_url'] }
            ]
        });

        const flashSaleData = books.map(book => {
            const originalPrice = parseFloat(book.price);
            const discountPercent = Math.floor(Math.random() * (50 - 10 + 1)) + 10; 
            const salePrice = originalPrice * (1 - discountPercent / 100);
            
            const totalStock = book.stock_quantity > 0 ? book.stock_quantity : 50;
            const sold = Math.floor(Math.random() * (totalStock - 1));

            // SỬA LỖI Ở ĐÂY: Dùng BookImages thay vì BOOK_IMAGEs
            let imageUrl = 'https://placehold.co/400x600?text=No+Image';
            if (book.BookImages && book.BookImages.length > 0) {
                 imageUrl = book.BookImages[0].book_image_url;
            }

            return {
                id: book.book_id,
                title: book.book_title,
                price: Math.round(salePrice / 1000) * 1000, 
                oldPrice: originalPrice,
                discount: discountPercent,
                image: imageUrl,
                sold: sold,
                totalStock: totalStock
            };
        });

        res.status(200).json({ success: true, data: flashSaleData });

    } catch (error) {
        console.error("Flash Sale Error:", error);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};

module.exports = { 
    getAllBooks, getBookDetail, createBook, updateBook, deleteBook, 
    getGenres, getAuthors, getPublishers,
    createAuthor, updateAuthor, deleteAuthor,
    createGenre, updateGenre, deleteGenre,
    importStock, getFlashSaleBooks
};