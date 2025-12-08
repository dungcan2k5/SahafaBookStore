const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { connectDB } = require('./config/database'); // <--- Import vào

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối DB
connectDB(); // <--- Gọi hàm chạy ngay khi server bật

app.get('/', (req, res) => {
    res.json({ message: 'Sahafa Backend is ready!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});