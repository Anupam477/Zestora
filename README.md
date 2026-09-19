# Zestora — Haute Cuisine & Fine Dining Full-Stack Platform

A modern, production-grade **Full-Stack Restaurant Web Application** built with **React 18, Vite, Tailwind CSS, Node.js, Express.js, and MongoDB**.

Transformed from a static legacy template into an enterprise-level commercial platform featuring online ordering, cart persistence, coupon engine, 7-stage live order tracking timeline, online table reservations with automated confirmation codes, customer dashboards, and a complete administrator console with business analytics.

---

## 🏛️ Project Architecture

```
restoran-1.0.0/
│
├── client/                           # React + Vite + Tailwind Frontend
│   ├── public/
│   │   ├── img/                      # Preserved & optimized culinary photography
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/               # Navbar, Footer, Modal, Toast, SectionHeader, Spinner
│   │   │   ├── menu/                 # MenuCard, FoodDetailModal
│   │   │   └── cart/                 # CartDrawer
│   │   ├── context/                  # AuthContext, CartContext, ToastContext
│   │   ├── layouts/                  # MainLayout
│   │   ├── pages/                    # 16 Production Pages
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── FoodDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Reservation.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/                 # api.js client SDK
│   │   ├── App.jsx                   # Central routing & protected route guards
│   │   ├── main.jsx
│   │   └── index.css                 # Custom luxury styling and scrollbars
│   ├── index.html
│   ├── vite.config.js                # Vite config with API proxy
│   ├── tailwind.config.js            # Custom color schemes, typography & shadows
│   └── package.json
│
├── server/                           # Node.js + Express + MongoDB REST API
│   ├── config/
│   │   └── db.js                     # Mongoose connection logic
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── reservationController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js                   # JWT verification & role authorization
│   │   └── errorHandler.js           # Centralized API error handling
│   ├── models/
│   │   ├── User.js                   # User auth & bcrypt password hashing
│   │   ├── Category.js               # Category schema
│   │   ├── MenuItem.js               # Rich culinary details & nutritional stats
│   │   ├── Order.js                  # 7-stage order status history
│   │   ├── Reservation.js            # Table booking registry
│   │   ├── Review.js                 # Testimonials
│   │   └── Coupon.js                 # Promotional discounts
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reservationRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── seed/
│   │   └── seedData.js               # Comprehensive realistic database seeder
│   ├── server.js                     # Express app, Helmet, CORS, Morgan
│   └── package.json
│
├── .env.example                      # Environment variable templates
├── .gitignore
└── README.md
```

---

## ⚡ Technologies Used

### Frontend
- **React 18** (Modern functional components & Hooks)
- **Vite 5** (Ultra-fast HMR and optimized production bundling)
- **React Router v6** (Nested routes, layout outlets, and protected route guards)
- **Tailwind CSS v3** (Custom luxury color palettes, typography, and responsive grids)
- **Lucide React** (Clean, modern iconography)
- **Framer Motion** & Custom CSS Animations (Spinning plate hero, card micro-interactions)

### Backend
- **Node.js v24** & **Express.js**
- **MongoDB** & **Mongoose ODM**
- **JSON Web Tokens (JWT)** for stateless, secure session authorization
- **Bcrypt.js** (Salted password hashing, never storing plaintext passwords)
- **Helmet** (HTTP security headers with cross-origin resource policy)
- **CORS** (Cross-origin resource sharing configuration)
- **Morgan** (Development request logging)

---

## 💎 Implemented Features

1. **Complete Project Redesign**:
   - Transformed generic Bootstrap layout into a sleek, midnight-slate and saffron-gold luxury aesthetic with typography matching high-end Michelin establishments.
2. **Interactive Smart Menu**:
   - Real-time search across dish names, ingredients, and categories.
   - Filter pills: All, Starters, Main Course, Indian Specialities, Artisan Pizza, Gourmet Burgers, Desserts, Beverages.
   - Vegetarian / Non-Vegetarian toggle filters.
   - Spicy indicator with heat level (0 to 3).
   - Multi-option sorting (Price: Low to High, Price: High to Low, Highest Rated, Recommended).
3. **Food Details & Nutrition**:
   - Modal and standalone detail pages showing high-res imagery, artisanal ingredients, prep time, calories, and macronutrient breakdowns (protein, carbs, fat).
4. **Live Persistent Cart & Coupons**:
   - Slide-over drawer cart accessible from anywhere in the app with live item count badge in navbar.
   - LocalStorage synchronization.
   - Promotional coupon engine (`WELCOME10` for 10% off, `FEAST20` for 20% off over $50, `FREESHIP` for $5 off).
   - Dynamic tax (5% GST) and delivery fee waiver (free delivery on orders over $50).
5. **Checkout & Order Creation**:
   - Full delivery address form with validation.
   - Payment method toggle (Cash on Delivery / Credit Card).
   - Instant order number generation (`ORD-YYYY-XXXXX`).
6. **7-Stage Live Order Tracking**:
   - Real-time visual timeline (`PLACED` → `CONFIRMED` → `PREPARING` → `READY` → `OUT_FOR_DELIVERY` → `DELIVERED` or `CANCELLED`).
   - Detailed status history log with admin notes and timestamps.
7. **Online Table Reservation System**:
   - Interactive date/time picker, guest count selector (1–20 people), and special requests.
   - Backend validation preventing past dates.
   - Generates unique reservation codes (e.g. `RES-K7X92A`).
   - Built-in reservation lookup tool to check table assignments.
8. **Authentication & Authorization**:
   - Registration with automatic login.
   - Login with JWT stored securely in client.
   - Role-based access control (`customer` vs `admin`).
   - 1-Click Demo Login buttons for easy reviewer testing.
9. **Customer Dashboard**:
   - Profile management and default delivery address updates.
   - Complete order history with live status badges.
   - Past and upcoming table reservations list.
10. **Executive Admin Dashboard**:
    - **KPI Metrics**: Total orders, today's orders, revenue counter, active kitchen orders, pending reservations.
    - **Order Management**: Status dropdown update with live DB synchronization.
    - **Menu Catalogue CRUD**: Add new dish modal, edit existing dishes, toggle availability, change prices, delete dishes.
    - **Reservations Management**: Approve, reject, or assign table numbers.
    - **Customer Directory**: View registered customer emails, phone numbers, and default addresses.

---

## 🔌 API Endpoint Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account | Public |
| `POST` | `/api/auth/login` | Login and receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Private (User) |
| `PUT` | `/api/auth/profile` | Update profile and address | Private (User) |
| `GET` | `/api/menu` | Browse menu with query filters & search | Public |
| `GET` | `/api/menu/:id` | Get single dish details | Public |
| `GET` | `/api/menu/featured` | Get signature dishes | Public |
| `GET` | `/api/categories` | Get active category list | Public |
| `POST` | `/api/reservations` | Create a new table reservation | Public / User |
| `GET` | `/api/reservations/lookup/:code` | Check reservation by confirmation code | Public |
| `GET` | `/api/reservations/my` | Get user's own reservations | Private (User) |
| `POST` | `/api/orders` | Place a new order | Public / User |
| `GET` | `/api/orders/track/:orderNumber` | Live order status tracking | Public |
| `GET` | `/api/orders/my` | Get user's past order history | Private (User) |
| `POST` | `/api/orders/validate-coupon` | Validate promo code and calculate discount | Public |
| `GET` | `/api/reviews` | Get client testimonials | Public |
| `POST` | `/api/reviews` | Post a client testimonial | Public |
| `GET` | `/api/admin/stats` | Analytics KPIs & revenue telemetry | Private (Admin) |
| `GET` | `/api/admin/orders` | List all orders with filters | Private (Admin) |
| `PATCH`| `/api/admin/orders/:id/status`| Update order status in timeline | Private (Admin) |
| `GET` | `/api/admin/reservations` | List all table bookings | Private (Admin) |
| `PATCH`| `/api/admin/reservations/:id/status`| Update reservation & table | Private (Admin) |
| `POST` | `/api/admin/menu` | Create a new menu dish | Private (Admin) |
| `PUT` | `/api/admin/menu/:id` | Edit an existing dish | Private (Admin) |
| `DELETE`| `/api/admin/menu/:id` | Delete a dish from the menu | Private (Admin) |
| `GET` | `/api/admin/customers` | View customer roster | Private (Admin) |

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@zestora.com` | `AdminPassword123!` |
| **Customer** | `customer@zestora.com` | `CustomerPassword123!` |

*(Both accounts are pre-filled on the login screen with 1-click convenience buttons)*

---

## 🚀 How to Run the Application Locally

### Prerequisites
- **Node.js** (v18 or higher; tested on Node v24)
- **MongoDB** (Local instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies (if not already installed)
npm install

# Seed the database with gourmet menu items, categories, demo users, and coupons
node seed/seedData.js

# Start the backend server
node server.js
# Or start in watch mode
npm run dev
```
The backend will run on **http://localhost:5000**.

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend will run on **http://localhost:5173**.

---

## 🌐 Production Deployment Guide

### Deploying Frontend (Vercel / Netlify / Cloudflare Pages)
1. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```
2. The output will be in `client/dist/`.
3. Configure environment variable:
   ```env
   VITE_API_URL=https://your-production-backend.com/api
   ```
4. For single-page app routing on Netlify, add `client/public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Deploying Backend (Render / Railway / AWS / DigitalOcean)
1. Set the following environment variables on your cloud host:
   ```env
   PORT=5000
   NODE_ENV=production
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/restoran?retryWrites=true&w=majority
   JWT_SECRET=your_super_secure_jwt_secret_key_production
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-frontend-domain.com
   ```
2. Command to start:
   ```bash
   node server.js
   ```

---

## 🔒 Security Practices Implemented
- **Password Protection**: Passwords salted and hashed with `bcryptjs` (10 rounds).
- **JWT Protection**: Tokens signed with high-entropy secrets and expiration dates.
- **Route Guards**: Dual middleware validation (`protect` for auth token, `adminOnly` checking role).
- **Helmet**: Secures HTTP response headers and defends against clickjacking / XSS.
- **CORS Configuration**: Configured allowed origins, headers, and HTTP methods.
- **Data Sanitization & Validation**: Validation of emails, phone numbers, and reservation dates before database writes.
- **Secure File Separation**: `.env` ignored from version control with `.env.example` provided.
