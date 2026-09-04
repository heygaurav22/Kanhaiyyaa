'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Truck, ArrowRight, Check, CreditCard, Smartphone, Building2, Wallet, Tag, X } from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { useAuth } from '../../lib/auth-context';
import { fetchApi } from '../../lib/api';
import { signInWithGoogle } from '../../lib/firebase';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { token, user, login } = useAuth();

  const [checkoutMode, setCheckoutMode] = useState<'account' | 'guest'>('account');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestName, setGuestName] = useState('');

  // Shipping Address
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
    label: 'Home',
  });

  // Coupons
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscountPaise, setCouponDiscountPaise] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('');

  // Submitting / Verifying
  const [submitting, setSubmitting] = useState(false);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  // Shipping calculation
  const shippingPaise = subtotal >= 99900 ? 0 : 9900; // Free over ₹999, else ₹99
  const totalPaise = Math.max(0, subtotal + shippingPaise - couponDiscountPaise);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();

    if (!code) return;

    if (code === 'DEVOTION500') {
      setAppliedCoupon('DEVOTION500');
      setCouponDiscountPaise(50000); // ₹500
    } else if (code === 'KANHA10') {
      setAppliedCoupon('KANHA10');
      setCouponDiscountPaise(Math.round(subtotal * 0.1)); // 10%
    } else {
      setCouponError('Invalid coupon code. Try DEVOTION500 or KANHA10');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPaise(0);
    setCouponInput('');
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      const res = await signInWithGoogle();
      login(res.token, res.user);
      if (res.user.name) {
        setFormData((prev) => ({ ...prev, fullName: res.user.name || '' }));
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google login failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.line1 || !formData.city || !formData.state || !formData.postcode || !formData.phone) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    if (!user && checkoutMode === 'guest' && !guestEmail) {
      setError('Please provide an email address for order notifications.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Step 1: Simulate Payment Gateway verification
      setProcessingStep('Connecting to Payment Gateway...');
      const payRes = await fetchApi<{ verified: boolean; paymentId: string }>('/orders/verify-payment', {
        method: 'POST',
        body: {
          amount: totalPaise,
          method: paymentMethod,
          upiId: upiId || undefined,
        },
      });

      if (!payRes.success) {
        throw new Error('Payment authorization failed.');
      }

      setProcessingStep('Cryptographically verifying payment status: PAID...');

      // Step 2: Create Order in backend
      setProcessingStep('Recording order #KAN & updating inventory stock...');
      const orderPayload: any = {
        guestAddress: {
          line1: formData.line1,
          line2: formData.line2 || undefined,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          phone: formData.phone,
          label: formData.label,
        },
        guestEmail: user ? user.email : guestEmail,
        guestName: user ? (user.name || user.email) : (formData.fullName || guestName || 'Devotional Patron'),
        paymentMethod,
        couponCode: appliedCoupon || undefined,
        notes: `Customer: ${formData.fullName || user?.name || 'Patron'} | Paid via ${paymentMethod}`,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          size: item.variant?.size,
          color: item.variant?.color,
          quantity: item.quantity,
          image: item.product.images?.[0],
        })),
      };

      const orderRes = await fetchApi<{ id: string; orderNumber: string }>('/orders', {
        method: 'POST',
        token: token || undefined,
        body: orderPayload,
      });

      if (orderRes.success && orderRes.data) {
        clearCart();
        router.push(`/order-confirmation/${orderRes.data.orderNumber || orderRes.data.id}`);
      } else {
        throw new Error(orderRes.error || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setError(err.message || 'An unexpected error occurred during order confirmation.');
      setProcessingStep(null);
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-3xl font-normal tracking-wide text-neutral-900">Your Bag is Empty</h2>
        <p className="text-xs text-neutral-500 font-light">Please add divine items to your shopping bag before proceeding to checkout.</p>
        <div className="pt-4">
          <Link
            href="/category/kanha"
            className="inline-block bg-black text-white text-xs uppercase tracking-[0.2em] py-3.5 px-8 font-medium hover:bg-neutral-800"
          >
            Discover Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-8 py-12">
      <div className="mb-8 pb-4 border-b border-neutral-200 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-medium block">
            Express Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-wide text-neutral-950 uppercase">
            Order & Shipping
          </h1>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-xs text-neutral-500">
          <ShieldCheck size={16} className="text-neutral-800" />
          <span>Encrypted 256-Bit SSL Checkout</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm">
          {error}
        </div>
      )}

      {/* Main Checkout Layout: Form (7 cols) + Order Summary (5 cols) */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-10">
          {/* STEP 1: Identification & Account Status */}
          <section className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="font-serif text-xl font-normal tracking-wide text-neutral-900">
                1. Customer Details
              </h2>
              {user && (
                <span className="text-[11px] text-green-700 bg-green-50 px-2.5 py-1 rounded font-medium">
                  Signed In
                </span>
              )}
            </div>

            {user ? (
              <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-sm border border-neutral-200">
                <div className="flex items-center space-x-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name || 'User'} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-serif flex items-center justify-center text-sm font-semibold">
                      {(user.name || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-semibold text-neutral-900">{user.name || 'Valued Patron'}</div>
                    <div className="text-xs text-neutral-500">{user.email}</div>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-500">Fast 1-Click Order</div>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                {/* Google One-Click Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-medium py-3 px-4 border border-neutral-300 rounded-sm transition-all shadow-sm disabled:opacity-60"
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span className="tracking-wider uppercase text-[11px] font-semibold">Continue with Google</span>
                    </>
                  )}
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-neutral-200 w-full" />
                  <span className="bg-white px-3 text-[10px] text-neutral-400 uppercase tracking-widest absolute">
                    or guest checkout
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-neutral-700 block mb-1 uppercase tracking-wider">
                      Email for Order Updates *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-white border border-neutral-300 p-3 text-xs text-neutral-900 rounded-sm focus:border-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-neutral-700 block mb-1 uppercase tracking-wider">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Gaurav"
                      className="w-full bg-white border border-neutral-300 p-3 text-xs text-neutral-900 rounded-sm focus:border-black outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* STEP 2: Delivery Address */}
          <section className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm space-y-4">
            <h2 className="font-serif text-xl font-normal tracking-wide text-neutral-900 pb-3 border-b border-neutral-100">
              2. Shipping Address
            </h2>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1 uppercase tracking-wider text-[11px]">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Gaurav Sharma"
                    className="w-full border border-neutral-300 p-3 text-xs rounded-sm focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-neutral-700 block mb-1 uppercase tracking-wider text-[11px]">
                    Phone Number (for Courier & Tracking) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full border border-neutral-300 p-3 text-xs rounded-sm focus:border-black outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1 uppercase tracking-wider text-[11px]">
                  Flat, House No., Building, Street *
                </label>
                <input
                  type="text"
                  required
                  value={formData.line1}
                  onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                  placeholder="e.g. Flat 402, Radhe Krishna Residency"
                  className="w-full border border-neutral-300 p-3 text-xs rounded-sm focus:border-black outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1 uppercase tracking-wider text-[11px]">
                  Area, Landmark, Mandir Vicinity (Optional)
                </label>
                <input
                  type="text"
                  value={formData.line2}
                  onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                  placeholder="e.g. Near ISKCON Temple / Bankey Bihari Marg"
                  className="w-full border border-neutral-300 p-3 text-xs rounded-sm focus:border-black outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1 uppercase tracking-wider text-[11px]">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Vrindavan / Mathura"
                    className="w-full border border-neutral-300 p-3 text-xs rounded-sm focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-neutral-700 block mb-1 uppercase tracking-wider text-[11px]">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Uttar Pradesh"
                    className="w-full border border-neutral-300 p-3 text-xs rounded-sm focus:border-black outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-neutral-700 block mb-1 uppercase tracking-wider text-[11px]">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    placeholder="281121"
                    className="w-full border border-neutral-300 p-3 text-xs rounded-sm focus:border-black outline-none"
                  />
                </div>
              </div>

              {/* Address label selector */}
              <div className="pt-2">
                <span className="text-[11px] font-medium text-neutral-700 block mb-2 uppercase tracking-wider">
                  Save Address As:
                </span>
                <div className="flex gap-3">
                  {['Home', 'Office', 'Temple / Mandir'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setFormData({ ...formData, label: lbl })}
                      className={`py-1.5 px-3.5 border rounded-sm text-xs transition-colors ${
                        formData.label === lbl
                          ? 'border-black bg-black text-white font-medium'
                          : 'border-neutral-300 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* STEP 3: Payment Method */}
          <section className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h2 className="font-serif text-xl font-normal tracking-wide text-neutral-900">
                3. Payment Gateway
              </h2>
              <span className="text-xs text-neutral-500">Instant Verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)', icon: Smartphone },
                { id: 'CARD', label: 'Debit / Credit Card', icon: CreditCard },
                { id: 'NETBANKING', label: 'Net Banking', icon: Building2 },
                { id: 'WALLET', label: 'Paytm / Wallets', icon: Wallet },
                { id: 'COD', label: 'Cash on Delivery (COD)', icon: Truck },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`flex items-center gap-3 p-3.5 border rounded-sm text-left transition-all ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-50 font-medium'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <Icon size={18} className={isSelected ? 'text-black' : 'text-neutral-500'} />
                    <span className="text-xs text-neutral-900">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'UPI' && (
              <div className="pt-2">
                <label className="font-medium text-neutral-700 block mb-1 uppercase tracking-wider text-[11px]">
                  Enter Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. username@okhdfcbank"
                  className="w-full border border-neutral-300 p-3 text-xs rounded-sm focus:border-black outline-none"
                />
              </div>
            )}
          </section>
        </div>

        {/* STEP 4: Order Summary (Right Column) */}
        <div className="lg:col-span-5">
          <div className="bg-neutral-50 border border-neutral-200 p-6 sm:p-8 rounded-sm sticky top-24 space-y-6">
            <h2 className="font-serif text-xl font-normal tracking-wide text-neutral-900 pb-3 border-b border-neutral-200 uppercase">
              Your Bag ({items.reduce((s, i) => s + i.quantity, 0)} Items)
            </h2>

            {/* Line Items Preview */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.images?.[0] || '/products/poshak_01.jpg'}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded-sm bg-white border border-neutral-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-neutral-900 truncate">{item.product.name}</div>
                      <div className="text-neutral-500 text-[11px]">
                        Qty: {item.quantity} {item.variant?.size ? `• Size: ${item.variant.size}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium text-neutral-900 whitespace-nowrap">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="pt-4 border-t border-neutral-200 space-y-2">
              <span className="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider block">
                Have a Promo / Festival Code?
              </span>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 text-green-800 p-2.5 rounded-sm text-xs">
                  <div className="flex items-center gap-2">
                    <Tag size={14} />
                    <span>Applied: <strong className="font-mono">{appliedCoupon}</strong> (-{formatPrice(couponDiscountPaise)})</span>
                  </div>
                  <button onClick={handleRemoveCoupon} type="button" className="text-neutral-500 hover:text-black">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Try DEVOTION500 or KANHA10"
                    className="flex-1 bg-white border border-neutral-300 p-2.5 text-xs rounded-sm focus:border-black outline-none font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-neutral-900 text-white text-xs px-4 font-medium uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-medium text-neutral-900">
                  {shippingPaise === 0 ? <span className="text-green-700 font-semibold">FREE</span> : formatPrice(shippingPaise)}
                </span>
              </div>
              {couponDiscountPaise > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Special Discount</span>
                  <span>-{formatPrice(couponDiscountPaise)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-serif font-bold text-neutral-950 pt-3 border-t border-neutral-300">
                <span>Total Amount</span>
                <span>{formatPrice(totalPaise)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-[0.25em] font-medium py-4 px-6 flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-60"
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-[11px] normal-case tracking-normal">{processingStep || 'Processing Order...'}</span>
                </div>
              ) : (
                <>
                  <span>PAY & PLACE ORDER ({formatPrice(totalPaise)})</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-4 text-[10px] text-neutral-400 pt-2">
              <span>Secure Transactions</span>
              <span>•</span>
              <span>100% Handcrafted Guarantee</span>
              <span>•</span>
              <span>Vrindavan Sanctified</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
