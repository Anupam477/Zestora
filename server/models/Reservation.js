const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  reservationCode: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  name: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Contact phone number is required'],
  },
  date: {
    type: String,
    required: [true, 'Reservation date is required'],
  },
  time: {
    type: String,
    required: [true, 'Reservation time is required'],
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: 1,
    max: 20,
  },
  specialRequest: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  tableNumber: {
    type: String,
    default: 'Assigned on arrival',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reservation', reservationSchema);
