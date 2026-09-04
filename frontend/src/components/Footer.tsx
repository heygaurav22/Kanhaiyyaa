'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <footer className="bg-white text-[#1A1A1A] border-t border-[#E5E5E5] pt-12 pb-8 font-sans">
      {/* Newsletter / Sign Up — Burberry style */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-md">
          <h3 className="text-[15px] font-medium text-[#1A1A1A] mb-6">Sign Up</h3>
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-b border-[#1A1A1A] pb-3 text-[14px] text-[#1A1A1A] placeholder-[#767676] outline-none focus:border-[#1A1A1A] pr-8"
            />
            <button
              type="submit"
              className="absolute right-0 bottom-3 text-[#1A1A1A] hover:opacity-60 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Footer Links — Burberry expandable style */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E5E5E5] pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 lg:gap-12">
          {/* Find a Store */}
          <div className="border-b border-[#E5E5E5] lg:border-0 py-3 lg:py-0">
            <Link href="/" className="text-[13px] text-[#1A1A1A] font-medium hover:underline underline-offset-4">
              Find a Store
            </Link>
          </div>

          {/* Collections — Collapsible on mobile */}
          <div className="border-b border-[#E5E5E5] lg:border-0">
            <button
              onClick={() => toggleSection('collections')}
              className="w-full flex items-center justify-between py-3 lg:py-0 text-[13px] text-[#1A1A1A] font-medium lg:cursor-default lg:mb-4"
            >
              <span>Collections</span>
              <ChevronDown size={16} className={`lg:hidden transition-transform ${openSections.collections ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-2.5 pb-4 lg:pb-0 ${openSections.collections ? 'block' : 'hidden lg:block'}`}>
              <li><Link href="/category/kanha" className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors">Kanha Poshak</Link></li>
              <li><Link href="/category/radha" className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors">Radha Dresses</Link></li>
              <li><Link href="/category/laddu-gopal" className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors">Laddu Gopal</Link></li>
              <li><Link href="/category/accessories" className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors">Accessories</Link></li>
              <li><Link href="/category/collections" className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors">Festival Collections</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="border-b border-[#E5E5E5] lg:border-0">
            <button
              onClick={() => toggleSection('support')}
              className="w-full flex items-center justify-between py-3 lg:py-0 text-[13px] text-[#1A1A1A] font-medium lg:cursor-default lg:mb-4"
            >
              <span>Customer Support</span>
              <ChevronDown size={16} className={`lg:hidden transition-transform ${openSections.support ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-2.5 pb-4 lg:pb-0 ${openSections.support ? 'block' : 'hidden lg:block'}`}>
              <li><Link href="/orders" className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors">Track Your Order</Link></li>
              <li><Link href="/cart" className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors">Shopping Bag</Link></li>
              <li><span className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors cursor-pointer">Size Guide</span></li>
              <li><span className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors cursor-pointer">Shipping & COD Info</span></li>
              <li><span className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors cursor-pointer">Care Instructions</span></li>
            </ul>
          </div>

          {/* About */}
          <div className="border-b border-[#E5E5E5] lg:border-0">
            <button
              onClick={() => toggleSection('about')}
              className="w-full flex items-center justify-between py-3 lg:py-0 text-[13px] text-[#1A1A1A] font-medium lg:cursor-default lg:mb-4"
            >
              <span>About Kanhaiyya</span>
              <ChevronDown size={16} className={`lg:hidden transition-transform ${openSections.about ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-2.5 pb-4 lg:pb-0 ${openSections.about ? 'block' : 'hidden lg:block'}`}>
              <li><span className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors cursor-pointer">Our Story</span></li>
              <li><span className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors cursor-pointer">Craftsmanship</span></li>
              <li><span className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors cursor-pointer">Vrindavan Heritage</span></li>
              <li><span className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors cursor-pointer">Sustainability</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="border-b border-[#E5E5E5] lg:border-0">
            <button
              onClick={() => toggleSection('legal')}
              className="w-full flex items-center justify-between py-3 lg:py-0 text-[13px] text-[#1A1A1A] font-medium lg:cursor-default lg:mb-4"
            >
              <span>Legal & Cookies</span>
              <ChevronDown size={16} className={`lg:hidden transition-transform ${openSections.legal ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-2.5 pb-4 lg:pb-0 ${openSections.legal ? 'block' : 'hidden lg:block'}`}>
              <li><span className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors cursor-pointer">Returns Policy</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-[#E5E5E5]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* Social Icons — Bottom Left */}
          <div className="flex items-center gap-5">
            {/* X (Twitter) */}
            <a
              href="https://x.com/kanhaiyyain"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X"
              className="text-[#1A1A1A] hover:opacity-50 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/kanhaiyya.in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="text-[#1A1A1A] hover:opacity-50 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://www.youtube.com/@kanhaiyyain"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch us on YouTube"
              className="text-[#1A1A1A] hover:opacity-50 transition-opacity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

          {/* Language / Shipping */}
          <div className="flex items-center gap-4 text-[12px] text-[#767676]">
            <span>Language <span className="text-[#1A1A1A] underline underline-offset-2 cursor-pointer">English</span></span>
            <span>Shipping to <span className="text-[#1A1A1A] underline underline-offset-2 cursor-pointer">India</span></span>
          </div>
        </div>

        <p className="text-[11px] text-[#A0A0A0] mt-6">
          © {new Date().getFullYear()} Kanhaiyya. Made with devotion in India.
        </p>
      </div>
    </footer>
  );
};
