import React, { useState } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { useToast } from '../context/ToastContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const Contact = () => {
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toastError('Please fill in your name, email, and inquiry message.');
      return;
    }
    setSent(true);
    success('Inquiry received! Our dining concierge will respond within 4 business hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <SectionHeader
        subtitle="Concierge & Inquiries"
        title="Connect With Our Hospitality Team"
        description="Have questions about private dining, bespoke catering, or culinary alliances? We are here to assist."
      />

      {/* 3 Contact Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="luxury-card p-6 rounded-2xl flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold font-heading text-white">Table Reservations</h4>
            <p className="text-xs text-slate-400 mt-1">Direct dining room bookings & dietary concierge</p>
            <p className="text-xs text-primary font-semibold mt-2">reservations@zestora.com</p>
            <p className="text-xs text-slate-300">+1 (555) 234-5678 (Ext 1)</p>
          </div>
        </div>

        <div className="luxury-card p-6 rounded-2xl flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold font-heading text-white">General & Catering</h4>
            <p className="text-xs text-slate-400 mt-1">Weddings, corporate galas & private chef requests</p>
            <p className="text-xs text-primary font-semibold mt-2">events@zestora.com</p>
            <p className="text-xs text-slate-300">+1 (555) 234-5678 (Ext 2)</p>
          </div>
        </div>

        <div className="luxury-card p-6 rounded-2xl flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold font-heading text-white">Dining Hours</h4>
            <p className="text-xs text-slate-400 mt-1">Open 7 days a week for lunch & evening service</p>
            <p className="text-xs text-slate-300 mt-2">Lunch: 11:30 AM – 3:30 PM</p>
            <p className="text-xs text-slate-300">Dinner: 5:30 PM – 11:00 PM</p>
          </div>
        </div>
      </div>

      {/* Map & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Google Map */}
        <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl min-h-[350px] lg:min-h-[450px]">
          <iframe
            title="Zestora Location"
            className="w-full h-full border-0 filter contrast-125 brightness-90"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2155732959827!2d-73.98784492346747!3d40.75253893484083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-6 luxury-card p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
              <MessageSquare className="w-5 h-5 text-primary" />
              Send Us a Message
            </h3>

            {sent ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Message Dispatched</h4>
                <p className="text-xs text-slate-300">
                  Thank you for reaching out. Our concierge desk will review your inquiry shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 text-xs font-bold text-primary underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="guest@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Private Dining Inquiry, Feedback, etc."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How may our concierge assist your dining expectations?"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:brightness-110 transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
