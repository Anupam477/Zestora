const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
  },
  roleOrProfession: {
    type: String,
    default: 'Food Critic',
  },
  avatar: {
    type: String,
    default: '/img/testimonial-1.jpg',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
  },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    default: null,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Review', reviewSchema);
