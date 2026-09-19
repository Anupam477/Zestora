import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { MenuCard } from '../components/menu/MenuCard';
import { FoodDetailModal } from '../components/menu/FoodDetailModal';
import { SectionHeader } from '../components/common/SectionHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Search,
  Filter,
  Leaf,
  Flame,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  Utensils,
} from 'lucide-react';

export const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState(null);

  // Filter States
  const activeCategory = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [vegOnly, setVegOnly] = useState(searchParams.get('veg') === 'true');
  const [spicyOnly, setSpicyOnly] = useState(searchParams.get('spicy') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'default');

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Dishes whenever filters change
  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== 'all') params.category = activeCategory;
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (vegOnly) params.veg = 'true';
        if (spicyOnly) params.spicy = 'true';
        if (sortBy !== 'default') params.sort = sortBy;

        const res = await api.getMenuItems(params);
        if (res.success) setDishes(res.data);
      } catch (err) {
        console.error('Failed to fetch menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchDishes();
    }, 250);

    return () => clearTimeout(debounce);
  }, [activeCategory, searchTerm, vegOnly, spicyOnly, sortBy]);

  const handleCategoryChange = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug === 'all') next.delete('category');
    else next.set('category', slug);
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setVegOnly(false);
    setSpicyOnly(false);
    setSortBy('default');
    setSearchParams({});
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <SectionHeader
        subtitle="Culinary Repertoire"
        title="Explore Our À La Carte Menu"
        description="From charcoal clay-pot biryanis to prime dry-aged steaks and delicate hand-crafted desserts."
      />

      {/* Control Bar: Search & Quick Filters */}
      <div className="luxury-card p-5 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes, ingredients, seasonings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-8 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-primary cursor-pointer appearance-none"
              >
                <option value="default">Sort by: Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Dietary Filter Toggles */}
          <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-2">
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                vegOnly
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-950'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              Veg Only
            </button>

            <button
              onClick={() => setSpicyOnly(!spicyOnly)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                spicyOnly
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-md shadow-rose-950'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Spicy
            </button>

            {(searchTerm || vegOnly || spicyOnly || sortBy !== 'default' || activeCategory !== 'all') && (
              <button
                onClick={handleResetFilters}
                title="Reset All Filters"
                className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 custom-scrollbar">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeCategory === 'all'
                ? 'bg-primary text-[#0B1120] shadow-lg shadow-primary/25'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            All Courses
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-[#0B1120] shadow-lg shadow-primary/25'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <LoadingSpinner text="Searching gourmet pantry..." />
      ) : dishes.length === 0 ? (
        <div className="p-16 text-center luxury-card rounded-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-heading text-white">No Dishes Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            We couldn't find any dishes matching your criteria. Try adjusting your search or clearing dietary filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-primary text-[#0B1120] font-bold text-sm hover:brightness-110 transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dishes.map((dish) => (
            <MenuCard
              key={dish._id}
              dish={dish}
              onSelect={(d) => setSelectedDish(d)}
            />
          ))}
        </div>
      )}

      {/* Food Details Modal */}
      <FoodDetailModal
        dish={selectedDish}
        isOpen={Boolean(selectedDish)}
        onClose={() => setSelectedDish(null)}
      />
    </div>
  );
};
