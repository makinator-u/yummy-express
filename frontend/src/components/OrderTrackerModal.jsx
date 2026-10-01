import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle2, Flame, Bike, Utensils, AlertCircle, Phone } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function OrderTrackerModal({ isOpen, onClose, initialOrderNumber = '', restaurant }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const phone = restaurant?.phone || '7249041603';

  React.useEffect(() => {
    if (isOpen && initialOrderNumber) {
      setOrderNumber(initialOrderNumber);
      fetchOrder(initialOrderNumber);
    }
  }, [isOpen, initialOrderNumber]);

  if (!isOpen) return null;

  const fetchOrder = async (num) => {
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`${API_BASE}/orders/${num.trim()}`);
      if (!res.ok) throw new Error('Order number not found. Please verify your Order ID and try again.');
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Unable to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    fetchOrder(orderNumber);
  };

  const steps = [
    { title: 'Order Confirmed',  icon: CheckCircle2, desc: 'Kitchen received & queued order' },
    { title: 'Sizzling in Wok', icon: Flame,         desc: 'Freshly tossed on high-flame burner' },
    { title: 'Out for Delivery', icon: Bike,          desc: 'Rider dispatched to your doorstep' },
    { title: 'Delivered',        icon: Utensils,      desc: 'Piping hot Indo-Chinese delivered' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Live Order Tracker
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Search Form */}
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Order Details & Progress */}
          {order && (
            <div className="space-y-4 pt-2">
              {/* Order Info Card */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Order ID</span>
                    <h4 className="text-lg sm:text-xl font-black text-amber-800 font-heading">
                      {order.order_number}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 border border-emerald-300 text-emerald-800">
                    {order.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-amber-200/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Customer:</span>
                    <div className="font-bold text-slate-900">{order.customer_name}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Amount:</span>
                    <div className="font-extrabold text-slate-900">₹{order.total_amount} ({order.payment_method})</div>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Preparation Status</h5>
                <div className="space-y-3.5">
                  {steps.map((st, idx) => {
                    const Icon = st.icon;
                    const isDone = idx === 0 || (order.status !== 'Confirmed' && idx === 1);
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl flex items-center justify-center ${
                          isDone
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-400'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-xs sm:text-sm font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                            {st.title}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">{st.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in order */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ordered Items</h5>
                <div className="space-y-1.5 text-xs">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-slate-700">
                      <span>{it.item_name} <strong className="text-amber-700 font-bold">({it.portion})</strong> x {it.quantity}</span>
                      <span className="font-bold text-slate-900">₹{it.total_price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call Support */}
              <a
                href={`tel:${phone}`}
                className="w-full btn-secondary text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call Kitchen Hotline at {phone}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
