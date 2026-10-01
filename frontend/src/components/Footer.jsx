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
    <footer className="mt-16 bg-gray-50 border-t border-gray-200 text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍜</span>
              <span className="text-lg font-black text-gray-900 tracking-tight">
                {name.split(' ')[0]} <span className="text-amber-600">{name.split(' ').slice(1).join(' ') || 'EXPRESS'}</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Steaming Indo-Chinese bowls, crispy starters, triple Schezwan woks, and stir-fried noodles made fresh in Malad West.
            </p>
            <div className="text-xs text-gray-400 font-medium">
              {tagline}
            </div>
          </div>

          {/* Col 2: Hours & Location */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Hours &amp; Location
            </h5>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Daily: <strong className="text-gray-900">{timing}</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-600">{deliveryNote}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Services
            </h5>
            <div className="flex flex-col gap-2 text-xs">
              <button
                type="button"
                onClick={onOpenPartyModal}
                className="text-left text-amber-600 hover:underline transition"
              >
                Book Party Catering &rarr;
              </button>
              <button
                type="button"
                onClick={onOpenTrackModal}
                className="text-left text-gray-500 hover:text-gray-900 transition"
              >
                Track Live Order &rarr;
              </button>
            </div>
          </div>

          {/* Col 4: Contact & Phone */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Direct Contact
            </h5>
            <div className="p-3.5 rounded-xl bg-white border border-gray-200 space-y-2 shadow-sm">
              <div className="text-[11px] text-gray-400">Kitchen Hotline:</div>
              <a 
                href={`tel:${phone}`}
                className="text-base font-bold text-gray-900 hover:text-amber-600 flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-600" />
                <span>{phone}</span>
              </a>
              <a
                href={`https://wa.me/91${phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(name)},%20I%20would%20like%20to%20order%20food`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </div>
          <div>
            Pure Veg Menu • Non-Veg Catering on Request
          </div>
        </div>
      </div>
    </footer>
  );
}
