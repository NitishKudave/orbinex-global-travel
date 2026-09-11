'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Plane,
  Building2,
  Bus,
  FileCheck2,
  ShieldCheck,
  Palmtree,
  HeartPulse,
  Compass,
  ArrowRight,
  Star,
  CheckCircle2,
  Copy,
  Clock,
  MapPin,
  Tag,
  ShieldAlert,
  Percent,
  Flame,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import HeroSearch from '@/components/HeroSearch';
import AllServicesGrid from '@/components/AllServicesGrid';
import AnimatedSection, { FadeInUp } from '@/components/AnimatedSection';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const { formatPrice, addItem } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [dealTab, setDealTab] = useState<'HOT DEALS' | 'FLIGHT' | 'HOTEL' | 'HOLIDAYS' | 'VISA'>('FLIGHT');

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const sampleDeals = [
    {
      code: 'ORBINEX100',
      title: 'FLAT $100 OFF',
      subtitle: 'On all orders above $500 across any module',
      badge: 'UNIVERSAL PASS',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      code: 'FLYGLOBAL',
      title: '15% OFF FLIGHTS',
      subtitle: 'Up to $150 off on Emirates, Qatar & BA',
      badge: 'AIRLINE SALE',
      badgeColor: 'bg-sky-100 text-sky-800',
    },
    {
      code: 'LUXURYHOTEL',
      title: '20% OFF 5-STAR STAYS',
      subtitle: 'Complimentary breakfast & room upgrade',
      badge: 'LUXURY STAY',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      code: 'HOLIDAY200',
      title: 'FLAT $200 OFF TOURS',
      subtitle: 'Bali, Swiss Alps & Paris holiday circuits',
      badge: 'HOLIDAY SPECIAL',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
  ];

  const featuredDestinations = [
    {
      id: 1,
      title: 'Enchanting Bali: 6 Days Private Pool Villa Escape',
      location: 'Bali, Indonesia',
      duration: '6 Days / 5 Nights',
      price: 699,
      originalPrice: 999,
      rating: 4.9,
      reviews: 320,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      tags: ['Private Pool Villa', 'Nusa Penida Boat', 'Daily Breakfast'],
      type: 'holiday' as const,
    },
    {
      id: 2,
      title: 'Swiss Alps Glacier Express & Paris Romance Circuit',
      location: 'Switzerland & Paris',
      duration: '8 Days / 7 Nights',
      price: 1499,
      originalPrice: 1899,
      rating: 4.9,
      reviews: 410,
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99',
      tags: ['Mt. Titlis Cable Car', 'TGV Rail', '4-Star Hotels'],
      type: 'holiday' as const,
    },
    {
      id: 3,
      title: 'Burj Al Arab Jumeirah: Ultra-Luxury Arabian Gulf Suite',
      location: 'Dubai, UAE',
      duration: 'Per Night Stay',
      price: 1250,
      originalPrice: 1550,
      rating: 4.9,
      reviews: 1850,
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
      tags: ['Private Island', 'Butler Service', '5-Star Luxury'],
      type: 'hotel' as const,
    },
  ];

  return (
    <div className="space-y-0">
      
      {/* 1. Hero Dynamic Search Widget */}
      <HeroSearch />

      {/* 2. Exclusive Deals Section (Akbar Travels Signature Style) */}
      <section className="pt-12 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <h2 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
                Exclusive Deals
              </h2>
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
                {(['HOT DEALS', 'FLIGHT', 'HOTEL', 'HOLIDAYS', 'VISA'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDealTab(tab)}
                    className={`text-xs sm:text-[13px] font-extrabold uppercase tracking-wider px-2 py-1.5 transition-all cursor-pointer relative ${
                      dealTab === tab
                        ? 'text-[#0284c7]'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    <span>{tab}</span>
                    {dealTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0284c7] rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Carousel Arrows + View All */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="flex items-center gap-1.5">
                <button
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                  aria-label="Previous Deal"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  className="w-7 h-7 rounded-full bg-[#0284c7] hover:bg-sky-700 text-white flex items-center justify-center transition cursor-pointer"
                  aria-label="Next Deal"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <Link
                href="/offers"
                className="text-xs sm:text-sm font-bold text-[#0284c7] hover:underline"
              >
                View All
              </Link>
            </div>
          </div>

          {/* 4 Wide Deal Cards Side-by-Side (Akbar Travels Exact Match) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                id: 'deal-1',
                image: '/deals/deal_macbook.jpg',
                title: 'BOOK & WIN MacBook Neo',
                code: 'WINMAC',
                href: '/flights',
              },
              {
                id: 'deal-2',
                image: '/deals/deal_british_airways.jpg',
                title: 'Exclusive Discount on British Airways',
                code: 'FLYBA',
                href: '/flights?destination=LHR',
              },
              {
                id: 'deal-3',
                image: '/deals/deal_business_class.jpg',
                title: 'Special Discount on Business Class Flights - Up to ₹10,000 OFF',
                code: 'ATFLY',
                href: '/flights?cabin=business',
              },
              {
                id: 'deal-4',
                image: '/deals/deal_payday.jpg',
                title: "Jazeera Airways It's PAYDAY - Up To 30% OFF",
                code: 'PAYDAY',
                href: '/flights?destination=DXB',
              },
            ].map((deal) => (
              <Link
                key={deal.id}
                href={deal.href}
                className="group block relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/90 transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-slate-900"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Trending Routes With Cheap Fares (Aviation Flight Sky Travel Background) */}
      <section className="relative py-14 overflow-hidden border-b border-slate-200/80">
        {/* Scenic Flight Sky Travel Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
          style={{ backgroundImage: `url('/routes_flight_sky_bg.jpg')` }}
        />
        {/* Frosted Glass Overlay for 100% Card & Route Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/94 via-white/86 to-white/95 backdrop-blur-[1.5px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider mb-2 px-3 py-1 rounded-full shadow-sm border" style={{background: 'linear-gradient(135deg, rgba(2,132,199,0.1), rgba(14,165,233,0.08))', borderColor: 'rgba(2,132,199,0.30)', color: '#0284c7'}}>
                <Plane className="w-3.5 h-3.5" />
                <span>Lowest Airfare Guarantee</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                <span className="text-slate-900">Trending Routes </span>
                <span style={{background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>With Cheap Fares</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Book flight tickets at guaranteed best prices on popular domestic and international routes
              </p>
            </div>
            <Link
              href="/flights"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0284c7] hover:underline bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-100 shadow-2xs"
            >
              <span>View All Routes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                from: 'Mumbai',
                fromCode: 'BOM',
                to: 'New Delhi',
                toCode: 'DEL',
                price: '₹4,990',
                airline: 'Air India / IndiGo',
                duration: '2h 10m',
                type: 'Direct'
              },
              {
                from: 'Mumbai',
                fromCode: 'BOM',
                to: 'Dubai',
                toCode: 'DXB',
                price: '₹8,499',
                airline: 'Emirates / flydubai',
                duration: '3h 30m',
                type: 'Direct'
              },
              {
                from: 'New Delhi',
                fromCode: 'DEL',
                to: 'London',
                toCode: 'LHR',
                price: '₹24,999',
                airline: 'British Airways / Virgin',
                duration: '9h 15m',
                type: 'Direct'
              },
              {
                from: 'Bengaluru',
                fromCode: 'BLR',
                to: 'Singapore',
                toCode: 'SIN',
                price: '₹11,200',
                airline: 'Singapore Airlines',
                duration: '4h 35m',
                type: 'Direct'
              },
              {
                from: 'Mumbai',
                fromCode: 'BOM',
                to: 'Goa',
                toCode: 'GOI',
                price: '₹2,899',
                airline: 'IndiGo / Akasa Air',
                duration: '1h 15m',
                type: 'Direct'
              },
              {
                from: 'Dubai',
                fromCode: 'DXB',
                to: 'Jeddah',
                toCode: 'JED',
                price: '₹6,499',
                airline: 'Saudia / flynas',
                duration: '2h 55m',
                type: 'Direct'
              },
            ].map((route, idx) => (
              <Link
                key={idx}
                href={`/flights?origin=${route.fromCode}&destination=${route.toCode}&tripType=oneway`}
                className="group bg-white/94 hover:bg-white rounded-2xl p-4 sm:p-5 border border-white/90 hover:border-[#0284c7] backdrop-blur-md shadow-[0_4px_16px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_32px_rgba(2,132,199,0.16)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284c7] flex items-center justify-center font-black text-xs shadow-2xs">
                      <Plane className="w-4 h-4 rotate-45" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{route.airline}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {route.type} • {route.duration}
                  </span>
                </div>

                <div className="py-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">{route.fromCode}</span>
                    <span className="text-base font-black text-slate-900">{route.from}</span>
                  </div>
                  <div className="flex flex-col items-center px-2">
                    <span className="text-[10px] text-slate-400 font-semibold">To</span>
                    <div className="w-12 h-0.5 bg-slate-200 relative my-1">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#0284c7] rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 block">{route.toCode}</span>
                    <span className="text-base font-black text-slate-900">{route.to}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Starts from</span>
                    <span className="text-lg font-black text-[#eb2026]">{route.price}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] group-hover:translate-x-1 transition-transform">
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. All Services Signature Grid */}
      <FadeInUp delay={0.1}>
        <AllServicesGrid />
      </FadeInUp>

      {/* 4. Trending Holiday Packages & Luxury Stays (Tropical Paradise & Luxury Resorts Background) */}
      <section className="relative py-16 overflow-hidden border-b border-slate-200/80">
        {/* Tropical Holiday Paradise Panoramic Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-[1.01]"
          style={{ backgroundImage: `url('/holidays_paradise_bg.jpg')` }}
        />
        {/* Frosted Glass Overlay: Keeps paradise lagoon vivid while keeping tour cards completely crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/93 via-white/84 to-white/95 backdrop-blur-[1.5px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50/90 border border-rose-200/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-xs">
                ✈ Handcrafted Journeys
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
                <span className="text-slate-900">Trending Holiday Tours</span>
                <br />
                <span style={{background: 'linear-gradient(135deg, #f43f5e, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>&amp; Luxury Stays</span>
              </h2>
              <p className="text-sm font-medium text-slate-600 mt-1 max-w-2xl">
                Handpicked global tour circuits with premium accommodations, private transfers, and professional local guides.
              </p>
            </div>
            <Link
              href="/holidays"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-rose-600 bg-white/90 hover:bg-white border border-slate-200 px-4 py-2 rounded-xl transition shadow-xs backdrop-blur-sm"
            >
              <span>Explore All Tours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDestinations.map((item) => (
              <div
                key={item.id}
                className="group bg-white/95 hover:bg-white rounded-2xl border border-white/90 overflow-hidden shadow-[0_4px_18px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.14)] hover:border-sky-300 transition-all duration-300 flex flex-col hover:-translate-y-1.5 backdrop-blur-md"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className="bg-[#071426]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {item.duration}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{item.location}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0284c7] transition line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10.5px] font-semibold text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10.5px] text-slate-400 line-through block">
                        {formatPrice(item.originalPrice)}
                      </span>
                      <span className="text-xl font-extrabold text-slate-900">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">per traveler</span>
                    </div>

                    <button
                      onClick={() => {
                        addItem({
                          booking_type: item.type,
                          title: item.title,
                          subtitle: `${item.location} • ${item.duration}`,
                          amount: item.price,
                          original_amount: item.originalPrice,
                          image: item.image,
                          travel_date: '2026-09-15',
                          details: { location: item.location, duration: item.duration },
                        });
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#071426] hover:bg-[#0284c7] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs active:scale-98"
                    >
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Umrah Pilgrimage Spotlight Banner (Royal Emerald Green & Gold with Holy Haram Background) */}
      <section className="relative py-16 bg-gradient-to-br from-[#031d16] via-[#08382b] to-[#021811] text-white border-y border-[#0d5340]/80 overflow-hidden">
        {/* Holy Makkah Haram & Clock Tower Atmospheric Background Texture */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/makkah_spiritual_bg.jpg')` }}
        />
        {/* Subtle Ambient Backlight Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 px-3.5 py-1 rounded-full border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Dedicated Islamic Pilgrimage Wing
              </span>
              <h2
                className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight"
              >
                VIP 5-Star Umrah Packages: Facing Masjid al-Haram &amp; Rawdah
              </h2>
              <p
                className="text-emerald-100/80 text-sm leading-relaxed"
              >
                Perform your spiritual journey in utmost tranquility. We bundle 5-Star Clock Tower Haram front suites, Dar Al Taqwa Madinah, Saudi 1-Year Multiple Entry eVisa, private GMC Yukon airport transfers, and scholar-guided historical Ziyarat tours.
              </p>

              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2"
              >
                <div
                  className="bg-[#05281e]/90 border border-[#0d4f3c] hover:border-amber-400/50 p-3.5 rounded-xl shadow-md transition-all"
                >
                  <span className="text-[10px] text-amber-300/80 uppercase block font-bold">Makkah Hotel</span>
                  <span className="text-xs font-bold text-white">Fairmont Clock Tower</span>
                  <span className="text-[10px] text-amber-400 block mt-0.5 font-semibold">0m Facing Kaaba</span>
                </div>
                <div
                  className="bg-[#05281e]/90 border border-[#0d4f3c] hover:border-amber-400/50 p-3.5 rounded-xl shadow-md transition-all"
                >
                  <span className="text-[10px] text-amber-300/80 uppercase block font-bold">Madinah Hotel</span>
                  <span className="text-xs font-bold text-white">Dar Al Taqwa 5★</span>
                  <span className="text-[10px] text-amber-400 block mt-0.5 font-semibold">50m to Rawdah</span>
                </div>
                <div
                  className="bg-[#05281e]/90 border border-[#0d4f3c] hover:border-amber-400/50 p-3.5 rounded-xl shadow-md transition-all"
                >
                  <span className="text-[10px] text-amber-300/80 uppercase block font-bold">Visa &amp; Transfers</span>
                  <span className="text-xs font-bold text-white">1-Year eVisa + GMC</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5 font-semibold">Included</span>
                </div>
              </div>

              <div
                className="pt-2 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/umrah"
                  className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:scale-[1.02]"
                >
                  Explore All Umrah Packages
                </Link>
                <Link
                  href="/visa"
                  className="bg-[#063024] hover:bg-[#0a4233] text-amber-100 font-semibold text-xs px-5 py-3 rounded-xl border border-[#145d47] transition"
                >
                  Apply for Saudi eVisa
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/35 group ring-1 ring-amber-400/20"
              >
                <img
                  src="https://images.unsplash.com/photo-1564769625905-50e93615e769"
                  alt="Holy Kaaba Makkah"
                  className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021811]/95 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span
                    className="text-amber-400 font-bold text-xs uppercase tracking-wider"
                  >Executive Package</span>
                  <h4 className="text-lg font-bold text-white">14 Days Executive VIP Umrah Pilgrimage</h4>
                  <p className="text-xs text-amber-200/90 mt-1">Starting from {formatPrice(1650)} / Pilgrim (Quad Sharing)</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Medical Tourism & European Circuits Grid */}
      <FadeInUp delay={0.15}>
        <div className="py-14 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Medical Tourism Card */}
              <div
                className="relative group bg-white p-6 sm:p-7 rounded-2xl border border-red-200/80 shadow-xs flex flex-col justify-between overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Subtle Healthcare Wellness Ambient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
                    <HeartPulse className="w-4 h-4" />
                    <span>Global Healthcare Concierge</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Medical Tourism: Save Up to 85% with JCI Accredited Hospitals
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Connect with world-class surgeons at Apollo Hospitals India and Bumrungrad Thailand for Robotic Knee Replacements, Minimally Invasive Heart Surgeries, Cosmetic &amp; Dental Makeovers with zero waitlists.
                  </p>

                  <div className="mt-4 p-3.5 bg-red-50/80 backdrop-blur-xs rounded-xl border border-red-100 flex items-center justify-between text-xs shadow-2xs">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">Robotic Knee Replacement</span>
                      <span className="font-bold text-red-700">Apollo India: $4,800</span>
                    </div>
                    <span className="text-slate-500 text-xs font-bold">vs US Avg: $35,000</span>
                  </div>
                </div>

                <div className="relative mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/medical-tourism"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition"
                  >
                    <span>Request Free 2nd Opinion &amp; Quote</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Europamundo Card with Scenic European Coach Route Background */}
              <div
                className="relative group bg-white p-6 sm:p-7 rounded-2xl border border-sky-200/90 shadow-xs flex flex-col justify-between overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Europamundo Coach Scenic Highway Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105 opacity-20"
                  style={{ backgroundImage: `url('/europamundo_coach_bg.jpg')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/90" />

                <div className="relative">
                  <div className="flex items-center gap-2 text-[#0284c7] font-bold text-xs uppercase tracking-wider mb-2">
                    <Compass className="w-4 h-4" />
                    <span>Official Guided Coach Circuits</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Europamundo European Circuits with Guaranteed Departures
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                    Travel across Spain, Portugal, Italy, and Switzerland in panoramic luxury coaches. Multilingual audio guides in English, Spanish, and Arabic with 4-star city hotels included.
                  </p>

                  <div className="mt-4 p-3.5 bg-sky-50/80 backdrop-blur-xs rounded-xl border border-sky-200/80 flex items-center justify-between text-xs shadow-2xs">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">Classic Iberian Tour (10 Days)</span>
                      <span className="font-bold text-[#0284c7]">Madrid, Granada, Lisbon, Porto</span>
                    </div>
                    <span className="font-extrabold text-slate-900 text-sm">{formatPrice(1450)}</span>
                  </div>
                </div>

                <div className="relative mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/europamundo"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284c7] hover:text-sky-700 transition"
                  >
                    <span>View European Tour Departures</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </FadeInUp>

      {/* 7. Why Choose OrbinexGlobal Pillars */}
      <FadeInUp delay={0.2}>
        <section className="py-14 bg-white border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="text-center max-w-2xl mx-auto mb-10"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Why Global Travelers Trust Orbinex
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Engineered for seamless multi-product booking with complete financial protection.
              </p>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              <div
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:-translate-y-1 hover:shadow-xs transition duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284c7] border border-sky-100 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">100% Protected Bookings</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Full financial security and instant digital vouchers with verifiable QR codes.
                </p>
              </div>

              <div
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:-translate-y-1 hover:shadow-xs transition duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center mb-3">
                  <Percent className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Unified Mixed Cart</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Combine flights, hotels, insurance, and eSIMs in a single 1-click checkout.
                </p>
              </div>

              <div
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:-translate-y-1 hover:shadow-xs transition duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-3">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">99.4% Visa Success</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Expert document pre-audit and direct embassy dispatch for swift electronic approvals.
                </p>
              </div>

              <div
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:-translate-y-1 hover:shadow-xs transition duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">24/7 Global Concierge</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Round-the-clock priority WhatsApp, phone, and airport desk assistance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInUp>

    </div>
  );
}
