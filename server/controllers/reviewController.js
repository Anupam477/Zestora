const mongoose = require('mongoose');
const Review = require('../models/Review');
const fallbackStore = require('../config/fallbackStore');

const isDbReady = () => mongoose.connection.readyState === 1;

// @desc Get all testimonials / reviews
// @route GET /api/reviews
exports.getReviews = async (req, res, next) => {
  try {
    if (!isDbReady()) {
      return res.status(200).json({
        success: true,
        count: fallbackStore.reviews.length,
        data: fallbackStore.reviews,
      });
    }

    const reviews = await Review.find({ isApproved: true }).sort('-createdAt').limit(10);
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: fallbackStore.reviews.length,
      data: fallbackStore.reviews,
    });
  }
};

// @desc Submit a new review
// @route POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { name, roleOrProfession, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, rating, and feedback comment',
      });
    }

    const reviewData = {
      _id: `rev_${Date.now()}`,
      name,
      roleOrProfession: roleOrProfession || 'Patron',
      rating: Number(rating),
      comment,
      avatar: `/img/testimonial-${Math.floor(Math.random() * 4) + 1}.jpg`,
      isApproved: true,
      createdAt: new Date(),
    };

    if (isDbReady()) {
      const review = await Review.create(reviewData);
      return res.status(201).json({
        success: true,
        message: 'Thank you for your review!',
        data: review,
      });
    }

    fallbackStore.reviews.unshift(reviewData);
    res.status(201).json({
      success: true,
      message: 'Thank you for your review!',
      data: reviewData,
    });
  } catch (error) {
    next(error);
  }
};
