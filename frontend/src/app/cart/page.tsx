'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { useAuth } from '../../lib/auth-context';

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-[#FAF3E8] border border-[#C8A951]/40 rounded-full flex items-center justify-center mx-auto text-[#C8A951]">
          <ShoppingBag size={36} />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-[#1A1A1A]">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E6E] font-light max-w-md mx-auto leading-relaxed">
          Discover our divine handcrafted poshaks and shringar collections for Shri Kanha, Shri Radha, and Laddu Gopal.
        </p>
        <div className="pt-4">
          <Link
            href="/category/kanha"
            className="inline-block bg-[#1A1A1A] text-[#E5D5B8] font-semibold text-xs uppercase tracking-[0.2em] py-4 px-8 hover:bg-[#C8A951] hover:text-white transition-colors"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-[#1A1A1A] mb-8 pb-4 border-b border-[#E5E0D8]">
        Shopping Bag ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Line Items (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => {
            const product = item.product;
            const mainImg = product?.images?.[0] || '/products/poshak_01.jpg';

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-[#E5E0D8] p-4 sm:p-6 rounded-sm gap-4"
              >
                <div className="flex items-center space-x-4">
                  <Link
                    href={`/product/${product.slug}`}
                    className="w-20 h-24 bg-[#FAF8F5] flex-shrink-0 overflow-hidden rounded-sm border border-[#E5E0D8]"
                  >
                    <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="space-y-1">
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-serif text-lg font-bold text-[#1A1A1A] hover:text-[#C8A951] transition-colors"
                    >
                      {product.name}
                    </Link>
                    {item.variant?.size && (
                      <p className="text-xs text-[#6E6E6E]">Size: <span className="font-semibold text-[#1A1A1A]">{item.variant.size}</span></p>
                    )}
                    {item.variant?.color && (
                      <p className="text-xs text-[#6E6E6E]">Color: <span className="font-semibold text-[#1A1A1A]">{item.variant.color}</span></p>
                    )}
                    <p className="font-serif font-bold text-base text-[#1A1A1A] sm:hidden pt-1">
                      {formatPrice(product.price * item.quantity)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto space-x-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#E5E0D8]">
                  {/* Quantity adjustment */}
                  <div className="flex items-center border border-[#E5E0D8] rounded-sm bg-white">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 text-sm font-bold text-[#1A1A1A] hover:bg-[#FAF8F5]"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 font-serif text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-sm font-bold text-[#1A1A1A] hover:bg-[#FAF8F5]"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Item Total */}
                  <div className="hidden sm:block text-right">
                    <p className="font-serif text-lg font-bold text-[#1A1A1A]">
                      {formatPrice(product.price * item.quantity)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E5E0D8] p-6 rounded-sm space-y-6">
            <h2 className="font-serif text-xl font-bold uppercase text-[#1A1A1A] pb-4 border-b border-[#E5E0D8]">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-[#6E6E6E]">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-[#1A1A1A] font-serif text-sm">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Handling</span>
                <span className="text-[#2E7D32] font-semibold uppercase">FREE (EXPRESS)</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-semibold text-[#1A1A1A]">Cash on Delivery</span>
              </div>
            </div>

            <div className="border-t border-[#E5E0D8] pt-4 flex justify-between items-baseline">
              <span className="font-serif text-lg font-bold uppercase text-[#1A1A1A]">Total Payable</span>
              <span className="font-serif text-2xl font-bold text-[#1A1A1A]">{formatPrice(subtotal)}</span>
            </div>

            <Link
              href={user ? '/checkout' : '/auth/login?redirect=/checkout'}
              className="w-full bg-[#1A1A1A] hover:bg-[#C8A951] text-white font-semibold text-xs uppercase tracking-[0.25em] py-4 px-6 flex items-center justify-center space-x-2 transition-colors shadow-lg text-center block"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={16} />
            </Link>

            <div className="bg-[#FAF3E8] border border-[#E8DCC4] p-4 rounded-sm flex items-start space-x-2 text-[11px] text-[#6E6E6E]">
              <ShieldCheck size={16} className="text-[#C8A951] flex-shrink-0 mt-0.5" />
              <span>Safe Cash on Delivery checkout. Instant order confirmation.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
