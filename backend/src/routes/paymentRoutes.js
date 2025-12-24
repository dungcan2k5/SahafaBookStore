const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.post('/sepay-webhook', paymentController.handleSepayWebhook);

router.get(
  '/transactions',
  verifyToken,
  authorize(['admin', 'employee']),
  paymentController.getAllTransactions
);

router.put(
  '/transactions/:id/approve',
  verifyToken,
  authorize(['admin', 'employee']),
  paymentController.approveTransaction
);

router.delete(
  '/transactions/:id',
  verifyToken,
  authorize(['admin', 'employee']),
  paymentController.deleteTransaction
);

router.post(
  '/transactions/fake',
  verifyToken,
  authorize(['admin', 'employee']),
  paymentController.createFakeTransaction
);

module.exports = router;
