const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Reservation = require('../models/Reservation');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

const seedDatabase = async (isStandalone = false) => {
  try {
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zestora_db';
      await mongoose.connect(mongoUri);
      console.log('[Seeding]: Connected to MongoDB...');
    }

    // Clear existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Reservation.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    console.log('[Seeding]: Cleared old data.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Chef Alessandro Rossi',
      email: 'admin@zestora.com',
      password: 'AdminPassword123!',
      phone: '+1 (555) 234-5678',
      role: 'admin',
      address: {
        street: '123 Grand Avenue, Penthouse B',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      },
    });

    const demoCustomer = await User.create({
      name: 'Eleanor Vance',
      email: 'customer@zestora.com',
      password: 'CustomerPassword123!',
      phone: '+1 (555) 876-5432',
      role: 'customer',
      address: {
        street: '742 Evergreen Terrace',
        city: 'New York',
        state: 'NY',
        zip: '10012',
      },
    });
    console.log('[Seeding]: Created Admin and Customer accounts.');

    // 2. Create Categories
    const categoriesData = [
      { name: 'Starters', slug: 'starters', description: 'Crisp, handcrafted appetizers to awaken your palate', icon: 'Soup', displayOrder: 1 },
      { name: 'Main Course', slug: 'main-course', description: 'Culinary masterpieces grilled and braised to perfection', icon: 'Utensils', displayOrder: 2 },
      { name: 'Indian Specialities', slug: 'indian', description: 'Aromatic curries, slow-cooked biryanis & clay tandoor classics', icon: 'Flame', displayOrder: 3 },
      { name: 'Artisan Pizza', slug: 'pizza', description: 'Wood-fired sourdough crusts with buffalo mozzarella', icon: 'Pizza', displayOrder: 4 },
      { name: 'Gourmet Burgers', slug: 'burgers', description: 'Wagyu and plant-based smash patties on toasted brioche', icon: 'Sandwich', displayOrder: 5 },
      { name: 'Desserts', slug: 'desserts', description: 'Decadent confections, gelatos, and warm pastries', icon: 'Cake', displayOrder: 6 },
      { name: 'Beverages', slug: 'beverages', description: 'Single-origin brews, fresh mocktails, and botanical infusions', icon: 'Coffee', displayOrder: 7 },
    ];

    const categories = await Category.insertMany(categoriesData);
    const catMap = {};
    categories.forEach(c => { catMap[c.slug] = c._id; });
    console.log(`[Seeding]: Created ${categories.length} categories.`);

    // 3. Create Menu Items (Using realistic culinary data and mapped assets)
    const menuItemsData = [
      {
        name: 'Crispy Truffle Calamari',
        description: 'Tender Monterey squid dusted in herb flour, flash-fried with fresh parsley, served with house black garlic aioli and charred lemon.',
        price: 18.50,
        discountPrice: 15.50,
        category: catMap['starters'],
        categoryName: 'Starters',
        image: '/img/menu-1.jpg',
        isVegetarian: false,
        isSpicy: false,
        spicyLevel: 0,
        isPopular: true,
        isFeatured: true,
        preparationTime: '15 mins',
        calories: 380,
        ingredients: ['Wild Squid', 'Black Garlic Aioli', 'Smoked Sea Salt', 'Fresh Parsley', 'Meyer Lemon'],
        nutritionalInfo: { calories: 380, protein: '22g', carbs: '28g', fat: '18g' },
        rating: 4.9,
        reviewCount: 42,
      },
      {
        name: 'Avocado Bruschetta Crostini',
        description: 'Toasted artisanal ciabatta rubbed with confit garlic, topped with heirloom cherry tomatoes, Hass avocado, and aged balsamic glaze.',
        price: 14.00,
        category: catMap['starters'],
        categoryName: 'Starters',
        image: '/img/menu-2.jpg',
        isVegetarian: true,
        isSpicy: false,
        spicyLevel: 0,
        isPopular: false,
        isFeatured: false,
        preparationTime: '12 mins',
        calories: 290,
        ingredients: ['Ciabatta Bread', 'Hass Avocado', 'Heirloom Tomatoes', 'Garlic Confit', 'Aged Balsamic'],
        nutritionalInfo: { calories: 290, protein: '6g', carbs: '32g', fat: '14g' },
        rating: 4.7,
        reviewCount: 19,
      },
      {
        name: 'Prime Dry-Aged Ribeye',
        description: '45-day dry-aged USDA Prime 12oz ribeye steak, flame-seared with rosemary bone marrow butter and duck fat roasted fingerling potatoes.',
        price: 48.00,
        discountPrice: 42.00,
        category: catMap['main-course'],
        categoryName: 'Main Course',
        image: '/img/menu-3.jpg',
        isVegetarian: false,
        isSpicy: false,
        spicyLevel: 0,
        isPopular: true,
        isFeatured: true,
        preparationTime: '25 mins',
        calories: 820,
        ingredients: ['Prime Ribeye 12oz', 'Rosemary Butter', 'Fingerling Potatoes', 'Black Truffle Jus', 'Sea Salt'],
        nutritionalInfo: { calories: 820, protein: '64g', carbs: '18g', fat: '52g' },
        rating: 5.0,
        reviewCount: 88,
      },
      {
        name: 'Pan-Roasted Atlantic Salmon',
        description: 'Crisp skin wild salmon fillet over saffron arborio risotto, shaved asparagus ribbons, and lemon-caper beurre blanc.',
        price: 32.00,
        category: catMap['main-course'],
        categoryName: 'Main Course',
        image: '/img/menu-4.jpg',
        isVegetarian: false,
        isSpicy: false,
        spicyLevel: 0,
        isPopular: true,
        isFeatured: true,
        preparationTime: '20 mins',
        calories: 560,
        ingredients: ['Wild Atlantic Salmon', 'Saffron Risotto', 'Baby Asparagus', 'Lemon Beurre Blanc'],
        nutritionalInfo: { calories: 560, protein: '42g', carbs: '34g', fat: '24g' },
        rating: 4.8,
        reviewCount: 36,
      },
      {
        name: 'Dum Pukht Awadhi Biryani',
        description: 'Royal long-grain basmati rice layered with tender spiced lamb, saffron strands, rose water, and caramelised onions, slow-cooked in a sealed earthen pot.',
        price: 26.50,
        category: catMap['indian'],
        categoryName: 'Indian Specialities',
        image: '/img/about-2.jpg',
        isVegetarian: false,
        isSpicy: true,
        spicyLevel: 2,
        isPopular: true,
        isFeatured: true,
        preparationTime: '30 mins',
        calories: 740,
        ingredients: ['Aged Basmati Rice', 'Grass-Fed Lamb', 'Kashmiri Saffron', 'Mint', 'Kewra Water', 'Ghee'],
        nutritionalInfo: { calories: 740, protein: '38g', carbs: '78g', fat: '28g' },
        rating: 4.9,
        reviewCount: 64,
      },
      {
        name: 'Paneer Makhani Royale',
        description: 'Velvety cottage cheese simmered in a slow-reduced San Marzano tomato gravy with churned butter, kasoori methi, and cream.',
        price: 21.00,
        discountPrice: 18.00,
        category: catMap['indian'],
        categoryName: 'Indian Specialities',
        image: '/img/about-4.jpg',
        isVegetarian: true,
        isSpicy: true,
        spicyLevel: 1,
        isPopular: true,
        isFeatured: false,
        preparationTime: '20 mins',
        calories: 610,
        ingredients: ['Artisan Paneer', 'Slow-Stewed Tomatoes', 'Cashew Paste', 'Fenugreek Leaf', 'Fresh Cream'],
        nutritionalInfo: { calories: 610, protein: '24g', carbs: '32g', fat: '44g' },
        rating: 4.8,
        reviewCount: 51,
      },
      {
        name: 'Truffle & Wild Mushroom Pizza',
        description: 'Wood-fired 72-hour fermented sourdough with fior di latte mozzarella, porcini mushrooms, fontina cheese, and white truffle oil drizzle.',
        price: 24.00,
        category: catMap['pizza'],
        categoryName: 'Artisan Pizza',
        image: '/img/menu-5.jpg',
        isVegetarian: true,
        isSpicy: false,
        spicyLevel: 0,
        isPopular: true,
        isFeatured: true,
        preparationTime: '15 mins',
        calories: 680,
        ingredients: ['Sourdough Crust', 'Wild Porcini Mushrooms', 'Fior di Latte', 'White Truffle Oil', 'Fresh Thyme'],
        nutritionalInfo: { calories: 680, protein: '26g', carbs: '72g', fat: '30g' },
        rating: 4.9,
        reviewCount: 73,
      },
      {
        name: 'Diavola Calabrese Pizza',
        description: 'Spicy Soppressata salami, San Marzano tomato reduction, fresh buffalo mozzarella, Calabrian chili flakes, and hot organic honey.',
        price: 25.50,
        category: catMap['pizza'],
        categoryName: 'Artisan Pizza',
        image: '/img/menu-6.jpg',
        isVegetarian: false,
        isSpicy: true,
        spicyLevel: 2,
        isPopular: false,
        isFeatured: false,
        preparationTime: '15 mins',
        calories: 750,
        ingredients: ['Spicy Calabrian Salami', 'San Marzano Sauce', 'Buffalo Mozzarella', 'Hot Honey', 'Fresh Basil'],
        nutritionalInfo: { calories: 750, protein: '34g', carbs: '70g', fat: '36g' },
        rating: 4.7,
        reviewCount: 29,
      },
      {
        name: 'Signature Wagyu Smash Burger',
        description: 'Double 4oz Australian Wagyu beef patties, aged Vermont cheddar, caramelized shallots, house secret sauce on a toasted brioche bun with parmesan truffle fries.',
        price: 22.00,
        discountPrice: 19.50,
        category: catMap['burgers'],
        categoryName: 'Gourmet Burgers',
        image: '/img/menu-7.jpg',
        isVegetarian: false,
        isSpicy: false,
        spicyLevel: 0,
        isPopular: true,
        isFeatured: true,
        preparationTime: '18 mins',
        calories: 890,
        ingredients: ['Australian Wagyu Beef', 'Aged Cheddar', 'Caramelized Onion', 'House Brioche', 'Truffle Aioli'],
        nutritionalInfo: { calories: 890, protein: '48g', carbs: '56g', fat: '54g' },
        rating: 4.9,
        reviewCount: 110,
      },
      {
        name: 'Crispy Spiced Paneer Burger',
        description: 'Herb-crusted marinated paneer block, crunchy pickled jalapenos, mint chutney mayonnaise, crisp lettuce on artisan milk bun.',
        price: 17.50,
        category: catMap['burgers'],
        categoryName: 'Gourmet Burgers',
        image: '/img/menu-8.jpg',
        isVegetarian: true,
        isSpicy: true,
        spicyLevel: 1,
        isPopular: false,
        isFeatured: false,
        preparationTime: '15 mins',
        calories: 640,
        ingredients: ['Crispy Spiced Paneer', 'Pickled Jalapeno', 'Mint Aioli', 'Butter Lettuce', 'Artisan Brioche'],
        nutritionalInfo: { calories: 640, protein: '22g', carbs: '58g', fat: '34g' },
        rating: 4.6,
        reviewCount: 21,
      },
      {
        name: 'Valrhona Chocolate Lava Dome',
        description: 'Warm molten single-estate dark chocolate cake, Madagascar vanilla bean gelato, and raspberry coulis.',
        price: 13.50,
        category: catMap['desserts'],
        categoryName: 'Desserts',
        image: '/img/about-1.jpg',
        isVegetarian: true,
        isSpicy: false,
        spicyLevel: 0,
        isPopular: true,
        isFeatured: true,
        preparationTime: '12 mins',
        calories: 490,
        ingredients: ['70% Valrhona Chocolate', 'Tahitian Vanilla Gelato', 'Organic Butter', 'Raspberry Coulis'],
        nutritionalInfo: { calories: 490, protein: '8g', carbs: '52g', fat: '28g' },
        rating: 5.0,
        reviewCount: 56,
      },
      {
        name: 'Smoked Bourbon Blood Orange Mocktail',
        description: 'Charred rosemary sprig, blood orange reduction, smoked oak essence, and effervescent botanical ginger beer.',
        price: 9.50,
        category: catMap['beverages'],
        categoryName: 'Beverages',
        image: '/img/about-3.jpg',
        isVegetarian: true,
        isSpicy: false,
        spicyLevel: 0,
        isPopular: false,
        isFeatured: false,
        preparationTime: '5 mins',
        calories: 120,
        ingredients: ['Fresh Blood Orange', 'Smoked Oak Bitters', 'Ginger Beer', 'Charred Rosemary'],
        nutritionalInfo: { calories: 120, protein: '1g', carbs: '28g', fat: '0g' },
        rating: 4.8,
        reviewCount: 15,
      },
    ];

    const menuItems = await MenuItem.insertMany(menuItemsData);
    console.log(`[Seeding]: Created ${menuItems.length} rich menu items.`);

    // 4. Create Coupons
    const couponsData = [
      { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderValue: 20, maxDiscount: 20 },
      { code: 'FEAST20', discountType: 'percentage', discountValue: 20, minOrderValue: 60, maxDiscount: 35 },
      { code: 'FREESHIP', discountType: 'fixed', discountValue: 5, minOrderValue: 25, maxDiscount: 5 },
    ];
    await Coupon.insertMany(couponsData);
    console.log('[Seeding]: Created promotional coupons.');

    // 5. Create Testimonials
    const reviewsData = [
      {
        name: 'Sophia Montgomery',
        roleOrProfession: 'Michelin Dining Enthusiast',
        avatar: '/img/testimonial-1.jpg',
        rating: 5,
        comment: 'Zestora delivers the most impeccable dining experience in the city. The dry-aged ribeye is cooked to pure perfection and the ambiance is unforgettable.',
      },
      {
        name: 'Julian Sterling',
        roleOrProfession: 'Senior Food & Wine Editor',
        avatar: '/img/testimonial-2.jpg',
        rating: 5,
        comment: 'From the warm sourdough truffle pizza to the Awadhi Biryani, the nuance of flavor execution here rivals three-star establishments in London and Paris.',
      },
      {
        name: 'Clara Delacroix',
        roleOrProfession: 'Lifestyle Architect',
        avatar: '/img/testimonial-3.jpg',
        rating: 5,
        comment: 'Ordering online through their interactive tracking was seamless. My order arrived steaming hot in 28 minutes, beautifully packaged.',
      },
      {
        name: 'Marcus Chen',
        roleOrProfession: 'Gastronomy Critic',
        avatar: '/img/testimonial-4.jpg',
        rating: 5,
        comment: 'A masterclass in hospitality. The online table reservation confirmed within seconds, and the chef personalized our anniversary dessert!',
      },
    ];
    await Review.insertMany(reviewsData);
    console.log('[Seeding]: Created reviews & testimonials.');

    // 6. Create Sample Reservations
    const sampleReservations = [
      {
        reservationCode: 'RES-K7X92A',
        user: demoCustomer._id,
        name: 'Eleanor Vance',
        email: 'customer@zestora.com',
        phone: '+1 (555) 876-5432',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '19:30',
        guests: 4,
        specialRequest: 'Window booth for anniversary celebration, please.',
        status: 'confirmed',
        tableNumber: 'Booth 12',
      },
      {
        reservationCode: 'RES-M3B18Q',
        user: null,
        name: 'David Harrington',
        email: 'david.h@example.com',
        phone: '+1 (555) 321-9988',
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        time: '20:00',
        guests: 2,
        specialRequest: 'Quiet table preferred.',
        status: 'pending',
        tableNumber: 'Assigned on arrival',
      },
    ];
    await Reservation.insertMany(sampleReservations);
    console.log('[Seeding]: Created initial reservations.');

    // 7. Create Sample Orders for Dashboard Metrics
    const sampleOrder = await Order.create({
      orderNumber: 'ORD-2026-981245',
      user: demoCustomer._id,
      customerDetails: {
        name: 'Eleanor Vance',
        email: 'customer@zestora.com',
        phone: '+1 (555) 876-5432',
        address: {
          street: '742 Evergreen Terrace',
          city: 'New York',
          state: 'NY',
          zip: '10012',
        },
        specialInstructions: 'Ring doorbell twice, leave at reception.',
      },
      items: [
        {
          menuItem: menuItems[0]._id,
          name: menuItems[0].name,
          price: menuItems[0].discountPrice || menuItems[0].price,
          quantity: 2,
          image: menuItems[0].image,
          subtotal: 31.00,
        },
        {
          menuItem: menuItems[2]._id,
          name: menuItems[2].name,
          price: menuItems[2].discountPrice || menuItems[2].price,
          quantity: 1,
          image: menuItems[2].image,
          subtotal: 42.00,
        },
      ],
      pricing: {
        subtotal: 73.00,
        tax: 3.65,
        deliveryFee: 0,
        discount: 7.30,
        total: 69.35,
      },
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'PREPARING',
      statusHistory: [
        { status: 'PLACED', timestamp: new Date(Date.now() - 35*60000), note: 'Order placed online' },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 30*60000), note: 'Kitchen confirmed order' },
        { status: 'PREPARING', timestamp: new Date(Date.now() - 15*60000), note: 'Chef is cooking your fresh items' },
      ],
    });
    console.log(`[Seeding]: Created sample order ${sampleOrder.orderNumber}.`);

    console.log('\n=========================================');
    console.log('✅ Zestora DATABASE SEEDED SUCCESSFULLY');
    console.log('Admin:    admin@zestora.com     / AdminPassword123!');
    console.log('Customer: customer@zestora.com  / CustomerPassword123!');
    console.log('=========================================\n');

    if (isStandalone) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seeding Error]:', error);
    if (isStandalone) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedDatabase(true);
}

module.exports = { seedDatabase };
