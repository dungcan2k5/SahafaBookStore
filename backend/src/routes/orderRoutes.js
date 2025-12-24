const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);

router.get('/admin', authorize(['admin', 'employee']), orderController.getAllOrders);
router.post('/admin/fake', authorize(['admin', 'employee']), orderController.createFakeOrder);

router.put('/admin/:id', authorize(['admin', 'employee']), orderController.updateOrderStatus);

// ✅ ĐÃ SỬA: Đổi hardDeleteOrder thành deleteOrderAdmin
router.delete('/admin/:id', authorize(['admin', 'employee']), orderController.deleteOrderAdmin);

module.exports = router;