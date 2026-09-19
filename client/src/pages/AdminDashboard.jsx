import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { SectionHeader } from '../components/common/SectionHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CalendarCheck,
  Users,
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronDown,
  AlertCircle,
  Eye,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'menu' | 'reservations' | 'customers'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menu Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    image: '/img/menu-1.jpg',
    isVegetarian: false,
    isSpicy: false,
    spicyLevel: 0,
    isPopular: false,
    isFeatured: false,
    isAvailable: true,
    preparationTime: '20 mins',
    calories: 450,
    ingredients: '',
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, menuRes, catsRes, resRes, custRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(),
        api.getMenuItems(),
        api.getCategories(),
        api.getAdminReservations(),
        api.getAdminCustomers(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data);
      if (menuRes.success) setMenuItems(resRes.data ? menuRes.data : []);
      if (catsRes.success) setCategories(catsRes.data);
      if (resRes.success) setReservations(resRes.data);
      if (custRes.success) setCustomers(custRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchAdminData();
  }, [isAdmin, navigate]);

  // Update Order Status handler
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        success(`Order updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        api.getAdminStats().then((s) => s.success && setStats(s.data));
      }
    } catch (err) {
      toastError(err.message || 'Failed to update order status');
    }
  };

  // Update Reservation Status handler
  const handleReservationStatusUpdate = async (resId, newStatus, tableNum) => {
    try {
      const res = await api.updateReservationStatus(resId, newStatus, tableNum);
      if (res.success) {
        success(`Reservation updated to ${newStatus}`);
        setReservations((prev) =>
          prev.map((r) => (r._id === resId ? { ...r, status: newStatus } : r))
        );
      }
    } catch (err) {
      toastError(err.message || 'Failed to update reservation');
    }
  };

  // Menu item Form Submit (Add or Edit)
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...menuForm,
        category: menuForm.category || (categories[0] ? categories[0]._id : null),
      };

      if (editingItem) {
        const res = await api.updateMenuItem(editingItem._id, payload);
        if (res.success) {
          success('Menu item successfully updated!');
        }
      } else {
        const res = await api.createMenuItem(payload);
        if (res.success) {
          success('New dish added to the à la carte menu!');
        }
      }

      setIsMenuModalOpen(false);
      setEditingItem(null);
      const updatedMenu = await api.getMenuItems();
      if (updatedMenu.success) setMenuItems(updatedMenu.data);
    } catch (err) {
      toastError(err.message || 'Failed to save menu item');
    }
  };

  // Delete Dish handler
  const handleDeleteDish = async (dishId) => {
    if (!window.confirm('Are you sure you want to remove this dish from the menu?')) return;
    try {
      const res = await api.deleteMenuItem(dishId);
      if (res.success) {
        success('Dish removed from menu');
        setMenuItems((prev) => prev.filter((item) => item._id !== dishId));
      }
    } catch (err) {
      toastError(err.message || 'Failed to delete dish');
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setMenuForm({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: categories[0]?._id || '',
      image: '/img/menu-1.jpg',
      isVegetarian: false,
      isSpicy: false,
      spicyLevel: 0,
      isPopular: false,
      isFeatured: false,
      isAvailable: true,
      preparationTime: '20 mins',
      calories: 450,
      ingredients: '',
    });
    setIsMenuModalOpen(true);
  };

  const openEditModal = (dish) => {
    setEditingItem(dish);
    setMenuForm({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      discountPrice: dish.discountPrice || '',
      category: dish.category?._id || dish.category,
      image: dish.image,
      isVegetarian: dish.isVegetarian,
      isSpicy: dish.isSpicy,
      spicyLevel: dish.spicyLevel || 0,
      isPopular: dish.isPopular,
      isFeatured: dish.isFeatured,
      isAvailable: dish.isAvailable,
      preparationTime: dish.preparationTime || '20 mins',
      calories: dish.calories || 450,
      ingredients: dish.ingredients ? dish.ingredients.join(', ') : '',
    });
    setIsMenuModalOpen(true);
  };

  if (!isAdmin) return null;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header bar */}
      <div className="luxury-card p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary/20 text-primary flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Executive Control Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-1">
            Zestora Management Suite
          </h1>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110"
        >
          <Plus className="w-4 h-4" />
          Add New Dish
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-2 sm:space-x-8 overflow-x-auto custom-scrollbar">
        {[
          { key: 'overview', label: 'Overview Analytics', icon: TrendingUp },
          { key: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { key: 'menu', label: `Menu Items (${menuItems.length})`, icon: UtensilsCrossed },
          { key: 'reservations', label: `Reservations (${reservations.length})`, icon: CalendarCheck },
          { key: 'customers', label: `Customers (${customers.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingSpinner text="Retrieving administrative telemetry..." />
      ) : (
        <div className="space-y-8">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8">
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="luxury-card p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400">Total Revenue</p>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-primary mt-1">
                      ${stats.totalRevenue.toFixed(2)}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="luxury-card p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400">Total Orders</p>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-white mt-1">
                      {stats.totalOrders}
                    </h3>
                    <span className="text-[11px] text-emerald-400 font-semibold">{stats.todayOrders} today</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                <div className="luxury-card p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400">Active Kitchen Orders</p>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-amber-400 mt-1">
                      {stats.pendingOrders}
                    </h3>
                    <span className="text-[11px] text-slate-400">In Prep / Dispatch</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                <div className="luxury-card p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-bold text-slate-400">Table Bookings</p>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-white mt-1">
                      {stats.totalReservations}
                    </h3>
                    <span className="text-[11px] text-amber-400 font-semibold">{stats.pendingReservations} pending</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="luxury-card p-6 rounded-3xl space-y-4">
                <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-3">
                  Recent Kitchen Orders
                </h3>
                <div className="divide-y divide-slate-800">
                  {stats.recentOrders?.map((ord) => (
                    <div key={ord._id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-primary mr-2">{ord.orderNumber}</span>
                        <span className="text-white font-medium">{ord.customerDetails.name}</span>
                        <span className="text-slate-500 ml-2">({ord.items.length} items)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-200">${ord.pricing.total.toFixed(2)}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. ORDERS MANAGEMENT TAB */}
          {activeTab === 'orders' && (
            <div className="luxury-card p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-3">
                Live Order Processing
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Order #</th>
                      <th className="p-3.5">Customer & Phone</th>
                      <th className="p-3.5">Courses</th>
                      <th className="p-3.5">Total</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Status Progression</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-primary">
                          {ord.orderNumber}
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-white">{ord.customerDetails.name}</p>
                          <p className="text-[11px] text-slate-400">{ord.customerDetails.phone}</p>
                        </td>
                        <td className="p-3.5">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="line-clamp-1">
                              {it.quantity}x {it.name}
                            </div>
                          ))}
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          ${ord.pricing.total.toFixed(2)}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {ord.paymentMethod} ({ord.paymentStatus})
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleOrderStatusUpdate(ord._id, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                              ord.orderStatus === 'DELIVERED'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                : ord.orderStatus === 'CANCELLED'
                                ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                                : 'bg-slate-900 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            <option value="PLACED">PLACED</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="READY">READY</option>
                            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. MENU MANAGEMENT TAB */}
          {activeTab === 'menu' && (
            <div className="luxury-card p-6 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold font-heading text-white">
                  Menu Items Catalogue ({menuItems.length})
                </h3>
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 rounded-xl bg-primary text-[#0B1120] font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Dish
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Image & Dish Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Dietary</th>
                      <th className="p-3.5">Availability</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {menuItems.map((dish) => (
                      <tr key={dish._id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{dish.name}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{dish.description}</p>
                          </div>
                        </td>
                        <td className="p-3.5 text-primary font-semibold">
                          {dish.categoryName || dish.category?.name || 'Main Course'}
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          ${dish.price.toFixed(2)}
                          {dish.discountPrice && (
                            <span className="text-emerald-400 block text-[10px]">
                              Sale: ${dish.discountPrice.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${dish.isVegetarian ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                            {dish.isVegetarian ? 'Veg' : 'Non-Veg'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${dish.isAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(dish)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDish(dish._id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. RESERVATIONS MANAGEMENT TAB */}
          {activeTab === 'reservations' && (
            <div className="luxury-card p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-3">
                Table Bookings Registry
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Code</th>
                      <th className="p-3.5">Guest & Phone</th>
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5">Guests</th>
                      <th className="p-3.5">Special Request</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {reservations.map((res) => (
                      <tr key={res._id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-primary">
                          {res.reservationCode}
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-white">{res.name}</p>
                          <p className="text-[11px] text-slate-400">{res.phone}</p>
                        </td>
                        <td className="p-3.5 text-white font-medium">
                          {res.date} @ {res.time}
                        </td>
                        <td className="p-3.5 font-bold">
                          {res.guests} Persons
                        </td>
                        <td className="p-3.5 text-slate-400 max-w-xs truncate">
                          {res.specialRequest || '—'}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={res.status}
                            onChange={(e) => handleReservationStatusUpdate(res._id, e.target.value, res.tableNumber)}
                            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. CUSTOMERS LIST TAB */}
          {activeTab === 'customers' && (
            <div className="luxury-card p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-3">
                Registered Patrons
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Phone</th>
                      <th className="p-3.5">Default Delivery Address</th>
                      <th className="p-3.5">Member Since</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {customers.map((cust) => (
                      <tr key={cust._id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5 font-bold text-white">{cust.name}</td>
                        <td className="p-3.5 text-slate-300">{cust.email}</td>
                        <td className="p-3.5">{cust.phone || '—'}</td>
                        <td className="p-3.5 text-slate-400">
                          {cust.address?.street ? `${cust.address.street}, ${cust.address.city}` : 'Not provided'}
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(cust.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Menu Item Create/Edit Modal */}
      <Modal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        title={editingItem ? 'Edit Culinary Dish' : 'Create New Menu Item'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleMenuSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Dish Name *</label>
              <input
                type="text"
                required
                value={menuForm.name}
                onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description *</label>
              <textarea
                required
                rows={2}
                value={menuForm.description}
                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.5"
                required
                value={menuForm.price}
                onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Sale Price ($)</label>
              <input
                type="number"
                step="0.5"
                value={menuForm.discountPrice}
                onChange={(e) => setMenuForm({ ...menuForm, discountPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Category</label>
              <select
                value={menuForm.category}
                onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Image Asset Path</label>
              <select
                value={menuForm.image}
                onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={`/img/menu-${n}.jpg`}>{`/img/menu-${n}.jpg`}</option>
                ))}
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={`/img/about-${n}.jpg`}>{`/img/about-${n}.jpg`}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Ingredients (comma separated)</label>
              <input
                type="text"
                value={menuForm.ingredients}
                onChange={(e) => setMenuForm({ ...menuForm, ingredients: e.target.value })}
                placeholder="e.g. Saffron, Wild mushrooms, Truffle oil"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>

            <div className="flex items-center gap-6 sm:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                <input
                  type="checkbox"
                  checked={menuForm.isVegetarian}
                  onChange={(e) => setMenuForm({ ...menuForm, isVegetarian: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Vegetarian</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                <input
                  type="checkbox"
                  checked={menuForm.isSpicy}
                  onChange={(e) => setMenuForm({ ...menuForm, isSpicy: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Spicy</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                <input
                  type="checkbox"
                  checked={menuForm.isPopular}
                  onChange={(e) => setMenuForm({ ...menuForm, isPopular: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Popular Badge</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsMenuModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-[#0B1120] font-black text-xs uppercase"
            >
              Save Dish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
