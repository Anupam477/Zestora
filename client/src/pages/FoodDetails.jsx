import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Star,
  Plus,
  Minus,
  Clock,
  Flame,
  Leaf,
  Sparkles,
  ShoppingBag,
  Activity,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export const FoodDetails = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, openCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDish = async () => {
      setLoading(true);
      try {
        const res = await api.getMenuItemById(id);
        if (res.success) setDish(res.data);
      } catch (err) {
        console.error('Failed to load dish details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDish();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 max-w-4xl mx-auto text-center">
        <LoadingSpinner text="Retrieving culinary recipe..." />
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold font-heading text-white">Dish Not Found</h2>
        <p className="text-sm text-slate-400">The requested recipe may be currently off the seasonal menu.</p>
        <Link to="/menu" className="inline-block px-6 py-2.5 rounded-xl bg-primary text-[#0B1120] font-bold text-sm">
          Return to Menu
        </Link>
      </div>
    );
  }

  const currentPrice = dish.discountPrice || dish.price;
  const totalPrice = (currentPrice * quantity).toFixed(2);

  const handleAddToCart = () => {
    addToCart(dish, quantity);
    openCart();
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Dish Big Image */}
        <div className="lg:col-span-6 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-[400px] sm:h-[480px] object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-slate-200 border border-white/10 font-medium">
              <Clock className="w-4 h-4 text-primary" />
              {dish.preparationTime || '20-25 mins'}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-amber-400 border border-white/10 font-bold">
              <Star className="w-4 h-4 fill-current" />
              {dish.rating || 4.8} ({dish.reviewCount || 24} reviews)
            </span>
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-primary">
                {dish.categoryName || 'Signature Course'}
              </span>
              {dish.isVegetarian ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> Vegetarian
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                  Non-Vegetarian
                </span>
              )}
              {dish.isSpicy && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/90 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Spice Level {dish.spicyLevel}/3
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">{dish.name}</h1>

            <div className="flex items-baseline gap-4 mt-3">
              <span className="text-3xl font-black font-heading text-primary">
                ${currentPrice.toFixed(2)}
              </span>
              {dish.discountPrice && (
                <span className="text-base text-slate-500 line-through">
                  ${dish.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {dish.description}
          </p>

          {/* Ingredients */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Artisanal Ingredients & Seasonings
              </h3>
              <div className="flex flex-wrap gap-2">
                {dish.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nutritional Values */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Activity className="w-4 h-4 text-primary" />
              <span>Nutritional Facts per Serving</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-800/80">
                <p className="text-slate-400 text-[10px]">Calories</p>
                <p className="font-bold text-white text-sm">{dish.calories || 450} kcal</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80">
                <p className="text-slate-400 text-[10px]">Protein</p>
                <p className="font-bold text-emerald-400 text-sm">{dish.nutritionalInfo?.protein || '22g'}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80">
                <p className="text-slate-400 text-[10px]">Carbs</p>
                <p className="font-bold text-amber-400 text-sm">{dish.nutritionalInfo?.carbs || '45g'}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/80">
                <p className="text-slate-400 text-[10px]">Fat</p>
                <p className="font-bold text-rose-400 text-sm">{dish.nutritionalInfo?.fat || '14g'}</p>
              </div>
            </div>
          </div>

          {/* Quantity and Add to Cart CTA */}
          <div className="pt-4 border-t border-slate-800/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-700 p-1.5 sm:w-36">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-orange hover:brightness-110 text-[#0B1120] font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-primary/25 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Order • ${totalPrice}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
