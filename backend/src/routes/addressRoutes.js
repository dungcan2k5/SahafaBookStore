const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { verifyToken } = require('../middleware/authMiddleware');

// Áp dụng middleware verifyToken cho TẤT CẢ các route bên dưới
// Vì phải đăng nhập mới có sổ địa chỉ
router.use(verifyToken);

router.get('/', addressController.getMyAddresses);
router.post('/', addressController.addAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;