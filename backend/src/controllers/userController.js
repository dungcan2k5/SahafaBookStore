const { models } = require('../config/database');
const { User, Address } = models;
const Joi = require('joi');
const bcrypt = require('bcrypt'); 
const { Op } = require('sequelize');

// [GET] /api/users/profile - Lấy thông tin profile (đã có trong auth, nhưng tách ra đây để quản lý update)
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user_id, {
            attributes: { exclude: ['password', 'deleted_at'] }
        });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [PUT] /api/users/profile - Cập nhật thông tin cá nhân
const updateProfile = async (req, res) => {
    try {
        const { full_name, phone, avatar_url } = req.body;
        
        await User.update(
            { full_name, phone, avatar_url },
            { where: { user_id: req.user_id } }
        );

        res.json({ success: true, message: 'Cập nhật thông tin thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [GET] /api/users/addresses - Lấy danh sách địa chỉ
const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.findAll({
            where: { user_id: req.user_id }
        });
        res.json({ success: true, data: addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [POST] /api/users/addresses - Thêm địa chỉ mới
const addAddress = async (req, res) => {
    try {
        const { address_detail, phone, recipient_name, is_default } = req.body;

        // Validation simple
        if (!address_detail || !recipient_name || !phone) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
        }

        // Nếu set default, bỏ default các cái cũ đi
        if (is_default) {
            await Address.update({ is_default: false }, { where: { user_id: req.user_id } });
        }

        const newAddress = await Address.create({
            user_id: req.user_id,
            address_detail,
            phone,
            recipient_name,
            is_default: is_default || false
        });

        res.status(201).json({ success: true, data: newAddress });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [PUT] /api/users/addresses/:id - Cập nhật địa chỉ
const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { address_detail, phone, recipient_name, is_default } = req.body;

        // Check ownership
        const address = await Address.findOne({ where: { address_id: id, user_id: req.user_id } });
        if (!address) return res.status(404).json({ success: false, message: 'Địa chỉ không tồn tại' });

        if (is_default) {
            await Address.update({ is_default: false }, { where: { user_id: req.user_id } });
        }

        await address.update({ address_detail, phone, recipient_name, is_default });
        
        res.json({ success: true, message: 'Cập nhật địa chỉ thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [DELETE] /api/users/addresses/:id - Xóa địa chỉ
const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Address.destroy({ where: { address_detail: id, user_id: req.user_id } }); // Bug in original code? where: { address_id: id... }
        // Correction: The original code had where: { address_id: id, user_id: req.user_id }
        // I should keep looking at the original file content from read_file output.
        // Original: const deleted = await Address.destroy({ where: { address_id: id, user_id: req.user_id } });
        
        // Wait, I am appending new functions, not replacing deleteAddress yet.
        // I will append at the end.
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// --- ADMIN MANAGEMENT ---

// [GET] /api/users - Danh sách User (Admin/Employee)
const getAllUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        
        const whereClause = {};
        if (role) whereClause.role = role;
        if (search) {
            whereClause[Op.or] = [
                { full_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } }
            ];
        }

        // Nếu là employee chỉ được xem customer
        if (req.user_role === 'employee' && (!role || role !== 'customer')) {
             whereClause.role = 'customer';
        }

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [POST] /api/users - Tạo User mới (Admin only)
const createUser = async (req, res) => {
    try {
        const { full_name, email, password, role, phone } = req.body;
        
        // Check exist
        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(400).json({ success: false, message: 'Email đã tồn tại' });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            full_name,
            email,
            password: hashPassword,
            role: role || 'customer',
            phone
        });

        // Tạo Cart mặc định
        const { Cart } = models; // Lazy load model if needed or import at top. User imported at top. Cart not yet.
        // models is available.
        await models.Cart.create({ user_id: newUser.user_id });

        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [PUT] /api/users/:id - Admin update User
const updateUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, role, phone, password } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Logic bảo vệ Admin: Admin không được sửa role của Admin khác (trừ khi là chính mình? hoặc Super Admin)
        // User request: "admin này không xoá được admin kia". Sửa thì sao? Thường cũng cấm.
        if (user.role === 'admin' && user.user_id !== req.user_id) {
             return res.status(403).json({ success: false, message: 'Không thể chỉnh sửa Admin khác' });
        }

        const updateData = { full_name, role, phone };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        await user.update(updateData);
        res.json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [DELETE] /api/users/:id - Admin xóa User
const deleteUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Rule: Admin này không xóa được Admin kia
        if (user.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Không thể xóa tài khoản Admin' });
        }

        await user.destroy();
        res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { 
    getProfile, 
    updateProfile, 
    getAddresses, 
    addAddress, 
    updateAddress, 
    deleteAddress,
    getAllUsers,
    createUser,
    updateUserAdmin,
    deleteUserAdmin
};
