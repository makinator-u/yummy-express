import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ShoppingBag, ChevronDown, CheckCircle, Shield } from 'lucide-react';

export default function UserMenu({ user, onLogout, onOpenMyOrders, onOpenDashboard }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-zinc-900/90 border border-amber-500/30 hover:border-amber-400 hover:bg-zinc-850 transition shadow-md"
        aria-label="User profile menu"
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-1 ring-amber-400/40"
          />
        ) : (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-zinc-950 font-black flex items-center justify-center text-xs shadow">
            {initials}
          </div>
        )}
        <div className="hidden sm:block text-left max-w-[110px] truncate">
          <p className="text-xs font-bold text-zinc-100 truncate">{user.name}</p>
          <p className="text-[10px] text-amber-400 font-medium">Google Account</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in divide-y divide-zinc-800">
          {/* User Info Header */}
          <div className="p-3">
            <div className="flex items-center gap-3">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-400/40"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-zinc-950 font-black flex items-center justify-center text-sm">
                  {initials}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-0.5">
                  <CheckCircle className="w-3 h-3" /> Signed In via Google
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 space-y-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenMyOrders();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-800 rounded-xl transition"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>My Order History</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenDashboard();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-800 rounded-xl transition"
            >
              <Shield className="w-4 h-4 text-red-400" />
              <span>Kitchen & Admin View</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
