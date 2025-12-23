const { models, sequelize } = require('../config/database');
const { Order, Transaction, User } = models;
const { Op } = require('sequelize');
const { SePayFactory } = require('../patterns/PaymentFactory');

// [POST] /api/payment/sepay-webhook
const handleSepayWebhook = async (req, res) => {
    try {
        // Áp dụng Abstract Factory Pattern
        // 1. Khởi tạo Factory cụ thể (ở đây là SePay)
        // Trong tương lai, có thể check req.params.gateway để new MomoFactory(), new ZaloPayFactory()...
        const paymentFactory = new SePayFactory(models, sequelize);

        // 2. Tạo đối tượng xử lý Webhook từ Factory
        const webhookHandler = paymentFactory.createWebhookHandler();

        // 3. Ủy quyền xử lý logic
        const result = await webhookHandler.process(req.body);

        return res.status(200).json(result);

    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [GET] /api/payment/transactions - Lấy danh sách giao dịch (Admin)
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            order: [['created_at', 'DESC']],
            include: [
                { model: models.User, attributes: ['full_name', 'email'] },
                { model: Order, attributes: ['total_amount', 'final_amount'] }
            ]
        });
        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// [PUT] /api/payment/transactions/:id/approve - Duyệt giao dịch thủ công
const approveTransaction = async (req, res) => {
    const t = await sequelize.transaction(); // Dùng transaction để đảm bảo toàn vẹn
    try {
        const { id } = req.params;

        // 1. Tìm giao dịch
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Giao dịch không tồn tại' });
        }

        if (transaction.status === 'success') {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Giao dịch này đã thành công rồi' });
        }

        // 2. Tìm đơn hàng tương ứng
        const order = await Order.findByPk(transaction.order_id);
        if (!order) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Đơn hàng gốc không tồn tại' });
        }

        // 3. Cập nhật trạng thái Giao dịch -> success
        await transaction.update({ status: 'success' }, { transaction: t });

        // 4. Cập nhật trạng thái Đơn hàng -> paid & processing
        await order.update({
            payment_status: 'paid',
            order_status: 'processing' // Chuyển sang đang xử lý để kho đóng gói
        }, { transaction: t });

        await t.commit();
        res.json({ success: true, message: 'Đã duyệt thanh toán thành công!' });

    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi server khi duyệt đơn' });
    }
};

module.exports = { handleSepayWebhook, getAllTransactions, approveTransaction };
