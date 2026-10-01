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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* Top Micro-Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-1 px-4 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-gray-500">
          <span className="font-semibold text-amber-600 tracking-wide">{tagline}</span>
          <div className="hidden sm:flex items-center gap-3">
            <span>📍 Liberty Garden, Malad West</span>
            <span className="text-gray-300">•</span>
            <span className="text-emerald-600 font-medium">{deliveryNote}</span>
          </div>
          <a href={`tel:${phone}`} className="text-gray-600 hover:text-amber-600 font-medium">
            📞 {phone}
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
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-gray-900 font-heading flex items-center gap-1.5">
              <span>{name.split(' ')[0]}</span>
              <span className="text-amber-600 font-normal">{name.split(' ').slice(1).join(' ') || 'EXPRESS'}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium -mt-0.5">
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

          {/* Kitchen Dashboard Link */}
          <button 
            type="button"
            onClick={onOpenDashboard}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition"
            title="Kitchen Dashboard"
          >
            <span>👨‍🍳</span>
            <span className="hidden xs:inline text-[11px]">Kitchen</span>
          </button>

          {/* Cart Basket */}
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
