// backend/src/seed.js
const { sequelize } = require('./config/database');
const initModels = require('./models/models');
const bcrypt = require('bcrypt');

// Load models
const { 
    User, Book, Author, Genre, Publisher, 
    Cart, BookImage 
} = initModels(sequelize);

const seed = async () => {
    // Khai báo transaction
    let t;

    try {
        await sequelize.authenticate();
        console.log("🔌 Kết nối DB ok. Bắt đầu Seed an toàn với Transaction...");

        // Start transaction
        t = await sequelize.transaction();

        // 1. Reset DB (Xóa sạch làm lại)
        // Dùng force: true để drop table tạo lại, đảm bảo sạch sẽ
        await sequelize.sync({ force: true }); 
        console.log("🗑️  Đã dọn dẹp DB.");

        // 2. Tạo Master Data (Author, Genre...)
        // Vì mấy cái này ít, tạo trước ngoài vòng lặp cũng được, hoặc gói trong transaction luôn
        const author = await Author.create({ 
            author_name: 'Nguyễn Nhật Ánh', 
            author_slug: 'nguyen-nhat-anh' 
        }, { transaction: t });

        const genre = await Genre.create({ 
            genre_name: 'Truyện dài', 
            genre_slug: 'truyen-dai' 
        }, { transaction: t });

        const publisher = await Publisher.create({ 
            publisher_name: 'NXB Trẻ', 
            publisher_slug: 'nxb-tre' 
        }, { transaction: t });

        // 3. Tạo Sách và Ảnh (QUAN TRỌNG: CHECK LOG ĐOẠN NÀY)
        console.log("📖 Đang tạo sách...");
        
        const newBook = await Book.create({
            book_title: 'Kính Vạn Hoa',
            price: 50000,
            stock_quantity: 10,
            book_slug: 'kinh-van-hoa',
            isbn: 'KVH01',
            author_id: author.author_id,
            genre_id: genre.genre_id,
            publisher_id: publisher.publisher_id
        }, { transaction: t });

        // LOG ID RA ĐỂ KIỂM CHỨNG
        console.log(`👉 Đã tạo sách với ID: ${newBook.book_id}`);

        if (!newBook.book_id) {
            throw new Error("❌ Lỗi: Tạo sách nhưng không có ID trả về!");
        }

        // Tạo ảnh gán vào ID vừa có
        await BookImage.create({
            book_image_url: 'https://placehold.co/600x400',
            book_id: newBook.book_id
        }, { transaction: t });
        
        console.log("🖼️  Đã tạo ảnh cho sách.");

        // 4. Tạo User Demo
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('123456', salt);
        
        const user = await User.create({
            full_name: 'Demo User',
            email: 'demo@sahafa.com',
            password: hash,
            role: 'admin'
        }, { transaction: t });

        await Cart.create({ user_id: user.user_id }, { transaction: t });

        // COMMIT TRANSACTION (Lúc này dữ liệu mới thực sự ghi xuống file)
        await t.commit();
        console.log("✅ SEEDING THÀNH CÔNG (Transaction Committed)!");

        // ==========================================
        // PHẦN TEST NGAY TẠI CHỖ (VERIFY)
        // ==========================================
        console.log("\n🕵️  Đang kiểm tra lại dữ liệu trong DB...");
        
        const checkBook = await Book.findOne({
            where: { book_id: newBook.book_id },
            include: [{ model: BookImage }] // Join thử xem có ra ảnh không
        });

        console.log("------------------------------------------------");
        console.log(`📘 Sách tìm thấy: ${checkBook.book_title}`);
        console.log(`🖼️  Số lượng ảnh đi kèm: ${checkBook.BookImages ? checkBook.BookImages.length : 0}`);
        
        if (checkBook.BookImages && checkBook.BookImages.length > 0) {
            console.log("URL ảnh đầu tiên: ", checkBook.BookImages[0].book_image_url);
            console.log("🎉 KẾT LUẬN: Dữ liệu đã vào ngon lành!");
        } else {
            console.log("⚠️ KẾT LUẬN: Sách có nhưng KHÔNG CÓ ẢNH. Lỗi ở quan hệ!");
        }
        console.log("------------------------------------------------");

    } catch (error) {
        // Có lỗi thì rollback sạch
        if (t) await t.rollback();
        console.error("❌ Lỗi seeding (Đã Rollback):", error);
    } finally {
        // Đóng kết nối
        // await sequelize.close(); // Tạm comment để m còn soi app
    }
};

seed();