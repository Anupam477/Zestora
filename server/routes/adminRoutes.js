const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllOrders,
  updateOrderStatus,
  getAllReservations,
  updateReservationStatus,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllCustomers,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/reservations', getAllReservations);
router.patch('/reservations/:id/status', updateReservationStatus);
router.post('/menu', createMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);
router.get('/customers', getAllCustomers);

module.exports = router;
