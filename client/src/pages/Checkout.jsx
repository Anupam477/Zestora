import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { SectionHeader } from '../components/common/SectionHeader';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';

export const Checkout = () => {
  const { items, subtotal, tax, deliveryFee, discount, grandTotal, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'New York',
    state: user?.address?.state || 'NY',
    zip: user?.address?.zip || '',
    specialInstructions: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    navigate('/menu');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.zip) {
      toastError('Please fill out all required contact and delivery address fields.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
          },
          specialInstructions: formData.specialInstructions,
        },
        items: items.map((i) => ({
          _id: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        couponCode: coupon?.code || null,
        paymentMethod,
      };

      const res = await api.createOrder(orderPayload);
      if (res.success) {
        success(`Order ${res.data.orderNumber} placed successfully!`);
        clearCart();
        navigate(`/track/${res.data.orderNumber}`);
      }
    } catch (err) {
      toastError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <SectionHeader
        subtitle="Final Step"
        title="Delivery Details & Payment"
        align="left"
        className="mb-6"
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact & Address Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact Details Card */}
          <div className="luxury-card p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              1. Delivery & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Johnathan Doe"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Street Address & Apartment / Suite *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    required
                    value={formData.zip}
                    onChange={handleChange}
                    placeholder="10001"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Special Kitchen or Delivery Instructions (Optional)
                </label>
                <textarea
                  name="specialInstructions"
                  rows={2}
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  placeholder="e.g. Ring front gate buzzer, allergy to peanuts, etc."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="luxury-card p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              2. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/15'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm text-white">Cash on Delivery</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Pay securely with cash or card swipe upon arrival.
                  </p>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  paymentMethod === 'CARD'
                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/15'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={() => setPaymentMethod('CARD')}
                  className="mt-1 text-primary focus:ring-primary"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="font-bold text-sm text-white">Credit / Debit Card</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Instant 256-bit encrypted online checkout.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Preview & Place Button */}
        <div className="lg:col-span-5 luxury-card p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Order Confirmation
          </h3>

          <div className="max-h-60 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {items.map((i) => (
              <div key={i._id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">{i.quantity}x</span>
                  <span className="text-slate-200 font-medium line-clamp-1">{i.name}</span>
                </div>
                <span className="text-slate-300 font-bold">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5% GST)</span>
              <span className="text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Doorstep Delivery</span>
              <span className="text-white font-medium">
                {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Promo Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-slate-800 pt-3 flex justify-between text-base font-black text-white">
              <span>Grand Total</span>
              <span className="text-primary text-xl">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? 'Placing Your Order...' : 'Confirm & Place Order'}
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Guaranteed Kitchen Confirmation & Live Tracking</span>
          </div>
        </div>
      </form>
    </div>
  );
};
