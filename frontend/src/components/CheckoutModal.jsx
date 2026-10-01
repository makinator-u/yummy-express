import React, { useState } from 'react';
import { X, CheckCircle2, ShoppingBag, Truck, MapPin, Phone, User, Send, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_BASE } from '../config/api';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderPlaced,
  restaurant
}) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    delivery_notes: '',
    order_type: 'Delivery',
    payment_method: 'Cash on Delivery'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  const phone = restaurant?.phone || '7249041603';
  const rawPhone = phone.replace(/\D/g, '');
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name.trim()) {
      setError('Please enter your full name');
      return;
    }

    const cleanPhone = formData.customer_phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (formData.order_type === 'Delivery' && !formData.delivery_address.trim()) {
      setError('Please provide your complete address in Malad West');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer_name: formData.customer_name.trim(),
        customer_phone: cleanPhone,
        delivery_address: formData.order_type === 'Delivery' ? formData.delivery_address.trim() : 'Takeaway / Self-Pickup from Counter (Liberty Garden)',
        delivery_notes: formData.delivery_notes.trim(),
        order_type: formData.order_type,
        payment_method: formData.payment_method,
        items: cartItems.map(item => ({
          menu_item_id: item.id,
          portion: item.portion,
          quantity: item.quantity
        }))
      };

      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to place order');
      }

      const orderResult = await response.json();
      setPlacedOrder(orderResult);
      onOrderPlaced();

      // Confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.error('Confetti error', err);
      }

    } catch (err) {
      setError(err.message || 'Network error while placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSend = () => {
    if (!placedOrder) return;
    const itemsText = placedOrder.items
      .map(it => `• ${it.item_name} (${it.portion}) x ${it.quantity} = ₹${it.total_price}`)
      .join('%0A');
    
    const message = `*${restaurant?.name || 'YUMMY EXPRESS'} ORDER - ${placedOrder.order_number}*%0A%0A*Customer:* ${placedOrder.customer_name}%0A*Phone:* ${placedOrder.customer_phone}%0A*Type:* ${placedOrder.order_type}%0A*Address:* ${placedOrder.delivery_address}%0A${placedOrder.delivery_notes ? `*Notes:* ${placedOrder.delivery_notes}%0A` : ''}%0A*Items Ordered:*%0A${itemsText}%0A%0A*Total Amount:* ₹${placedOrder.total_amount}%0A*Payment:* ${placedOrder.payment_method}%0A%0APlease confirm my order!`;
    
    window.open(`https://wa.me/91${rawPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥡</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              {placedOrder ? 'Order Confirmed!' : 'Checkout & Order Details'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {placedOrder ? (
            /* Order Success Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Order ID</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-700 font-heading tracking-wider mt-0.5">
                  {placedOrder.order_number}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5 text-xs sm:text-[13px] text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Order Status:</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {placedOrder.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Customer:</span>
                  <span className="font-bold text-slate-900">{placedOrder.customer_name} ({placedOrder.customer_phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Total Amount:</span>
                  <span className="font-black text-slate-900">₹{placedOrder.total_amount} ({placedOrder.payment_method})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Delivery Address:</span>
                  <span className="font-semibold text-right max-w-[220px] truncate text-slate-900">{placedOrder.delivery_address}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppSend}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>Send Order to WhatsApp ({phone})</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full btn-secondary text-xs sm:text-sm py-2.5"
                >
                  Return to Menu
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Order Type Toggle */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Order Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, order_type: 'Delivery' })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${
                      formData.order_type === 'Delivery'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Free Home Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, order_type: 'Takeaway' })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${
                      formData.order_type === 'Takeaway'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    <span>Self Pickup (Counter)</span>
                  </button>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="custom-input pl-10"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="custom-input pl-10"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              {formData.order_type === 'Delivery' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Address in Malad West *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <textarea
                      required
                      rows={2}
                      placeholder="Flat/Wing, Building name, Near Liberty Garden / Landmark..."
                      value={formData.delivery_address}
                      onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                      className="custom-input pl-10 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Special Cooking Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cooking / Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Less oil, extra spicy, extra fried noodles..."
                  value={formData.delivery_notes}
                  onChange={(e) => setFormData({ ...formData, delivery_notes: e.target.value })}
                  className="custom-input"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Payment Method *</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    formData.payment_method === 'Cash on Delivery'
                      ? 'bg-amber-50 border-amber-500 text-slate-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="Cash on Delivery"
                      checked={formData.payment_method === 'Cash on Delivery'}
                      onChange={() => setFormData({ ...formData, payment_method: 'Cash on Delivery' })}
                      className="accent-amber-600"
                    />
                    <span className="text-xs">💵 Cash on Delivery</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    formData.payment_method === 'UPI QR on Delivery'
                      ? 'bg-amber-50 border-amber-500 text-slate-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="UPI QR on Delivery"
                      checked={formData.payment_method === 'UPI QR on Delivery'}
                      onChange={() => setFormData({ ...formData, payment_method: 'UPI QR on Delivery' })}
                      className="accent-amber-600"
                    />
                    <span className="text-xs">📱 UPI / QR Scanner</span>
                  </label>
                </div>
              </div>

              {/* Order Total Line */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-600 font-medium">Total Payable:</span>
                  <span className="text-base font-black text-amber-700 ml-2 font-heading">₹{total}</span>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Free Fast Delivery
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-sm rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Place Order</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
