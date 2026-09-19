const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderByNumber,
  getMyOrders,
  validateCoupon,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Optional auth for placing order: works for guests and logged in users
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/validate-coupon', validateCoupon);
router.post('/', optionalProtect, createOrder);
router.get('/track/:orderNumber', getOrderByNumber);
router.get('/my', protect, getMyOrders);

module.exports = router;
