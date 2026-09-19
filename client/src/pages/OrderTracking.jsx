import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { SectionHeader } from '../components/common/SectionHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Search,
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  Home,
  XCircle,
  MapPin,
  Phone,
  Calendar,
} from 'lucide-react';

export const OrderTracking = () => {
  const { orderNumber: paramOrderNumber } = useParams();
  const [orderNumberInput, setOrderNumberInput] = useState(paramOrderNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const stages = [
    { key: 'PLACED', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed by Kitchen', icon: CheckCircle2 },
    { key: 'PREPARING', label: 'Chef Preparing', icon: ChefHat },
    { key: 'READY', label: 'Packed & Ready', icon: PackageCheck },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike },
    { key: 'DELIVERED', label: 'Delivered', icon: Home },
  ];

  const fetchOrder = async (ordNum) => {
    if (!ordNum.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.getOrderByNumber(ordNum);
      if (res.success) {
        setOrder(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'No order found with this tracking number');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramOrderNumber) {
      fetchOrder(paramOrderNumber);
    }
  }, [paramOrderNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderNumberInput.trim()) return;
    navigate(`/track/${orderNumberInput.trim().toUpperCase()}`);
    fetchOrder(orderNumberInput.trim().toUpperCase());
  };

  const getStageIndex = (status) => {
    if (status === 'CANCELLED') return -1;
    return stages.findIndex((s) => s.key === status);
  };

  const currentStageIndex = order ? getStageIndex(order.orderStatus) : 0;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <SectionHeader
        subtitle="Live Kitchen Dispatch"
        title="Track Your Order In Real Time"
        description="Monitor every milestone from chef preparation to your doorstep."
      />

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Enter Order # (e.g. ORD-2026-981245)"
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value.toUpperCase())}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-black text-sm shadow-xl shadow-primary/20 hover:brightness-110 transition-all flex items-center gap-2"
        >
          Track Order
        </button>
      </form>

      {/* Loading state */}
      {loading && <LoadingSpinner text="Connecting to kitchen dispatch..." />}

      {/* Error state */}
      {errorMsg && (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-center text-sm max-w-md mx-auto">
          {errorMsg}
        </div>
      )}

      {/* Order Results */}
      {order && !loading && (
        <div className="space-y-8 animate-in fade-in">
          {/* Header Card */}
          <div className="luxury-card p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-slate-400">Order Number</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/20 text-primary">
                  {order.orderNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block">Current Status</span>
              <span
                className={`inline-block mt-1 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${
                  order.orderStatus === 'DELIVERED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : order.orderStatus === 'CANCELLED'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    : 'bg-primary/20 text-primary border border-primary/40 animate-pulse'
                }`}
              >
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Timeline Visual Progression */}
          {order.orderStatus === 'CANCELLED' ? (
            <div className="p-8 rounded-3xl bg-rose-950/30 border border-rose-500/40 text-center space-y-2">
              <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
              <h3 className="text-xl font-bold text-rose-200">This Order was Cancelled</h3>
              <p className="text-xs text-slate-400">
                Please contact our concierge team if you have any questions regarding refunds.
              </p>
            </div>
          ) : (
            <div className="luxury-card p-8 rounded-3xl">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-8">
                Delivery Timeline Progress
              </h4>

              <div className="relative">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-800" />
                <div
                  className="hidden md:block absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-primary transition-all duration-700"
                  style={{
                    width: `${Math.max(0, (currentStageIndex / (stages.length - 1)) * 90)}%`,
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
                  {stages.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div
                        key={stage.key}
                        className="flex md:flex-col items-center gap-4 md:gap-3 text-left md:text-center"
                      >
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                            isCurrent
                              ? 'bg-primary text-[#0B1120] shadow-lg shadow-primary/40 ring-4 ring-primary/20 scale-110'
                              : isCompleted
                              ? 'bg-emerald-500 text-[#0B1120]'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold leading-tight ${
                              isCompleted ? 'text-white' : 'text-slate-500'
                            }`}
                          >
                            {stage.label}
                          </p>
                          {isCurrent && (
                            <span className="inline-block mt-0.5 text-[10px] text-primary font-semibold animate-pulse">
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Order Details & Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Items Card */}
            <div className="luxury-card p-6 rounded-3xl space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
                Items in this Order ({order.items.length})
              </h4>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary text-xs">{item.quantity}x</span>
                      <span className="text-white">{item.name}</span>
                    </div>
                    <span className="font-medium text-slate-300">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.pricing.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{order.pricing.deliveryFee === 0 ? 'FREE' : `$${order.pricing.deliveryFee.toFixed(2)}`}</span>
                </div>
                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-${order.pricing.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-slate-800 pt-2 flex justify-between text-base font-bold text-white">
                  <span>Total Paid/Due</span>
                  <span className="text-primary">${order.pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Destination Card */}
            <div className="luxury-card p-6 rounded-3xl space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Delivery Information
              </h4>
              <div className="space-y-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block">Recipient:</span>
                  <p className="text-sm font-bold text-white mt-0.5">{order.customerDetails.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">Address:</span>
                  <p className="text-white mt-0.5">
                    {order.customerDetails.address.street}, {order.customerDetails.address.city}, {order.customerDetails.address.state} {order.customerDetails.address.zip}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 block">Phone Contact:</span>
                  <p className="text-white mt-0.5">{order.customerDetails.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment Method:</span>
                  <p className="text-white font-medium mt-0.5">{order.paymentMethod} ({order.paymentStatus})</p>
                </div>
                {order.customerDetails.specialInstructions && (
                  <div>
                    <span className="text-slate-500 block">Kitchen Instructions:</span>
                    <p className="text-amber-300 italic mt-0.5">{order.customerDetails.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
