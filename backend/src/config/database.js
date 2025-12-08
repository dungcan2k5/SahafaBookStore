const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false, // Tắt log query rác cho đỡ rối mắt
        timezone: '+07:00' // Giờ Việt Nam
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối Database thành công!');
    } catch (error) {
        console.error('❌ Kết nối thất bại:', error);
        process.exit(1); // Lỗi DB thì tắt server luôn chứ chạy làm gì
    }
};

module.exports = { sequelize, connectDB };