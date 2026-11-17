const mongoose = require('mongoose');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const MenuItem = require('../models/MenuItem');
const fallbackStore = require('../config/fallbackStore');

const isDbReady = () => mongoose.connection.readyState === 1;

const FALLBACK_COUPONS = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderValue: 20, maxDiscount: 20 },
  { code: 'FEAST20', discountType: 'percentage', discountValue: 20, minOrderValue: 60, maxDiscount: 35 },
  { code: 'FREESHIP', discountType: 'fixed', discountValue: 5, minOrderValue: 25, maxDiscount: 5 },
];

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${new Date().getFullYear()}-${timestamp}${random}`;
};

// @desc Validate coupon
// @route POST /api/orders/validate-coupon
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, orderSubtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const upperCode = code.toUpperCase().trim();
    let coupon = null;

    if (isDbReady()) {
      coupon = await Coupon.findOne({
        code: upperCode,
        isActive: true,
        expiryDate: { $gte: new Date() },
      });
    }

    if (!coupon) {
      coupon = FALLBACK_COUPONS.find(c => c.code === upperCode);
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired promo code' });
    }

    if (orderSubtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Order subtotal must be at least $${coupon.minOrderValue} to use this coupon`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      discount: Math.round(discount * 100) / 100,
      code: coupon.code,
      message: `Coupon ${coupon.code} applied successfully!`,
    });
  } catch (error) {
    const upperCode = (req.body.code || '').toUpperCase().trim();
    const coupon = FALLBACK_COUPONS.find(c => c.code === upperCode);
    if (coupon) {
      const discount = coupon.discountType === 'percentage' ? (req.body.orderSubtotal * coupon.discountValue) / 100 : coupon.discountValue;
      return res.status(200).json({ success: true, discount, code: coupon.code });
    }
    next(error);
  }
};

// @desc Place a new order
// @route POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { customerDetails, items, couponCode, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address) {
      return res.status(400).json({ success: false, message: 'Please fill out all delivery contact details' });
    }

    let subtotal = 0;
    const formattedItems = [];

    for (const itm of items) {
      let dbItem = null;
      if (isDbReady()) {
        try {
          dbItem = await MenuItem.findById(itm._id || itm.menuItem);
        } catch (e) {}
      }
      if (!dbItem) {
        dbItem = fallbackStore.menuItems.find(i => i._id === (itm._id || itm.menuItem));
      }

      const price = dbItem ? (dbItem.discountPrice || dbItem.price) : Number(itm.price || 15);
      const qty = Number(itm.quantity) || 1;
      const itemSubtotal = price * qty;
      subtotal += itemSubtotal;

      formattedItems.push({
        menuItem: dbItem ? dbItem._id : itm._id,
        name: dbItem ? dbItem.name : itm.name,
        price,
        quantity: qty,
        image: dbItem ? dbItem.image : (itm.image || ''),
        subtotal: itemSubtotal,
      });
    }

    let discount = 0;
    if (couponCode) {
      const upperCode = couponCode.toUpperCase().trim();
      const coupon = FALLBACK_COUPONS.find(c => c.code === upperCode);
      if (coupon && subtotal >= coupon.minOrderValue) {
        discount = coupon.discountType === 'percentage'
          ? Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || 500)
          : coupon.discountValue;
      }
    }

    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = subtotal >= 50 ? 0 : 5;
    const total = Math.max(0, Math.round((subtotal + tax + deliveryFee - discount) * 100) / 100);
    const orderNumber = generateOrderNumber();

    const orderData = {
      _id: `ord_${Date.now()}`,
      orderNumber,
      user: req.user ? req.user.id : null,
      customerDetails,
      items: formattedItems,
      pricing: { subtotal, tax, deliveryFee, discount, total },
      couponApplied: couponCode ? { code: couponCode.toUpperCase(), discountAmount: discount } : null,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PLACED',
      statusHistory: [
        { status: 'PLACED', timestamp: new Date(), note: 'Order placed online by customer' },
      ],
      createdAt: new Date(),
    };

    if (isDbReady()) {
      const order = await Order.create(orderData);
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        orderNumber: order.orderNumber,
        data: order,
      });
    }

    fallbackStore.inMemoryOrders.unshift(orderData);
    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderNumber: orderData.orderNumber,
      data: orderData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Track order by order number
// @route GET /api/orders/track/:orderNumber
exports.trackOrder = async (req, res, next) => {
  try {
    const orderNumber = req.params.orderNumber.toUpperCase().trim();

    if (!isDbReady()) {
      const found = fallbackStore.inMemoryOrders.find(o => o.orderNumber === orderNumber);
      if (found) return res.status(200).json({ success: true, data: found });
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      const found = fallbackStore.inMemoryOrders.find(o => o.orderNumber === orderNumber);
      if (found) return res.status(200).json({ success: true, data: found });
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc Get logged-in user order history
// @route GET /api/orders/my
exports.getMyOrders = async (req, res, next) => {
  try {
    if (!isDbReady()) {
      const myOrders = fallbackStore.inMemoryOrders.filter(
        o => (req.user && o.user === req.user.id) || (req.user && o.customerDetails && o.customerDetails.email === req.user.email)
      );
      return res.status(200).json({ success: true, count: myOrders.length, data: myOrders });
    }

    const orders = await Order.find({
      $or: [
        { user: req.user.id },
        { 'customerDetails.email': req.user.email },
      ],
    }).sort('-createdAt');

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(200).json({ success: true, count: 0, data: [] });
  }
};
