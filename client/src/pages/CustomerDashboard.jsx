import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { SectionHeader } from '../components/common/SectionHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  User,
  ShoppingBag,
  CalendarCheck,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Save,
} from 'lucide-react';

export const CustomerDashboard = () => {
  const { user, updateUser } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'reservations' | 'profile'
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [ordersRes, resRes] = await Promise.all([
          api.getMyOrders(),
          api.getMyReservations(),
        ]);
        if (ordersRes.success) setOrders(ordersRes.data);
        if (resRes.success) setReservations(resRes.data);
      } catch (err) {
        console.error('Failed to load customer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        address: {
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          zip: profileForm.zip,
        },
      });
      if (res.success) {
        updateUser(res.user);
        success('Profile and delivery details updated successfully!');
      }
    } catch (err) {
      toastError(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="luxury-card p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent-orange text-[#0B1120] font-black text-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary" /> {user?.email}
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="capitalize text-primary font-semibold">{user?.role} Account</span>
            </p>
          </div>
        </div>

        <Link
          to="/menu"
          className="px-6 py-3 rounded-xl bg-primary text-[#0B1120] font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-primary/20"
        >
          Explore Menu
        </Link>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 space-x-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          My Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'reservations'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          Table Bookings ({reservations.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          Profile & Address Settings
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <LoadingSpinner text="Loading account records..." />
      ) : (
        <div>
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="luxury-card p-12 text-center rounded-3xl space-y-4">
                  <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Previous Orders Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Treat your palate to exquisite artisanal courses delivered right to your table.
                  </p>
                  <Link
                    to="/menu"
                    className="inline-block px-6 py-2.5 rounded-xl bg-primary text-[#0B1120] font-bold text-xs"
                  >
                    Start an Order
                  </Link>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="luxury-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-primary">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            ord.orderStatus === 'DELIVERED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : ord.orderStatus === 'CANCELLED'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                          }`}
                        >
                          {ord.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString()} at{' '}
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                        {ord.items.length} item(s) • Total: <strong>${ord.pricing.total.toFixed(2)}</strong>
                      </p>
                    </div>

                    <Link
                      to={`/track/${ord.orderNumber}`}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Track Order</span>
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="luxury-card p-12 text-center rounded-3xl space-y-4">
                  <CalendarCheck className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Table Reservations Found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Reserve an exclusive dining table for birthdays, celebrations, or intimate culinary journeys.
                  </p>
                  <Link
                    to="/reservation"
                    className="inline-block px-6 py-2.5 rounded-xl bg-primary text-[#0B1120] font-bold text-xs"
                  >
                    Book a Table
                  </Link>
                </div>
              ) : (
                reservations.map((res) => (
                  <div
                    key={res._id}
                    className="luxury-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-primary">
                          {res.reservationCode}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            res.status === 'confirmed'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : res.status === 'pending'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Date: <strong>{res.date}</strong> at <strong>{res.time}</strong> • Party of{' '}
                        <strong>{res.guests} Guests</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Seating: <span className="text-amber-400">{res.tableNumber}</span>
                        {res.specialRequest && ` • Note: "${res.specialRequest}"`}
                      </p>
                    </div>

                    <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                      Confirmed Registry
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="luxury-card p-8 rounded-3xl max-w-2xl space-y-6">
              <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-3">
                Account Information & Default Address
              </h3>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={profileForm.street}
                      onChange={(e) => setProfileForm({ ...profileForm, street: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        value={profileForm.zip}
                        onChange={(e) => setProfileForm({ ...profileForm, zip: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-3 rounded-xl bg-primary text-[#0B1120] font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
