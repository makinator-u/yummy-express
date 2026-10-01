import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Truck } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  onOpenCheckout
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="fixed inset-y-0 right-0 max-w-full w-full sm:max-w-md bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Your Food Basket
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {cartItems.length} {cartItems.length === 1 ? 'dish' : 'dishes'} selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="px-2.5 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition text-xs flex items-center gap-1 font-bold"
                title="Clear basket"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-3xl">
                🥢
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-heading">
                Your basket is empty
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                Add your favorite Indo-Chinese soups, starters, triple rice, or noodles to start your order!
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary text-xs py-2 px-4 rounded-xl mt-2 inline-flex items-center gap-1.5"
              >
                <span>Browse Menu Dishes</span>
              </button>
            </div>
          ) : (
            <>
              {/* Free Delivery Banner */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Free Delivery in Malad West</strong> applied automatically!</span>
              </div>

              {cartItems.map((item) => (
                <div 
                  key={`${item.id}-${item.portion}`}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="veg-badge shrink-0">
                        <span className="veg-dot" />
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                        {item.portion} Portion
                      </span>
                      <span className="font-semibold text-slate-600">₹{item.price} each</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stepper */}
                    <div className="qty-stepper">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.portion, item.quantity - 1)}
                        className="qty-btn"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <span className="qty-val text-xs">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.portion, item.quantity + 1)}
                        className="qty-btn"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                    <div className="text-right min-w-[55px]">
                      <div className="text-sm sm:text-base font-black text-slate-900">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs sm:text-[13px]">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Home Delivery Fee</span>
                <span className="font-bold uppercase">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-amber-700 font-heading text-xl">₹{total}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full btn-primary py-3.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
