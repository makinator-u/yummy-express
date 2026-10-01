import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Phone, Calendar, Users, UtensilsCrossed, AlertCircle, MessageSquare } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function PartyModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    event_date: '',
    approx_guests: 25,
    party_type: 'Veg Catering (Live Wok)',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name.trim()) {
      setError('Please enter your name');
      return;
    }

    const cleanPhone = formData.customer_phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!formData.event_date) {
      setError('Please select an event date');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/party/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          customer_phone: cleanPhone,
          approx_guests: parseInt(formData.approx_guests) || 20
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit party inquiry');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Error submitting party inquiry. Please call us directly at 7249041603.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    const text = `*YUMMY EXPRESS PARTY CATERING INQUIRY*%0A%0A*Name:* ${formData.customer_name}%0A*Phone:* ${formData.customer_phone}%0A*Date:* ${formData.event_date}%0A*Guests:* ${formData.approx_guests}%0A*Party Type:* ${formData.party_type}%0A*Notes:* ${formData.notes || 'N/A'}%0A%0APlease share your party package menu and quote!`;
    window.open(`https://wa.me/917249041603?text=${text}`, '_blank');
  };

  return (
    <div className="modal-overlay">
      <div 
        className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-amber-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-600 font-heading">
                Party &amp; Bulk Catering
              </h3>
              <p className="text-xs text-gray-500">
                Live Wok Counters &amp; Custom Menus
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice from Menu Flyer */}
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <span>🔥</span>
          <span>
            <strong>Menu Special:</strong> We take orders for any kind of party &amp; <em className="text-amber-400 underline">non-veg parties only at your place</em>!
          </span>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/40 text-green-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 font-heading">
                Party Inquiry Received!
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{formData.customer_name}</strong>. Chef team from Yummy Express will contact you shortly on <strong>{formData.customer_phone}</strong> to customize your menu.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-green-600 hover:bg-green-500 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly (7249041603)</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full btn-secondary text-xs py-2.5"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Party Type Selection */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Party Type *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, party_type: 'Veg Catering (Live Wok / Bulk)' })}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition text-left ${
                      formData.party_type.startsWith('Veg')
                        ? 'bg-amber-100 border-amber-400 text-amber-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    🥬 Veg Live Wok Catering
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, party_type: 'Non-Veg Party (At Your Place Only)' })}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition text-left ${
                      formData.party_type.startsWith('Non-Veg')
                        ? 'bg-red-100 border-red-400 text-red-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    🍗 Non-Veg (At Your Venue)
                  </button>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Patel"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="custom-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="custom-input"
                  />
                </div>
              </div>

              {/* Event Date & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="custom-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Approx. Guests *</label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={formData.approx_guests}
                    onChange={(e) => setFormData({ ...formData, approx_guests: e.target.value })}
                    className="custom-input"
                  />
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Party Location &amp; Dish Preferences</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Society clubhouse in Malad West, need Manchurian Chopper Rice, Paneer Chilli, Spring rolls..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="custom-input resize-none text-xs sm:text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-sm rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : 'Request Party Quotation'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
