import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle2, Flame, Bike, Utensils, AlertCircle, Phone } from 'lucide-react';

export default function OrderTrackerModal({ isOpen, onClose }) {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`http://localhost:8000/api/orders/${orderNumber.trim()}`);
      if (!res.ok) {
        throw new Error('Order number not found. Please check and try again.');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Unable to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Order Confirmed', icon: CheckCircle2, desc: 'Received at counter' },
    { title: 'Sizzling in Wok', icon: Flame, desc: 'Freshly tossing in high heat' },
    { title: 'Out for Delivery', icon: Bike, desc: 'On scooter to your address' },
    { title: 'Delivered', icon: Utensils, desc: 'Hot & ready to eat' }
  ];

  return (
    <div className="modal-overlay">
      <div 
        className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white font-heading">
              Live Order Status
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Search Input Form */}
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. YE-10293)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                className="custom-input pl-10 text-xs sm:text-sm font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs sm:text-sm px-4 rounded-xl"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Order Details & Progress */}
          {order && (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-900/40 border border-amber-500/30">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Order ID</span>
                    <h4 className="text-lg sm:text-xl font-black text-amber-400 font-heading">
                      {order.order_number}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/20 border border-green-500/40 text-green-300">
                    {order.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-zinc-500">Customer:</span>
                    <div className="font-semibold text-white">{order.customer_name}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Amount:</span>
                    <div className="font-bold text-amber-300">₹{order.total_amount} ({order.payment_method})</div>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Preparation Journey</h5>
                
                <div className="space-y-3">
                  {steps.map((st, idx) => {
                    const Icon = st.icon;
                    const isDone = idx === 0 || idx === 1; // simulation
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl flex items-center justify-center ${
                          isDone 
                            ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20' 
                            : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-xs sm:text-sm font-bold ${isDone ? 'text-white' : 'text-zinc-500'}`}>
                            {st.title}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {st.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ordered Items */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Items in this Order</h5>
                <div className="space-y-1.5 text-xs">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-zinc-300">
                      <span>{it.item_name} <strong className="text-amber-400">({it.portion})</strong> x {it.quantity}</span>
                      <span className="font-semibold">₹{it.total_price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Call Support */}
              <a
                href="tel:7249041603"
                className="w-full btn-secondary text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-green-400" />
                <span>Call Kitchen at 7249041603</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
