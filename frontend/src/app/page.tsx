'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Product } from '../types';
import { fetchApi } from '../lib/api';
import { ProductCard } from '../components/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [kanhaProducts, setKanhaProducts] = useState<Product[]>([]);
  const [radhaProducts, setRadhaProducts] = useState<Product[]>([]);
  const [ladduGopalProducts, setLadduGopalProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'kanha' | 'radha' | 'laddu-gopal'>('all');
  const [loading, setLoading] = useState<boolean>(true);

  // Carousel slide states for editorial split sections
  const [wrapUpIndex, setWrapUpIndex] = useState(0);
  const [foreverIndex, setForeverIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [allRes, featRes, kanhaRes, radhaRes, lgRes] = await Promise.all([
          fetchApi<Product[]>('/products?limit=16'),
          fetchApi<Product[]>('/products?featured=true&limit=8'),
          fetchApi<Product[]>('/products?category=kanha&limit=8'),
          fetchApi<Product[]>('/products?category=radha&limit=8'),
          fetchApi<Product[]>('/products?category=laddu-gopal&limit=8'),
        ]);

        if (allRes.success && allRes.data) setAllProducts(allRes.data);
        if (featRes.success && featRes.data) setFeaturedProducts(featRes.data);
        if (kanhaRes.success && kanhaRes.data) setKanhaProducts(kanhaRes.data);
        if (radhaRes.success && radhaRes.data) setRadhaProducts(radhaRes.data);
        if (lgRes.success && lgRes.data) setLadduGopalProducts(lgRes.data);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 360;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getFilteredRailProducts = () => {
    switch (activeTab) {
      case 'kanha':
        return kanhaProducts.length > 0 ? kanhaProducts : allProducts;
      case 'radha':
        return radhaProducts.length > 0 ? radhaProducts : allProducts;
      case 'laddu-gopal':
        return ladduGopalProducts.length > 0 ? ladduGopalProducts : allProducts;
      case 'all':
      default:
        return allProducts.length > 0 ? allProducts : featuredProducts;
    }
  };

  const railProducts = getFilteredRailProducts();

  // Curated items for the interactive split carousels
  const wrapUpShowcase = [
    {
      image: '/products/poshak_01.jpg',
      title: 'Vrindavan Royal Poshak',
      price: '₹2,499.00',
      category: 'Kanha',
      slug: 'vrindavan-royal-poshak',
    },
    {
      image: '/products/poshak_05.jpg',
      title: 'Shyam Floral Poshak',
      price: '₹1,899.00',
      category: 'Kanha',
      slug: 'shyam-floral-poshak',
    },
    {
      image: '/products/poshak_08.jpg',
      title: 'Madhav Silk Poshak',
      price: '₹3,499.00',
      category: 'Kanha',
      slug: 'madhav-silk-poshak',
    },
    {
      image: '/products/poshak_13.jpg',
      title: 'Vrindavan Bridal Lehenga',
      price: '₹6,999.00',
      category: 'Radha',
      slug: 'vrindavan-bridal-lehenga',
    },
    {
      image: '/products/poshak_12.jpg',
      title: 'Peacock Mukut Special',
      price: '₹1,999.00',
      category: 'Accessories',
      slug: 'peacock-mukut-special',
    },
  ];

  const foreverShowcase = [
    {
      image: '/products/poshak_03.jpg',
      title: 'Braj Festive Poshak',
      price: '₹2,799.00',
      category: 'Kanha',
      slug: 'braj-festive-poshak',
    },
    {
      image: '/products/poshak_15.jpg',
      title: 'Kishori Floral Dress',
      price: '₹2,899.00',
      category: 'Radha',
      slug: 'kishori-floral-dress',
    },
    {
      image: '/products/poshak_16.jpg',
      title: 'Radha Rani Silk Saree Dress',
      price: '₹3,799.00',
      category: 'Radha',
      slug: 'radha-rani-silk-saree-dress',
    },
    {
      image: '/products/poshak_10.jpg',
      title: 'Laddu Gopal Designer Poshak',
      price: '₹1,999.00',
      category: 'Laddu Gopal',
      slug: 'laddu-gopal-designer-poshak',
    },
    {
      image: '/products/poshak_06.jpg',
      title: 'Mohan Designer Poshak',
      price: '₹4,499.00',
      category: 'Kanha',
      slug: 'mohan-designer-poshak',
    },
  ];

  return (
    <div className="bg-white text-[#1A1A1A]">
      {/* 1. HERO SECTION (Full landscape autoplay video without sound, clean luxury overlay) */}
      <section className="relative h-[92vh] min-h-[640px] w-full bg-black overflow-hidden flex items-end">
        {/* Full bleed landscape video background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130vw] h-[130vh] min-w-[177.77vh] min-h-[56.25vw] pointer-events-none">
            <iframe
              className="w-full h-full object-cover scale-[1.3] opacity-85"
              src="https://www.youtube-nocookie.com/embed/7z4NhsiuqBQ?autoplay=1&mute=1&loop=1&playlist=7z4NhsiuqBQ&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1"
              title="KANHAIYYA Hero Landscape Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          {/* Subtle editorial gradients for luxury depth and text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40 pointer-events-none" />
        </div>

        {/* Burberry-style minimalist bottom typography */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 sm:px-12 pb-14 text-white flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/70 font-medium block mb-2">
              Autumn / Winter Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide text-white mb-4">
              New-season Styles
            </h1>
            <div className="flex items-center space-x-6 text-sm font-normal">
              <Link
                href="/category/kanha"
                className="text-white hover:underline underline-offset-4 decoration-1 transition-all tracking-wide"
              >
                Shop Kanha
              </Link>
              <Link
                href="/category/radha"
                className="text-white hover:underline underline-offset-4 decoration-1 transition-all tracking-wide"
              >
                Shop Radha
              </Link>
              <Link
                href="/category/laddu-gopal"
                className="text-white hover:underline underline-offset-4 decoration-1 transition-all tracking-wide"
              >
                Shop Laddu Gopal
              </Link>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Vrindavan Atelier • Live Craftsmanship</span>
          </div>
        </div>
      </section>

      {/* 2. "WHAT'S NEW" HORIZONTAL CAROUSEL RAIL (Exact Burberry style) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 border-b border-[#E5E5E5]">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-neutral-900">
            What’s New
          </h2>

          <div className="flex items-center space-x-6 text-xs sm:text-sm tracking-wide">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-1 transition-colors relative ${
                activeTab === 'all'
                  ? 'text-neutral-900 font-medium border-b border-blue-600 text-blue-700'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('kanha')}
              className={`pb-1 transition-colors relative ${
                activeTab === 'kanha'
                  ? 'text-neutral-900 font-medium border-b border-blue-600 text-blue-700'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Kanha
            </button>
            <button
              onClick={() => setActiveTab('radha')}
              className={`pb-1 transition-colors relative ${
                activeTab === 'radha'
                  ? 'text-neutral-900 font-medium border-b border-blue-600 text-blue-700'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Radha
            </button>
            <button
              onClick={() => setActiveTab('laddu-gopal')}
              className={`pb-1 transition-colors relative ${
                activeTab === 'laddu-gopal'
                  ? 'text-neutral-900 font-medium border-b border-blue-600 text-blue-700'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Laddu Gopal
            </button>
          </div>
        </div>

        {/* Carousel Container with Left/Right Nav Arrows */}
        <div className="relative group">
          {/* Navigation Arrows */}
          <button
            onClick={() => scrollCarousel('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-20 w-10 h-10 bg-white/95 border border-neutral-200 shadow-md rounded-full flex items-center justify-center text-neutral-800 hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => scrollCarousel('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-20 w-10 h-10 bg-white/95 border border-neutral-200 shadow-md rounded-full flex items-center justify-center text-neutral-800 hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>

          {/* Product Items Rail */}
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="min-w-[260px] sm:min-w-[320px] aspect-[3/4] bg-neutral-100 animate-pulse" />
                ))
              : railProducts.map((product) => (
                  <div key={product.id} className="min-w-[260px] sm:min-w-[310px] flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* 3. SPLIT SECTION A: Interactive Product Showcase (Left) + Editorial Campaign (Right) */}
      <section className="border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Product Showcase with dash indicators and copy */}
          <div className="p-8 sm:p-14 lg:p-16 flex flex-col justify-between bg-white">
            <div className="relative aspect-[4/5] max-w-md mx-auto w-full bg-[#F7F7F7] overflow-hidden">
              <img
                src={wrapUpShowcase[wrapUpIndex].image}
                alt={wrapUpShowcase[wrapUpIndex].title}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute top-4 left-4 text-xs font-normal text-neutral-800 bg-white/90 px-2 py-1">
                {wrapUpShowcase[wrapUpIndex].category}
              </div>
            </div>

            {/* Dash Pagination Indicators */}
            <div className="flex items-center justify-center gap-2 mt-8 mb-6">
              {wrapUpShowcase.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setWrapUpIndex(i)}
                  className={`h-0.5 transition-all ${
                    wrapUpIndex === i ? 'w-6 bg-black' : 'w-4 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Editorial Copy */}
            <div className="text-center max-w-lg mx-auto space-y-3">
              <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-neutral-900">
                The Wrap-up
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-light">
                Devotional season is upon us. From traditional pure Banarasi silk poshak sets to statement angavastras, our signature devotional silhouettes answer every sacred celebration need. Add an auspicious, stylish accent to your Thakurji darshan.
              </p>
              <div className="pt-2 flex items-center justify-center space-x-6 text-xs tracking-wide">
                <Link
                  href="/category/kanha"
                  className="text-blue-700 hover:underline underline-offset-4 decoration-1 font-medium"
                >
                  Kanha
                </Link>
                <Link
                  href="/category/radha"
                  className="text-blue-700 hover:underline underline-offset-4 decoration-1 font-medium"
                >
                  Radha
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Full bleed vertical campaign photograph (Authentic Radha-Krishna Darshan) */}
          <div className="relative min-h-[500px] lg:min-h-[750px] bg-neutral-900 overflow-hidden group">
            <img
              src="/products/kanha_sections.jpg"
              alt="Radha Krishna Divine Festive Darshan"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            {/* Minimal Burberry-style bottom-left text */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              <h4 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-white mb-2">
                Divine Darshan
              </h4>
              <Link
                href="/category/kanha"
                className="text-xs sm:text-sm text-white hover:underline underline-offset-4 tracking-wide font-normal"
              >
                Radha & Kanha Sacred Festive Ensembles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SPLIT SECTION B: Editorial Campaign (Left) + Forever Layers Showcase (Right) */}
      <section className="border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: Full bleed vertical campaign photograph (Authentic Kanha Royal Attire) */}
          <div className="relative min-h-[500px] lg:min-h-[750px] bg-neutral-900 overflow-hidden group order-2 lg:order-1">
            <img
              src="/products/kanha.jpg"
              alt="Kanha Royal Poshak Darshan"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
            />
            {/* Minimal bottom-left label */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              <h4 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-white mb-2">
                Coats with Character
              </h4>
              <Link
                href="/category/kanha"
                className="text-xs sm:text-sm text-white hover:underline underline-offset-4 tracking-wide font-normal"
              >
                Kanha’s Royal Brocade & Kurtas
              </Link>
            </div>
          </div>

          {/* Right: Forever Layers Showcase with dash indicators */}
          <div className="p-8 sm:p-14 lg:p-16 flex flex-col justify-between bg-white order-1 lg:order-2">
            <div className="relative aspect-[4/5] max-w-md mx-auto w-full bg-[#F7F7F7] overflow-hidden">
              <img
                src={foreverShowcase[foreverIndex].image}
                alt={foreverShowcase[foreverIndex].title}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute top-4 left-4 text-xs font-normal text-neutral-800 bg-white/90 px-2 py-1">
                {foreverShowcase[foreverIndex].category}
              </div>
            </div>

            {/* Dash Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8 mb-6">
              {foreverShowcase.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setForeverIndex(i)}
                  className={`h-0.5 transition-all ${
                    foreverIndex === i ? 'w-6 bg-black' : 'w-4 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Editorial Copy */}
            <div className="text-center max-w-lg mx-auto space-y-3">
              <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-neutral-900">
                Forever Layers
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-light">
                Meet the sacred styles you'll cherish on repeat. As the auspicious dates arrive, our new-season devotional outerwear steps up. Plush silk textures, house zari details, and pure finishes reshape divine silhouettes with a distinctly modern attitude.
              </p>
              <div className="pt-2 flex items-center justify-center space-x-6 text-xs tracking-wide">
                <Link
                  href="/category/kanha"
                  className="text-blue-700 hover:underline underline-offset-4 decoration-1 font-medium"
                >
                  Kanha
                </Link>
                <Link
                  href="/category/laddu-gopal"
                  className="text-blue-700 hover:underline underline-offset-4 decoration-1 font-medium"
                >
                  Laddu Gopal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHRI RADHA RANI DEDICATED SECTION (User requested: Radha section with H1) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-[#E5E5E5]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.28em] text-neutral-400 font-medium block mb-2">
            The Barsana Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-neutral-900 mb-4">
            Shri Radha Rani • Festive Lehengas & Saree Sets
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed max-w-xl mx-auto">
            Woven in pure Banarasi silk, kundan embroidery, and delicate zari borders. Each ensemble celebrates the divine grace and auspicious splendor of Kishori Ji.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs tracking-wider">
            <Link href="/category/radha" className="text-blue-700 hover:underline underline-offset-4 font-medium uppercase">
              Shop Radha Lehengas
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/category/radha" className="text-blue-700 hover:underline underline-offset-4 font-medium uppercase">
              Festive Saree Sets
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/category/accessories" className="text-blue-700 hover:underline underline-offset-4 font-medium uppercase">
              Mukut & Shringar
            </Link>
          </div>
        </div>

        {/* Radha Editorial Showcase: 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Full Bleed Campaign Portrait: Swarna Zari Silk */}
          <div className="lg:col-span-7 relative min-h-[500px] lg:min-h-[640px] bg-neutral-900 overflow-hidden group rounded-sm shadow-md">
            <img
              src="/products/radha2.jpg"
              alt="Shri Radha Rani Sacred Poshak"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 text-white z-10 max-w-md">
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/80 block mb-1">
                Divine Darshan • Vrindavan
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-white mb-2">
                Swarna Zari Silk Ensemble
              </h3>
              <p className="text-xs text-white/80 font-light mb-4 leading-relaxed">
                Adorned with pure white floral cascades and deep red roses, woven specifically for auspicious festival darshans.
              </p>
              <Link
                href="/category/radha"
                className="inline-block text-xs uppercase tracking-widest text-white border-b border-white pb-1 hover:opacity-75 transition-opacity"
              >
                Discover The Radha Collection →
              </Link>
            </div>
          </div>

          {/* Secondary Editorial Column: Sunflower Darshan + Curated Poshaks */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden group rounded-sm shadow-md">
              <img
                src="/products/radha.jpg"
                alt="Radha Rani Green Silk Poshak"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white z-10">
                <span className="text-[10px] uppercase tracking-widest text-white/80 block mb-1">
                  Floral Shringar
                </span>
                <h4 className="font-serif text-xl text-white font-normal">
                  Kishori Spring Green Poshak
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FAF9F7] p-4 rounded-sm border border-neutral-200/70 text-center">
                <div className="aspect-[4/5] bg-white overflow-hidden mb-3">
                  <img src="/products/poshak_13.jpg" alt="Bridal Lehenga" className="w-full h-full object-cover" />
                </div>
                <h5 className="font-serif text-xs font-medium text-neutral-900 truncate">Vrindavan Bridal Lehenga</h5>
                <span className="text-[11px] text-neutral-500">₹6,999.00</span>
              </div>
              <div className="bg-[#FAF9F7] p-4 rounded-sm border border-neutral-200/70 text-center">
                <div className="aspect-[4/5] bg-white overflow-hidden mb-3">
                  <img src="/products/poshak_15.jpg" alt="Kishori Floral Dress" className="w-full h-full object-cover" />
                </div>
                <h5 className="font-serif text-xs font-medium text-neutral-900 truncate">Kishori Floral Dress</h5>
                <span className="text-[11px] text-neutral-500">₹2,899.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PADDU / LADDU GOPAL DEDICATED SECTION (User requested: Paddu/Laddu Gopal section) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-[#E5E5E5] bg-[#FAF8F5]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.28em] text-amber-700 font-medium block mb-2">
            Thakurji Seva Special
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-neutral-900 mb-4">
            Paddu Gopal • Divine Seva Collection
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed max-w-xl mx-auto">
            From playful Holi festive yellow dresses with golden bansuri to delicate mint green net ruffles and pearl mukut sets. Pure comfort and loving devotion for your Laddu Gopal.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs tracking-wider">
            <Link href="/category/laddu-gopal" className="text-blue-700 hover:underline underline-offset-4 font-medium uppercase">
              Shop Paddu Poshak
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/category/laddu-gopal" className="text-blue-700 hover:underline underline-offset-4 font-medium uppercase">
              Holi 2025 Specials
            </Link>
            <span className="text-neutral-300">•</span>
            <Link href="/category/accessories" className="text-blue-700 hover:underline underline-offset-4 font-medium uppercase">
              Bansuri & Singhasan
            </Link>
          </div>
        </div>

        {/* 3-Card Editorial Grid for Laddu Gopal (Paddu) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1: Holi Special Yellow Dress */}
          <div className="bg-white border border-neutral-200/80 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
              <img
                src="/products/holi_padu_section.jpg"
                alt="Paddu Gopal Holi 2025 Dress"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1">
                Holi 2025 Edition
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-neutral-900 mb-1">
                  Golden Holi Ruffle Poshak
                </h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed mb-4">
                  Multi-layered festive yellow ruffle poshak paired with royal floral mukut, peacock crest, and auspicious gold bansuri.
                </p>
              </div>
              <Link
                href="/category/laddu-gopal"
                className="text-xs font-medium text-neutral-900 underline underline-offset-4 hover:text-blue-700 tracking-wide"
              >
                Shop Holi Edition →
              </Link>
            </div>
          </div>

          {/* Card 2: Mint Green Ruffled Royal Poshak */}
          <div className="bg-white border border-neutral-200/80 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
              <img
                src="/products/paddu.jpg"
                alt="Paddu Gopal Mint Ruffle Poshak"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-emerald-700 text-white text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1">
                Signature Seva
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-neutral-900 mb-1">
                  Vrindavan Mint Net Ruffle Set
                </h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed mb-4">
                  Delicate organza and sequin-embroidered mint green poshak with pearl mala, chandan shringar, and velvet inner lining.
                </p>
              </div>
              <Link
                href="/category/laddu-gopal"
                className="text-xs font-medium text-neutral-900 underline underline-offset-4 hover:text-blue-700 tracking-wide"
              >
                Shop Mint Poshak →
              </Link>
            </div>
          </div>

          {/* Card 3: Intricate Shringar & Mukut */}
          <div className="bg-white border border-neutral-200/80 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
              <img
                src="/products/paddu2.jpg"
                alt="Paddu Gopal Pearl Mukut Shringar"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-neutral-900 text-white text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1">
                Handcrafted Detail
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-normal text-neutral-900 mb-1">
                  Pearl Mala & Morpankh Mukut
                </h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed mb-4">
                  Exquisite temple-craft jewellery, kundan-studded pagdis, and delicate haars designed specifically for small and large deities.
                </p>
              </div>
              <Link
                href="/category/accessories"
                className="text-xs font-medium text-neutral-900 underline underline-offset-4 hover:text-blue-700 tracking-wide"
              >
                Shop Thakurji Shringar →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CRAFTSMANSHIP & STORY REELS (Preserving authentic 9:16 ratio without width/height distortion) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 border-b border-[#E5E5E5] bg-[#FAFAFA]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium block mb-2">
            The Vrindavan Atelier
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-wide text-neutral-900 mb-3">
            Handcrafted With Devotion
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
            Watch our sacred process — intricate embroidery, zari embellishments, and the little story behind every KANHAIYYA creation.
          </p>
        </div>

        {/* Dual 9:16 Video Showcase (Natural Aspect Ratio — No Width/Height Distortion) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 max-w-4xl mx-auto items-center justify-items-center">
          {/* Reel 1: How I Make My KANHAIYYA Dress */}
          <div className="w-full max-w-[340px] flex flex-col items-center">
            <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl border border-neutral-200 relative group">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/7z4NhsiuqBQ?autoplay=0&controls=1&rel=0&modestbranding=1"
                title="How I Make My KANHAIYYA Dress"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="text-center mt-4 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-blue-700 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full inline-block">
                Behind The Seva 🦚✨
              </span>
              <h3 className="font-serif text-base font-normal text-neutral-900">
                How I Make My KANHAIYYA Dress
              </h3>
            </div>
          </div>

          {/* Reel 2: There’s a Little Story Behind KANHAIYYA */}
          <div className="w-full max-w-[340px] flex flex-col items-center">
            <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl border border-neutral-200 relative group">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/AajMDcZGmaI?autoplay=0&controls=1&rel=0&modestbranding=1"
                title="There’s a Little Story Behind KANHAIYYA"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="text-center mt-4 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                Brand Journey 🦚❤️
              </span>
              <h3 className="font-serif text-base font-normal text-neutral-900">
                There’s a Little Story Behind KANHAIYYA
              </h3>
            </div>
          </div>
        </div>

        {/* Channel Link */}
        <div className="text-center mt-12">
          <a
            href="https://www.youtube.com/@kanhaiyyain"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-900 font-medium hover:underline underline-offset-4 decoration-1"
          >
            <span>Explore all stories on YouTube @kanhaiyyain</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* 8. DUAL 50/50 EDITORIAL CAMPAIGN GRID (Featuring authentic Thakurji darshans) */}
      <section className="border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Holi Festive Seva */}
          <div className="relative min-h-[550px] md:min-h-[700px] bg-neutral-900 overflow-hidden group">
            <img
              src="/products/paddu_dress_holis_2025.jpg"
              alt="Holi Festive Seva"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 text-white z-10">
              <span className="text-[10px] uppercase tracking-widest text-white/80 block mb-1">
                Seasonal Celebration
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-white mb-2">
                Holi Festive Seva
              </h3>
              <div className="flex items-center space-x-5 text-xs sm:text-sm font-normal">
                <Link
                  href="/category/laddu-gopal"
                  className="text-white hover:underline underline-offset-4 tracking-wide"
                >
                  Paddu Gopal Holi Sets
                </Link>
                <Link
                  href="/category/kanha"
                  className="text-white hover:underline underline-offset-4 tracking-wide"
                >
                  Kanha Yellow Poshaks
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Thakurji Shringar & Mukut */}
          <div className="relative min-h-[550px] md:min-h-[700px] bg-neutral-900 overflow-hidden group border-t md:border-t-0 md:border-l border-neutral-200">
            <img
              src="/products/paddu4.jpg"
              alt="Thakurji Shringar & Mukut"
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 text-white z-10">
              <span className="text-[10px] uppercase tracking-widest text-white/80 block mb-1">
                Sacred Ornaments
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-white mb-2">
                Thakurji Shringar & Mukut
              </h3>
              <div className="flex items-center space-x-5 text-xs sm:text-sm font-normal">
                <Link
                  href="/category/accessories"
                  className="text-white hover:underline underline-offset-4 tracking-wide"
                >
                  Morpankh Mukut Sets
                </Link>
                <Link
                  href="/category/accessories"
                  className="text-white hover:underline underline-offset-4 tracking-wide"
                >
                  Pearl Malas & Bansuri
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. THREE PROMO TILES (Winter Runway, Signature Shoes, Timeless Accessories) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tile 1 */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
              <img
                src="/products/poshak_06.jpg"
                alt="Winter Runway"
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-wide text-neutral-900 mb-2">
                Winter Runway
              </h3>
              <div className="flex items-center space-x-4 text-xs font-medium">
                <Link href="/category/kanha" className="text-blue-700 hover:underline underline-offset-4">
                  Kanha
                </Link>
                <Link href="/category/radha" className="text-blue-700 hover:underline underline-offset-4">
                  Radha
                </Link>
              </div>
            </div>
          </div>

          {/* Tile 2 */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
              <img
                src="/products/poshak_09.jpg"
                alt="Signature Shringar"
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-wide text-neutral-900 mb-2">
                Signature Footwear & Payal
              </h3>
              <div className="flex items-center space-x-4 text-xs font-medium">
                <Link href="/category/laddu-gopal" className="text-blue-700 hover:underline underline-offset-4">
                  Laddu Gopal
                </Link>
                <Link href="/category/accessories" className="text-blue-700 hover:underline underline-offset-4">
                  Accessories
                </Link>
              </div>
            </div>
          </div>

          {/* Tile 3 */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden">
              <img
                src="/products/poshak_11.jpg"
                alt="Timeless Accessories"
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-wide text-neutral-900 mb-2">
                Timeless Accessories
              </h3>
              <div className="flex items-center space-x-4 text-xs font-medium">
                <Link href="/category/kanha" className="text-blue-700 hover:underline underline-offset-4">
                  Kanha
                </Link>
                <Link href="/category/accessories" className="text-blue-700 hover:underline underline-offset-4">
                  Shringar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
