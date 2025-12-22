// --- Abstract Products ---
class PaymentProcessor {
    generatePaymentInfo(order) { throw new Error("Method not implemented"); }
}

class WebhookHandler {
    async process(req) { throw new Error("Method not implemented"); }
}

// --- Concrete Products (SePay) ---
class SePayProcessor extends PaymentProcessor {
    generatePaymentInfo(order) {
        // Trả về thông tin để Frontend tạo QR
        return {
            method: 'bank_transfer',
            gateway: 'SePay',
            bank_code: 'MB', 
            amount: order.final_amount,
            content: `SAHAFA ${order.order_id}`,
            instruction: "Vui lòng quét mã QR hoặc chuyển khoản với nội dung chính xác."
        };
    }
}

class SePayWebhookHandler extends WebhookHandler {
    constructor(models, sequelize) {
        super();
        this.Order = models.Order;
        this.Transaction = models.Transaction;
        this.sequelize = sequelize;
    }

    async process(reqBody) {
        const { 
            gateway, transactionDate, accountNumber, transferAmount, 
            content, description, transferContent 
        } = reqBody;

        console.log(">>> [SePay Strategy] Processing:", JSON.stringify(reqBody));

        const paymentContent = content || description || transferContent || "";
        if (!paymentContent) return { success: true, message: 'No content found' };

        const regex = /SAHAFA\s*(\d+)/i;
        const match = paymentContent.match(regex);
        if (!match) return { success: true, message: 'Syntax not matched' };

        const orderId = match[1];

        const order = await this.Order.findByPk(orderId);
        if (!order) return { success: true, message: 'Order not found' };

        if (order.payment_status === 'paid') return { success: true, message: 'Order already paid' };

        const receivedAmount = parseFloat(transferAmount);
        const orderAmount = parseFloat(order.final_amount);

        if (receivedAmount < orderAmount) {
            console.warn(`>>> Underpayment Order ${orderId}`);
            return { success: true, message: 'Amount not enough' };
        }

        await this.sequelize.transaction(async (t) => {
            await order.update({
                payment_status: 'paid',
                order_status: 'processing'
            }, { transaction: t });

            await this.Transaction.create({
                payment_method: 'bank_transfer',
                amount: receivedAmount,
                status: 'success',
                payment_info: reqBody,
                order_id: order.order_id,
                user_id: order.user_id
            }, { transaction: t });
        });

        console.log(`>>> [SePay Strategy] Success Order ${orderId}`);
        return { success: true, message: 'Payment processed' };
    }
}

// --- Concrete Products (COD) ---
class CODProcessor extends PaymentProcessor {
    generatePaymentInfo(order) {
        return {
            method: 'cod',
            gateway: null,
            amount: order.final_amount,
            instruction: "Vui lòng chuẩn bị tiền mặt và thanh toán cho shipper khi nhận hàng."
        };
    }
}

class CODWebhookHandler extends WebhookHandler {
    async process(reqBody) {
        // COD không hỗ trợ webhook
        return { success: false, message: 'COD does not support webhooks' };
    }
}

// --- Abstract Factory ---
class PaymentFactory {
    createProcessor() { throw new Error("Method not implemented"); }
    createWebhookHandler() { throw new Error("Method not implemented"); }

    static getFactory(type, models, sequelize) {
        if (type === 'cod') return new CODFactory(models, sequelize);
        if (type === 'bank_transfer' || type === 'sepay' || type === 'vietqr') return new SePayFactory(models, sequelize);
        return null;
    }
}

// --- Concrete Factory (SePay) ---
class SePayFactory extends PaymentFactory {
    constructor(models, sequelize) {
        super();
        this.models = models;
        this.sequelize = sequelize;
    }

    createProcessor() {
        return new SePayProcessor();
    }

    createWebhookHandler() {
        return new SePayWebhookHandler(this.models, this.sequelize);
    }
}

// --- Concrete Factory (COD) ---
class CODFactory extends PaymentFactory {
    constructor(models, sequelize) {
        super();
        this.models = models;
        // COD factory có thể không cần models, nhưng giữ constructor giống nhau để đồng bộ
    }

    createProcessor() {
        return new CODProcessor();
    }

    createWebhookHandler() {
        return new CODWebhookHandler();
    }
}

module.exports = { SePayFactory, CODFactory, PaymentFactory };