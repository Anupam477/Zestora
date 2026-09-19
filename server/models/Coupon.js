const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  discountValue: {
    type: Number,
    required: true,
  },
  minOrderValue: {
    type: Number,
    default: 0,
  },
  maxDiscount: {
    type: Number,
    default: 500,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiryDate: {
    type: Date,
    default: () => new Date(+new Date() + 365*24*60*60*1000),
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Coupon', couponSchema);
