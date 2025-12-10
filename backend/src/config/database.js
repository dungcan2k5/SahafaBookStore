const { Sequelize } = require('sequelize');
require('dotenv').config(); // Tạm tắt hoặc giữ tùy mày, nhưng sửa config dưới này

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE, // <--- QUAN TRỌNG: Tên file mày muốn tạo
    logging: false,
    // timezone: '+07:00' // SQLite lưu UTC chuẩn, cái này thường không tác dụng nhiều với SQLite như MySQL đâu
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối Database thành công!');

        require('./models'); // <--- Import models vào để thiết lập

        // Đồng bộ Model vào Database
        // alter: true -> Tự sửa bảng nếu có thay đổi, không mất dữ liệu
        await sequelize.sync({ alter: true }); 
        console.log('✅ Đã đồng bộ Models với Database!');
    } catch (error) {
        console.error('❌ Kết nối thất bại:', error);
        process.exit(1); // Lỗi DB thì tắt server luôn chứ chạy làm gì
    }
};

module.exports = { sequelize, connectDB };