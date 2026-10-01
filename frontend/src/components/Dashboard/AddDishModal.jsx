import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

export default function AddDishModal({ isOpen, onClose, categories, onDishAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    category_id: categories[0]?.id || 1,
    description: '',
    half_price: '',
    full_price: '',
    is_spicy: false,
    is_bestseller: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter dish name');
      return;
    }

    if (!formData.full_price || parseFloat(formData.full_price) <= 0) {
      setError('Please enter a valid full portion price');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        category_id: parseInt(formData.category_id),
        description: formData.description.trim(),
        half_price: formData.half_price ? parseFloat(formData.half_price) : null,
        full_price: parseFloat(formData.full_price),
        is_spicy: formData.is_spicy,
        is_bestseller: formData.is_bestseller
      };

      const res = await fetch('http://localhost:8000/api/dashboard/menu/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to add dish');
      }

      await onDishAdded();
      onClose();
    } catch (err) {
      setError(err.message || 'Error adding dish');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="relative w-full max-w-md bg-zinc-950 border border-amber-500/40 rounded-2xl shadow-2xl p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-base font-bold text-white font-heading">
            Add New Menu Dish to SQLite
          </h3>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Dish Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dragon Paneer Dry"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="custom-input"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Category *</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="custom-input"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Half Price (₹)</label>
              <input
                type="number"
                placeholder="Optional (e.g. 100)"
                value={formData.half_price}
                onChange={(e) => setFormData({ ...formData, half_price: e.target.value })}
                className="custom-input"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Full Price (₹) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 180"
                value={formData.full_price}
                onChange={(e) => setFormData({ ...formData, full_price: e.target.value })}
                className="custom-input"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Appetizing description of ingredients and spices..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="custom-input resize-none text-xs"
            />
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={formData.is_spicy}
                onChange={(e) => setFormData({ ...formData, is_spicy: e.target.checked })}
                className="accent-red-500 w-4 h-4"
              />
              <span>🌶️ Spicy Tag</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={formData.is_bestseller}
                onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                className="accent-amber-500 w-4 h-4"
              />
              <span>⭐ Bestseller Tag</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-xs sm:text-sm rounded-xl font-bold flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Adding to SQLite...' : 'Save Dish to Menu'}
          </button>
        </form>
      </div>
    </div>
  );
}
