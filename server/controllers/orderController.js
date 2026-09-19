const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const MenuItem = require('../models/MenuItem');

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

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
      expiryDate: { $gte: new Date() },
    });

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
    next(error);
  }
};

// @desc Place a new order
// @route POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const {
      customerDetails,
      items,
      couponCode,
      paymentMethod,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address) {
      return res.status(400).json({ success: false, message: 'Please fill out all delivery contact details' });
    }

    // Calculate pricing securely
    let subtotal = 0;
    const formattedItems = [];

    for (const itm of items) {
      const dbItem = await MenuItem.findById(itm._id || itm.menuItem);
      const price = dbItem ? (dbItem.discountPrice || dbItem.price) : Number(itm.price);
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

    // Coupon calculation
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true,
        expiryDate: { $gte: new Date() },
      });
      if (coupon && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'percentage') {
          discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || 500);
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST/tax
    const deliveryFee = subtotal >= 50 ? 0 : 5; // Free delivery over $50
    const total = Math.max(0, Math.round((subtotal + tax + deliveryFee - discount) * 100) / 100);

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      user: req.user ? req.user.id : null,
      customerDetails,
      items: formattedItems,
      pricing: {
        subtotal,
        tax,
        deliveryFee,
        discount,
        total,
      },
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      orderStatus: 'PLACED',
      statusHistory: [
        {
          status: 'PLACED',
          timestamp: new Date(),
          note: 'Order successfully placed by customer',
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Track order by order number
// @route GET /api/orders/track/:orderNumber
exports.getOrderByNumber = async (req, res, next) => {
  try {
    const orderNumber = req.params.orderNumber.toUpperCase().trim();
    const order = await Order.findOne({ orderNumber }).populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found with this order number' });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get logged-in user order history
// @route GET /api/orders/my
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user.id },
        { 'customerDetails.email': req.user.email },
      ],
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
