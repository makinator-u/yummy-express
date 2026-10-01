import React from 'react';
import { 
  IndianRupee, 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  Users, 
  UtensilsCrossed, 
  Sparkles, 
  Flame,
  Award,
  CheckCircle2,
  Bike
} from 'lucide-react';

export default function OverviewTab({ stats, orders, onTabChange }) {
  if (!stats) {
    return (
      <div className="py-16 text-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading analytics...</span>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: `₹${stats.total_revenue}`,
      icon: IndianRupee,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      sub: `${stats.total_orders} total orders placed`
    },
    {
      title: 'Active Kitchen Queue',
      value: stats.active_orders,
      icon: Flame,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/30',
      sub: 'Orders cooking or on delivery'
    },
    {
      title: 'Delivered Orders',
      value: stats.delivered_orders,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      sub: 'Successfully fulfilled'
    },
    {
      title: 'Avg Order Value (AOV)',
      value: `₹${stats.average_order_value}`,
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/30',
      sub: 'Per completed basket'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`p-4 rounded-2xl bg-zinc-900 border ${kpi.bg} shadow-md`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2 rounded-xl bg-zinc-950 ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl sm:text-3xl font-black font-heading mt-2 ${kpi.color}`}>
                {kpi.value}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 font-medium">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Selling Items (Left Col) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white font-heading">
                Top Selling Dishes Leaderboard
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-400/90 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              Live SQLite Analytics
            </span>
          </div>

          {stats.top_items && stats.top_items.length > 0 ? (
            <div className="space-y-2.5">
              {stats.top_items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                      idx === 0 
                        ? 'bg-amber-400 text-zinc-950' 
                        : idx === 1 
                        ? 'bg-zinc-300 text-zinc-950' 
                        : idx === 2 
                        ? 'bg-amber-700 text-white' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">{item.name}</div>
                      <div className="text-[11px] text-zinc-400">{item.quantity_sold} portions ordered</div>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-black text-amber-400 font-heading">
                    ₹{item.sales_amount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-zinc-400">
              No dish sales recorded yet. Place orders to see live leaderboard!
            </div>
          )}
        </div>

        {/* Category Distribution & Quick Links (Right Col) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Category Breakdown */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              <span>Menu Dishes by Category</span>
            </h3>

            <div className="space-y-2.5 pt-1">
              {stats.category_breakdown && stats.category_breakdown.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-zinc-300">{cat.name}</span>
                    <span className="font-bold text-amber-400">{cat.items_count} dishes</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      style={{ width: `${(cat.items_count / stats.total_dishes) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-zinc-900 to-zinc-950 border border-amber-500/30 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kitchen Shortcuts</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onTabChange('orders')}
                className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-400 text-left transition"
              >
                <div className="text-xs font-bold text-white">Live Orders</div>
                <div className="text-[10px] text-zinc-400">{stats.active_orders} active now</div>
              </button>

              <button
                onClick={() => onTabChange('menu')}
                className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-400 text-left transition"
              >
                <div className="text-xs font-bold text-white">Edit Menu</div>
                <div className="text-[10px] text-zinc-400">{stats.total_dishes} items</div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
