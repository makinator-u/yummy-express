import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Store, Clock, Phone, MapPin, Sparkles } from 'lucide-react';

export default function SettingsTab({ restaurant, onUpdateSettings }) {
  const [formData, setFormData] = useState({
    phone: restaurant?.phone || '7249041603',
    timing: restaurant?.timing || '7:30 PM to 11:30 PM',
    address: restaurant?.address || 'In front of BMC Office, Near Liberty Garden (Khaugalli), Malad West',
    banner_text: restaurant?.banner_text || 'Authentic Indo-Chinese Delicacies • Piping Hot Wok Specials • Fast & Free Delivery',
    party_catering_text: restaurant?.party_catering_text || 'We also take orders for any kind of party & We take orders for non-veg parties only at your place'
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');

    try {
      await onUpdateSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white font-heading">
            Restaurant Details &amp; Flyer Settings
          </h3>
        </div>
        <span className="text-xs text-zinc-400 font-semibold">
          Saved in SQLite Database
        </span>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Restaurant settings updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        <div>
          <label className="text-xs font-bold text-zinc-300 block mb-1">Kitchen Mobile Hotline *</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="custom-input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-300 block mb-1">Operating Dinner Hours *</label>
          <div className="relative">
            <Clock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={formData.timing}
              onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
              className="custom-input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-300 block mb-1">Location &amp; Address *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <textarea
              rows={2}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="custom-input pl-10 resize-none text-xs sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-300 block mb-1">Party Catering Flyer Note</label>
          <input
            type="text"
            value={formData.party_catering_text}
            onChange={(e) => setFormData({ ...formData, party_catering_text: e.target.value })}
            className="custom-input"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Update Restaurant Settings'}</span>
        </button>
      </form>
    </div>
  );
}
