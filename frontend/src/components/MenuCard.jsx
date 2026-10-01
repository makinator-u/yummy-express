import React, { useState } from 'react';
import { Flame, Star, Plus, Minus } from 'lucide-react';

export default function MenuCard({ 
  item, 
  cartItems, 
  onAddToCart, 
  onUpdateQuantity 
}) {
  const hasHalfOption = item.half_price !== null;
  
  // Default portion to 'Half' if available, otherwise 'Full'
  const [selectedPortion, setSelectedPortion] = useState(
    hasHalfOption ? 'Half' : 'Full'
  );

  const activePrice = selectedPortion === 'Half' ? item.half_price : item.full_price;

  // Check if current item with this specific portion is in cart
  const cartItem = cartItems.find(ci => ci.id === item.id && ci.portion === selectedPortion);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    onAddToCart({
      id: item.id,
      name: item.name,
      portion: selectedPortion,
      price: activePrice,
      is_veg: item.is_veg
    });
  };

  return (
    <div className="food-card flex flex-col justify-between">
      <div>
        {/* Top Indicators */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="veg-badge" title="100% Pure Vegetarian">
              <span className="veg-dot" />
            </span>

            {item.is_spicy && (
              <span className="spicy-badge">
                <Flame className="w-3 h-3 text-red-400 fill-current" />
                <span>SPICY</span>
              </span>
            )}
          </div>

          {item.is_bestseller && (
            <span className="bestseller-badge">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              <span>POPULAR</span>
            </span>
          )}
        </div>

        {/* Item Title */}
        <h4 className="text-base font-bold text-foreground leading-snug">
          {item.name}
        </h4>

        {/* Item Description */}
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>

      <div className="mt-4 pt-3.5 border-t border-border/80 space-y-3">
        {/* Portion Selector Tabs */}
        <div>
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Portion</span>
            {!hasHalfOption && (
              <span className="text-zinc-500 font-normal lowercase">(full only)</span>
            )}
          </div>

          <div className={`portion-toggle-group ${!hasHalfOption ? 'single-item' : ''}`}>
            {hasHalfOption && (
              <button
                type="button"
                onClick={() => setSelectedPortion('Half')}
                className={`portion-toggle-btn ${selectedPortion === 'Half' ? 'active' : ''}`}
              >
                <span>Half</span>
                <span className="font-semibold opacity-90">₹{item.half_price}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedPortion('Full')}
              className={`portion-toggle-btn ${selectedPortion === 'Full' ? 'active' : ''}`}
            >
              <span>Full</span>
              <span className="font-semibold opacity-90">₹{item.full_price}</span>
            </button>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">
              {selectedPortion} Portion
            </span>
            <div className="text-xl font-bold text-foreground tracking-tight">
              ₹{activePrice}
            </div>
          </div>

          {/* Add or Stepper */}
          {currentQuantity === 0 ? (
            <button
              type="button"
              onClick={handleAdd}
              className="btn-primary text-xs py-1.5 px-3.5 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add</span>
            </button>
          ) : (
            <div className="qty-stepper">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, selectedPortion, currentQuantity - 1)}
                className="qty-btn"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="qty-val">{currentQuantity}</span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, selectedPortion, currentQuantity + 1)}
                className="qty-btn"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
