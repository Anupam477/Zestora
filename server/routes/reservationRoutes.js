const express = require('express');
const router = express.Router();
const {
  createReservation,
  lookupReservation,
  getMyReservations,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');

router.post('/', createReservation);
router.get('/lookup/:code', lookupReservation);
router.get('/my', protect, getMyReservations);

module.exports = router;
