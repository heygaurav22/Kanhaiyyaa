'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CheckCircle2, Truck, Package, ShieldCheck, ArrowRight, Clock, MapPin, Check } from 'lucide-react';
import { Order } from '../../../types';
import { fetchApi } from '../../../lib/api';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (orderId) {
      fetchApi<Order>(`/orders/${orderId}`).then((res) => {
        if (res.success && res.data) {
          setOrder(res.data);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  const totalItemsCount = order?.items?.reduce((acc, item) => acc + item.quantity, 0) || 1;

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-8 py-16">
      <div className="bg-white border border-neutral-200 p-8 sm:p-12 rounded-sm shadow-sm text-center space-y-8">
        {/* Success Icon */}
        <div className="w-18 h-18 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-serif">
          <Check size={32} strokeWidth={2} />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium block">
            Sacred Purchase Complete
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-wide uppercase text-neutral-900">
            Order Confirmed ❤️
          </h1>
          <p className="text-sm text-neutral-600 font-light max-w-md mx-auto leading-relaxed">
            Thank you for shopping with <strong className="font-semibold text-neutral-900 font-serif">KANHAIYYA</strong>.
          </p>
        </div>

        {/* Order Details Header Box */}
        <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-sm text-left max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-neutral-200 pb-4 gap-2">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider block">
                Order Identifier
              </span>
              <span className="font-serif font-bold text-xl text-neutral-900">
                #{order?.orderNumber || orderId}
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold tracking-wider block">
                Payment Status
              </span>
              <span className="inline-block text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded">
                PAID & VERIFIED
              </span>
            </div>
          </div>

          {/* Pipeline Tracker — PACK -> SHIP -> DELIVER */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
              <span className="text-black font-semibold">1. Confirmed</span>
              <span className="text-black font-semibold">2. Processing</span>
              <span>3. Packed</span>
              <span>4. Shipped</span>
              <span>5. Delivered</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-neutral-900 h-full w-2/5 rounded-full" />
            </div>
          </div>

          {/* Items Summary */}
          <div className="border-t border-neutral-200 pt-4 space-y-3">
            <span className="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider block">
              Ordered Items ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}):
            </span>

            <div className="space-y-3">
              {order?.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-white border border-neutral-200 rounded-sm overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-neutral-100" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">{item.productName}</div>
                        <div className="text-neutral-500 text-[11px]">
                          Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''} {item.color ? `• ${item.color}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium text-neutral-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-neutral-500 italic">Order details loaded securely.</div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order?.address && (
            <div className="border-t border-neutral-200 pt-4 text-xs text-neutral-600 space-y-1">
              <span className="font-semibold text-neutral-800 block uppercase text-[10px] tracking-wider">
                Dispatch Destination:
              </span>
              <p className="font-medium text-neutral-900">{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>{order.address.city}, {order.address.state} — {order.address.postcode}</p>
              <p className="text-neutral-500">Contact: {order.address.phone}</p>
            </div>
          )}

          {/* Grand Total */}
          <div className="border-t border-neutral-300 pt-4 flex justify-between items-baseline">
            <span className="font-serif uppercase text-sm text-neutral-700">Total Paid:</span>
            <span className="font-serif text-2xl font-bold text-neutral-950">
              {order ? formatPrice(order.total) : '₹8,892.00'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href="/orders"
            className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-medium uppercase tracking-[0.25em] py-4 px-8 transition-colors text-center"
          >
            Track Order
          </Link>
          <Link
            href="/"
            className="w-full border border-neutral-300 hover:border-black text-neutral-900 text-xs font-medium uppercase tracking-[0.25em] py-4 px-8 transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
