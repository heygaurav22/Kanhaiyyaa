'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { signInWithGoogle } from '../lib/firebase';
import { X, Sparkles } from 'lucide-react';

export const GoogleOneTap: React.FC = () => {
  const { user, login } = useAuth();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only show if user is NOT logged in and hasn't dismissed it in this session
    if (user) {
      setVisible(false);
      return;
    }

    const dismissed = sessionStorage.getItem('google_onetap_dismissed');
    if (dismissed) return;

    // Slight delay so the page settles naturally, just like modern Google One Tap
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, [user]);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem('google_onetap_dismissed', 'true');
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await signInWithGoogle();
      login(res.token, res.user);
      setVisible(false);
    } catch (err: any) {
      console.error('Google One Tap error:', err);
      // If user closed the popup, don't show an aggressive error, just keep state clean
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!visible || user) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-2xl p-4 sm:p-5 w-[320px] sm:w-[350px] relative transition-all">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-900 transition-colors p-1 rounded-full hover:bg-neutral-100"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
          <div>
            <div className="text-xs font-semibold tracking-wide text-neutral-900">
              Sign in to KANHAIYYA
            </div>
            <div className="text-[11px] text-neutral-500">
              Personalized luxury poshak experience
            </div>
          </div>
        </div>

        <p className="text-[11px] text-neutral-600 mb-4 leading-relaxed">
          Access your sacred wishlist, real-time dispatch tracking, and express 1-click checkout.
        </p>

        {error && (
          <div className="mb-3 text-[11px] text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow hover:shadow-md disabled:opacity-60"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#ffffff"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-400">
          <span>Protected by Google</span>
          <button
            onClick={handleDismiss}
            className="hover:text-neutral-600 transition-colors underline"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};
