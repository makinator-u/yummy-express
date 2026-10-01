import React from 'react';
import { Phone, MapPin, Clock, Truck, MessageSquare } from 'lucide-react';

export default function Footer({ restaurant, onOpenPartyModal, onOpenTrackModal }) {
  return (
    <footer className="mt-16 bg-zinc-950 border-t border-zinc-800 text-zinc-300">
      {/* Top Auspicious Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-zinc-950 to-amber-950/80 py-2.5 border-b border-amber-500/20 text-center">
        <span className="text-amber-300 font-bold tracking-widest text-xs sm:text-sm">
          ॥ श्री स्वामी समर्थ ॥
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Quality */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍜</span>
              <h4 className="text-xl font-black text-amber-400 font-heading">
                YUMMY <span className="text-red-500">EXPRESS</span>
              </h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Authentic street-style Indo-Chinese woks prepared fresh with crispy vegetables, secret Schezwan sauces, and pure love in Malad West.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-amber-300">
                ⭐ Zomato &amp; Swiggy
              </span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-emerald-400">
                🛵 Free Delivery
              </span>
            </div>
          </div>

          {/* Col 2: Hours & Location */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Kitchen &amp; Address
            </h5>
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Daily: <strong>7:30 PM to 11:30 PM</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>In front of BMC Office, Near Liberty Garden (Khaugalli), Malad West</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-300 font-semibold">Free Home Delivery in Malad</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Catering & Quick Links */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Party &amp; Live Orders
            </h5>
            <p className="text-xs text-zinc-400">
              Orders for any kind of party &amp; <strong className="text-amber-300">non-veg parties only at your place</strong>.
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              <button
                type="button"
                onClick={onOpenPartyModal}
                className="text-left text-xs font-bold text-amber-400 hover:text-amber-300 transition"
              >
                &rarr; Book Party Catering
              </button>
              <button
                type="button"
                onClick={onOpenTrackModal}
                className="text-left text-xs font-semibold text-zinc-300 hover:text-white transition"
              >
                &rarr; Track Your Live Order
              </button>
            </div>
          </div>

          {/* Col 4: Kitchen Hotline */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Direct Contact
            </h5>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="text-[11px] text-zinc-400 font-medium">Kitchen Hotline:</div>
              <a 
                href="tel:7249041603"
                className="text-base font-black text-amber-400 hover:text-amber-300 flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>7249041603</span>
              </a>
              <a
                href="https://wa.me/917249041603?text=Hi%20Yummy%20Express,%20I%20would%20like%20to%20order%20food"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-5 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} YUMMY EXPRESS. All rights reserved.
          </div>
          <div className="text-zinc-400">
            Malad West, Mumbai
          </div>
        </div>
      </div>
    </footer>
  );
}
