const Review = require('../models/Review');

// @desc Get all testimonials / reviews
// @route GET /api/reviews
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort('-createdAt').limit(10);
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
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

    const review = await Review.create({
      name,
      roleOrProfession: roleOrProfession || 'Patron',
      rating: Number(rating),
      comment,
      avatar: `/img/testimonial-${Math.floor(Math.random() * 4) + 1}.jpg`,
      isApproved: true,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your review!',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
