import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    success('Thank you for subscribing to our culinary gazette!');
    setEmail('');
  };

  return (
    <footer className="bg-[#070B14] border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-orange flex items-center justify-center shadow-lg shadow-primary/20">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black font-heading tracking-wide text-white">
                Zestora<span className="text-primary font-serif">.</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Honoring artisanal culinary heritage with contemporary flair. Sourced organically from heritage farms and crafted by master chefs.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary hover:text-[#0B1120] text-slate-300 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary hover:text-[#0B1120] text-slate-300 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary hover:text-[#0B1120] text-slate-300 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary hover:text-[#0B1120] text-slate-300 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-5 border-l-2 border-primary pl-3">
              Explore & Dine
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/menu" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> À La Carte Menu
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> Reserve a Private Table
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> Live Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> Our Kitchen & Chefs
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> Culinary Visual Gallery
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-primary" /> Guest Critic Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Hours */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-5 border-l-2 border-primary pl-3">
              Concierge & Hours
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>123 Grand Avenue, Manhattan, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+1 (555) 234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>concierge@zestora.com</span>
              </li>
              <li className="flex items-start gap-3 pt-1 border-t border-slate-800">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-300 font-medium">Daily Service:</p>
                  <p className="text-xs text-slate-400">Lunch: 11:30 AM – 3:30 PM</p>
                  <p className="text-xs text-slate-400">Dinner: 5:30 PM – 11:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-white font-heading font-bold text-lg mb-5 border-l-2 border-primary pl-3">
              Culinary Gazette
            </h4>
            <p className="text-sm text-slate-400 mb-4">
              Receive secret tasting menus, seasonal invitations, and exclusive dining privileges.
            </p>
            {subscribed ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>You are subscribed to the private registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-[#0B1120] font-bold text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Join the Society
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Zestora Haute Cuisine. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">Terms of Hospitality</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Food Safety Certification</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
