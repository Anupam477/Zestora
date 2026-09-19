import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useCart } from '../../context/CartContext';
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
} from 'lucide-react';

export const FoodDetailModal = ({ dish, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!dish) return null;

  const currentPrice = dish.discountPrice || dish.price;
  const totalPrice = (currentPrice * quantity).toFixed(2);

  const handleAddToCart = () => {
    addToCart(dish, quantity);
    onClose();
    setQuantity(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={dish.name} maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Dish Media */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 h-64 md:h-full min-h-[260px]">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-slate-200 border border-white/10 font-medium">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {dish.preparationTime || '20-25 mins'}
            </span>
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-400 border border-white/10 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              {dish.rating || 4.8} ({dish.reviewCount || 24} reviews)
            </span>
          </div>
        </div>

        {/* Right: Details & Customization */}
        <div className="flex flex-col justify-between space-y-5">
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-primary">
                {dish.categoryName || 'Signature Course'}
              </span>
              {dish.isVegetarian ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> Vegetarian
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300">
                  Non-Vegetarian
                </span>
              )}
              {dish.isSpicy && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Spice Level {dish.spicyLevel}/3
                </span>
              )}
            </div>

            {/* Title & Price */}
            <h2 className="text-2xl font-bold font-heading text-white">{dish.name}</h2>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-2xl font-black font-heading text-primary">
                ${currentPrice.toFixed(2)}
              </span>
              {dish.discountPrice && (
                <span className="text-sm text-slate-500 line-through">
                  ${dish.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              {dish.description}
            </p>

            {/* Ingredients */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Artisanal Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {dish.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nutritional Info */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2">
                <Activity className="w-3.5 h-3.5 text-primary" />
                <span>Nutritional Values per Serving</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-slate-800/60">
                  <p className="text-slate-400 text-[10px]">Calories</p>
                  <p className="font-bold text-white">{dish.calories || 450} kcal</p>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-800/60">
                  <p className="text-slate-400 text-[10px]">Protein</p>
                  <p className="font-bold text-emerald-400">{dish.nutritionalInfo?.protein || '22g'}</p>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-800/60">
                  <p className="text-slate-400 text-[10px]">Carbs</p>
                  <p className="font-bold text-amber-400">{dish.nutritionalInfo?.carbs || '45g'}</p>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-800/60">
                  <p className="text-slate-400 text-[10px]">Fat</p>
                  <p className="font-bold text-rose-400">{dish.nutritionalInfo?.fat || '14g'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row: Quantity + Add CTA */}
          <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700 p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-bold text-sm text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-orange hover:brightness-110 text-[#0B1120] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Order • ${totalPrice}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
