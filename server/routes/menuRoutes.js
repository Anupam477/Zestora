const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  getCategories,
  getFeaturedDishes,
} = require('../controllers/menuController');

router.get('/categories', getCategories);
router.get('/featured', getFeaturedDishes);
router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

module.exports = router;
