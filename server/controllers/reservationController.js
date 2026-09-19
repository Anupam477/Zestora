const Reservation = require('../models/Reservation');

// Helper to generate 6-character reservation code
const generateReservationCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'RES-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @desc Create table reservation
// @route POST /api/reservations
exports.createReservation = async (req, res, next) => {
  try {
    const { name, email, phone, date, time, guests, specialRequest } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, date, time, and number of guests',
      });
    }

    // Validate date is not in past
    const reservationDate = new Date(`${date}T${time || '12:00'}`);
    const now = new Date();
    if (reservationDate < now - 24*60*60*1000) {
      return res.status(400).json({
        success: false,
        message: 'Reservation date cannot be in the past',
      });
    }

    const reservationCode = generateReservationCode();

    const reservation = await Reservation.create({
      reservationCode,
      user: req.user ? req.user.id : null,
      name,
      email,
      phone,
      date,
      time,
      guests: Number(guests),
      specialRequest: specialRequest || '',
      status: 'confirmed', // Auto-confirm on valid slot
    });

    res.status(201).json({
      success: true,
      message: 'Table reservation successfully booked!',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Lookup reservation by code
// @route GET /api/reservations/lookup/:code
exports.lookupReservation = async (req, res, next) => {
  try {
    const code = req.params.code.toUpperCase().trim();
    const reservation = await Reservation.findOne({ reservationCode: code });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'No reservation found with this confirmation code',
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get logged-in user reservations
// @route GET /api/reservations/my
exports.getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
      $or: [
        { user: req.user.id },
        { email: req.user.email },
      ],
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};
