const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Dish name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  discountPrice: {
    type: Number,
    default: null,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  categoryName: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: [true, 'Image URL or path is required'],
  },
  isVegetarian: {
    type: Boolean,
    default: false,
  },
  isSpicy: {
    type: Boolean,
    default: false,
  },
  spicyLevel: {
    type: Number,
    min: 0,
    max: 3,
    default: 0,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: String,
    default: '20-25 mins',
  },
  calories: {
    type: Number,
    default: 450,
  },
  ingredients: [{
    type: String,
  }],
  nutritionalInfo: {
    calories: { type: Number, default: 450 },
    protein: { type: String, default: '18g' },
    carbs: { type: String, default: '45g' },
    fat: { type: String, default: '14g' },
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 24,
  },
}, {
  timestamps: true,
});

menuItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
