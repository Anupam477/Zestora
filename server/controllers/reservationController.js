const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const fallbackStore = require('../config/fallbackStore');

const isDbReady = () => mongoose.connection.readyState === 1;

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

    const reservationCode = generateReservationCode();

    const reservationData = {
      _id: `res_${Date.now()}`,
      reservationCode,
      user: req.user ? req.user.id : null,
      name,
      email,
      phone,
      date,
      time,
      guests: Number(guests),
      specialRequest: specialRequest || '',
      status: 'confirmed',
      tableNumber: Math.floor(Math.random() * 20) + 1,
      createdAt: new Date(),
    };

    if (isDbReady()) {
      const reservation = await Reservation.create(reservationData);
      return res.status(201).json({
        success: true,
        message: 'Table reservation successfully booked!',
        data: reservation,
      });
    }

    fallbackStore.inMemoryReservations.push(reservationData);
    res.status(201).json({
      success: true,
      message: 'Table reservation successfully booked!',
      data: reservationData,
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

    if (!isDbReady()) {
      const found = fallbackStore.inMemoryReservations.find(r => r.reservationCode === code);
      if (found) return res.status(200).json({ success: true, data: found });
      return res.status(404).json({ success: false, message: 'No reservation found with this confirmation code' });
    }

    const reservation = await Reservation.findOne({ reservationCode: code });
    if (!reservation) {
      const found = fallbackStore.inMemoryReservations.find(r => r.reservationCode === code);
      if (found) return res.status(200).json({ success: true, data: found });
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
    const code = req.params.code.toUpperCase().trim();
    const found = fallbackStore.inMemoryReservations.find(r => r.reservationCode === code);
    if (found) return res.status(200).json({ success: true, data: found });
    res.status(404).json({ success: false, message: 'No reservation found with this confirmation code' });
  }
};

// @desc Get logged-in user reservations
// @route GET /api/reservations/my
exports.getMyReservations = async (req, res, next) => {
  try {
    if (!isDbReady()) {
      const myRes = fallbackStore.inMemoryReservations.filter(
        r => (req.user && r.user === req.user.id) || (req.user && r.email === req.user.email)
      );
      return res.status(200).json({ success: true, count: myRes.length, data: myRes });
    }

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
    res.status(200).json({ success: true, count: 0, data: [] });
  }
};
