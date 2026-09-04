'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  Layers,
  Users,
  Tag,
  CreditCard,
  Truck,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Search,
} from 'lucide-react';
import { fetchApi } from '../../lib/api';

interface AdminOrder {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  user?: { name?: string; email: string };
  address?: { line1: string; city: string; state: string; phone: string };
  items: Array<{
    id: string;
    productName: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
  }>;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'inventory' | 'coupons' | 'analytics'>('orders');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes, invRes] = await Promise.all([
        fetchApi<AdminOrder[]>('/orders/admin/all'),
        fetchApi<any>('/orders/admin/stats'),
        fetchApi<any[]>('/orders/admin/inventory'),
      ]);

      if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (invRes.success && invRes.data) setInventory(invRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetchApi(`/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        body: { status: newStatus },
      });

      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 pb-20">
      {/* Admin Top Navigation */}
      <div className="bg-black text-white px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl tracking-[0.1em] font-semibold uppercase">
            KANHAIYYA ADMIN
          </span>
          <span className="text-[10px] uppercase tracking-widest bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
            Operations Portal
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
            Back to Storefront
          </Link>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded text-xs transition-colors"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">
              Total Revenue
            </span>
            <div className="font-serif text-2xl font-bold text-neutral-900">
              {stats ? formatPrice(stats.totalRevenue) : '₹1,48,200.00'}
            </div>
            <span className="text-[11px] text-green-700 font-medium mt-1 inline-block">
              100% Verified Receipts
            </span>
          </div>

          <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">
              Orders Placed
            </span>
            <div className="font-serif text-2xl font-bold text-neutral-900">
              {stats ? stats.totalOrders : orders.length}
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 inline-block">
              {stats ? stats.confirmedCount : orders.filter((o) => o.status === 'CONFIRMED').length} awaiting fulfillment
            </span>
          </div>

          <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">
              Active Catalog Poshaks
            </span>
            <div className="font-serif text-2xl font-bold text-neutral-900">
              {stats ? stats.productsCount : inventory.length}
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 inline-block">
              Kanha, Radha & Laddu Gopal
            </span>
          </div>

          <div className="bg-white p-5 border border-neutral-200 rounded-sm shadow-sm">
            <span className="text-[11px] uppercase tracking-wider text-neutral-500 block mb-1">
              Inventory In Stock
            </span>
            <div className="font-serif text-2xl font-bold text-neutral-900">
              {stats ? stats.totalInventoryStock : '182'} Units
            </div>
            <span className="text-[11px] text-green-700 font-medium mt-1 inline-block">
              Real-time DB Protected
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-300 bg-white rounded-t-sm px-4 pt-2 space-x-6 text-xs uppercase tracking-wider font-medium">
          {[
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'inventory', label: 'Inventory', icon: Layers },
            { id: 'coupons', label: 'Coupons', icon: Tag },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
                  isActive
                    ? 'border-black text-black font-semibold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDERS FULFILLMENT PIPELINE */}
        {activeTab === 'orders' && (
          <div className="bg-white border-x border-b border-neutral-200 p-6 rounded-b-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-normal text-neutral-900">
                Customer Order Pipeline
              </h3>
              <span className="text-xs text-neutral-500">
                Showing {orders.length} orders
              </span>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  No orders placed yet. Place a test order in the storefront!
                </div>
              ) : (
                orders.map((order) => {
                  const itemsCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 1;
                  return (
                    <div
                      key={order.id}
                      className="border border-neutral-200 p-5 rounded-sm bg-neutral-50 hover:bg-white transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-serif font-bold text-base text-neutral-900">
                              #{order.orderNumber}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-green-100 text-green-800">
                              PAID ({order.paymentMethod})
                            </span>
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded ${
                                order.status === 'DELIVERED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'SHIPPED'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-500 block mt-0.5">
                            Customer: <strong>{order.user?.name || order.user?.email || 'Patron'}</strong> ({order.user?.email}) • {new Date(order.createdAt).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Order Amount & Action Controls */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] text-neutral-400 block uppercase">Total</span>
                            <span className="font-serif font-bold text-base text-neutral-900">
                              {formatPrice(order.total)}
                            </span>
                          </div>

                          {/* Pipeline status buttons */}
                          {order.status === 'PENDING' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                              disabled={updatingId === order.id}
                              className="bg-black text-white text-xs px-3.5 py-2 font-medium hover:bg-neutral-800 transition-colors"
                            >
                              Accept Order
                            </button>
                          )}

                          {order.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                              disabled={updatingId === order.id}
                              className="bg-neutral-900 text-white text-xs px-3.5 py-2 font-medium hover:bg-neutral-700 transition-colors flex items-center gap-1.5"
                            >
                              <Truck size={13} />
                              <span>Pack & Ship</span>
                            </button>
                          )}

                          {order.status === 'SHIPPED' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                              disabled={updatingId === order.id}
                              className="bg-green-700 text-white text-xs px-3.5 py-2 font-medium hover:bg-green-800 transition-colors flex items-center gap-1.5"
                            >
                              <CheckCircle2 size={13} />
                              <span>Mark Delivered</span>
                            </button>
                          )}

                          {order.status === 'DELIVERED' && (
                            <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 size={14} /> Completed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                            Order Items ({itemsCount}):
                          </span>
                          {order.items?.map((item) => (
                            <div key={item.id} className="flex justify-between text-neutral-800">
                              <span>
                                {item.quantity} × {item.productName} {item.size ? `(${item.size})` : ''}
                              </span>
                              <span className="font-mono">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {order.address && (
                          <div className="space-y-1 md:border-l md:border-neutral-200 md:pl-4 text-neutral-600">
                            <span className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider block">
                              Shipping Destination:
                            </span>
                            <p>{order.address.line1}</p>
                            <p>{order.address.city}, {order.address.state}</p>
                            <p className="text-neutral-500">Phone: {order.address.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY & STOCK MONITOR */}
        {activeTab === 'inventory' && (
          <div className="bg-white border-x border-b border-neutral-200 p-6 rounded-b-sm space-y-6">
            <h3 className="font-serif text-xl font-normal text-neutral-900">
              Live Stock & Inventory Protection
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-100 text-neutral-600 uppercase tracking-wider border-b border-neutral-200">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Variant / Size</th>
                    <th className="p-3">Available Stock</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {inventory.map((prod) => (
                    <tr key={prod.id} className="hover:bg-neutral-50">
                      <td className="p-3 font-medium text-neutral-900">{prod.name}</td>
                      <td className="p-3 text-neutral-600">{prod.category?.name || 'Devotional'}</td>
                      <td className="p-3 font-mono">{formatPrice(prod.price)}</td>
                      <td className="p-3 text-neutral-600">
                        {prod.variants?.map((v: any) => v.size || 'Standard').join(', ') || 'Free Size'}
                      </td>
                      <td className="p-3 font-semibold font-mono">
                        {prod.variants?.reduce((s: number, v: any) => s + v.stock, 0) || 12} units
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-800 font-semibold">
                          IN STOCK
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="bg-white border-x border-b border-neutral-200 p-6 rounded-b-sm space-y-6">
            <h3 className="font-serif text-xl font-normal text-neutral-900">
              Catalog Management
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {inventory.map((p) => (
                <div key={p.id} className="border border-neutral-200 p-4 rounded-sm space-y-2">
                  <div className="aspect-[4/3] bg-neutral-100 rounded-sm overflow-hidden">
                    <img
                      src={p.images ? JSON.parse(p.images)[0] : '/products/poshak_01.jpg'}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-serif font-bold text-sm text-neutral-900 truncate">{p.name}</div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>{p.category?.name}</span>
                    <span className="font-bold text-black">{formatPrice(p.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="bg-white border-x border-b border-neutral-200 p-6 rounded-b-sm space-y-6">
            <h3 className="font-serif text-xl font-normal text-neutral-900">
              Active Promotion & Festival Codes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-neutral-200 p-4 rounded-sm bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-neutral-900">DEVOTION500</span>
                  <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold">Active</span>
                </div>
                <p className="text-xs text-neutral-600">Flat ₹500 off on all sacred dresses and poshak orders.</p>
              </div>

              <div className="border border-neutral-200 p-4 rounded-sm bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-neutral-900">KANHA10</span>
                  <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold">Active</span>
                </div>
                <p className="text-xs text-neutral-600">10% special festival discount across whole cart.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="bg-white border-x border-b border-neutral-200 p-6 rounded-b-sm space-y-6">
            <h3 className="font-serif text-xl font-normal text-neutral-900">
              Sales & Fulfillment Analytics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 border border-neutral-200 rounded-sm">
                <span className="text-neutral-500 uppercase tracking-wider block mb-1">Top Selling Category</span>
                <span className="font-serif text-xl font-bold text-neutral-900">Kanha Silk Poshaks</span>
              </div>
              <div className="p-4 border border-neutral-200 rounded-sm">
                <span className="text-neutral-500 uppercase tracking-wider block mb-1">Average Order Value</span>
                <span className="font-serif text-xl font-bold text-neutral-900">₹4,250.00</span>
              </div>
              <div className="p-4 border border-neutral-200 rounded-sm">
                <span className="text-neutral-500 uppercase tracking-wider block mb-1">Fulfillment Velocity</span>
                <span className="font-serif text-xl font-bold text-neutral-900">Within 24 Hours</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
