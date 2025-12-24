const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Tất cả các route này đều cần đăng nhập
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng và địa chỉ
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Lấy thông tin cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 *   put:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

/**
 * @swagger
 * /api/users/addresses:
 *   get:
 *     summary: Lấy danh sách địa chỉ nhận hàng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List địa chỉ
 *   post:
 *     summary: Thêm địa chỉ mới
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address_detail
 *               - recipient_name
 *               - phone
 *             properties:
 *               address_detail:
 *                 type: string
 *               recipient_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.get('/addresses', userController.getAddresses);
router.post('/addresses', userController.addAddress);

/**
 * @swagger
 * /api/users/addresses/{id}:
 *   put:
 *     summary: Cập nhật địa chỉ
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address_detail:
 *                 type: string
 *               recipient_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa địa chỉ
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.put('/addresses/:id', userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);

// --- ADMIN / MANAGER ROUTES ---

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách users (Admin/Employee)
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách users
 */
router.get('/', authorize(['admin', 'employee']), userController.getAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Tạo user mới (Admin only)
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - full_name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, employee, customer]
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', authorize(['admin']), userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cập nhật user (Admin only)
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               role:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa user (Admin only)
 *     tags: [Users Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.put('/:id', authorize(['admin']), userController.updateUserAdmin);
router.delete('/:id', authorize(['admin']), userController.deleteUserAdmin);

module.exports = router;
