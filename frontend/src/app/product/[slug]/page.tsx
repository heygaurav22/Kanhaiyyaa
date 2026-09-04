'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check, ChevronRight } from 'lucide-react';
import { Product, Variant } from '../../../types';
import { fetchApi } from '../../../lib/api';
import { useCart } from '../../../lib/cart-context';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('1');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [adding, setAdding] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'included' | 'care'>('details');

  useEffect(() => {
    fetchApi<Product>(`/products/${slug}`).then((res) => {
      if (res.success && res.data) {
        setProduct(res.data);
        if (res.data.variants && res.data.variants.length > 0) {
          const firstVar = res.data.variants[0];
          if (firstVar.size) setSelectedSize(firstVar.size);
          if (firstVar.color) setSelectedColor(firstVar.color);
        }
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-[#EFECE6] animate-pulse rounded-sm" />
          <div className="space-y-6">
            <div className="h-8 bg-[#EFECE6] animate-pulse w-3/4" />
            <div className="h-6 bg-[#EFECE6] animate-pulse w-1/4" />
            <div className="h-32 bg-[#EFECE6] animate-pulse w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold">Product Not Found</h2>
        <p className="text-xs text-gray-500">The poshak you are looking for does not exist or has been removed.</p>
        <Link href="/" className="inline-block bg-[#1A1A1A] text-white text-xs uppercase px-6 py-3 tracking-widest">
          Return to Home
        </Link>
      </div>
    );
  }

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  // Find matching variant ID based on selected size & color
  const matchedVariant = product.variants?.find(
    (v) => (v.size ? v.size === selectedSize : true) && (v.color ? v.color === selectedColor : true)
  );

  const handleAddToCart = async () => {
    setAdding(true);
    const success = await addToCart(product.id, matchedVariant?.id, quantity);
    setAdding(false);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  const images = product.images?.length > 0 ? product.images : ['/products/poshak_01.jpg', '/products/poshak_02.jpg'];

  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  // Extract unique sizes and colors from variants
  const availableSizes = Array.from(new Set(product.variants?.map((v) => v.size).filter(Boolean)));
  const availableColors = Array.from(
    new Set(
      product.variants
        ?.map((v) => JSON.stringify({ color: v.color, hex: v.colorHex }))
        .filter(Boolean)
    )
  ).map((str) => JSON.parse(str as string));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#8C8C8C] mb-8 font-light">
        <Link href="/" className="hover:text-[#1A1A1A]">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href={`/category/${product.category?.slug || 'kanha'}`} className="hover:text-[#1A1A1A]">
          {product.category?.name || 'Category'}
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#1A1A1A] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF8F5] border border-[#E5E0D8] rounded-sm">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent && discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#6B1D2F] text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1">
                SAVE {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnail Rail */}
          {images.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 aspect-[3/4] flex-shrink-0 border-2 rounded-sm overflow-hidden transition-all ${
                    selectedImage === idx ? 'border-[#C8A951]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Detail Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div>
            {/* Category tag */}
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#C8A951] font-semibold block mb-1">
              {product.category?.name}
            </span>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight leading-snug uppercase">
              {product.name}
            </h1>

            {/* Rating Stars & Reviews */}
            <div className="flex items-center space-x-3 mt-3">
              <div className="flex items-center text-[#D97706]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'fill-[#D97706]' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#1A1A1A]">{product.rating}</span>
              <span className="text-xs text-[#8C8C8C]">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price Display */}
            <div className="mt-6 flex items-baseline space-x-3 border-y border-[#E5E0D8] py-4">
              <span className="font-serif text-3xl font-bold text-[#1A1A1A]">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-base text-[#8C8C8C] line-through font-light">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
              <span className="text-xs text-[#2E7D32] font-semibold uppercase tracking-wider">
                Inclusive of all taxes
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed font-light mt-4">
              {product.description}
            </p>

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#1A1A1A]">
                    Select Idol Size: <span className="text-[#C8A951]">Size {selectedSize}</span>
                  </span>
                  <span className="text-[#8C8C8C] underline text-[11px] cursor-pointer hover:text-[#1A1A1A]">
                    Size Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz as string}
                      onClick={() => setSelectedSize(sz as string)}
                      className={`w-12 h-12 flex items-center justify-center font-serif text-sm font-bold rounded-sm border transition-all ${
                        selectedSize === sz
                          ? 'bg-[#1A1A1A] text-[#E5D5B8] border-[#1A1A1A]'
                          : 'bg-white text-[#1A1A1A] border-[#E5E0D8] hover:border-[#C8A951]'
                      }`}
                    >
                      {sz as string}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Swatch Selector */}
            {availableColors.length > 0 && (
              <div className="mt-6 space-y-3">
                <span className="font-semibold uppercase tracking-wider text-xs text-[#1A1A1A] block">
                  Select Color: <span className="text-[#C8A951]">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => setSelectedColor(c.color)}
                      title={c.color}
                      className={`w-8 h-8 rounded-full border-2 p-0.5 transition-all ${
                        selectedColor === c.color ? 'border-[#C8A951] scale-110' : 'border-transparent'
                      }`}
                    >
                      <span
                        className="w-full h-full rounded-full block border border-gray-300 shadow-inner"
                        style={{ backgroundColor: c.hex || '#ffffff' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add To Bag */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center border border-[#E5E0D8] rounded-sm bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-[#1A1A1A] hover:bg-[#FAF8F5] font-bold text-sm"
                >
                  −
                </button>
                <span className="px-4 py-3 font-serif font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-[#1A1A1A] hover:bg-[#FAF8F5] font-bold text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 w-full bg-[#1A1A1A] hover:bg-[#C8A951] text-white font-semibold text-xs uppercase tracking-[0.25em] py-4 px-8 flex items-center justify-center space-x-3 transition-colors shadow-lg"
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>ADDED TO SHOPPING BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>{adding ? 'ADDING TO BAG...' : 'ADD TO SHOPPING BAG'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Cash on Delivery Notice */}
            <div className="mt-6 bg-[#FAF3E8] border border-[#E8DCC4] p-4 rounded-sm flex items-start space-x-3">
              <ShieldCheck size={20} className="text-[#C8A951] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#4A4A4A] leading-relaxed">
                <span className="font-bold text-[#1A1A1A] block">Cash on Delivery Available</span>
                Pay at your doorstep across India. Free shipping on all orders above ₹999.
              </div>
            </div>
          </div>

          {/* Tabbed Product Details Section */}
          <div className="mt-10 border-t border-[#E5E0D8] pt-8">
            <div className="flex border-b border-[#E5E0D8] space-x-6 text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 border-b-2 transition-all ${
                  activeTab === 'details' ? 'border-[#C8A951] text-[#C8A951]' : 'border-transparent text-[#8C8C8C]'
                }`}
              >
                About Poshak
              </button>
              <button
                onClick={() => setActiveTab('fabric')}
                className={`pb-3 border-b-2 transition-all ${
                  activeTab === 'fabric' ? 'border-[#C8A951] text-[#C8A951]' : 'border-transparent text-[#8C8C8C]'
                }`}
              >
                Fabric & Craft
              </button>
              <button
                onClick={() => setActiveTab('included')}
                className={`pb-3 border-b-2 transition-all ${
                  activeTab === 'included' ? 'border-[#C8A951] text-[#C8A951]' : 'border-transparent text-[#8C8C8C]'
                }`}
              >
                What's Included
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-3 border-b-2 transition-all ${
                  activeTab === 'care' ? 'border-[#C8A951] text-[#C8A951]' : 'border-transparent text-[#8C8C8C]'
                }`}
              >
                Care Info
              </button>
            </div>

            <div className="py-4 text-xs text-[#6E6E6E] font-light leading-relaxed">
              {activeTab === 'details' && <p>{product.details || product.description}</p>}
              {activeTab === 'fabric' && <p>{product.fabric || 'Pure Banarasi Silk and authentic Zari threadwork.'}</p>}
              {activeTab === 'included' && <p>{product.included || 'Poshak dress and waist belt.'}</p>}
              {activeTab === 'care' && <p>{product.careInfo || 'Dry clean only. Store in a cool dry place.'}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
