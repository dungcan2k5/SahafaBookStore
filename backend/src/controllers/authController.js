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
            // Password: Tối thiểu 8 ký tự, chữ hoa, thường, số, ký tự đặc biệt
            password: Joi.string()
                .min(8)
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
                .required()
                .messages({
                    'string.min': 'Mật khẩu phải có ít nhất 8 ký tự',
                    'string.pattern.base': 'Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&*)',
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
        const user = await User.findByPk(req.user_id, { attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: { ...user.toJSON(), name: user.full_name } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { full_name, phone, avatar_url } = req.body;
        const userId = req.user_id;

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Cập nhật thông tin
        if (full_name && full_name.trim() !== '') user.full_name = full_name;
        if (phone !== undefined) user.phone = phone;
        if (avatar_url !== undefined) user.avatar_url = avatar_url;

        await user.save(); // <--- Lỗi xảy ra ở dòng này nếu trùng phone

        res.json({ 
            success: true, 
            message: 'Cập nhật thành công',
            data: {
                id: user.user_id,
                full_name: user.full_name,
                name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar_url: user.avatar_url
            }
        });
    } catch (error) {
        console.error("Update Error:", error);

        // --- BẮT LỖI TRÙNG SỐ ĐIỆN THOẠI Ở ĐÂY ---
        if (error.name === 'SequelizeUniqueConstraintError') {
             // Kiểm tra xem trường nào bị trùng
             const field = error.errors[0]?.path;
             if (field === 'phone') {
                 return res.status(400).json({ success: false, message: 'Số điện thoại này đã được sử dụng bởi người khác' });
             }
             if (field === 'email') {
                 return res.status(400).json({ success: false, message: 'Email này đã được sử dụng' });
             }
        }
        
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
};

// [POST] /api/auth/forgot-password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập email' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email không tồn tại trong hệ thống' });
        }

        // Tạo mật khẩu ngẫu nhiên đảm bảo độ mạnh (8 ký tự, hoa, thường, số, ký tự đặc biệt)
        const generateStrongPassword = () => {
            const lower = 'abcdefghijklmnopqrstuvwxyz';
            const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789';
            const special = '!@#$%^&*';
            const all = lower + upper + numbers + special;
            
            let password = '';
            // Đảm bảo mỗi loại có ít nhất 1 ký tự
            password += lower[Math.floor(Math.random() * lower.length)];
            password += upper[Math.floor(Math.random() * upper.length)];
            password += numbers[Math.floor(Math.random() * numbers.length)];
            password += special[Math.floor(Math.random() * special.length)];

            // Điền nốt 4 ký tự ngẫu nhiên còn lại
            for (let i = 0; i < 4; i++) {
                password += all[Math.floor(Math.random() * all.length)];
            }
            
            // Xáo trộn chuỗi (Fisher-Yates shuffle đơn giản)
            return password.split('').sort(() => 0.5 - Math.random()).join('');
        };

        const newPassword = generateStrongPassword();
        
        // Hash mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Lưu vào DB
        user.password = hashedPassword;
        await user.save();

        // Trả về mật khẩu mới (TẠM THỜI)
        res.json({ success: true, message: 'Đặt lại mật khẩu thành công', newPassword });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// [POST] /api/auth/change-password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user_id;

        // Validation cơ bản
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        
        // Validate mật khẩu mới (Mạnh)
        const passwordSchema = Joi.string()
            .min(8)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
            .required()
            .messages({
                'string.min': 'Mật khẩu mới phải có ít nhất 8 ký tự',
                'string.pattern.base': 'Mật khẩu mới phải có chữ hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&*)',
                'any.required': 'Vui lòng nhập mật khẩu mới'
            });

        const { error } = passwordSchema.validate(newPassword);
        if (error) {
             return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Kiểm tra mật khẩu cũ
        const validPass = await bcrypt.compare(oldPassword, user.password);
        if (!validPass) {
            return res.status(400).json({ success: false, message: 'Mật khẩu cũ không chính xác' });
        }

        // Hash mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Lưu
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: 'Đổi mật khẩu thành công' });

    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = { register, login, getProfile, updateProfile, forgotPassword, changePassword };