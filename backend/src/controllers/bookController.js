const db = require('../config/database');

// 👇 KIỂM TRA QUAN TRỌNG:
if (!db.models) {
    console.error("❌ LỖI NGHIÊM TRỌNG: Không tìm thấy Models! Kiểm tra lại file database.js và models.js");
    process.exit(1);
}

const { Book, Author, Genre, BookImage } = db.models;
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { uploadRoot } = require('../middleware/uploadMiddleware');

// [GET] /api/books - Lấy danh sách sách (có phân trang)
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
                    { '$Author.author_name$': { [Op.like]: `%${search}%` } }
                ]
            };
        }

        // 2. Logic lọc theo Danh mục
        if (category) {
            whereClause['$Genre.genre_slug$'] = category;
        }

        const { count, rows } = await Book.findAndCountAll({
            where: whereClause,
            order: [['book_id', 'ASC']], 
            include: [
                { model: Author, attributes: ['author_name'] },
                { model: Genre, attributes: ['genre_name'] },
                { model: BookImage, attributes: ['book_image_url'] }
            ],
            limit: limitInt,
            offset: offset,
            distinct: true // Để đếm đúng khi có include
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
        res.status(500).json({ success: false });
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
        const bookDir = path.join(uploadRoot, 'books', String(newBook.book_id));

        // 1. Xử lý ảnh Upload (req.files)
        if (req.files && req.files.length > 0) {
            // Tạo folder cho sách nếu chưa có
            if (!fs.existsSync(bookDir)) {
                fs.mkdirSync(bookDir, { recursive: true });
            }

            for (const file of req.files) {
                const oldPath = file.path;
                const newPath = path.join(bookDir, file.filename);
                
                // Di chuyển file từ temp sang folder sách
                fs.renameSync(oldPath, newPath);

                // Lưu DB (đường dẫn tương đối)
                const imageUrl = `/uploads/books/${newBook.book_id}/${file.filename}`;
                await BookImage.create({
                    book_id: newBook.book_id,
                    book_image_url: imageUrl
                });
            }
        } 
        
        // 2. Xử lý ảnh từ Server hoặc URL (req.body.images - mảng các link)
        // Frontend sẽ gửi: images: ['url1', 'url2']
        if (req.body.images) {
            const images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            for (const url of images) {
                // Chỉ lưu nếu chưa tồn tại (tránh trùng lặp nếu frontend gửi cả ảnh cũ)
                // Tuy nhiên với tạo mới thì cứ lưu hết
                await BookImage.create({
                    book_id: newBook.book_id,
                    book_image_url: url
                });
            }
        } else if (req.body.image_url) {
            // Hỗ trợ field cũ (1 ảnh)
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

// [PUT] /api/books/:id - Cập nhật
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Luôn xử lý ảnh nếu có field images hoặc có file upload
        if (req.body.images || (req.files && req.files.length > 0)) {
            const bookDir = path.join(uploadRoot, 'books', String(id));

            // Danh sách ảnh cuối cùng mong muốn (bao gồm ảnh cũ giữ lại + ảnh mới từ URL)
            // Lưu ý: req.body.images có thể là string (nếu 1 ảnh) hoặc array
            let finalImages = [];
            if (req.body.images) {
                finalImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            }

            // 1. Xử lý ảnh Upload mới (thêm vào danh sách final)
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

            // 2. Đồng bộ DB: Xóa ảnh không còn trong list, Thêm ảnh mới
            // Lấy danh sách ảnh hiện tại trong DB
            const currentImages = await BookImage.findAll({ where: { book_id: id } });
            const currentUrls = currentImages.map(img => img.book_image_url);

            // A. Xóa ảnh không còn nằm trong finalImages
            const imagesToDelete = currentImages.filter(img => !finalImages.includes(img.book_image_url));
            for (const img of imagesToDelete) {
                await img.destroy();
                // Optional: Xóa file vật lý nếu muốn
                // const filePath = path.join(uploadRoot, img.book_image_url.replace('/uploads', ''));
                // if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }

            // B. Thêm ảnh mới (chưa có trong DB)
            const imagesToAdd = finalImages.filter(url => !currentUrls.includes(url));
            for (const url of imagesToAdd) {
                await BookImage.create({
                    book_id: id,
                    book_image_url: url
                });
            }

            return res.status(200).json({ success: true, message: 'Cập nhật thành công' });
        } else if (updated) {
             return res.status(200).json({ success: true, message: 'Cập nhật thành công' });
        }
        
        throw new Error('Không tìm thấy sách hoặc không có gì thay đổi');
    } catch (error) {
        console.error("Lỗi update sách:", error);
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
                { model: BookImages, attributes: ['book_image_url'] }
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