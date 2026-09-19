import React from 'react';
import { useCart } from '../../context/CartContext';
import { Star, Plus, Flame, Leaf, Clock, Sparkles } from 'lucide-react';

export const MenuCard = ({ dish, onSelect }) => {
  const { addToCart } = useCart();

  const handleCardClick = (e) => {
    // If clicked on the add button, don't open modal
    if (e.target.closest('.add-btn')) return;
    if (onSelect) onSelect(dish);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative luxury-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      {/* Top Media Area */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131D31] via-transparent to-transparent opacity-80" />

        {/* Badges Top Left & Right */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {dish.isVegetarian ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 backdrop-blur-md">
              <Leaf className="w-3 h-3" /> Veg
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 border border-slate-700 text-slate-300 backdrop-blur-md">
              Non-Veg
            </span>
          )}

          {dish.isSpicy && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-rose-950/80 border border-rose-500/50 text-rose-300 backdrop-blur-md">
              <Flame className="w-3 h-3" /> {dish.spicyLevel > 1 ? 'Extra Hot' : 'Spicy'}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 items-end">
          {dish.isPopular && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/90 text-[#0B1120] shadow-md backdrop-blur-md">
              <Sparkles className="w-3 h-3" /> Popular
            </span>
          )}
          {dish.discountPrice && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-[#0B1120]">
              SAVE ${(dish.price - dish.discountPrice).toFixed(0)}
            </span>
          )}
        </div>

        {/* Prep time badge bottom left */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 text-xs text-slate-300 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>{dish.preparationTime || '20 mins'}</span>
        </div>
      </div>

      {/* Card Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs uppercase font-bold tracking-wider text-primary">
              {dish.categoryName || 'Signature'}
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{dish.rating || 4.8}</span>
              <span className="text-slate-500 font-normal">({dish.reviewCount || 24})</span>
            </div>
          </div>

          <h3 className="text-lg font-bold font-heading text-white group-hover:text-primary transition-colors line-clamp-1">
            {dish.name}
          </h3>

          <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
            {dish.description}
          </p>
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            {dish.discountPrice ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black font-heading text-primary">
                  ${dish.discountPrice.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 line-through">
                  ${dish.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-black font-heading text-primary">
                ${dish.price.toFixed(2)}
              </span>
            )}
            <span className="text-[10px] text-slate-400 font-medium">
              {dish.calories} kcal
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(dish);
            }}
            className="add-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/15 hover:bg-primary text-primary hover:text-[#0B1120] font-bold text-xs border border-primary/30 transition-all duration-200 active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
