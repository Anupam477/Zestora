import React, { useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SectionHeader } from '../components/common/SectionHeader';
import {
  CalendarCheck,
  Clock,
  Users,
  CheckCircle2,
  Search,
  MapPin,
  Phone,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';

export const Reservation = () => {
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '19:00',
    guests: '2',
    specialRequest: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Lookup state
  const [searchCode, setSearchCode] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createReservation(formData);
      if (res.success) {
        setConfirmedBooking(res.data);
        success(`Reservation confirmed! Your code is ${res.data.reservationCode}`);
      }
    } catch (err) {
      toastError(err.message || 'Failed to book table. Please check dates and availability.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setLookingUp(true);
    setLookupResult(null);
    try {
      const res = await api.lookupReservation(searchCode);
      if (res.success) {
        setLookupResult(res.data);
      }
    } catch (err) {
      toastError('No reservation found matching this code.');
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <SectionHeader
        subtitle="Intimate Hospitality"
        title="Reserve Your Table Online"
        description="Select your preferred evening, party size, and culinary preferences for an unforgettable dining experience."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Video & Ambiance Showcase */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl h-80 sm:h-96">
            <img
              src="/img/video.jpg"
              alt="Dining Ambiance"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase mb-1">
                <Sparkles className="w-4 h-4" /> Grand Dining Room & Terrace
              </div>
              <h4 className="text-xl font-bold font-heading text-white">Atmospheric Luxury</h4>
              <p className="text-xs text-slate-300 mt-1">
                Live jazz accompaniment on Thursday & Saturday evenings. Private sommelier wine pairing available upon request.
              </p>
            </div>
          </div>

          {/* Quick Concierge Info */}
          <div className="luxury-card p-6 rounded-2xl space-y-3 text-xs text-slate-400">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Private Event Inquiries
            </h4>
            <p>For parties greater than 10 guests or exclusive dining room buyouts:</p>
            <p className="text-white font-medium">Direct Line: +1 (555) 234-5678</p>
            <p className="text-white font-medium">Email: private-dining@zestora.com</p>
          </div>
        </div>

        {/* Right: Reservation Form or Confirmation Card */}
        <div className="lg:col-span-7">
          {confirmedBooking ? (
            <div className="luxury-card p-8 rounded-3xl border-primary/40 text-center space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                  Table Confirmed!
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  We look forward to hosting you at Zestora.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-md mx-auto space-y-3 text-left text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Confirmation Code:</span>
                  <span className="text-primary font-black tracking-wider text-base">
                    {confirmedBooking.reservationCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guest Name:</span>
                  <span className="text-white font-medium">{confirmedBooking.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="text-white font-medium">
                    {confirmedBooking.date} at {confirmedBooking.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Number of Guests:</span>
                  <span className="text-white font-medium">{confirmedBooking.guests} People</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seating:</span>
                  <span className="text-amber-400 font-medium">{confirmedBooking.tableNumber}</span>
                </div>
              </div>

              <button
                onClick={() => setConfirmedBooking(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold"
              >
                Book Another Table
              </button>
            </div>
          ) : (
            <div className="luxury-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                <CalendarCheck className="w-5 h-5 text-primary" />
                Table Reservation Form
              </h3>

              <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Lady Genevieve"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="guest@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Contact Phone *
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

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Party Size (Guests) *
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Preferred Time Slot *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="12:00">12:00 PM (Lunch)</option>
                    <option value="13:00">01:00 PM (Lunch)</option>
                    <option value="14:00">02:00 PM (Lunch)</option>
                    <option value="17:30">05:30 PM (Early Dinner)</option>
                    <option value="18:30">06:30 PM (Dinner)</option>
                    <option value="19:30">07:30 PM (Prime Dinner)</option>
                    <option value="20:30">08:30 PM (Dinner)</option>
                    <option value="21:30">09:30 PM (Late Dining)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Special Requests, Dietary Restrictions or Occasion
                  </label>
                  <textarea
                    name="specialRequest"
                    rows={3}
                    value={formData.specialRequest}
                    onChange={handleChange}
                    placeholder="e.g. Quiet corner table for anniversary, celebration cake, wheelchair accessible, etc."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-primary/25 hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {submitting ? 'Confirming Availability...' : 'Book Table & Receive Confirmation Code'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Lookup Existing Reservation Section */}
      <div className="luxury-card p-8 rounded-3xl space-y-6 max-w-3xl mx-auto border-t border-slate-800">
        <div className="text-center space-y-1">
          <h4 className="text-xl font-bold font-heading text-white">Check Your Table Status</h4>
          <p className="text-xs text-slate-400">
            Have a confirmation code? Enter it below to check your table assignment and booking details.
          </p>
        </div>

        <form onSubmit={handleLookup} className="flex gap-3 max-w-md mx-auto">
          <input
            type="text"
            placeholder="e.g. RES-K7X92A"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white uppercase text-sm tracking-wider focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={lookingUp}
            className="px-6 py-3 rounded-xl bg-primary text-[#0B1120] font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Lookup
          </button>
        </form>

        {lookupResult && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm space-y-2 max-w-md mx-auto animate-in fade-in">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Status:</span>
              <span className="capitalize font-bold text-emerald-400">{lookupResult.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Guest:</span>
              <span className="text-white font-medium">{lookupResult.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Time:</span>
              <span className="text-white font-medium">{lookupResult.date} @ {lookupResult.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Guests:</span>
              <span className="text-white font-medium">{lookupResult.guests} People</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Table:</span>
              <span className="text-amber-400 font-medium">{lookupResult.tableNumber}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
