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

module.exports = { handleSepayWebhook, getAllTransactions };
