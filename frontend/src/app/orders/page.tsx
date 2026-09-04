'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Truck, Calendar, ShoppingBag } from 'lucide-react';
import { Order } from '../../types';
import { fetchApi } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

export default function OrdersPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      fetchApi<Order[]>('/orders', { token }).then((res) => {
        if (res.success && res.data) {
          setOrders(res.data);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-xs uppercase">DELIVERED</span>;
      case 'SHIPPED':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-xs uppercase">SHIPPED</span>;
      case 'CONFIRMED':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-xs uppercase">CONFIRMED</span>;
      case 'CANCELLED':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-xs uppercase">CANCELLED</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-xs uppercase">PENDING</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-4">
        <div className="h-8 bg-[#EFECE6] animate-pulse w-1/3" />
        <div className="h-40 bg-[#EFECE6] animate-pulse w-full rounded-sm" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-[#FAF3E8] border border-[#C8A951]/40 rounded-full flex items-center justify-center mx-auto text-[#C8A951]">
          <Package size={36} />
        </div>
        <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-[#1A1A1A]">
          No Past Orders Found
        </h1>
        <p className="text-xs text-[#6E6E6E] max-w-sm mx-auto">
          You haven't placed any orders yet. Explore our divine poshak collections to make your first purchase.
        </p>
        <Link
          href="/category/kanha"
          className="inline-block bg-[#1A1A1A] text-[#E5D5B8] text-xs font-semibold uppercase tracking-[0.2em] py-3.5 px-8 hover:bg-[#C8A951] hover:text-white transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-[#1A1A1A] mb-8 pb-4 border-b border-[#E5E0D8]">
        My Orders ({orders.length})
      </h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-[#E5E0D8] rounded-sm overflow-hidden shadow-sm">
            {/* Header bar */}
            <div className="bg-[#FAF8F5] p-4 sm:p-6 border-b border-[#E5E0D8] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#8C8C8C] uppercase font-bold tracking-wider block">Order Date</span>
                  <span className="font-semibold text-[#1A1A1A]">{formatDate(order.createdAt)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8C8C] uppercase font-bold tracking-wider block">Order ID</span>
                  <span className="font-serif font-bold text-[#1A1A1A]">{order.orderNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8C8C] uppercase font-bold tracking-wider block">Total</span>
                  <span className="font-serif font-bold text-[#1A1A1A]">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div>{getStatusBadge(order.status)}</div>
            </div>

            {/* Items list */}
            <div className="p-4 sm:p-6 space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || '/products/poshak_01.jpg'}
                      alt={item.productName}
                      className="w-14 h-18 object-cover rounded-sm border border-[#E5E0D8]"
                    />
                    <div className="space-y-1 text-xs">
                      <h4 className="font-serif font-bold text-base text-[#1A1A1A]">{item.productName}</h4>
                      {item.size && <p className="text-[#8C8C8C]">Size: <span className="font-semibold text-[#1A1A1A]">{item.size}</span></p>}
                      {item.color && <p className="text-[#8C8C8C]">Color: <span className="font-semibold text-[#1A1A1A]">{item.color}</span></p>}
                      <p className="text-[#8C8C8C]">Quantity: {item.quantity}</p>
                    </div>
                  </div>

                  <span className="font-serif font-bold text-base text-[#1A1A1A]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Address Footer */}
            {order.address && (
              <div className="bg-[#FAF3E8]/50 p-4 px-6 border-t border-[#E5E0D8] text-xs text-[#6E6E6E]">
                <span className="font-bold text-[#1A1A1A] mr-2">Delivery Address:</span>
                {order.address.line1}, {order.address.city}, {order.address.state} — {order.address.postcode} (Phone: {order.address.phone})
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
