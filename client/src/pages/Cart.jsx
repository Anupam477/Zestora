import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { SectionHeader } from '../components/common/SectionHeader';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export const Cart = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    discount,
    grandTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setApplying(true);
    await applyCoupon(couponCode);
    setApplying(false);
  };

  if (items.length === 0) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold font-heading text-white">Your Cart is Currently Empty</h2>
        <p className="text-sm text-slate-400">
          You haven't selected any courses yet. Savor our menu of master-crafted dishes and handcrafted mocktails.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-black text-sm shadow-xl shadow-primary/20 hover:brightness-110 transition-all"
        >
          Browse Our Menu
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <SectionHeader
        subtitle="Review & Customize"
        title="Your Dining Order"
        align="left"
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items Table/List */}
        <div className="lg:col-span-8 luxury-card rounded-2xl overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold font-heading text-white">
              Selected Courses ({items.length})
            </h3>
            <button
              onClick={clearCart}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Cart
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-900 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-primary font-semibold mt-0.5">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                  {/* Quantity selector */}
                  <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 p-1">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right sm:min-w-[80px]">
                    <p className="text-base font-bold text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary Card */}
        <div className="lg:col-span-4 luxury-card rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-4">
            Order Summary
          </h3>

          {/* Promo code input */}
          {coupon ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Promo <strong>{coupon.code}</strong> Applied</span>
              </div>
              <button
                onClick={removeCoupon}
                className="text-rose-400 hover:text-rose-300 text-xs underline font-semibold"
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon (e.g. WELCOME10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={applying}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-primary text-xs font-bold border border-slate-700 transition-colors"
              >
                Apply
              </button>
            </form>
          )}

          {/* Pricing calculations */}
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (5% GST)</span>
              <span className="text-white font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-white font-medium">
                {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Discount Saved</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-800 flex justify-between text-lg font-bold text-white">
              <span>Grand Total</span>
              <span className="text-primary text-xl">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98]"
          >
            Proceed to Secure Checkout
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted Payment & Contactless Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
