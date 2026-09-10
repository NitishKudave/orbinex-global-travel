'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Tag,
  Copy,
  CheckCircle2,
  Sparkles,
  Plane,
  Building2,
  Palmtree,
  CreditCard,
  ArrowRight,
  Flame
} from 'lucide-react';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';

export default function OffersPage() {
  const { applyCoupon, setIsDrawerOpen } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState('all');

  const offers = [
    {
      code: 'ORBINEX100',
      title: 'FLAT $100 OFF on Global Bookings',
      description: 'Applicable across Flights, 5-Star Hotels, Umrah, and Holiday Tour Packages on orders exceeding $500.',
      category: 'all',
      badge: 'UNIVERSAL SPECIAL',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      validity: 'Valid till 31 Dec 2026',
      ctaLink: '/flights',
      ctaText: 'Book Travel Now',
    },
    {
      code: 'FLYGLOBAL',
      title: '15% Instant Discount on International Flights',
      description: 'Save up to $150 on Emirates, Qatar Airways, Singapore Airlines, and British Airways bookings.',
      category: 'flight',
      badge: 'AIRLINE SALE',
      badgeColor: 'bg-sky-100 text-sky-800',
      validity: 'Valid on all routes',
      ctaLink: '/flights',
      ctaText: 'Search Flights',
    },
    {
      code: 'LUXURYHOTEL',
      title: '20% OFF on Luxury Resorts & 5-Star Stays',
      description: 'Enjoy 20% discount plus complimentary daily gourmet breakfast at Burj Al Arab, The Savoy, and Bali private pool villas.',
      category: 'hotel',
      badge: '5★ PRIVILEGE',
      badgeColor: 'bg-amber-100 text-amber-800',
      validity: 'Free cancellation included',
      ctaLink: '/hotels',
      ctaText: 'Explore Hotels',
    },
    {
      code: 'HOLIDAY200',
      title: 'FLAT $200 OFF on Handcrafted Tour Packages',
      description: 'Instant $200 cash reduction when booking Bali Paradise, Swiss Alps Glacier Express, or Paris Romantic Circuits.',
      category: 'holiday',
      badge: 'TOUR SAVER',
      badgeColor: 'bg-rose-100 text-rose-800',
      validity: 'For 2+ travelers',
      ctaLink: '/holidays',
      ctaText: 'Browse Packages',
    },
    {
      code: 'VISAPASS',
      title: 'FLAT $20 OFF on Electronic Visa Fees',
      description: 'Apply for UAE, Schengen Europe, or UK tourist visas with fee discounts and 24h express processing.',
      category: 'visa',
      badge: 'VISA DISCOUNT',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      validity: 'Single & Multi entry',
      ctaLink: '/visa',
      ctaText: 'Apply for Visa',
    },
    {
      code: 'HDFCTRAVEL',
      title: '10% Extra Discount with Bank Partner Cards',
      description: 'Exclusive cardholder instant savings on all cross-border flight, hotel, and mixed cart checkouts.',
      category: 'bank',
      badge: 'BANK PARTNER',
      badgeColor: 'bg-purple-100 text-purple-800',
      validity: 'HDFC, Chase & Amex cards',
      ctaLink: '/cart',
      ctaText: 'Go to Cart',
    },
  ];

  const filtered = filterCat === 'all' ? offers : offers.filter((o) => o.category === filterCat);

  const handleCopyAndApply = async (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    await applyCoupon(code);
    setIsDrawerOpen(true);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-purple-500/20 border border-purple-400/30 text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Active Promo Codes & Flash Deals
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Orbinex Deals, Coupons & Bank Privileges
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Copy coupon codes with one click to apply instant discounts across flights, 5-star hotels, tour circuits, and unified mixed cart checkouts.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex rounded-2xl bg-white p-1.5 border border-slate-200 shadow-xs max-w-xl mx-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Deals' },
            { id: 'flight', label: 'Flights' },
            { id: 'hotel', label: 'Hotels' },
            { id: 'holiday', label: 'Holiday Tours' },
            { id: 'visa', label: 'Visas' },
            { id: 'bank', label: 'Bank Offers' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCat(cat.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                filterCat === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((deal) => (
            <div
              key={deal.code}
              className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition duration-300 space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${deal.badgeColor}`}>
                    {deal.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{deal.validity}</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 mt-3 leading-snug">{deal.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{deal.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <span className="font-mono text-sm font-black text-purple-700 tracking-wider">
                    {deal.code}
                  </span>
                  <button
                    onClick={() => handleCopyAndApply(deal.code)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    {copiedCode === deal.code ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Applied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy & Apply</span>
                      </>
                    )}
                  </button>
                </div>

                <Link
                  href={deal.ctaLink}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:text-purple-600 block transition"
                >
                  {deal.ctaText} →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
