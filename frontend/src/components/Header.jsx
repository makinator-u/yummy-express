import React from 'react';
import logoImg from '../assets/logo.jpg';
import { ShoppingBag, Clock, PartyPopper } from 'lucide-react';

export default function Header({ 
  restaurant, 
  cartCount, 
  onOpenCart, 
  onOpenPartyModal, 
  onOpenTrackModal,
  onOpenDashboard
}) {
  const phone = restaurant?.phone || '7249041603';
  const timing = restaurant?.timing || '7:30 PM to 11:30 PM';
  const tagline = restaurant?.tagline || '॥ श्री स्वामी समर्थ ॥';
  const name = restaurant?.name || 'YUMMY EXPRESS';
  const deliveryNote = restaurant?.delivery_note || 'Free Home Delivery';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Micro-Bar */}
      <div className="bg-slate-50 border-b border-slate-200 py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-600">
          <span className="font-bold text-amber-700 tracking-wide">{tagline}</span>
          <div className="hidden sm:flex items-center gap-3">
            <span className="font-medium text-slate-700">📍 Liberty Garden, Malad West</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">{deliveryNote}</span>
          </div>
          <a href={`tel:${phone}`} className="text-slate-700 hover:text-amber-700 font-bold transition">
            📞 {phone}
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 shadow-xs">
            <img
              src={logoImg}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-heading flex items-center gap-1.5">
              <span>{name.split(' ')[0]}</span>
              <span className="text-amber-600 font-bold">{name.split(' ').slice(1).join(' ') || 'EXPRESS'}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold -mt-0.5">
              Indo-Chinese Wok • Open {timing}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Party Catering Button */}
          <button 
            type="button"
            onClick={onOpenPartyModal}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition"
          >
            <PartyPopper className="w-4 h-4 text-amber-600" />
            <span>Party Catering</span>
          </button>

          {/* Track Order Button */}
          <button 
            type="button"
            onClick={onOpenTrackModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition"
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Track Order</span>
          </button>

          {/* Kitchen Dashboard Link */}
          <button 
            type="button"
            onClick={onOpenDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
            title="Kitchen Dashboard"
          >
            <span>👨‍🍳</span>
            <span className="hidden xs:inline text-xs">Kitchen</span>
          </button>

          {/* Cart Basket */}
          <button 
            type="button"
            onClick={onOpenCart}
            className="btn-primary py-2 px-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 font-bold shadow-sm"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-white/30 text-white text-[11px] font-black px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
