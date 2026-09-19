const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

// @desc Get all categories
// @route GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('displayOrder');
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get menu items with search, filters, sorting
// @route GET /api/menu
exports.getMenuItems = async (req, res, next) => {
  try {
    const { category, search, veg, spicy, popular, sort } = req.query;
    let query = { isAvailable: true };

    if (category && category !== 'all') {
      // Find category id or slug
      const cat = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { name: new RegExp(`^${category}$`, 'i') }],
      });
      if (cat) {
        query.category = cat._id;
      }
    }

    if (veg === 'true') {
      query.isVegetarian = true;
    }

    if (spicy === 'true') {
      query.isSpicy = true;
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

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

    // Sorting
    if (sort === 'price-low') {
      menuQuery = menuQuery.sort('price');
    } else if (sort === 'price-high') {
      menuQuery = menuQuery.sort('-price');
    } else if (sort === 'rating') {
      menuQuery = menuQuery.sort('-rating');
    } else {
      // Default sort: popular first, then newest
      menuQuery = menuQuery.sort('-isPopular -createdAt');
    }

    const items = await menuQuery.exec();

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single menu item by ID
// @route GET /api/menu/:id
exports.getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('category', 'name slug');
    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get featured / signature dishes
// @route GET /api/menu/featured
exports.getFeaturedDishes = async (req, res, next) => {
  try {
    const items = await MenuItem.find({ isFeatured: true, isAvailable: true }).limit(8);
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};
