'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  X,
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

export default function CartDrawer() {
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
    isDrawerOpen,
    setIsDrawerOpen,
    formatPrice,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isDrawerOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
        >
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Unified Travel Cart</h2>
                <p className="text-xs text-slate-500">{totalItems} item(s) selected for mixed checkout</p>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 divide-y divide-slate-100">
            {items.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-100 to-sky-100 flex items-center justify-center text-cyan-500 mx-auto mb-3 shadow-inner shadow-cyan-500/15"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ShoppingBag className="w-10 h-10" />
                </motion.div>
                <h3 className="text-base font-black text-slate-800">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-6">
                  Add flights, 5-star hotels, travel insurance, or electronic visas to combine into a single instant checkout.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsDrawerOpen(false)}
                  className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-600/25 transition cursor-pointer"
                >
                  Explore Travel Services
                </motion.button>
              </motion.div>
            ) : (
              items.map((item) => {
                const Icon = getModuleIcon(item.booking_type);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.4 }}
                    className="pt-3 first:pt-0 flex gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700 shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">{item.title}</h4>
                        <span className="text-xs font-black text-slate-900 shrink-0">
                          {formatPrice(item.amount)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.subtitle}</p>
                      
                      {item.travel_date && (
                        <span className="inline-block mt-1 text-[10px] text-slate-400">
                          Date: {item.travel_date}
                        </span>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">
                          {item.booking_type}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-600 text-xs flex items-center gap-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 space-y-4">
              
              {/* Coupon Code Box */}
              {couponCode ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">Coupon {couponCode} Applied</p>
                      <p className="text-[10px] text-emerald-600">Saved {formatPrice(discountAmount)}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-1">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                        placeholder="Try code: ORBINEX100"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-slate-800 uppercase outline-none focus:border-cyan-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplying || !inputCoupon}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50 cursor-pointer"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1 pl-1">
                      <AlertCircle className="w-3 h-3" />
                      {couponError}
                    </p>
                  )}
                </form>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Gross Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatPrice(totalGross)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Promotional Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Taxes, Surcharges & Fees</span>
                  <span>Included</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-cyan-700 text-base">{formatPrice(totalNet)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 20px 28px 0 rgb(6 182 208 / 0.35)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsDrawerOpen(false);
                  router.push('/checkout');
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-cyan-600/30 transition transform cursor-pointer"
              >
                <span>Proceed to Unified Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={clearCart}
                className="w-full text-center text-[11px] text-slate-400 hover:text-red-500 transition cursor-pointer"
              >
                Clear Cart
              </motion.button>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
