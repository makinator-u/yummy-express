import React from 'react';
import { Phone, MapPin, Clock, Truck, Flame, Sparkles, Utensils } from 'lucide-react';

export default function HeroBanner({ restaurant, onOpenPartyModal }) {
  const phone = restaurant?.phone || '7249041603';
  const timing = restaurant?.timing || '7:30 PM to 11:30 PM';
  const address = restaurant?.address || 'In front of BMC Office, Near Liberty Garden (Khaugalli), Malad West';
  const name = restaurant?.name || 'YUMMY EXPRESS';
  const deliveryNote = restaurant?.delivery_note || 'Free Delivery';
  const bannerText = restaurant?.banner_text || 'Steaming hot soups, crispy wok-tossed starters, triple Schezwan rice, and stir-fried noodles made fresh to order in Malad West.';
  const partyCateringText = restaurant?.party_catering_text || 'We also take orders for any kind of party & We take orders for non-veg parties only at your place';

  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Information */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold tracking-wide">
              <Flame className="w-4 h-4 text-red-600 fill-red-500" />
              <span>LIVE INDO-CHINESE WOK SPECIALS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Hot Indo-Chinese at <br className="hidden sm:inline" />
              <span className="text-amber-600">{name}</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
              {bannerText}
            </p>

            {/* Structured Info Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-100">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{deliveryNote}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Malad West Area</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0 border border-amber-100">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{timing}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Daily Dinner Service</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
                <div className="p-2 rounded-lg bg-red-50 text-red-700 shrink-0 border border-red-100">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Liberty Garden</div>
                  <div className="text-[11px] text-slate-500 font-medium">Opp. BMC Office</div>
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
                <span>Explore Menu Dishes</span>
              </a>

              <a 
                href={`tel:${phone}`}
                className="btn-secondary"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call Hotline: {phone}</span>
              </a>
            </div>
          </div>

          {/* Party Catering Promo Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  Party Catering
                </span>
                <span className="text-amber-700 text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Live Counters
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Orders for Any Kind of Party
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {partyCateringText}
              </p>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">
                  Custom live wok setups &amp; catering
                </span>
                <button 
                  type="button"
                  onClick={onOpenPartyModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition shadow-xs"
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
