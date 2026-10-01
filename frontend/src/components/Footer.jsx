import React from 'react';
import { Phone, MapPin, Clock, Truck, MessageSquare } from 'lucide-react';

export default function Footer({ restaurant, onOpenPartyModal, onOpenTrackModal }) {
  return (
    <footer className="mt-16 bg-surface border-t border-border text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍜</span>
              <span className="text-lg font-black text-foreground tracking-tight">
                YUMMY <span className="text-primary">EXPRESS</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Steaming Indo-Chinese bowls, crispy starters, triple Schezwan woks, and stir-fried noodles made fresh in Malad West.
            </p>
            <div className="text-xs text-zinc-500 font-medium">
              ॥ श्री स्वामी समर्थ ॥
            </div>
          </div>

          {/* Col 2: Hours & Location */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Hours &amp; Location
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Daily: <strong className="text-foreground">7:30 PM – 11:30 PM</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Opp. BMC Office, Liberty Garden, Malad West</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400">Free delivery in Malad area</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Services
            </h5>
            <div className="flex flex-col gap-2 text-xs">
              <button
                type="button"
                onClick={onOpenPartyModal}
                className="text-left text-primary hover:underline transition"
              >
                Book Party Catering &rarr;
              </button>
              <button
                type="button"
                onClick={onOpenTrackModal}
                className="text-left text-zinc-400 hover:text-foreground transition"
              >
                Track Live Order &rarr;
              </button>
            </div>
          </div>

          {/* Col 4: Contact & Phone */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Direct Contact
            </h5>
            <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-2">
              <div className="text-[11px] text-zinc-400">Kitchen Hotline:</div>
              <a 
                href="tel:7249041603"
                className="text-base font-bold text-foreground hover:text-primary flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span>7249041603</span>
              </a>
              <a
                href="https://wa.me/917249041603?text=Hi%20Yummy%20Express,%20I%20would%20like%20to%20order%20food"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} Yummy Express. All rights reserved.
          </div>
          <div>
            Pure Veg Menu • Non-Veg Catering on Request
          </div>
        </div>
      </div>
    </footer>
  );
}
