const db = require('../config/database');

// 👇 KIỂM TRA QUAN TRỌNG:
if (!db.models) {
    console.error("❌ LỖI NGHIÊM TRỌNG: Không tìm thấy Models! Kiểm tra lại file database.js và models.js");
    process.exit(1);
}

const { Book, Author, Genre, BookImage } = db.models;
const { Op } = require('sequelize');

// [GET] /api/books - Lấy danh sách sách
const getAllBooks = async (req, res) => {
    try {
        const { search, category } = req.query; 
        
        let whereClause = {};
        
        // Cấu hình include để lấy dữ liệu liên quan
        let includeClause = [
            { model: Author, attributes: ['author_name'] }, // Bỏ alias 'as: Author' để tránh lỗi nếu chưa config
            { model: BookImage, attributes: ['book_image_url'] },
            // 👇 SỬA: Lấy thông tin Thể loại (Genre) thay vì Category
            { 
                model: Genre, 
                attributes: ['genre_name', 'genre_slug'] 
            } 
        ];

        // 1. Logic tìm kiếm (Search)
        if (search) {
             whereClause = {
                [Op.or]: [
                    // Tìm theo tên sách
                    { book_title: { [Op.like]: `%${search}%` } },
                    // Tìm theo tên tác giả (Query trên bảng liên kết Author)
                    { '$Author.author_name$': { [Op.like]: `%${search}%` } }
                ]
            };
        }

        // 2. Logic lọc theo Danh mục (Thực chất là tìm theo Genre Slug)
        if (category) {
            // Khi frontend gọi /api/books?category=van-hoc -> Backend tìm genre_slug = 'van-hoc'
            whereClause['$Genre.genre_slug$'] = category;
        }

        const books = await Book.findAll({
            where: whereClause,
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
        
        // Logic xử lý ảnh: Ưu tiên File Upload -> Sau đó đến URL String
        if (req.file) {
            const imageUrl = `/uploads/images/${req.file.filename}`;
            await BookImage.create({
                book_id: newBook.book_id,
                book_image_url: imageUrl
            });
        } 
        else if (req.body.image_url) {
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

// [PUT] /api/books/:id - Cập nhật sách (ĐÃ XỬ LÝ CONFLICT)
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Sequelize update trả về mảng [số_dòng_được_update]
        const [updatedCount] = await Book.update(req.body, { where: { book_id: id } });
        
        // --- XỬ LÝ ẢNH (Logic gộp từ Dev và Local) ---
        let newImageUrl = null;

        // 1. Nếu có file upload mới -> Lấy đường dẫn file
        if (req.file) {
            newImageUrl = `/uploads/images/${req.file.filename}`;
        } 
        // 2. Nếu không upload file, nhưng có gửi link ảnh mới
        else if (req.body.image_url) {
            newImageUrl = req.body.image_url;
        }

        // Nếu xác định được ảnh mới thì cập nhật vào bảng BookImage
        if (newImageUrl) {
            const img = await BookImage.findOne({ where: { book_id: id } });
            if (img) {
                await img.update({ book_image_url: newImageUrl });
            } else {
                await BookImage.create({ book_id: id, book_image_url: newImageUrl });
            }
        }

        // Nếu thông tin sách thay đổi HOẶC có ảnh mới -> Báo thành công
        if (updatedCount > 0 || newImageUrl) {
            return res.status(200).json({ success: true, message: 'Cập nhật thành công' });
        }
        
        // Nếu không tìm thấy sách để update (Do ID sai)
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
        
        // 1. Xóa ảnh trước
        await BookImage.destroy({ where: { book_id: id } });
        
        // 2. Xóa sách
        const deleted = await Book.destroy({ where: { book_id: id } });

        if (deleted) {
            return res.status(200).json({ success: true, message: 'Đã xóa sách' });
        }
        return res.status(404).json({ success: false, message: 'Sách không tồn tại' });
    } catch (error) {
        console.error("Delete Book Error:", error);
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
                { model: BookImage, attributes: ['book_image_url'] }
            ]
        });

        const flashSaleData = books.map(book => {
            const originalPrice = parseFloat(book.price);
            const discountPercent = Math.floor(Math.random() * (50 - 10 + 1)) + 10; 
            const salePrice = originalPrice * (1 - discountPercent / 100);
            
            const totalStock = book.stock_quantity > 0 ? book.stock_quantity : 50;
            const sold = Math.floor(Math.random() * (totalStock - 1));

            // SỬA LỖI Ở ĐÂY: Dùng BookImages thay vì BOOK_IMAGEs cho khớp với model mới
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