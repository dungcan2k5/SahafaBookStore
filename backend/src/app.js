const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { connectDB } = require('./config/database');

// Import Routes
const bookRoutes = require('./routes/bookRoutes'); // <--- Thêm dòng này
const authRoutes = require('./routes/authRoutes'); // <--- Thêm
const cartRoutes = require('./routes/cartRoutes'); // <--- Thêm
const orderRoutes = require('./routes/orderRoutes');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối DB
connectDB();

// Routes
app.use('/api/books', bookRoutes); // <--- Đăng ký route: tất cả đường dẫn bắt đầu bằng /api/books sẽ vào đây
app.use('/api/auth', authRoutes); // <--- Đăng ký Auth
app.use('/api/cart', cartRoutes); // <--- Đăng ký Cart
app.use('/api/orders', orderRoutes); // <--- Đăng ký Order

// Route cho API Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
    res.json({ message: 'Sahafa Backend is ready!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});