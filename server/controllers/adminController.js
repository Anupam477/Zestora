const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const Category = require('../models/Category');

// @desc Get comprehensive admin analytics and KPIs
// @route GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    
    // Today's start
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({ createdAt: { $gte: startOfToday } });
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['PLACED', 'CONFIRMED', 'PREPARING'] } });
    
    // Revenue sum
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? Math.round(revenueAgg[0].totalRevenue * 100) / 100 : 0;

    // Total reservations & pending
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });

    // Total customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Popular dishes
    const popularDishes = await MenuItem.find({ isPopular: true }).limit(5);

    // Recent 6 orders
    const recentOrders = await Order.find().sort('-createdAt').limit(6);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        todayOrders,
        pendingOrders,
        totalRevenue,
        totalReservations,
        pendingReservations,
        totalCustomers,
        popularDishes,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all orders
// @route GET /api/admin/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 50 } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query).sort('-createdAt').limit(Number(limit));
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update order status
// @route PATCH /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'DELIVERED') {
      order.paymentStatus = 'PAID';
    }

    order.statusHistory.push({
      status: orderStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${orderStatus} by Admin`,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status successfully updated to ${orderStatus}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all reservations
// @route GET /api/admin/reservations
exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update reservation status
// @route PATCH /api/admin/reservations/:id/status
exports.updateReservationStatus = async (req, res, next) => {
  try {
    const { status, tableNumber } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (status) reservation.status = status;
    if (tableNumber) reservation.tableNumber = tableNumber;

    await reservation.save();

    res.status(200).json({
      success: true,
      message: `Reservation updated to ${status}`,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create menu item
// @route POST /api/admin/menu
exports.createMenuItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      image,
      isVegetarian,
      isSpicy,
      spicyLevel,
      isPopular,
      isFeatured,
      isAvailable,
      preparationTime,
      calories,
      ingredients,
    } = req.body;

    const cat = await Category.findById(category);

    const item = await MenuItem.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      category,
      categoryName: cat ? cat.name : 'Main Course',
      image: image || '/img/menu-1.jpg',
      isVegetarian: Boolean(isVegetarian),
      isSpicy: Boolean(isSpicy),
      spicyLevel: Number(spicyLevel) || 0,
      isPopular: Boolean(isPopular),
      isFeatured: Boolean(isFeatured),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      preparationTime: preparationTime || '20 mins',
      calories: calories ? Number(calories) : 400,
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map(s => s.trim()) : []),
    });

    res.status(201).json({
      success: true,
      message: 'New dish created successfully!',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update menu item
// @route PUT /api/admin/menu/:id
exports.updateMenuItem = async (req, res, next) => {
  try {
    let item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Dish updated successfully!',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete menu item
// @route DELETE /api/admin/menu/:id
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Dish successfully removed from menu',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all registered customers
// @route GET /api/admin/customers
exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort('-createdAt');
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};
