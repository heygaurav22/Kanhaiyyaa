'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';
import { fetchApi } from '../../../lib/api';
import { signInWithGoogle } from '../../../lib/firebase';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      const res = await signInWithGoogle();
      login(res.token, res.user);
      router.push('/');
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Sign-In could not be completed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetchApi<{ token: string; user: any }>('/auth/signup', {
        method: 'POST',
        body: { name, email, password },
      });

      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        router.push('/');
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white border border-[#E5E5E5] p-8 sm:p-10 rounded-sm shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-medium block">
            Welcome to KANHAIYYA
          </span>
          <h1 className="font-serif text-3xl font-normal tracking-wide uppercase text-neutral-900">
            Create Account
          </h1>
          <p className="text-xs text-neutral-500 font-light">
            Enjoy tailored recommendations, saved addresses, and express checkout.
          </p>
        </div>

        {error && (
          <div className="bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs p-3 rounded-sm">
            {error}
          </div>
        )}

        {/* 1. Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-medium py-3.5 px-5 border border-neutral-300 rounded-sm transition-all shadow-sm hover:border-neutral-400 disabled:opacity-60"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span className="tracking-wider uppercase text-[11px] font-semibold">Sign up with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-neutral-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-neutral-400 uppercase tracking-widest absolute">
            or
          </span>
        </div>

        {/* 2. Email / Password form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold uppercase tracking-wider text-neutral-700 text-[11px] block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gaurav Sharma"
                required
                className="w-full bg-white border border-neutral-300 p-3.5 pl-10 text-xs text-neutral-900 rounded-sm focus:border-black outline-none transition-colors"
              />
              <User size={16} className="absolute left-3.5 top-4 text-neutral-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold uppercase tracking-wider text-neutral-700 text-[11px] block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-white border border-neutral-300 p-3.5 pl-10 text-xs text-neutral-900 rounded-sm focus:border-black outline-none transition-colors"
              />
              <Mail size={16} className="absolute left-3.5 top-4 text-neutral-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold uppercase tracking-wider text-neutral-700 text-[11px] block">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="w-full bg-white border border-neutral-300 p-3.5 pl-10 text-xs text-neutral-900 rounded-sm focus:border-black outline-none transition-colors"
              />
              <Lock size={16} className="absolute left-3.5 top-4 text-neutral-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold uppercase tracking-wider text-neutral-700 text-[11px] block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full bg-white border border-neutral-300 p-3.5 pl-10 text-xs text-neutral-900 rounded-sm focus:border-black outline-none transition-colors"
              />
              <Lock size={16} className="absolute left-3.5 top-4 text-neutral-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black hover:bg-neutral-800 text-white font-medium text-xs uppercase tracking-[0.25em] py-4 px-6 flex items-center justify-center space-x-2 transition-colors mt-6 shadow-sm"
          >
            <span>{submitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-neutral-200 text-xs text-neutral-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-black font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
