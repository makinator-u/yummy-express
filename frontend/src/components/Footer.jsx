import React from 'react';
import { Phone, MapPin, Clock, Truck, MessageSquare } from 'lucide-react';

export default function Footer({ restaurant, onOpenPartyModal, onOpenTrackModal }) {
  const phone = restaurant?.phone || '7249041603';
  const timing = restaurant?.timing || '7:30 PM to 11:30 PM';
  const address = restaurant?.address || 'In front of BMC Office, Near Liberty Garden (Khaugalli), Malad West';
  const name = restaurant?.name || 'YUMMY EXPRESS';
  const tagline = restaurant?.tagline || '॥ श्री स्वामी समर्थ ॥';
  const deliveryNote = restaurant?.delivery_note || 'Free delivery in Malad area';

  return (
    <footer className="mt-16 bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍜</span>
              <span className="text-xl font-black text-white tracking-tight font-heading">
                {name.split(' ')[0]} <span className="text-amber-400">{name.split(' ').slice(1).join(' ') || 'EXPRESS'}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Steaming Indo-Chinese bowls, crispy starters, triple Schezwan woks, and stir-fried noodles made fresh in Malad West.
            </p>
            <div className="text-xs text-amber-400 font-bold tracking-wide">
              {tagline}
            </div>
          </div>

          {/* Col 2: Hours & Location */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Hours &amp; Location
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-slate-400">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Daily Service: <strong className="text-white">{timing}</strong></span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-semibold">{deliveryNote}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Services &amp; Inquiries
            </h5>
            <div className="flex flex-col gap-2.5 text-xs sm:text-[13px]">
              <button
                type="button"
                onClick={onOpenPartyModal}
                className="text-left text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                Book Party Catering &rarr;
              </button>
              <button
                type="button"
                onClick={onOpenTrackModal}
                className="text-left text-slate-400 hover:text-white font-medium transition"
              >
                Track Live Order &rarr;
              </button>
            </div>
          </div>

          {/* Col 4: Contact & Phone */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Direct Contact
            </h5>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5 shadow-sm">
              <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Kitchen Hotline:</div>
              <a 
                href={`tel:${phone}`}
                className="text-lg font-black text-white hover:text-amber-400 flex items-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{phone}</span>
              </a>
              <a
                href={`https://wa.me/91${phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(name)},%20I%20would%20like%20to%20order%20food`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:text-emerald-300 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-medium">
          <div>
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </div>
          <div className="text-slate-400">
            Pure Veg Menu • Non-Veg Catering on Request
          </div>
        </div>
      </div>
    </footer>
  );
}
