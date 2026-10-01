import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Flame, 
  Bike, 
  XCircle, 
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

export default function OrdersTab({ orders, onStatusUpdate, onRefresh }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const statuses = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'Confirmed', value: 'Confirmed', color: 'text-amber-400' },
    { label: 'Sizzling in Wok', value: 'Preparing in Wok', color: 'text-orange-400' },
    { label: 'Out for Delivery', value: 'Out for Delivery', color: 'text-blue-400' },
    { label: 'Delivered', value: 'Delivered', color: 'text-emerald-400' },
    { label: 'Cancelled', value: 'Cancelled', color: 'text-red-400' }
  ];

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'ALL' && order.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = order.order_number.toLowerCase().includes(q);
      const matchCustomer = order.customer_name.toLowerCase().includes(q);
      const matchPhone = order.customer_phone.includes(q);
      return matchNumber || matchCustomer || matchPhone;
    }
    return true;
  });

  const handleUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    await onStatusUpdate(orderId, newStatus);
    setUpdatingId(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">Confirmed</span>;
      case 'Preparing in Wok':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" /> Sizzling in Wok</span>;
      case 'Out for Delivery':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1"><Bike className="w-3 h-3 text-blue-400" /> Out for Delivery</span>;
      case 'Delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Delivered</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="custom-input pl-10 py-1.5 text-xs sm:text-sm"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {statuses.map((st) => (
            <button
              key={st.value}
              type="button"
              onClick={() => setStatusFilter(st.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                statusFilter === st.value
                  ? 'bg-amber-400 text-zinc-950 shadow font-extrabold'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-3">
          <div className="text-4xl">🥡</div>
          <h4 className="text-base font-bold text-white font-heading">No orders in this view</h4>
          <p className="text-xs text-zinc-400">
            {searchQuery ? 'Try changing your search query.' : 'New orders will automatically appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order.id;

            return (
              <div 
                key={order.id} 
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg space-y-4 hover:border-amber-500/40 transition"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-amber-400 font-heading">
                        {order.order_number}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {order.order_type}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Placed: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {getStatusBadge(order.status)}
                </div>

                {/* Customer Details */}
                <div className="space-y-1.5 text-xs text-zinc-300">
                  <div className="flex justify-between font-semibold text-white">
                    <span>{order.customer_name}</span>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`tel:${order.customer_phone}`}
                        className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{order.customer_phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/91${order.customer_phone}?text=Hi%20${order.customer_name},%20this%20is%20Yummy%20Express%20regarding%20order%20${order.order_number}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 p-1"
                        title="WhatsApp Customer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 text-zinc-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.delivery_address}</span>
                  </div>

                  {order.delivery_notes && (
                    <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-300 text-[11px]">
                      <strong>Note:</strong> {order.delivery_notes}
                    </div>
                  )}
                </div>

                {/* Item List */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Dishes to Prepare</div>
                  {order.items && order.items.map((it) => (
                    <div key={it.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-amber-400">{it.quantity}x</span>
                        <span className="text-white font-medium">{it.item_name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-amber-300">
                          {it.portion}
                        </span>
                      </div>
                      <span className="font-bold text-zinc-300">₹{it.total_price}</span>
                    </div>
                  ))}
                  
                  <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
                    <span className="text-zinc-400">{order.payment_method}</span>
                    <span className="text-sm font-black text-amber-400 font-heading">Total: ₹{order.total_amount}</span>
                  </div>
                </div>

                {/* Workflow Status Action Buttons */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Update Kitchen Stage:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      disabled={isUpdating || order.status === 'Preparing in Wok'}
                      onClick={() => handleUpdate(order.id, 'Preparing in Wok')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition flex items-center justify-center gap-1 ${
                        order.status === 'Preparing in Wok'
                          ? 'bg-orange-500 text-zinc-950 border-orange-400 font-black'
                          : 'bg-zinc-950 text-orange-400 border-orange-500/30 hover:bg-orange-500/10'
                      }`}
                    >
                      <Flame className="w-3 h-3" />
                      <span>Wok Cook</span>
                    </button>

                    <button
                      type="button"
                      disabled={isUpdating || order.status === 'Out for Delivery'}
                      onClick={() => handleUpdate(order.id, 'Out for Delivery')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition flex items-center justify-center gap-1 ${
                        order.status === 'Out for Delivery'
                          ? 'bg-blue-500 text-white border-blue-400 font-black'
                          : 'bg-zinc-950 text-blue-400 border-blue-500/30 hover:bg-blue-500/10'
                      }`}
                    >
                      <Bike className="w-3 h-3" />
                      <span>Delivery</span>
                    </button>

                    <button
                      type="button"
                      disabled={isUpdating || order.status === 'Delivered'}
                      onClick={() => handleUpdate(order.id, 'Delivered')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition flex items-center justify-center gap-1 ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-black'
                          : 'bg-zinc-950 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Delivered</span>
                    </button>

                    <button
                      type="button"
                      disabled={isUpdating || order.status === 'Cancelled'}
                      onClick={() => handleUpdate(order.id, 'Cancelled')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition flex items-center justify-center gap-1 ${
                        order.status === 'Cancelled'
                          ? 'bg-red-500 text-white border-red-400 font-black'
                          : 'bg-zinc-950 text-red-400 border-red-500/30 hover:bg-red-500/10'
                      }`}
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
