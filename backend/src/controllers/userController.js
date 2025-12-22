const { models } = require('../config/database');
const { User, Address } = models;
const Joi = require('joi');

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
        const deleted = await Address.destroy({ where: { address_id: id, user_id: req.user_id } });
        
        if (!deleted) return res.status(404).json({ success: false, message: 'Địa chỉ không tìm thấy' });

        res.json({ success: true, message: 'Xóa địa chỉ thành công' });
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
    deleteAddress 
};
