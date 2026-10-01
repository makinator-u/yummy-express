import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Clock, MapPin, CheckCircle2, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function UserOrdersModal({ isOpen, onClose, token, user, onTrackOrder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to load your orders');
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Preparing in Wok':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Out for Delivery':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Delivered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-heading">
                My Order History
              </h2>
              <p className="text-xs text-zinc-400">
                Orders placed under <span className="text-amber-400 font-semibold">{user?.email}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-750 transition"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-750 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {loading && orders.length === 0 && (
            <div className="text-center py-12 text-zinc-400 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-2" />
              Loading your orders...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="text-center py-12 text-zinc-400">
              <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-base font-bold text-white mb-1">No Orders Yet</p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                You haven't placed any orders yet. Browse our delicious Indo-Chinese wok specialties and place your first order!
              </p>
            </div>
          )}

          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-zinc-850/80 border border-zinc-800 hover:border-amber-500/40 rounded-2xl transition space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {order.order_number}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-white font-heading">
                    ₹{order.total_amount}
                  </span>
                  <span className="text-[10px] text-zinc-500 block">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-zinc-900/60 rounded-xl p-2.5 divide-y divide-zinc-800/80 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between text-zinc-300">
                    <div>
                      <span className="font-semibold text-white">{item.quantity}x</span> {item.item_name}
                      <span className="text-[10px] text-amber-400/90 ml-1.5">({item.portion})</span>
                    </div>
                    <span className="font-medium text-zinc-400">₹{item.total_price}</span>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="truncate max-w-[240px] sm:max-w-xs">{order.delivery_address}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTrackOrder(order.order_number);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Live Track</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
