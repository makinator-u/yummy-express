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
  return (
    <div className="sticky top-[69px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Search Bar & Quick Filter Chips */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search dishes (e.g. Manchurian, Hakka, Schezwan)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="custom-input pl-10 pr-9 py-2 text-xs sm:text-sm"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition border ${
                showBestsellersOnly
                  ? 'bg-amber-600 text-white border-amber-600 font-bold'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Bestsellers</span>
            </button>

            <button
              type="button"
              onClick={onToggleSpicy}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition border ${
                showSpicyOnly
                  ? 'bg-red-500 text-white border-red-500 font-bold'
                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Spicy</span>
            </button>
          </div>
        </div>

        {/* Category Jump Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition border ${
              selectedCategory === null
                ? 'bg-gray-900 text-white border-gray-900 font-semibold'
                : 'bg-gray-100 text-gray-500 border-gray-200 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            All Items ({totalItemsCount})
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-gray-900 text-white border-gray-900 font-semibold'
                    : 'bg-gray-100 text-gray-500 border-gray-200 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {cat.name} ({cat.items ? cat.items.length : 0})
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
