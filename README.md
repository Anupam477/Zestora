# 🍽️ Zestora — Fine Dining & Restaurant Full-Stack Platform

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, production-grade **Full-Stack Restaurant Web Application** built with **React 18, Vite, Tailwind CSS, Node.js, Express, and MongoDB**. 

Zestora provides an end-to-end dining experience featuring interactive menu discovery, dietary filters, online ordering with cart persistence, promo coupon discounts, a 7-stage live visual order tracking timeline, table reservations with confirmation code lookups, personal customer portals, and an administrative operations dashboard with real-time analytics.

---

## 🔗 Project Links

- **Repository**: [https://github.com/Anupam477/Zestora](https://github.com/Anupam477/Zestora)
- **Live Demo**: [https://zestora-dining.vercel.app](https://zestora-dining.vercel.app)

---

## 🏛️ Project Architecture

```
Zestora/
├── client/                     # React 18 + Vite + Tailwind CSS Frontend
│   ├── public/
│   │   └── img/                # High-resolution culinary photography
│   ├── src/
│   │   ├── components/         # Modular UI components (Navbar, Footer, Modals, Cards)
│   │   ├── context/            # AuthContext, CartContext, ToastContext
│   │   ├── layouts/            # MainLayout and navigation wrappers
│   │   ├── pages/              # 16 Production Pages
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── FoodDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Reservation.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ...
│   │   ├── services/           # Axios/Fetch API client SDK
│   │   ├── App.jsx             # React Router routing & protected route guards
│   │   └── index.css           # Custom styling and animations
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Node.js + Express + MongoDB REST API
│   ├── config/                 # Database connection & auto-fallback engine
│   ├── controllers/            # Auth, Menu, Order, Reservation, Admin controllers
│   ├── middleware/             # JWT auth guards, admin authorization, error handling
│   ├── models/                 # Mongoose schemas (User, MenuItem, Order, Reservation, Coupon, Review)
│   ├── routes/                 # Express API routes
│   ├── seed/                   # Database seeding script with realistic culinary items
│   ├── server.js               # Central server entrypoint
│   └── package.json
│
├── vercel.json                 # Vercel deployment configuration
├── .env.example
├── .gitignore
├── package.json                # Root workspace orchestration scripts
└── README.md
```

---

## ✨ Features

### 1. Interactive Gourmet Menu
- **Search & Filter**: Real-time search across dish names, ingredients, and categories (Starters, Main Course, Indian Specialties, Artisan Pizza, Gourmet Burgers, Desserts, Beverages).
- **Dietary Indicators**: Vegetarian vs. Non-Vegetarian tags, spice intensity meter (levels 0 to 3), and nutritional breakdowns (calories, protein, carbs, fat).
- **Dynamic Sorting**: Filter by price (Low to High, High to Low), highest customer rating, or chef recommendations.

### 2. Cart & Promotional Coupons
- **Slide-Over Cart Drawer**: Global access across every screen with automatic `localStorage` synchronization.
- **Coupon Discount Engine**: 
  - `WELCOME10` — 10% discount on entire order
  - `FEAST20` — 20% discount on orders over $50
  - `FREESHIP` — Free shipping waiver
- Dynamic tax computation (5% GST) and automatic complimentary delivery threshold.

### 3. Checkout & 7-Stage Order Tracking
- Streamlined checkout flow supporting delivery address input and Cash on Delivery / Card simulation.
- Generates unique order tracking numbers (`ORD-YYYY-XXXXX`).
- **Live Timeline**: Visual state progress tracker (`PLACED` → `CONFIRMED` → `PREPARING` → `READY` → `OUT_FOR_DELIVERY` → `DELIVERED`).

### 4. Table Reservations
- Interactive guest count selector (1 to 20 guests), date picker, and special occasion requests.
- Automatic reservation confirmation code generation (`RES-XXXXXX`).
- Real-time booking lookup utility for guests to verify reservation and table assignments.

### 5. Role-Based Dashboards & Security
- **JWT Authentication**: Secure password hashing with `bcryptjs` and stateless bearer token authorization.
- **Customer Dashboard**: Track ongoing orders, review past dining bookings, and manage delivery addresses.
- **Admin Dashboard**: Real-time sales statistics, revenue counter, order status updating, reservation approval, and full menu CRUD management.

---

## 🔑 Demo Credentials

Test accounts are pre-configured in the database and accessible directly via **1-click buttons** on the Login page (`/login`):

| Role | Email | Password | Dashboard Route |
|---|---|---|---|
| **Administrator** | `admin@zestora.com` | `AdminPassword123!` | `/admin` |
| **Customer** | `customer@zestora.com` | `CustomerPassword123!` | `/dashboard` |

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** *(Optional — a zero-config embedded database automatically activates if external MongoDB is not detected)*

### 1. Clone the Repository
```bash
git clone https://github.com/Anupam477/Zestora.git
cd Zestora
```

### 2. Install Dependencies
Install dependencies for both client and server from the root:
```bash
npm run install:all
```

### 3. Start Development Server
```bash
# Runs the backend API (with embedded DB) on port 5000:
npm run dev
```

In a second terminal window, run the Vite client:
```bash
npm run dev:client
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### 4. Single-Command Production Start
You can also run both the client and server bundled together from the backend on port 5000:
```bash
npm run build
npm start
```
Visit **[http://localhost:5000](http://localhost:5000)** to view the full application.

---

## 🔌 Key API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account | Public |
| `POST` | `/api/auth/login` | Login and receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Private |
| `GET` | `/api/menu` | Browse menu dishes with filter & search | Public |
| `GET` | `/api/categories` | Get all active food categories | Public |
| `POST` | `/api/orders` | Place a new food order | Public / User |
| `GET` | `/api/orders/track/:orderNumber` | Live order timeline and status | Public |
| `POST` | `/api/orders/validate-coupon` | Validate coupon code and compute discount | Public |
| `POST` | `/api/reservations` | Reserve a dining table | Public / User |
| `GET` | `/api/reservations/lookup/:code` | Check table booking status by code | Public |
| `GET` | `/api/admin/stats` | Business telemetry & revenue metrics | Admin Only |
| `PATCH`| `/api/admin/orders/:id/status`| Progress order status in live timeline | Admin Only |
| `PATCH`| `/api/admin/reservations/:id/status`| Assign tables & manage reservations | Admin Only |

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push repository to GitHub.
2. Import project into Vercel and select root directory as `client`.
3. Set Build Command to `npm run build` and Output Directory to `dist`.
4. Add environment variable `VITE_API_URL` pointing to your hosted API.

### Backend (Render / Railway / Cloud)
1. Connect your repository to Render or Railway.
2. Set Build Command: `cd server && npm install`.
3. Set Start Command: `cd server && node server.js`.
4. Configure environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT=5000`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
