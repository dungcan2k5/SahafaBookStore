const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // Lấy token từ header: "Authorization: Bearer <token>"
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Không tìm thấy token, vui lòng đăng nhập!' });
    }

    try {
        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sahafa_secret_key');
        req.user_id = decoded.user_id; // Lưu user_id vào request để dùng ở controller sau
        req.user_role = decoded.role;
        next(); // Cho đi tiếp
    } catch (error) {
        console.log(error);
        return res.status(403).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

module.exports = verifyToken;