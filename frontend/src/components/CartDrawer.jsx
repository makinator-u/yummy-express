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
        className="fixed inset-y-0 right-0 max-w-full w-full sm:max-w-md bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 font-heading">
                Your Order Basket
              </h3>
              <p className="text-xs text-gray-400">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in basket
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="px-2.5 py-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition text-xs flex items-center gap-1 font-semibold"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
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
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto text-3xl">
                🍜
              </div>
              <h4 className="text-base font-bold text-gray-900 font-heading">
                Your basket is empty
              </h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Explore our steaming Manchow soup, Schezwan triple rice, or crispy starters to add delicious dishes!
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs mt-2"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Free Delivery Banner */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-700">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Free Delivery</strong> automatically applied to your order!</span>
              </div>

              {cartItems.map((item) => (
                <div 
                  key={`${item.id}-${item.portion}`}
                  className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="veg-badge shrink-0">
                        <span className="veg-dot" />
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-gray-200 text-amber-700 text-[11px] font-bold">
                        {item.portion} Portion
                      </span>
                      <span className="text-gray-500">₹{item.price} each</span>
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
                        <Minus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <span className="qty-val text-xs">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.portion, item.quantity + 1)}
                        className="qty-btn"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>

                    <div className="text-right min-w-[55px]">
                      <div className="text-xs sm:text-sm font-black text-amber-600">
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
          <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Delivery Charge</span>
                <span className="font-bold">FREE</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-extrabold text-gray-900">
                <span>Total Amount</span>
                <span className="text-amber-600 font-heading text-lg">₹{total}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full btn-primary py-3 text-sm rounded-xl flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
