'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '../types';

interface MegaMenuProps {
  categories: Category[];
  activeCategory: string | null;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ categories, activeCategory, onClose }) => {
  if (!activeCategory) return null;

  const currentCat = categories.find(
    (c) => c.slug === activeCategory || c.name.toLowerCase() === activeCategory.toLowerCase()
  );

  if (!currentCat || !currentCat.children || currentCat.children.length === 0) {
    return null;
  }

  const children = currentCat.children;

  return (
    <div
      className="absolute top-full left-0 w-full bg-white border-b border-[#E5E5E5] shadow-sm z-50"
      onMouseLeave={onClose}
    >
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Subcategories Columns */}
          <div className="col-span-9 grid grid-cols-3 gap-10">
            <div>
              <h3 className="text-[13px] font-semibold text-[#1A1A1A] mb-5 pb-3 border-b border-[#E5E5E5]">
                {currentCat.name} Collections
              </h3>
              <ul className="space-y-3">
                {children.slice(0, 5).map((sub) => (
                  <li key={sub.id}>
                    <Link
                      href={`/category/${sub.slug}`}
                      onClick={onClose}
                      className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors duration-200 block"
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {children.length > 5 && (
              <div>
                <h3 className="text-[13px] font-semibold text-[#1A1A1A] mb-5 pb-3 border-b border-[#E5E5E5]">
                  Featured Styles
                </h3>
                <ul className="space-y-3">
                  {children.slice(5, 10).map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/category/${sub.slug}`}
                        onClick={onClose}
                        className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors duration-200 block"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-[13px] font-semibold text-[#1A1A1A] mb-5 pb-3 border-b border-[#E5E5E5]">
                Explore
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`/category/${currentCat.slug}`}
                    onClick={onClose}
                    className="text-[13px] text-[#1A1A1A] hover:underline underline-offset-4 block font-medium"
                  >
                    View All {currentCat.name} →
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/category/${currentCat.slug}?sort=rating`}
                    onClick={onClose}
                    className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors block"
                  >
                    Top Rated & Bestsellers
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/category/${currentCat.slug}?isNew=true`}
                    onClick={onClose}
                    className="text-[13px] text-[#767676] hover:text-[#1A1A1A] transition-colors block"
                  >
                    New Season Arrivals
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Featured Editorial Card */}
          <div className="col-span-3 pl-6 border-l border-[#E5E5E5]">
            <div className="relative overflow-hidden bg-[#F5F5F5] aspect-[4/5] group rounded-sm shadow-sm">
              {(() => {
                const categoryImages: Record<string, string> = {
                  kanha: '/products/kanha.jpg',
                  radha: '/products/radha2.jpg',
                  'laddu-gopal': '/products/paddu.jpg',
                  accessories: '/products/paddu3.jpg',
                  collections: '/products/kanha_sections.jpg',
                  gifts: '/products/holi_padu_section.jpg',
                  shringar: '/products/paddu2.jpg',
                };
                const imgSrc = categoryImages[currentCat.slug] || categoryImages[currentCat.name.toLowerCase()] || '/products/kanha.jpg';
                return (
                  <img
                    src={imgSrc}
                    alt={currentCat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h4 className="text-white text-[15px] font-medium mb-2 tracking-wide">
                  {currentCat.name}
                </h4>
                <Link
                  href={`/category/${currentCat.slug}`}
                  onClick={onClose}
                  className="text-white text-[12px] underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  Discover Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
