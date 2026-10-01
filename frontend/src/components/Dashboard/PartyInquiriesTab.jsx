import React from 'react';
import { Sparkles, Calendar, Users, Phone, MessageSquare, MapPin } from 'lucide-react';

export default function PartyInquiriesTab({ inquiries }) {
  if (!inquiries || inquiries.length === 0) {
    return (
      <div className="p-12 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-3">
        <div className="text-4xl">🎉</div>
        <h4 className="text-base font-bold text-white font-heading">No Party Inquiries Yet</h4>
        <p className="text-xs text-zinc-400">
          When customers submit catering requests for Veg or Non-Veg parties, they will be listed here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white font-heading">
          Customer Party &amp; Bulk Catering Requests ({inquiries.length})
        </h3>
        <span className="text-xs text-amber-400 font-semibold">
          Veg Live Wok &amp; Non-Veg At-Venue
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inquiries.map((inq) => (
          <div key={inq.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-bold text-white font-heading">
                  {inq.customer_name}
                </h4>
                <div className="text-xs text-amber-300 font-semibold mt-0.5">
                  {inq.party_type}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{inq.approx_guests} Guests</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Date: <strong>{inq.event_date}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href={`tel:${inq.customer_phone}`} className="hover:underline font-bold text-emerald-400">
                  {inq.customer_phone}
                </a>
              </div>
            </div>

            {inq.notes && (
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                <strong className="text-zinc-500">Preferences:</strong> {inq.notes}
              </div>
            )}

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
              <span className="text-[11px] text-zinc-500">
                Received: {new Date(inq.created_at).toLocaleDateString()}
              </span>

              <a
                href={`https://wa.me/91${inq.customer_phone}?text=Hi%20${inq.customer_name},%20we%20received%20your%20catering%20inquiry%20for%20${inq.approx_guests}%20guests%20on%20${inq.event_date}.%20Here%20is%20our%20party%20package%20pricing:`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send WhatsApp Quote</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
