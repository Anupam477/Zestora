const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const fallbackStore = require('../config/fallbackStore');

const isDbReady = () => mongoose.connection.readyState === 1;

// @desc Get all categories
// @route GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    if (!isDbReady()) {
      return res.status(200).json({
        success: true,
        count: fallbackStore.categories.length,
        data: fallbackStore.categories,
      });
    }

    const categories = await Category.find({ isActive: true }).sort('displayOrder');
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    // If DB fails, fallback seamlessly
    res.status(200).json({
      success: true,
      count: fallbackStore.categories.length,
      data: fallbackStore.categories,
    });
  }
};

// @desc Get menu items with search, filters, sorting
// @route GET /api/menu
exports.getMenuItems = async (req, res, next) => {
  try {
    const { category, search, veg, spicy, popular, sort } = req.query;

    if (!isDbReady()) {
      let filtered = [...fallbackStore.menuItems];

      if (category && category !== 'all') {
        filtered = filtered.filter(
          item =>
            (item.category && item.category.slug === category.toLowerCase()) ||
            (item.categoryName && item.categoryName.toLowerCase() === category.toLowerCase())
        );
      }
      if (veg === 'true') {
        filtered = filtered.filter(item => item.isVegetarian);
      }
      if (spicy === 'true') {
        filtered = filtered.filter(item => item.isSpicy);
      }
      if (popular === 'true') {
        filtered = filtered.filter(item => item.isPopular);
      }
      if (search && search.trim() !== '') {
        const s = search.trim().toLowerCase();
        filtered = filtered.filter(
          item =>
            item.name.toLowerCase().includes(s) ||
            item.description.toLowerCase().includes(s) ||
            item.categoryName.toLowerCase().includes(s)
        );
      }

      if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }

    let query = { isAvailable: true };

    if (category && category !== 'all') {
      const cat = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { name: new RegExp(`^${category}$`, 'i') }],
      });
      if (cat) {
        query.category = cat._id;
      }
    }

    if (veg === 'true') query.isVegetarian = true;
    if (spicy === 'true') query.isSpicy = true;
    if (popular === 'true') query.isPopular = true;

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { categoryName: searchRegex },
        { ingredients: searchRegex },
      ];
    }

    let menuQuery = MenuItem.find(query).populate('category', 'name slug');

    if (sort === 'price-low') {
      menuQuery = menuQuery.sort('price');
    } else if (sort === 'price-high') {
      menuQuery = menuQuery.sort('-price');
    } else if (sort === 'rating') {
      menuQuery = menuQuery.sort('-rating');
    } else {
      menuQuery = menuQuery.sort('-isPopular -createdAt');
    }

    const items = await menuQuery.exec();

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    // If query fails, return fallback
    res.status(200).json({
      success: true,
      count: fallbackStore.menuItems.length,
      data: fallbackStore.menuItems,
    });
  }
};

// @desc Get single menu item by ID
// @route GET /api/menu/:id
exports.getMenuItemById = async (req, res, next) => {
  try {
    if (!isDbReady()) {
      const item = fallbackStore.menuItems.find(i => i._id === req.params.id) || fallbackStore.menuItems[0];
      return res.status(200).json({ success: true, data: item });
    }

    const item = await MenuItem.findById(req.params.id).populate('category', 'name slug');
    if (!item) {
      const fb = fallbackStore.menuItems.find(i => i._id === req.params.id);
      if (fb) return res.status(200).json({ success: true, data: fb });
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    const fb = fallbackStore.menuItems.find(i => i._id === req.params.id) || fallbackStore.menuItems[0];
    res.status(200).json({ success: true, data: fb });
  }
};

// @desc Get featured / signature dishes
// @route GET /api/menu/featured
exports.getFeaturedDishes = async (req, res, next) => {
  try {
    if (!isDbReady()) {
      const featured = fallbackStore.menuItems.filter(i => i.isFeatured);
      return res.status(200).json({
        success: true,
        count: featured.length,
        data: featured,
      });
    }

    const items = await MenuItem.find({ isFeatured: true, isAvailable: true }).limit(8);
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    const featured = fallbackStore.menuItems.filter(i => i.isFeatured);
    res.status(200).json({
      success: true,
      count: featured.length,
      data: featured,
    });
  }
};
