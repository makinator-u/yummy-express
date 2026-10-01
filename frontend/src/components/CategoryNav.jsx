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
    <div className="sticky top-[69px] z-30 bg-background/90 backdrop-blur-md border-b border-border py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Search Bar & Quick Filter Chips */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition border ${
                showBestsellersOnly
                  ? 'bg-primary text-black border-primary font-bold'
                  : 'bg-surface text-zinc-300 border-border hover:bg-surface-elevated hover:text-white'
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
                  : 'bg-surface text-zinc-300 border-border hover:bg-surface-elevated hover:text-white'
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
                ? 'bg-foreground text-background border-foreground font-semibold'
                : 'bg-surface text-zinc-400 border-border hover:text-foreground hover:bg-surface-elevated'
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
                    ? 'bg-foreground text-background border-foreground font-semibold'
                    : 'bg-surface text-zinc-400 border-border hover:text-foreground hover:bg-surface-elevated'
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
