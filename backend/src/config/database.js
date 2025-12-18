const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || './sahafa.sqlite',
    logging: false,
});

const initModels = require("./models");
// Khởi tạo models và gán vào biến db
const models = initModels(sequelize);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Kết nối Database thành công!");
        await sequelize.sync({ alter: true });
        console.log("✅ Đã đồng bộ Models với Database!");
    } catch (error) {
        console.error("❌ Kết nối thất bại:", error);
        process.exit(1);
    }
};

// Export cả models ra để dùng ở Controller
module.exports = { sequelize, connectDB, models };