// Dòng cũ (Sai): tạm thời command lại để tránh lỗi không tìm thấy Models
// const db = require('../models/models'); // Đảm bảo đường dẫn trỏ đúng file models/index.js hoặc models.js của bạn

// ✅ DÒNG MỚI (ĐÚNG): Phải gọi vào file config database nơi đã khởi tạo models
const { models } = require('../config/database'); 

// 👇 KIỂM TRA QUAN TRỌNG:
if (!models || !models.Book) {
    console.error("❌ LỖI NGHIÊM TRỌNG: Không tìm thấy Models! Kiểm tra lại file database.js");
    // Không exit process để tránh sập server dev, nhưng sẽ báo lỗi đỏ
}

// Destructuring các Model ra để dùng bên dưới
const { Book, Author, Genre, BookImage, Publisher } = models; 
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { uploadRoot } = require('../middleware/uploadMiddleware');

// [GET] /api/books - Lấy danh sách sách (Fix lỗi Search Author)
const getAllBooks = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 10 } = req.query; 
        
        const offset = (page - 1) * limit;
        const limitInt = parseInt(limit);

        let whereClause = {};
        
        // 1. Logic tìm kiếm (Search)
        if (search) {
             whereClause = {
                [Op.or]: [
                    { book_title: { [Op.like]: `%${search}%` } },
                    // Cú pháp $ModelAlias.column$ để search bảng liên kết
                    { '$Author.author_name$': { [Op.like]: `%${search}%` } }
                ]
            };
        }

        // 2. Logic lọc theo Danh mục
        if (category) {
            whereClause['$Genre.genre_name$'] = { [Op.like]: `%${category}%` }; // Sửa lại cho linh hoạt hơn hoặc dùng genre_slug nếu DB có
        }

        const { count, rows } = await Book.findAndCountAll({
            where: whereClause,
            // 👇 LOGIC QUAN TRỌNG: Cho phép sắp xếp theo cột (ví dụ: total_sold)
            order: sort ? [[sort, order || 'DESC']] : [['book_id', 'ASC']], 
            // 👇 GIỚI HẠN SỐ LƯỢNG: Chỉ lấy số lượng cần thiết (ví dụ: 4)
            limit: limit ? parseInt(limit) : undefined,
            include: [
                { 
                    model: Author, 
                    attributes: ['author_name'],
                    as: 'Author' // Đảm bảo Alias khớp với query '$Author...'
                },
                { 
                    model: Genre, 
                    attributes: ['genre_name'],
                    as: 'Genre'
                },
                { 
                    model: BookImage, 
                    attributes: ['book_image_url'],
                    as: 'BookImages' // Kiểm tra xem trong models define alias là gì (thường là BookImages hoặc book_images)
                }
            ],
            limit: limitInt,
            offset: offset,
            distinct: true, // Để đếm đúng sách (không đếm trùng do nhiều ảnh)
            
            // 🔥 QUAN TRỌNG: Dòng này sửa lỗi SQLITE_ERROR: no such column: Author.author_name
            // Nó buộc Sequelize không tạo subquery cắt trang trước khi join bảng
            subQuery: false 
        });


        res.status(200).json({ 
            success: true, 
            data: rows,
            meta: {
                total: count,
                page: parseInt(page),
                limit: limitInt,
                totalPages: Math.ceil(count / limitInt)
            }
        });
    } catch (error) {
        console.error("Get All Books Error:", error);
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// [GET] /api/books/:idOrSlug
const getBookDetail = async (req, res) => {
    try {
        const { id } = req.params; // Tham số này có thể là ID (22) hoặc Slug (nha-gia-kim)
        let book;

        // KIỂM TRA: Nếu là số (ID) thì tìm theo Primary Key
        if (/^\d+$/.test(id)) {
            book = await Book.findByPk(id, { 
                include: [Author, Genre, BookImage, Publisher] 
            });
        } 
        // NGƯỢC LẠI: Nếu là chữ (Slug) thì tìm theo cột book_slug
        else {
            book = await Book.findOne({ 
                where: { book_slug: id },
                include: [Author, Genre, BookImage, Publisher] 
            });
        }
        
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
        const bookDir = path.join(uploadRoot, 'books', String(newBook.book_id));

        // 1. Xử lý ảnh Upload (req.files)
        if (req.files && req.files.length > 0) {
            if (!fs.existsSync(bookDir)) {
                fs.mkdirSync(bookDir, { recursive: true });
            }

            for (const file of req.files) {
                const oldPath = file.path;
                const newPath = path.join(bookDir, file.filename);
                
                fs.renameSync(oldPath, newPath);

                const imageUrl = `/uploads/books/${newBook.book_id}/${file.filename}`;
                await BookImage.create({
                    book_id: newBook.book_id,
                    book_image_url: imageUrl
                });
            }
        } 
        
        // 2. Xử lý ảnh từ URL
        if (req.body.images) {
            const images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            for (const url of images) {
                await BookImage.create({
                    book_id: newBook.book_id,
                    book_image_url: url
                });
            }
        }
        
        res.status(201).json({ success: true, data: newBook });
    } catch (error) {
        console.error("Create Book Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// [PUT] /api/books/:id - Cập nhật
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Update thông tin cơ bản
        await Book.update(req.body, { where: { book_id: id } });

        // Xử lý ảnh nếu có
        if (req.body.images || (req.files && req.files.length > 0)) {
            const bookDir = path.join(uploadRoot, 'books', String(id));

            let finalImages = [];
            if (req.body.images) {
                finalImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            }

            if (req.files && req.files.length > 0) {
                if (!fs.existsSync(bookDir)) {
                    fs.mkdirSync(bookDir, { recursive: true });
                }
                for (const file of req.files) {
                    const oldPath = file.path;
                    const newPath = path.join(bookDir, file.filename);
                    fs.renameSync(oldPath, newPath);
                    const imageUrl = `/uploads/books/${id}/${file.filename}`;
                    finalImages.push(imageUrl);
                }
            }

            // Đồng bộ DB: Xóa ảnh cũ không còn, thêm ảnh mới
            const currentImages = await BookImage.findAll({ where: { book_id: id } });
            const currentUrls = currentImages.map(img => img.book_image_url);

            const imagesToDelete = currentImages.filter(img => !finalImages.includes(img.book_image_url));
            for (const img of imagesToDelete) {
                await img.destroy();
            }

            const imagesToAdd = finalImages.filter(url => !currentUrls.includes(url));
            for (const url of imagesToAdd) {
                await BookImage.create({
                    book_id: id,
                    book_image_url: url
                });
            }
        }
        
        res.status(200).json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        console.error("Lỗi update sách:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// [DELETE] /api/books/:id - Xóa sách
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        await BookImage.destroy({ where: { book_id: id } });
        const deleted = await Book.destroy({ where: { book_id: id } });

        if (deleted) return res.status(200).json({ success: true, message: 'Đã xóa sách' });
        return res.status(404).json({ success: false, message: 'Sách không tồn tại' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// --- CÁC HÀM GET PHỤ ---
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
        const pub = await Publisher.findAll();
        res.status(200).json({ success: true, data: pub });
    } catch (e) { res.status(500).json({ error: e.message }) }
};

// --- QUẢN LÝ TÁC GIẢ ---
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

// --- QUẢN LÝ THỂ LOẠI ---
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

// --- NHẬP KHO ---
const importStock = async (req, res) => {
    try {
        const { book_id, quantity } = req.body;
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

// [GET] /api/books/flash-sale
const getFlashSaleBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            limit: 10,
            order: [['book_id', 'DESC']], 
            include: [{ model: BookImage, attributes: ['book_image_url'] }]
        });

        const flashSaleData = books.map(book => {
            const originalPrice = parseFloat(book.price);
            const discountPercent = Math.floor(Math.random() * 41) + 10; 
            const salePrice = originalPrice * (1 - discountPercent / 100);
            
            let imageUrl = 'https://placehold.co/400x600?text=No+Image';
            // Kiểm tra alias BookImages hoặc book_images
            const images = book.BookImages || book.book_images;
            if (images && images.length > 0) {
                 imageUrl = images[0].book_image_url;
            }

            return {
                id: book.book_id,
                
                // 👇 THÊM DÒNG NÀY ĐỂ FRONTEND CÓ SLUG MÀ DÙNG
                slug: book.book_slug, 
                
                title: book.book_title,
                price: Math.round(salePrice / 1000) * 1000, 
                oldPrice: originalPrice,
                discount: discountPercent,
                image: imageUrl,
                sold: Math.floor(Math.random() * 50),
                totalStock: book.stock_quantity || 50
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