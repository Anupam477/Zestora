import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  User,
  Menu as MenuIcon,
  X,
  Phone,
  Clock,
  MapPin,
  CalendarCheck,
  Compass,
  LogOut,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { totalCount, openCart } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Reservation', path: '/reservation' },
    { name: 'Track Order', path: '/track' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reviews', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="hidden lg:block bg-[#070B14] border-b border-slate-800/80 text-xs text-slate-400 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              123 Grand Avenue, Manhattan, NY 10001
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Open Daily: 11:00 AM – 11:00 PM
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:+15552345678" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <Phone className="w-3.5 h-3.5 text-primary" />
              +1 (555) 234-5678
            </a>
            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-medium">
              Free Delivery Over $50
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B1120]/95 backdrop-blur-md shadow-2xl border-b border-slate-800/90 py-3.5'
            : 'bg-[#0B1120]/80 backdrop-blur-sm border-b border-slate-800/40 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-orange flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black font-heading tracking-wide text-white flex items-center gap-1">
                Zestora<span className="text-primary font-serif">.</span>
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-primary/90 font-bold -mt-1">
                Haute Cuisine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & CTAs */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              aria-label="View Cart"
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700/60"
            >
              <ShoppingBag className="w-5 h-5 text-primary" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-[#0B1120] text-xs font-bold flex items-center justify-center shadow-md animate-scale">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Dropdown or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 text-sm font-medium transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 border border-slate-700">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-primary/20 text-primary">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                      >
                        <Compass className="w-4 h-4 text-primary" />
                        My Orders & Profile
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 rounded-lg font-medium"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors"
              >
                <User className="w-4 h-4 text-primary" />
                Sign In
              </Link>
            )}

            {/* Quick Reservation Button */}
            <Link
              to="/reservation"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] hover:brightness-110 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Table
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              className="xl:hidden p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-800/80 bg-[#0B1120]/98 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                    isActive ? 'text-primary bg-primary/10 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                to="/reservation"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-[#0B1120] font-bold text-center"
              >
                <CalendarCheck className="w-5 h-5" />
                Book Table Online
              </Link>
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 text-white font-medium text-center"
                >
                  <User className="w-4 h-4 text-primary" />
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
