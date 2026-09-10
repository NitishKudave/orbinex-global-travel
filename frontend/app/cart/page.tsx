'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  Plane,
  Building2,
  Bus,
  FileCheck2,
  ShieldCheck,
  Palmtree,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { BookingType } from '@/lib/types';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    clearCart,
    totalItems,
    totalGross,
    discountAmount,
    totalNet,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
    formatPrice,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;
    setIsApplying(true);
    const success = await applyCoupon(inputCoupon.trim());
    setIsApplying(false);
    if (!success) {
      setCouponError(couponMessage || 'Invalid coupon code');
    } else {
      setInputCoupon('');
    }
  };

  const getModuleIcon = (type: BookingType) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Building2;
      case 'bus': return Bus;
      case 'visa': return FileCheck2;
      case 'insurance': return ShieldCheck;
      case 'holiday': return Palmtree;
      case 'umrah': return Sparkles;
      default: return ShoppingBag;
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-400 mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Unified Cart is Empty</h2>
          <p className="text-xs text-slate-500">
            You can combine flights, 5-star hotels, tour circuits, visas, and eSIMs together into a single unified order.
          </p>
          <Link
            href="/flights"
            className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition"
          >
            Start Booking Flights
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Unified Travel Cart</h1>
          <p className="text-xs text-slate-500 mt-1">Review and manage your mixed multi-service travel booking before final payment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">{totalItems} Item(s) in Cart</span>
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:underline font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {items.map((item) => {
                const Icon = getModuleIcon(item.booking_type);
                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700 shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                          {item.booking_type}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{item.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                        {item.travel_date && (
                          <span className="text-[11px] text-slate-400 block mt-1">Travel Date: {item.travel_date}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <span className="text-base font-black text-slate-900">{formatPrice(item.amount)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-600 text-xs flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout Summary Card */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">Order Summary</h3>

            {/* Coupon Box */}
            {couponCode ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-800">Coupon {couponCode}</p>
                  <p className="text-[11px] text-emerald-600">Saved {formatPrice(discountAmount)}</p>
                </div>
                <button onClick={removeCoupon} className="text-xs text-red-600 font-semibold hover:underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                    placeholder="Coupon (e.g. ORBINEX100)"
                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold uppercase rounded-xl outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={isApplying || !inputCoupon}
                    className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-red-600 pl-1">{couponError}</p>
                )}
              </form>
            )}

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800">{formatPrice(totalGross)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Estimated Taxes & Fees</span>
                <span>Included</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-cyan-700 text-lg">{formatPrice(totalNet)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-cyan-600/30 transition cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
