'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../lib/cart-context';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const formatPrice = (paise: number) => {
    return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    const success = await addToCart(product.id);
    setAdding(false);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const mainImage = product.images?.[0] || '/products/poshak_01.jpg';
  const hoverImage = product.images?.[1] || '/products/poshak_02.jpg';

  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div className="group relative flex flex-col">
      {/* Image Container — Burberry clean style */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5F5]">
        <img
          src={mainImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover Secondary Image */}
        {product.images?.[1] && (
          <img
            src={hoverImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
            loading="lazy"
          />
        )}

        {/* Badges — minimal Burberry style */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="text-[#1A1A1A] text-[11px] font-medium">
              New In
            </span>
          )}
          {product.featured && !product.isNew && (
            <span className="text-[#1A1A1A] text-[11px] font-medium">
              Runway
            </span>
          )}
        </div>

        {/* Quick Add Button — slides up on hover */}
        <button
          onClick={handleQuickAdd}
          disabled={adding}
          className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm text-[#1A1A1A] text-[12px] font-medium tracking-wide py-3 px-4 flex items-center justify-center space-x-2 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 border-t border-[#E5E5E5]"
        >
          {added ? (
            <>
              <Check size={14} />
              <span>Added to Bag</span>
            </>
          ) : (
            <>
              <ShoppingBag size={14} strokeWidth={1.5} />
              <span>{adding ? 'Adding...' : 'Add to Bag'}</span>
            </>
          )}
        </button>
      </Link>

      {/* Product Info — Burberry minimal: name left, price right */}
      <div className="pt-3 pb-1 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-[13px] text-[#1A1A1A] font-normal leading-snug line-clamp-2 hover:underline underline-offset-2">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="flex flex-col items-end flex-shrink-0">
          <span className="text-[13px] text-[#1A1A1A] font-normal whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-[11px] text-[#767676] line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>

      {/* Color swatches preview — Burberry style */}
      {product.variants && product.variants.length > 0 && (
        <div className="flex items-center gap-1.5 mt-1">
          {product.variants
            .filter((v, i, arr) => arr.findIndex(a => a.colorHex === v.colorHex) === i)
            .slice(0, 4)
            .map((variant, idx) => (
              <span
                key={idx}
                className="w-3 h-3 rounded-full border border-[#D4D4D4]"
                style={{ backgroundColor: variant.colorHex || '#1A1A1A' }}
                title={variant.color || ''}
              />
            ))}
          {product.variants.filter((v, i, arr) => arr.findIndex(a => a.colorHex === v.colorHex) === i).length > 4 && (
            <span className="text-[10px] text-[#767676] ml-0.5">
              +{product.variants.filter((v, i, arr) => arr.findIndex(a => a.colorHex === v.colorHex) === i).length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
