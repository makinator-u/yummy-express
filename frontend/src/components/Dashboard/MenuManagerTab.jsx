import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Flame, 
  Star, 
  Check, 
  X, 
  Edit2, 
  Save, 
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function MenuManagerTab({ 
  categories, 
  onUpdateMenuItem, 
  onOpenAddDish 
}) {
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [savingId, setSavingId] = useState(null);

  // Flatten all items
  const allItems = categories.flatMap(cat => 
    (cat.items || []).map(item => ({ ...item, category_name: cat.name }))
  );

  const filteredItems = allItems.filter(item => {
    if (selectedCat !== 'ALL' && item.category_id !== parseInt(selectedCat)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleToggleStock = async (item) => {
    setSavingId(item.id);
    await onUpdateMenuItem(item.id, { is_available: !item.is_available });
    setSavingId(null);
  };

  const handleToggleBestseller = async (item) => {
    setSavingId(item.id);
    await onUpdateMenuItem(item.id, { is_bestseller: !item.is_bestseller });
    setSavingId(null);
  };

  const handleToggleSpicy = async (item) => {
    setSavingId(item.id);
    await onUpdateMenuItem(item.id, { is_spicy: !item.is_spicy });
    setSavingId(null);
  };

  const startEditing = (item) => {
    setEditingItemId(item.id);
    setEditValues({
      name: item.name,
      half_price: item.half_price !== null ? item.half_price : '',
      full_price: item.full_price,
      description: item.description
    });
  };

  const saveEdit = async (itemId) => {
    setSavingId(itemId);
    await onUpdateMenuItem(itemId, {
      name: editValues.name,
      half_price: editValues.half_price !== '' ? parseFloat(editValues.half_price) : null,
      full_price: parseFloat(editValues.full_price),
      description: editValues.description
    });
    setSavingId(null);
    setEditingItemId(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes to edit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="custom-input pl-10 py-1.5 text-xs sm:text-sm"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="custom-input py-1.5 px-3 text-xs sm:text-sm w-full sm:w-auto font-semibold"
          >
            <option value="ALL">All Categories ({allItems.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.items ? c.items.length : 0})
              </option>
            ))}
          </select>
        </div>

        {/* Add Dish Button */}
        <button
          type="button"
          onClick={onOpenAddDish}
          className="btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow whitespace-nowrap w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 text-zinc-950 stroke-[3]" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Dishes Table / List */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 uppercase text-[11px] font-bold tracking-wider">
                <th className="p-3.5">Dish Name &amp; Category</th>
                <th className="p-3.5">Half Price</th>
                <th className="p-3.5">Full Price</th>
                <th className="p-3.5 text-center">Tags</th>
                <th className="p-3.5 text-center">Stock Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredItems.map((item) => {
                const isEditing = editingItemId === item.id;
                const isSaving = savingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-zinc-800/40 transition">
                    {/* Name & Desc */}
                    <td className="p-3.5 max-w-xs">
                      {isEditing ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editValues.name}
                            onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                            className="custom-input py-1 px-2 text-xs"
                          />
                          <input
                            type="text"
                            value={editValues.description}
                            onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                            className="custom-input py-1 px-2 text-[11px]"
                            placeholder="Description..."
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="veg-badge shrink-0">
                              <span className="veg-dot" />
                            </span>
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                            {item.category_name} • {item.description}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Half Price */}
                    <td className="p-3.5 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          placeholder="None"
                          value={editValues.half_price}
                          onChange={(e) => setEditValues({ ...editValues, half_price: e.target.value })}
                          className="custom-input py-1 px-2 text-xs w-20"
                        />
                      ) : (
                        <span className="font-bold text-zinc-300">
                          {item.half_price !== null ? `₹${item.half_price}` : <span className="text-zinc-500 font-normal">N/A</span>}
                        </span>
                      )}
                    </td>

                    {/* Full Price */}
                    <td className="p-3.5 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.full_price}
                          onChange={(e) => setEditValues({ ...editValues, full_price: e.target.value })}
                          className="custom-input py-1 px-2 text-xs w-20"
                        />
                      ) : (
                        <span className="font-black text-amber-400">
                          ₹{item.full_price}
                        </span>
                      )}
                    </td>

                    {/* Tags (Spicy & Bestseller) */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleBestseller(item)}
                          disabled={isSaving}
                          className={`p-1.5 rounded-lg border transition ${
                            item.is_bestseller
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-400'
                          }`}
                          title="Toggle Popular/Bestseller"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleSpicy(item)}
                          disabled={isSaving}
                          className={`p-1.5 rounded-lg border transition ${
                            item.is_spicy
                              ? 'bg-red-500/20 border-red-500 text-red-300'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-400'
                          }`}
                          title="Toggle Spicy"
                        >
                          <Flame className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </td>

                    {/* Stock Status Switch */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(item)}
                        disabled={isSaving}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                          item.is_available
                            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                            : 'bg-red-950/50 border-red-500/40 text-red-300 hover:bg-red-900/50'
                        }`}
                      >
                        {item.is_available ? '● In Stock' : '✕ Sold Out'}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => saveEdit(item.id)}
                            disabled={isSaving}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingItemId(null)}
                            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditing(item)}
                          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700 transition"
                          title="Edit Dish & Price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
