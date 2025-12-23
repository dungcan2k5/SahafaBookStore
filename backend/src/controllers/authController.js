const { models } = require('../config/database');
const { User, Cart } = models;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
require('dotenv').config();

// Check điều kiện username/pass
// [POST] /api/auth/register
const register = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // --- 1. VALIDATION LAYER (Dùng Joi) ---
        const schema = Joi.object({
            full_name: Joi.string().min(2).max(50).required().messages({
                'string.empty': 'Tên không được để trống',
                'string.min': 'Tên phải có ít nhất 2 ký tự',
                'any.required': 'Vui lòng nhập họ tên'
            }),
            email: Joi.string().email().required().messages({
                'string.email': 'Email không hợp lệ',
                'any.required': 'Vui lòng nhập email'
            }),
            // Password: Tối thiểu 6 ký tự, phải có cả chữ và số (Regex cơ bản)
            password: Joi.string()
                .min(6)
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[0-9])')) 
                .required()
                .messages({
                    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
                    'string.pattern.base': 'Mật khẩu phải bao gồm cả chữ và số',
                    'any.required': 'Vui lòng nhập mật khẩu'
                })
        });

        // Validate dữ liệu đầu vào
        const { error } = schema.validate(req.body);
        if (error) {
            // Trả về lỗi đầu tiên gặp phải cho gọn
            return res.status(400).json({ 
                success: false, 
                message: error.details[0].message 
            });
        }
        // --- END VALIDATION ---


        // --- 2. LOGIC CŨ (Giữ nguyên) ---
        
        // Check xem email tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email này đã được sử dụng' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo User mới
        const newUser = await User.create({
            full_name,
            email,
            password: hashedPassword,
            role: 'customer' // Mặc định là khách hàng
        });

        // Tạo luôn cái Cart rỗng cho nó
        await Cart.create({ user_id: newUser.user_id });

        res.status(201).json({ success: true, message: 'Đăng ký thành công!' });

    } catch (error) {
        // Log lỗi ra console server để debug cho dễ
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// [POST] /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // --- 1. VALIDATION LAYER (Thêm vào đây) ---
        const schema = Joi.object({
            email: Joi.string().email().required().messages({
                'string.email': 'Email không hợp lệ',
                'any.required': 'Vui lòng nhập email'
            }),
            password: Joi.string().required().messages({
                'any.required': 'Vui lòng nhập mật khẩu',
                'string.empty': 'Mật khẩu không được để trống'
            })
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                success: false, 
                message: error.details[0].message 
            });
        }
        // --- END VALIDATION ---

        // Tìm user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }

        // Check pass
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }

        // Tạo token
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET || 'sahafa_secret_key',
            { expiresIn: '1d' } 
        );

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: user.user_id,
                name: user.full_name,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login Error:", error); // Log ra còn biết đường sửa
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [GET] /api/auth/me (Lấy thông tin profile)
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user_id, {
            attributes: { exclude: ['password'] } // Không trả về pass
        });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [PUT] /api/auth/me (Cập nhật thông tin profile)
const updateProfile = async (req, res) => {
    try {
        const { full_name, phone, avatar_url } = req.body;
        const userId = req.user_id; // Lấy từ middleware verifyToken

        // Validate cơ bản (Có thể dùng Joi nếu muốn chặt chẽ hơn)
        if (!full_name) {
            return res.status(400).json({ success: false, message: 'Tên hiển thị không được để trống' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        // Cập nhật thông tin
        user.full_name = full_name;
        user.phone = phone || user.phone;
        user.avatar_url = avatar_url || user.avatar_url;

        await user.save();

        res.json({ 
            success: true, 
            message: 'Cập nhật thông tin thành công',
            data: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar_url: user.avatar_url
            }
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = { register, login, getProfile, updateProfile };