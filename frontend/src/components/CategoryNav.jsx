import React from 'react';
import { Search, Flame, Star, X } from 'lucide-react';

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
  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'veg-soup':
        return '🥣';
      case 'veg-starters':
        return '🥟';
      case 'veg-rice':
        return '🍚';
      case 'veg-noodles':
        return '🍜';
      default:
        return '🥢';
    }
  };

  return (
    <div className="sticky top-[73px] z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/90 py-3 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Search Bar & Quick Filter Chips */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/80" />
            <input 
              type="text"
              placeholder="Search Manchurian, Hakka, Schezwan, Paneer, Soups..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="custom-input pl-10 pr-9 py-2 text-xs sm:text-sm"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
                showBestsellersOnly
                  ? 'bg-amber-400 text-zinc-950 shadow-md font-extrabold'
                  : 'bg-zinc-900 text-amber-300 border border-amber-500/30 hover:bg-zinc-800'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Popular Picks</span>
            </button>

            <button
              type="button"
              onClick={onToggleSpicy}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
                showSpicyOnly
                  ? 'bg-red-600 text-white shadow-md font-extrabold'
                  : 'bg-zinc-900 text-red-300 border border-red-500/30 hover:bg-zinc-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Spicy Specials</span>
            </button>
          </div>
        </div>

        {/* Category Jump Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 shadow-md font-black'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-amber-500/40 hover:text-white'
            }`}
          >
            <span>🥢</span>
            <span>All Menu ({totalItemsCount})</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 shadow-md font-black'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <span>{getCategoryIcon(cat.slug)}</span>
                <span>{cat.name} ({cat.items ? cat.items.length : 0})</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
