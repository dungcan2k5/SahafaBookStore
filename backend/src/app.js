const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { connectDB } = require('./config/database');

// Import Routes
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const postRoutes = require('./routes/postRoutes');
const voucherRoutes = require('./routes/voucherRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
// ✅ THÊM DÒNG NÀY: Import Address Routes
const addressRoutes = require('./routes/addressRoutes');

// Swagger
const { swaggerUi, swaggerSpec } = require('./config/swagger');

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
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/payment', paymentRoutes);
// ✅ THÊM DÒNG NÀY: Đăng ký route
app.use('/api/addresses', addressRoutes);

// API Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: 'Sahafa Backend is ready!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});