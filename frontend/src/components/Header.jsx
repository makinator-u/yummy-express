import React from 'react';
import logoImg from '../assets/logo.jpg';
import { Phone, ShoppingBag, MapPin, Clock, PartyPopper, Utensils } from 'lucide-react';

export default function Header({ 
  restaurant, 
  cartCount, 
  onOpenCart, 
  onOpenPartyModal, 
  onOpenTrackModal,
  onOpenDashboard
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

          {/* Direct Call Button */}
          <a 
            href="tel:7249041603"
            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/40 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>7249041603</span>
          </a>

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
