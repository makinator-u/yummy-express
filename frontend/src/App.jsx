import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryNav from './components/CategoryNav';
import MenuCard from './components/MenuCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import PartyModal from './components/PartyModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import GoogleAuthModal from './components/GoogleAuthModal';
import UserOrdersModal from './components/UserOrdersModal';
import Footer from './components/Footer';
import DashboardView from './components/Dashboard/DashboardView';
import { ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function App() {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth state from localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ye_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('ye_auth_token') || '';
  });

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [initialTrackNumber, setInitialTrackNumber] = useState('');

  // Auth Handlers
  const handleAuthSuccess = (authData) => {
    setUser(authData.user);
    setAuthToken(authData.token);
    try {
      localStorage.setItem('ye_user', JSON.stringify(authData.user));
      localStorage.setItem('ye_auth_token', authData.token);
    } catch (e) {
      console.error('Failed to save user session', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAuthToken('');
    try {
      localStorage.removeItem('ye_user');
      localStorage.removeItem('ye_auth_token');
    } catch (e) {
      console.error('Failed to clear user session', e);
    }
  };

  const handleTrackFromOrders = (orderNumber) => {
    setInitialTrackNumber(orderNumber);
    setIsTrackModalOpen(true);
  };

  // Sync to local storage
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
        item => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
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
    <div className="min-h-screen flex flex-col selection:bg-amber-500 selection:text-black">
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
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
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
            <div className="w-10 h-10 border-3 border-amber-500/20 border-t-amber-400 rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-zinc-300">Loading fresh menu from SQLite database...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="max-w-xl mx-auto my-12 p-6 rounded-2xl bg-red-950/40 border border-red-500/40 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-lg font-bold text-white font-heading">Connection Error</h3>
            <p className="text-xs text-zinc-300">{error}</p>
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
          <section id="menu-section" className="scroll-mt-36">
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
                <div className="text-center py-16 space-y-3">
                  <div className="text-4xl">🔍</div>
                  <h4 className="text-lg font-bold text-white font-heading">No menu dishes found</h4>
                  <p className="text-xs text-zinc-400">
                    Try clearing your search query or reset your filters.
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
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-amber-400 font-heading flex items-center gap-2">
                          <span>{cat.name}</span>
                          <span className="text-xs font-semibold text-zinc-400 font-sans">
                            ({cat.items.length} items)
                          </span>
                        </h3>
                        {cat.description && (
                          <p className="text-xs sm:text-[13px] text-zinc-300 mt-1">{cat.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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

      {/* Floating Bottom Cart Bar - Minimalist */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-5 inset-x-4 max-w-md mx-auto z-40">
          <div 
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-3 rounded-xl bg-foreground text-background font-semibold shadow-xl border border-border flex items-center justify-between cursor-pointer hover:opacity-95 active:scale-95 transition"
          >
            <div className="flex items-center gap-3">
              <span className="bg-primary text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
              <div className="text-xs sm:text-sm">
                <span>View Basket</span>
                <span className="mx-2 opacity-40">/</span>
                <span className="font-bold">₹{cartSubtotal}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
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
        user={user}
        onOpenAuthModal={() => {
          setIsCheckoutOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      <PartyModal
        isOpen={isPartyModalOpen}
        onClose={() => setIsPartyModalOpen(false)}
      />

      <OrderTrackerModal
        isOpen={isTrackModalOpen}
        onClose={() => {
          setIsTrackModalOpen(false);
          setInitialTrackNumber('');
        }}
        initialOrderNumber={initialTrackNumber}
      />

      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <UserOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        token={authToken}
        user={user}
        onTrackOrder={handleTrackFromOrders}
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
