import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryNav from './components/CategoryNav';
import MenuCard from './components/MenuCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import PartyModal from './components/PartyModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import Footer from './components/Footer';
import DashboardView from './components/Dashboard/DashboardView';
import { ArrowRight, RefreshCw, AlertTriangle, Search } from 'lucide-react';
import { API_BASE } from './config/api';

export default function App() {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View state: 'store' or 'dashboard'
  const [currentView, setCurrentView] = useState('store');

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSpicyOnly, setShowSpicyOnly] = useState(false);
  const [showBestsellersOnly, setShowBestsellersOnly] = useState(false);

  // Cart state in localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ye_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [initialTrackNumber, setInitialTrackNumber] = useState('');

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('ye_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cartItems]);

  // Fetch menu data from FastAPI
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resInfo, resCats] = await Promise.all([
        fetch(`${API_BASE}/restaurant`),
        fetch(`${API_BASE}/menu/categories`)
      ]);

      if (!resInfo.ok || !resCats.ok) {
        throw new Error('Failed to load menu data from server');
      }

      const infoData = await resInfo.json();
      const catsData = await resCats.json();

      setRestaurant(infoData);
      setCategories(catsData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error connecting to server. Please check FastAPI backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cart Handlers
  const handleAddToCart = (itemToAdd) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        ci => ci.id === itemToAdd.id && ci.portion === itemToAdd.portion
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (itemId, portion, newQty) => {
    setCartItems(prev => {
      if (newQty <= 0) {
        return prev.filter(ci => !(ci.id === itemId && ci.portion === portion));
      }
      return prev.map(ci => {
        if (ci.id === itemId && ci.portion === portion) {
          return { ...ci, quantity: newQty };
        }
        return ci;
      });
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const allItems = categories.flatMap(cat => cat.items || []);

  // Filter categories
  const filteredCategories = categories.map(cat => {
    let items = cat.items || [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        item => item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q))
      );
    }

    if (showSpicyOnly) {
      items = items.filter(item => item.is_spicy);
    }

    if (showBestsellersOnly) {
      items = items.filter(item => item.is_bestseller);
    }

    return {
      ...cat,
      items
    };
  }).filter(cat => {
    if (selectedCategory && cat.slug !== selectedCategory) {
      return false;
    }
    return cat.items.length > 0;
  });

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

  // If in Dashboard View, render the Admin/Kitchen Dashboard
  if (currentView === 'dashboard') {
    return (
      <DashboardView
        restaurant={restaurant}
        categories={categories}
        onBackToStore={() => setCurrentView('store')}
        onRefreshData={fetchData}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-500 selection:text-white bg-slate-50">
      {/* Header */}
      <Header
        restaurant={restaurant}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPartyModal={() => setIsPartyModalOpen(true)}
        onOpenTrackModal={() => {
          setInitialTrackNumber('');
          setIsTrackModalOpen(true);
        }}
        onOpenDashboard={() => setCurrentView('dashboard')}
      />

      {/* Main Content */}
      <main className="flex-1">
        <HeroBanner
          restaurant={restaurant}
          onOpenPartyModal={() => setIsPartyModalOpen(true)}
        />

        {/* Loading */}
        {loading && (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">Loading fresh menu from database...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-xl mx-auto my-12 p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 font-heading">Connection Error</h3>
            <p className="text-xs sm:text-sm text-slate-600">{error}</p>
            <button 
              type="button"
              onClick={fetchData} 
              className="btn-primary text-xs py-2 px-4 rounded-xl inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connecting</span>
            </button>
          </div>
        )}

        {/* Menu Section */}
        {!loading && !error && (
          <section id="menu-section" className="scroll-mt-36 pb-16">
            <CategoryNav
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showSpicyOnly={showSpicyOnly}
              onToggleSpicy={() => setShowSpicyOnly(!showSpicyOnly)}
              showBestsellersOnly={showBestsellersOnly}
              onToggleBestsellers={() => setShowBestsellersOnly(!showBestsellersOnly)}
              totalItemsCount={allItems.length}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
                    🔍
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 font-heading">No matching dishes found</h4>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                    Try clearing your search keyword or reset the spicy/popular filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSpicyOnly(false);
                      setShowBestsellersOnly(false);
                      setSelectedCategory(null);
                    }}
                    className="btn-secondary text-xs mt-2"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredCategories.map(cat => (
                  <div key={cat.id} className="space-y-4 scroll-mt-48" id={cat.slug}>
                    {/* Category Title Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading flex items-center gap-2.5">
                          <span>{cat.name}</span>
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-sans">
                            {cat.items.length} {cat.items.length === 1 ? 'dish' : 'dishes'}
                          </span>
                        </h3>
                        {cat.description && (
                          <p className="text-xs sm:text-[13px] text-slate-600 mt-1 font-medium">{cat.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {cat.items.map(item => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          cartItems={cartItems}
                          onAddToCart={handleAddToCart}
                          onUpdateQuantity={handleUpdateQuantity}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-5 inset-x-4 max-w-md mx-auto z-40">
          <div 
            onClick={() => setIsCartOpen(true)}
            className="px-5 py-3.5 rounded-2xl bg-slate-900 text-white font-bold shadow-2xl border border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-800 active:scale-98 transition"
          >
            <div className="flex items-center gap-3">
              <span className="bg-amber-500 text-slate-950 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
              <div className="text-xs sm:text-sm">
                <span>View Basket</span>
                <span className="mx-2 text-slate-500">/</span>
                <span className="font-extrabold text-amber-400">₹{cartSubtotal}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-400">
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderPlaced={() => setCartItems([])}
        restaurant={restaurant}
      />

      <PartyModal
        isOpen={isPartyModalOpen}
        onClose={() => setIsPartyModalOpen(false)}
        restaurant={restaurant}
      />

      <OrderTrackerModal
        isOpen={isTrackModalOpen}
        onClose={() => {
          setIsTrackModalOpen(false);
          setInitialTrackNumber('');
        }}
        initialOrderNumber={initialTrackNumber}
        restaurant={restaurant}
      />

      <Footer
        restaurant={restaurant}
        onOpenPartyModal={() => setIsPartyModalOpen(true)}
        onOpenTrackModal={() => {
          setInitialTrackNumber('');
          setIsTrackModalOpen(true);
        }}
      />
    </div>
  );
}
