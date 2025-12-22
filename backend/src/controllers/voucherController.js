const { models } = require('../config/database');
const { Voucher } = models;
const { Op } = require('sequelize');

// [GET] /api/vouchers - Lấy danh sách mã giảm giá còn hiệu lực
const getVouchers = async (req, res) => {
    try {
        const now = new Date();
        const vouchers = await Voucher.findAll({
            where: {
                start_at: { [Op.lte]: now }, // Bắt đầu trước hoặc bằng hiện tại
                end_at: { [Op.gte]: now },   // Kết thúc sau hoặc bằng hiện tại
                usage_limit: { [Op.gt]: 0 }  // Còn lượt dùng
            }
        });
        res.json({ success: true, data: vouchers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [POST] /api/vouchers/check - Kiểm tra mã giảm giá
const checkVoucher = async (req, res) => {
    try {
        const { code, orderValue } = req.body;
        const now = new Date();

        const voucher = await Voucher.findOne({
            where: { 
                code,
                start_at: { [Op.lte]: now },
                end_at: { [Op.gte]: now }
            }
        });

        if (!voucher) {
            return res.status(404).json({ success: false, message: 'Mã giảm giá không tồn tại hoặc hết hạn' });
        }

        if (voucher.usage_limit <= 0) {
            return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết lượt sử dụng' });
        }

        if (orderValue && voucher.min_order_value && orderValue < parseFloat(voucher.min_order_value)) {
            return res.status(400).json({ 
                success: false, 
                message: `Đơn hàng tối thiểu phải từ ${voucher.min_order_value}` 
            });
        }

        res.json({ success: true, data: voucher, message: 'Mã hợp lệ' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [POST] /api/vouchers - Tạo voucher mới (Admin/Employee)
const createVoucher = async (req, res) => {
    try {
        const { code, discount_type, value, min_order_value, usage_limit, start_at, end_at } = req.body;

        const newVoucher = await Voucher.create({
            code,
            discount_type: discount_type || 'fixed',
            value,
            min_order_value,
            usage_limit,
            start_at,
            end_at
        });

        res.status(201).json({ success: true, data: newVoucher });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, message: 'Mã voucher đã tồn tại' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [PUT] /api/vouchers/:id - Cập nhật voucher (Admin/Employee)
const updateVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const { usage_limit, start_at, end_at, min_order_value } = req.body;

        const voucher = await Voucher.findByPk(id);
        if (!voucher) return res.status(404).json({ success: false, message: 'Voucher không tồn tại' });

        await voucher.update({
            usage_limit,
            start_at,
            end_at,
            min_order_value
        });

        res.json({ success: true, message: 'Cập nhật voucher thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [DELETE] /api/vouchers/:id - Xóa voucher
const deleteVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Voucher.destroy({ where: { voucher_id: id } });
        
        if (!deleted) return res.status(404).json({ success: false, message: 'Voucher không tìm thấy' });

        res.json({ success: true, message: 'Xóa voucher thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getVouchers, checkVoucher, createVoucher, updateVoucher, deleteVoucher };
