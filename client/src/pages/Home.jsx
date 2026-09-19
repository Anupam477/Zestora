import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { MenuCard } from '../components/menu/MenuCard';
import { FoodDetailModal } from '../components/menu/FoodDetailModal';
import { SectionHeader } from '../components/common/SectionHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  UtensilsCrossed,
  CalendarCheck,
  ShoppingBag,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  Star,
  Quote,
  ChefHat,
  Truck,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';

export const Home = () => {
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [dishesRes, catsRes, reviewsRes] = await Promise.all([
          api.getFeaturedDishes(),
          api.getCategories(),
          api.getReviews(),
        ]);
        if (dishesRes.success) setFeaturedDishes(dishesRes.data);
        if (catsRes.success) setCategories(catsRes.data);
        if (reviewsRes.success) setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const chefTeam = [
    { name: 'Chef Alessandro Rossi', role: 'Executive Head Chef', image: '/img/team-1.jpg', spec: 'Italian & Classical French' },
    { name: 'Chef Vikramaditya Singh', role: 'Master of Heritage Spice', image: '/img/team-2.jpg', spec: 'Royal Awadhi Dum Pukht' },
    { name: 'Chef Marcus Dubois', role: 'Senior Pastry Alchemist', image: '/img/team-3.jpg', spec: 'Artisan Baking & Confection' },
    { name: 'Chef Elena Rostova', role: 'Sous Chef & Saucier', image: '/img/team-4.jpg', spec: 'Modern Gastronomy' },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#070B14]">
        {/* Background Image with dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 transform animate-pulse"
          style={{ backgroundImage: "url('/img/bg-hero.jpg')", animationDuration: '8s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs sm:text-sm font-bold tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Michelin Inspired Gastronomy</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading text-white tracking-tight leading-[1.1]">
              Enjoy Our <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-accent-orange">
                Delicious Meal
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Indulge in an extraordinary symphony of authentic flavors, hand-harvested ingredients, and timeless culinary techniques crafted by world-class master chefs.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/menu"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-primary/25 hover:brightness-110 hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                Order Now
              </Link>
              <Link
                to="/reservation"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base border border-slate-700/80 flex items-center justify-center gap-3 transition-all hover:scale-105"
              >
                <CalendarCheck className="w-5 h-5 text-primary" />
                Reserve a Table
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-black font-heading text-white">15+</p>
                <p className="text-xs sm:text-sm text-slate-400">Years Heritage</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black font-heading text-primary">50+</p>
                <p className="text-xs sm:text-sm text-slate-400">Gourmet Creations</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black font-heading text-white">4.9 ★</p>
                <p className="text-xs sm:text-sm text-slate-400">12,000+ Patrons</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Rotating Culinary Plate */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px]">
              {/* Outer decorative glowing ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-accent-orange/10 blur-3xl luxury-glow animate-pulse" />
              <div className="absolute inset-4 rounded-full border border-primary/20 border-dashed animate-spin-slow" />
              
              {/* Spinning Hero Food Image */}
              <img
                src="/img/hero.png"
                alt="Zestora Signature Gourmet Dish"
                className="relative z-10 w-full h-full object-contain filter drop-shadow-2xl animate-spin-slow hover:pause"
                style={{ animationDuration: '60s' }}
              />

              {/* Floating Highlight Card */}
              <div className="absolute -bottom-4 -left-4 z-20 glass-panel p-4 rounded-2xl border border-primary/30 shadow-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Award Winner</p>
                  <p className="text-sm font-bold text-white">Best Culinary Haute 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS (Why Choose Us) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="luxury-card p-8 rounded-2xl flex flex-col items-start space-y-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ChefHat className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">Master Chefs</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Guided by internationally celebrated culinary artisans dedicated to precision gastronomy and flavor mastery.
            </p>
          </div>

          <div className="luxury-card p-8 rounded-2xl flex flex-col items-start space-y-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">Quality Food</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              100% farm-to-table organic produce, prime dry-aged cuts, and sustainable wild-caught seafood.
            </p>
          </div>

          <div className="luxury-card p-8 rounded-2xl flex flex-col items-start space-y-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">Online Order</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fast, temperature-controlled delivery packaged in eco-luxury insulated thermal boxes with live tracking.
            </p>
          </div>

          <div className="luxury-card p-8 rounded-2xl flex flex-col items-start space-y-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">24/7 Service</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Round-the-clock dedicated concierge for private events, midnight cravings, and corporate hospitality.
            </p>
          </div>
        </div>
      </section>

      {/* 3. ABOUT OUR STORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* 4-Image Mosaic Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="/img/about-1.jpg"
                alt="Zestora Kitchen Craft"
                className="rounded-2xl object-cover w-full h-52 sm:h-64 border border-slate-800 shadow-xl"
              />
              <img
                src="/img/about-2.jpg"
                alt="Biryani Slow Cooking"
                className="rounded-2xl object-cover w-full h-40 sm:h-48 border border-slate-800 shadow-xl"
              />
            </div>
            <div className="space-y-4 pt-6">
              <img
                src="/img/about-3.jpg"
                alt="Artisan Mocktails"
                className="rounded-2xl object-cover w-full h-40 sm:h-48 border border-slate-800 shadow-xl"
              />
              <img
                src="/img/about-4.jpg"
                alt="Dining Atmosphere"
                className="rounded-2xl object-cover w-full h-52 sm:h-64 border border-slate-800 shadow-xl"
              />
            </div>
          </div>

          {/* Story Text */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              subtitle="Our Philosophy"
              title="Welcome to Zestora"
              align="left"
              className="mb-4"
            />
            <p className="text-slate-300 text-base leading-relaxed">
              Founded fifteen years ago with a singular dream: to harmonize traditional slow-cooking methods with visionary gastronomy. Every recipe at Zestora is steeped in cultural reverence and elevated through refined modern technique.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Whether you are dining under the grand chandeliers of our dining hall or experiencing our gourmet home delivery, our commitment remains unwavering: unparalleled freshness, impeccable warmth, and unforgettable taste memories.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              <div className="border-l-4 border-primary pl-4">
                <p className="text-3xl font-black font-heading text-white">15</p>
                <p className="text-xs uppercase font-bold text-slate-400 mt-1">Years of Culinary Mastery</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <p className="text-3xl font-black font-heading text-primary">50</p>
                <p className="text-xs uppercase font-bold text-slate-400 mt-1">Master Artisans & Staff</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-primary text-white text-sm font-bold transition-all hover:gap-3"
              >
                Learn More About Us
                <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED SIGNATURE MENU ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeader
            subtitle="Signature Courses"
            title="Most Popular Dishes"
            align="left"
            className="mb-0"
            description="Hand-selected by Chef Alessandro Rossi, crafted daily with premier ingredients."
          />
          <Link
            to="/menu"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-primary font-bold hover:text-white transition-colors"
          >
            View Full Menu ({categories.length} Categories)
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Preparing signature dishes..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredDishes.map((dish) => (
              <MenuCard
                key={dish._id}
                dish={dish}
                onSelect={(d) => setSelectedDish(d)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. TABLE RESERVATION BANNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#0F172A] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
              <img
                src="/img/video.jpg"
                alt="Dining Table Experience"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0F172A]/50 to-[#0F172A] hidden lg:block" />
            </div>

            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                <CalendarCheck className="w-4 h-4" />
                <span>Private Dining & Events</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white leading-tight">
                Reserve Your Private Culinary Table Online
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                Whether celebrating an intimate anniversary, hosting a business dinner, or savoring a weekend feast with loved ones, guarantee your exclusive table with instant digital confirmation.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/reservation"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent-orange text-[#0B1120] font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
                >
                  Book a Table Now
                </Link>
                <a
                  href="tel:+15552345678"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-sm hover:bg-slate-800 transition-colors"
                >
                  Call Reception (+1 555-234-5678)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MASTER CHEFS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle="Team Members"
          title="Meet Our Master Chefs"
          description="Passionate culinary masters dedicated to perfection in every single plate."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {chefTeam.map((chef, idx) => (
            <div
              key={idx}
              className="luxury-card rounded-2xl overflow-hidden text-center group flex flex-col justify-between"
            >
              <div className="relative overflow-hidden h-72 bg-slate-900">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131D31] via-transparent to-transparent opacity-80" />
              </div>
              <div className="p-6 space-y-1">
                <h4 className="text-lg font-bold font-heading text-white group-hover:text-primary transition-colors">
                  {chef.name}
                </h4>
                <p className="text-xs font-semibold text-primary">{chef.role}</p>
                <p className="text-[11px] text-slate-400 pt-2">{chef.spec}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TESTIMONIALS / GUEST REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle="Guest Testimonials"
          title="What Our Patrons Say"
          description="Real reflections from food critics, culinary enthusiasts, and cherished guests."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev._id}
              className="luxury-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 relative"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover border border-primary/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-primary">{rev.roleOrProfession}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Food Detail Modal */}
      <FoodDetailModal
        dish={selectedDish}
        isOpen={Boolean(selectedDish)}
        onClose={() => setSelectedDish(null)}
      />
    </div>
  );
};
