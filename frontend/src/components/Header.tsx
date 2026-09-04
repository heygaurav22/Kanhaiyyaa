'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User as UserIcon, Menu, X, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useCart } from '../lib/cart-context';
import { MegaMenu } from './MegaMenu';
import { Category } from '../types';
import { fetchApi } from '../lib/api';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState<boolean>(false);

  useEffect(() => {
    fetchApi<Category[]>('/categories').then((res) => {
      if (res.success && res.data) {
        setCategories(res.data);
      }
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/category/all?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className={`sticky top-0 z-40 bg-white transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
      {/* Top Announcement Bar — Burberry style with dismiss X */}
      {!announcementDismissed && (
        <div className="bg-black text-white py-2 px-4 sm:px-8 text-center text-[11px] tracking-normal font-normal relative flex items-center justify-between">
          <div className="flex-1 text-center">
            <span>
              Stay updated on our new collections, campaigns and stories{' '}
              <Link href="/auth/signup" className="underline underline-offset-4 hover:opacity-80 font-medium ml-1">
                Sign Up
              </Link>
            </span>
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="text-neutral-400 hover:text-white transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="border-b border-[#E5E5E5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-18">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-neutral-900 hover:opacity-60 p-2 transition-opacity"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Authentic Red KANHAIYYA Brand Wordmark */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 group py-1" aria-label="KANHAIYYA Home">
                <img
                  src="/kanhaiyya-logo-transparent.png"
                  alt="KANHAIYYA"
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_1px_2px_rgba(224,6,19,0.15)]"
                />
              </Link>
            </div>


            {/* Desktop Navigation Links — Burberry style */}
            <nav className="hidden lg:flex items-center space-x-8 h-full ml-8">
              {[
                { slug: 'kanha', label: 'Kanha' },
                { slug: 'radha', label: 'Radha' },
                { slug: 'laddu-gopal', label: 'Laddu Gopal' },
                { slug: 'accessories', label: 'Accessories' },
                { slug: 'collections', label: 'Collections' },
                { slug: 'gifts', label: 'Gifts' },
                { slug: 'shringar', label: 'Shringar' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onMouseEnter={() => setActiveCategory(cat.slug)}
                  className={`h-18 flex items-center text-[13px] font-normal transition-colors relative tracking-wide ${
                    activeCategory === cat.slug ? 'text-neutral-950 font-medium' : 'text-neutral-900 hover:text-neutral-500'
                  }`}
                >
                  {cat.label}
                  {/* Active underline indicator */}
                  {activeCategory === cat.slug && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-950" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-6">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-neutral-900 hover:opacity-60 transition-opacity p-1"
                aria-label="Search catalog"
              >
                <Search size={21} strokeWidth={1.4} />
              </button>

              {/* User Account / Auth */}
              {user ? (
                <div className="relative group">
                  <button
                    className="flex items-center gap-2 text-neutral-900 hover:opacity-75 transition-opacity p-1"
                    aria-label="Account menu"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="w-7 h-7 rounded-full object-cover border border-neutral-300"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-neutral-900 text-white text-[11px] font-serif flex items-center justify-center">
                        {(user.name || user.email || 'K')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:inline text-xs font-normal text-neutral-800 tracking-wider uppercase">
                      {user.name ? user.name.split(' ')[0] : 'Account'}
                    </span>
                  </button>

                  <div className="absolute right-0 top-full hidden group-hover:block bg-white shadow-xl border border-neutral-200 py-2 w-56 z-50 rounded-sm">
                    <div className="px-4 py-2.5 border-b border-neutral-100 text-xs text-neutral-500">
                      Signed in as <span className="font-semibold text-neutral-900 block truncate">{user.name || user.email}</span>
                    </div>
                    <Link
                      href="/orders"
                      className="block px-4 py-2.5 text-xs text-neutral-800 hover:bg-neutral-50 transition-colors"
                    >
                      My Orders & Shipments
                    </Link>
                    <Link
                      href="/admin"
                      className="block px-4 py-2.5 text-xs text-neutral-800 hover:bg-neutral-50 flex items-center justify-between transition-colors border-t border-neutral-100 font-medium"
                    >
                      <span>Admin Management</span>
                      <ShieldCheck size={14} className="text-neutral-600" />
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 text-xs text-neutral-800 hover:bg-neutral-50 flex items-center space-x-2 transition-colors border-t border-neutral-100"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-neutral-900 hover:opacity-60 transition-opacity p-1"
                  aria-label="Account login"
                >
                  <UserIcon size={21} strokeWidth={1.4} />
                </Link>
              )}

              {/* Cart Bag Icon */}
              <Link
                href="/cart"
                className="text-neutral-900 hover:opacity-60 transition-opacity p-1 relative"
                aria-label="Shopping Bag"
              >
                <ShoppingBag size={21} strokeWidth={1.4} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-neutral-900 text-white font-medium text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <MegaMenu
        categories={categories}
        activeCategory={activeCategory}
        onClose={() => setActiveCategory(null)}
      />

      {/* Search Input Bar */}
      {searchOpen && (
        <div className="bg-white border-b border-[#E5E5E5] py-5 px-4 sm:px-8 animate-in fade-in duration-200">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-4">
            <Search size={20} className="text-neutral-400" strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search poshak, lehengas, mukut, accessories..."
              autoFocus
              className="flex-1 bg-transparent border-none text-base text-neutral-900 placeholder-neutral-400 outline-none font-light"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-900 font-medium"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[105px] bg-white z-50 overflow-y-auto px-6 py-6 border-t border-neutral-200 animate-in slide-in-from-left duration-200">
          <nav className="space-y-4">
            {[
              { slug: 'kanha', label: 'Kanha Devotional Dresses' },
              { slug: 'radha', label: 'Radha Rani Lehengas' },
              { slug: 'laddu-gopal', label: 'Laddu Gopal Poshaks' },
              { slug: 'accessories', label: 'Mukut & Accessories' },
              { slug: 'collections', label: 'Festival Collections' },
              { slug: 'gifts', label: 'Devotional Gifts' },
              { slug: 'shringar', label: 'Sacred Shringar' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-medium text-neutral-900 border-b border-neutral-100 pb-3"
              >
                <span>{cat.label}</span>
                <ChevronRight size={16} className="text-neutral-400" />
              </Link>
            ))}

            <div className="pt-6 space-y-3">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-widest font-semibold text-neutral-600"
              >
                Admin Panel
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block text-xs uppercase tracking-widest font-semibold text-red-600"
                >
                  Sign Out ({user.email})
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-widest font-semibold text-neutral-900"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
