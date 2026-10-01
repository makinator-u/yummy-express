import React from 'react';
import logoImg from '../assets/logo.jpg';
import { Phone, ShoppingBag, MapPin, Clock, PartyPopper, Utensils, LogIn } from 'lucide-react';
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
    <header className="sticky top-0 z-50 glass-card border-b border-zinc-800/90 shadow-lg">
      {/* Top Auspicious Banner */}
      <div className="bg-gradient-to-r from-amber-950/90 via-zinc-950 to-amber-950/90 py-1.5 px-4 text-center text-xs font-semibold tracking-wider text-amber-200 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs">
          <span className="font-bold text-amber-300">॥ श्री स्वामी समर्थ ॥</span>
          <span className="hidden md:inline opacity-40">•</span>
          <span className="text-zinc-300 font-medium">📍 Liberty Garden Khaugalli, Malad West</span>
          <span className="hidden md:inline opacity-40">•</span>
          <span className="text-amber-400 font-bold">🛵 Free Fast Home Delivery</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md shrink-0 group-hover:scale-105 transition ring-2 ring-amber-400/40">
            <img
              src={logoImg}
              alt="Yummy Express Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-2xl font-black tracking-wide text-amber-400 font-heading">
                YUMMY <span className="text-red-500">EXPRESS</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Open Daily: 7:30 PM – 11:30 PM</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Kitchen Dashboard Button */}
          <button 
            type="button"
            onClick={onOpenDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-400 transition"
            title="Open Kitchen & Admin Dashboard"
          >
            <span className="text-sm">👨‍🍳</span>
            <span className="hidden xs:inline">Dashboard</span>
          </button>

          {/* Party Catering Button */}
          <button 
            type="button"
            onClick={onOpenPartyModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-400 transition"
          >
            <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
            <span>Party Orders</span>
          </button>

          {/* Track Order Button */}
          <button 
            type="button"
            onClick={onOpenTrackModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700/80 hover:border-amber-400/50 hover:text-white transition"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Order</span>
          </button>

          {/* Google Auth / User Profile */}
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
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-400 transition shadow-sm"
              title="Sign In with Google"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden sm:inline">Google Sign In</span>
              <span className="sm:hidden">Sign In</span>
            </button>
          )}

          {/* Cart Header Button */}
          <button 
            type="button"
            onClick={onOpenCart}
            className="btn-primary text-xs sm:text-sm py-2 px-3.5 sm:px-4 rounded-xl flex items-center gap-2 shadow-md"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 text-zinc-950" />
            <span className="font-extrabold">Cart</span>
            {cartCount > 0 && (
              <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

