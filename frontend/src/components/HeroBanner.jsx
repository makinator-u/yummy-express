import React from 'react';
import { Phone, MapPin, Clock, Truck, Flame, Sparkles, Utensils, Award } from 'lucide-react';

export default function HeroBanner({ restaurant, onOpenPartyModal }) {
  return (
    <div className="relative overflow-hidden pt-6 pb-8 border-b border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Hero Text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>FRESHLY TOSS-FRIED IN SUPER HEATED WOKS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-[1.15] font-heading">
              Hot Indo-Chinese at <br className="hidden sm:inline" />
              <span className="gold-gradient-text">YUMMY EXPRESS</span>
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Order steaming hot soups, crispy starters, triple Schezwan woks, and stir-fried noodles cooked fresh on order in Malad West.
            </p>

            {/* Structured Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Free Delivery</div>
                  <div className="text-[11px] text-zinc-400">Malad West area</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">7:30 PM – 11:30 PM</div>
                  <div className="text-[11px] text-zinc-400">Dinner timings</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 text-red-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Liberty Garden</div>
                  <div className="text-[11px] text-zinc-400">Opp. BMC Office</div>
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
                <span>Explore Full Menu</span>
              </a>

              <a 
                href="tel:7249041603"
                className="btn-secondary"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Kitchen: 7249041603</span>
              </a>
            </div>
          </div>

          {/* Party Catering Promo Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md bg-red-600/30 text-red-300 border border-red-500/40">
                  Special Catering
                </span>
                <span className="text-amber-300 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Party Orders
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-amber-300 font-heading">
                🎉 Orders for Any Kind of Party!
              </h3>
              
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Hosting a celebration or gathering? We prepare bulk live wok counters for our pure veg menu &amp; <strong className="text-amber-200">cater non-veg parties exclusively at your venue</strong>!
              </p>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                <span className="text-[11px] text-zinc-400">
                  Customized packages &amp; live chef
                </span>
                <button 
                  type="button"
                  onClick={onOpenPartyModal}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition shadow-sm"
                >
                  Inquire Now &rarr;
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
