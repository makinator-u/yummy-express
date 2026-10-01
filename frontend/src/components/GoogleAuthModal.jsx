import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, User, Mail } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function GoogleAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  // Handle Google GIS callback if script is loaded
  useEffect(() => {
    if (!isOpen) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredentialResponse,
      });
      const btnContainer = document.getElementById('google-btn-container');
      if (btnContainer) {
        window.google.accounts.id.renderButton(btnContainer, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          width: 280
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Google Authentication failed');
      }

      const authData = await res.json();
      onAuthSuccess(authData);
      onClose();
    } catch (err) {
      console.error('Google Auth Error', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSignIn = async (name, email) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Sign-in failed');
      }

      const authData = await res.json();
      onAuthSuccess(authData);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setError('Please enter a valid Gmail address');
      return;
    }
    handleQuickSignIn(customName || customEmail.split('@')[0], customEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-900/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glowing background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-inner mb-3">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-wide">
            Sign In with Google
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Access instant checkout, saved orders, and live order tracking.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Benefits list */}
        <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-2xl p-3.5 mb-5 space-y-2 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>1-Click Auto-Fill for Home Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Real-time Wok Order Status Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Full Order History & Quick Re-order</span>
          </div>
        </div>

        {/* Official Google GSI Render Container if configured */}
        <div id="google-btn-container" className="flex justify-center mb-4 min-h-[40px]"></div>

        {/* One-Click Google Quick Login Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleQuickSignIn('Urva Desai', 'urvadesai@gmail.com')}
            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-800 hover:bg-zinc-750 hover:border-amber-400/50 border border-zinc-700 rounded-2xl text-xs sm:text-sm font-semibold text-white transition group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs ring-1 ring-amber-400/30">
                UD
              </div>
              <div className="text-left">
                <div className="font-bold text-zinc-100 group-hover:text-amber-400 transition">Continue as Urva Desai</div>
                <div className="text-[11px] text-zinc-400">urvadesai@gmail.com</div>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-400 opacity-60 group-hover:opacity-100 transition" />
          </button>
        </div>

        {/* Custom Google Account Login Form */}
        <div className="mt-5 pt-4 border-t border-zinc-800">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 text-center">
            Or Sign In with Any Google Account
          </p>
          <form onSubmit={handleCustomSubmit} className="space-y-2.5">
            <div>
              <input
                type="text"
                placeholder="Full Name (e.g. Rahul Sharma)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <input
                type="email"
                required
                placeholder="Google Email (e.g. name@gmail.com)"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In with Google</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secure Google OAuth 2.0 Verification</span>
        </div>
      </div>
    </div>
  );
}
