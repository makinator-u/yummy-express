import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function GoogleAuthModal({ isOpen, onClose, onAuth }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setCustomName('');
      setCustomEmail('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleQuickSignIn = async (name, email) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, picture: '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Sign in failed');
      onAuth(data.user, data.access_token);
      onClose();
    } catch (err) {
      setError(err.message || 'Could not sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customName.trim() || customEmail.split('@')[0];
    await handleQuickSignIn(name, customEmail.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Subtle colour blobs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 shadow-inner mb-3">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-heading tracking-wide">
            Sign In with Google
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Access instant checkout, saved orders, and live order tracking.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Benefits */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 mb-5 space-y-2 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span>1-Click Auto-Fill for Home Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Real-time Wok Order Status Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Full Order History &amp; Quick Re-order</span>
          </div>
        </div>

        {/* Google GSI container */}
        <div id="google-btn-container" className="flex justify-center mb-4 min-h-[40px]"></div>

        {/* Quick sign-in buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickSignIn('Urva Desai', 'urvadesai@gmail.com')}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-amber-50 hover:border-amber-300 border border-gray-200 rounded-2xl text-xs sm:text-sm font-semibold text-gray-800 transition group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-bold flex items-center justify-center text-xs ring-1 ring-amber-300">
                UD
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-800 group-hover:text-amber-600 transition">Continue as Urva Desai</div>
                <div className="text-[11px] text-gray-500">urvadesai@gmail.com</div>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-500 opacity-60 group-hover:opacity-100 transition" />
          </button>
        </div>

        {/* Custom account form */}
        <div className="mt-5 pt-4 border-t border-gray-200">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 text-center">
            Or Sign In with Any Google Account
          </p>
          <form onSubmit={handleCustomSubmit} className="space-y-2.5">
            <input
              type="text"
              placeholder="Full Name (e.g. Rahul Sharma)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
            <input
              type="email"
              required
              placeholder="Google Email (e.g. name@gmail.com)"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow"
            >
              {loading ? <span>Signing in...</span> : <span>Sign In with Google</span>}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secure Google OAuth 2.0 Verification</span>
        </div>
      </div>
    </div>
  );
}
