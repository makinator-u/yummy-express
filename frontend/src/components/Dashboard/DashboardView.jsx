import React, { useState, useEffect } from 'react';
import OverviewTab from './OverviewTab';
import OrdersTab from './OrdersTab';
import MenuManagerTab from './MenuManagerTab';
import PartyInquiriesTab from './PartyInquiriesTab';
import SettingsTab from './SettingsTab';
import AddDishModal from './AddDishModal';
import { 
  LayoutDashboard, 
  Flame, 
  UtensilsCrossed, 
  Sparkles, 
  Settings, 
  ArrowLeft, 
  RefreshCw,
  ShoppingBag
} from 'lucide-react';

export default function DashboardView({ 
  onBackToStore, 
  restaurant, 
  categories, 
  onRefreshData 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [partyInquiries, setPartyInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const [resStats, resOrders, resInquiries] = await Promise.all([
        fetch('http://localhost:8000/api/dashboard/stats'),
        fetch('http://localhost:8000/api/orders?limit=50'),
        fetch('http://localhost:8000/api/party/inquiries')
      ]);

      if (resStats.ok) setStats(await resStats.json());
      if (resOrders.ok) setOrders(await resOrders.json());
      if (resInquiries.ok) setPartyInquiries(await resInquiries.json());
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000); // 15s polling for live orders
    return () => clearInterval(interval);
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/api/dashboard/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateMenuItem = async (itemId, updateData) => {
    try {
      const res = await fetch(`http://localhost:8000/api/dashboard/menu/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        await onRefreshData();
        await fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSettings = async (settingsData) => {
    const res = await fetch('http://localhost:8000/api/dashboard/restaurant', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    await onRefreshData();
  };

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Live Orders', icon: Flame, badge: stats?.active_orders },
    { id: 'menu', label: 'Menu & Prices', icon: UtensilsCrossed },
    { id: 'party', label: 'Party Inquiries', icon: Sparkles, badge: partyInquiries.length },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStore}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>

            <div className="h-5 w-px bg-zinc-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-xl">👨‍🍳</span>
              <div>
                <h1 className="text-base sm:text-lg font-black text-amber-400 font-heading">
                  YUMMY EXPRESS <span className="text-red-400 text-xs font-semibold px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30">Admin &amp; Kitchen</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="p-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white flex items-center gap-1.5 transition"
              title="Refresh Dashboard"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-zinc-800/60 pt-2 pb-2">
          {navTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-400 text-zinc-950 shadow-md font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                {t.badge !== undefined && t.badge > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-zinc-950 text-amber-300' : 'bg-red-600 text-white'
                  }`}>
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-400 font-semibold">Connecting to SQLite Live Database...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewTab 
                stats={stats} 
                orders={orders} 
                onTabChange={setActiveTab} 
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab 
                orders={orders} 
                onStatusUpdate={handleUpdateOrderStatus} 
                onRefresh={fetchDashboardData} 
              />
            )}

            {activeTab === 'menu' && (
              <MenuManagerTab 
                categories={categories} 
                onUpdateMenuItem={handleUpdateMenuItem} 
                onOpenAddDish={() => setIsAddDishOpen(true)} 
              />
            )}

            {activeTab === 'party' && (
              <PartyInquiriesTab 
                inquiries={partyInquiries} 
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab 
                restaurant={restaurant} 
                onUpdateSettings={handleUpdateSettings} 
              />
            )}
          </>
        )}
      </main>

      {/* Add Dish Modal */}
      <AddDishModal
        isOpen={isAddDishOpen}
        onClose={() => setIsAddDishOpen(false)}
        categories={categories}
        onDishAdded={async () => {
          await onRefreshData();
          await fetchDashboardData();
        }}
      />
    </div>
  );
}
