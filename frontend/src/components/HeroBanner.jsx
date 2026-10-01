import React from 'react';
import { Phone, MapPin, Clock, Truck, Flame, Sparkles, Utensils } from 'lucide-react';

export default function HeroBanner({ restaurant, onOpenPartyModal }) {
  return (
    <section className="border-b border-gray-200 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Information */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold tracking-wide">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>SUPER HEATED LIVE WOK SPECIALS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Hot Indo-Chinese at <br className="hidden sm:inline" />
              <span className="text-amber-600">YUMMY EXPRESS</span>
            </h1>

            <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed">
              Steaming hot soups, crispy wok-tossed starters, triple Schezwan rice, and stir-fried noodles made fresh to order in Malad West.
            </p>

            {/* Structured Info Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center gap-3 shadow-sm">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">Free Delivery</div>
                  <div className="text-[11px] text-gray-400">Malad West</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center gap-3 shadow-sm">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">7:30 PM – 11:30 PM</div>
                  <div className="text-[11px] text-gray-400">Dinner Service</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-200 flex items-center gap-3 shadow-sm">
                <div className="p-2 rounded-lg bg-red-50 text-red-500 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-800">Liberty Garden</div>
                  <div className="text-[11px] text-gray-400">Opp. BMC Office</div>
                </div>
              </div>
            </div>

            {/* Quick Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a 
                href="#menu-section"
                className="btn-primary"
              >
                <Utensils className="w-4 h-4" />
                <span>Explore Menu</span>
              </a>

              <a 
                href="tel:7249041603"
                className="btn-secondary"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call: 7249041603</span>
              </a>
            </div>
          </div>

          {/* Party Catering Promo Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                  Party Catering
                </span>
                <span className="text-amber-600 text-xs font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Live Counters
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Orders for Any Kind of Party
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Hosting an event? We bring live wok counters for pure veg parties, plus <span className="text-amber-600 font-medium">exclusive non-veg live catering at your venue</span>.
              </p>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <span className="text-[11px] text-gray-400">
                  Custom live setups &amp; packages
                </span>
                <button 
                  type="button"
                  onClick={onOpenPartyModal}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition"
                >
                  Inquire Now &rarr;
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
