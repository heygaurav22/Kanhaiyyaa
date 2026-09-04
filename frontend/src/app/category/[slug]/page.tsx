'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Filter, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { Product, Category } from '../../../types';
import { fetchApi } from '../../../lib/api';
import { ProductCard } from '../../../components/ProductCard';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sort, setSort] = useState<string>('newest');
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetchApi<Product[]>(`/products?category=${slug}&sort=${sort}&limit=50`),
          fetchApi<Category[]>('/categories'),
        ]);

        if (prodRes.success && prodRes.data) {
          setProducts(prodRes.data);
          setTotal(prodRes.total || prodRes.data.length);
        }

        if (catRes.success && catRes.data) {
          // Find matching category or subcategory
          let found: Category | undefined = catRes.data.find((c) => c.slug === slug);
          if (!found) {
            for (const parent of catRes.data) {
              if (parent.children) {
                const sub = parent.children.find((c) => c.slug === slug);
                if (sub) {
                  found = sub;
                  break;
                }
              }
            }
          }
          if (found) setCategory(found);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, sort]);

  const categoryTitle = category ? category.name : slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-[#8C8C8C] mb-8 font-light">
        <Link href="/" className="hover:text-[#1A1A1A]">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/category/all" className="hover:text-[#1A1A1A]">
          Collections
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#1A1A1A] font-medium capitalize">{categoryTitle}</span>
      </nav>

      {/* Category Header */}
      <div className="border-b border-[#E5E0D8] pb-8 mb-10 text-center sm:text-left">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#C8A951] font-semibold block mb-1">
          Divine Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase text-[#1A1A1A] tracking-wider">
          {categoryTitle}
        </h1>
        {category?.description && (
          <p className="text-xs sm:text-sm text-[#6E6E6E] mt-3 max-w-2xl font-light leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E5E0D8]/60 text-xs">
        <div className="text-[#6E6E6E] font-medium">
          Showing <span className="text-[#1A1A1A] font-bold">{products.length}</span> of {total} products
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-[#1A1A1A]">
            <SlidersHorizontal size={14} className="text-[#C8A951]" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Sort By:</span>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-[#E5E0D8] px-3 py-2 text-xs text-[#1A1A1A] font-medium outline-none rounded-sm focus:border-[#C8A951]"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-[#EFECE6] animate-pulse rounded-sm" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-white border border-[#E5E0D8] rounded-sm p-12">
          <h3 className="font-serif text-2xl font-semibold text-[#1A1A1A]">No Poshak Found</h3>
          <p className="text-xs text-[#8C8C8C]">
            We could not find products in this collection matching your query.
          </p>
          <Link
            href="/category/kanha"
            className="inline-block bg-[#1A1A1A] text-[#E5D5B8] text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:bg-[#C8A951] hover:text-white transition-colors mt-4"
          >
            Explore Kanha Collection
          </Link>
        </div>
      )}
    </div>
  );
}
