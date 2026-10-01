import React from 'react';
import { Search, Flame, Star, X, Sparkles } from 'lucide-react';

const categoryIcons = {
  'veg-soup': '🍲',
  'veg-starters': '🥟',
  'veg-rice': '🍚',
  'veg-noodles': '🍜',
};

export default function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  showSpicyOnly,
  onToggleSpicy,
  showBestsellersOnly,
  onToggleBestsellers,
  totalItemsCount
}) {
  return (
    <div className="sticky top-[69px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Search Bar & Quick Filter Chips */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search dishes (e.g. Manchurian, Hakka, Schezwan)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="custom-input pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Buttons (Spicy & Bestsellers) */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={onToggleBestsellers}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition border shadow-xs ${
                showBestsellersOnly
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showBestsellersOnly ? 'fill-current' : 'text-amber-500 fill-amber-500'}`} />
              <span>Bestsellers</span>
            </button>

            <button
              type="button"
              onClick={onToggleSpicy}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition border shadow-xs ${
                showSpicyOnly
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${showSpicyOnly ? 'fill-current' : 'text-red-500 fill-red-500'}`} />
              <span>Spicy Specials</span>
            </button>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
              selectedCategory === null
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>🍽️</span>
            <span>All Dishes</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedCategory === null ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {totalItemsCount}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const icon = categoryIcons[cat.slug] || '🥢';
            const count = cat.items ? cat.items.length : 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
