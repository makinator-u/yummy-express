import React from 'react';
import logoImg from '../assets/logo.jpg';
import { ShoppingBag, Clock, PartyPopper } from 'lucide-react';
import UserMenu from './UserMenu';

export default function Header({ 
  restaurant, 
  cartCount, 
  onOpenCart, 
  onOpenPartyModal, 
  onOpenTrackModal,
  onOpenDashboard,
  user,
  onOpenAuthModal,
  onLogout,
  onOpenMyOrders
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Top Micro-Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-1 px-4 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-gray-500">
          <span className="font-semibold text-amber-600 tracking-wide">॥ श्री स्वामी समर्थ ॥</span>
          <div className="hidden sm:flex items-center gap-3">
            <span>📍 Liberty Garden, Malad West</span>
            <span className="text-gray-300">•</span>
            <span className="text-emerald-600 font-medium">Free Home Delivery</span>
          </div>
          <a href={`tel:${restaurant?.phone || '7249041603'}`} className="text-gray-600 hover:text-amber-600 font-medium">
            📞 {restaurant?.phone || '7249041603'}
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-gray-100">
            <img
              src={logoImg}
              alt="Yummy Express"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-gray-900 font-heading flex items-center gap-1.5">
              <span>YUMMY</span>
              <span className="text-amber-600 font-normal">EXPRESS</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium -mt-0.5">
              Indo-Chinese Wok • Open {restaurant?.timing || '7:30 PM - 11:30 PM'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Party Catering Button */}
          <button 
            type="button"
            onClick={onOpenPartyModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 transition"
          >
            <PartyPopper className="w-3.5 h-3.5 text-amber-600" />
            <span>Party Catering</span>
          </button>

          {/* Track Order Button */}
          <button 
            type="button"
            onClick={onOpenTrackModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 transition"
          >
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>Track</span>
          </button>

          {/* Dashboard Link */}
          <button 
            type="button"
            onClick={onOpenDashboard}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition"
            title="Kitchen Dashboard"
          >
            <span>👨‍🍳</span>
            <span className="hidden xs:inline text-[11px]">Kitchen</span>
          </button>

          {/* Google Auth */}
          {user ? (
            <UserMenu 
              user={user} 
              onLogout={onLogout} 
              onOpenMyOrders={onOpenMyOrders} 
              onOpenDashboard={onOpenDashboard} 
            />
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In</span>
            </button>
          )}

          {/* Cart */}
          <button 
            type="button"
            onClick={onOpenCart}
            className="btn-primary py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 font-bold"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-white/25 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
