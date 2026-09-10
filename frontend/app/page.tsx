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
  Flame
} from 'lucide-react';
import HeroSearch from '@/components/HeroSearch';
import AllServicesGrid from '@/components/AllServicesGrid';
import AnimatedSection, { FadeInUp } from '@/components/AnimatedSection';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const { formatPrice, addItem } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

      {/* 2. All Services Signature 12-Icon Grid */}
      <FadeInUp delay={0.1}>
        <AllServicesGrid />
      </FadeInUp>

      {/* 3. Live Promotional Coupons & Bank Deals Strip */}
      <AnimatedSection className="py-14 bg-[#071426] text-white relative overflow-hidden border-y border-[#162a45]" delay={0.15} staggerChildren={0.07}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none animate-float" aria-hidden="true" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight">Exclusive Travel Offers &amp; Promotions</h3>
                <p className="text-xs text-slate-300 mt-0.5">Apply coupon code at checkout for instant cash discounts on flights, hotels &amp; tours</p>
              </div>
            </div>
            <Link
              href="/offers"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition shrink-0"
            >
              <span>View All Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleDeals.map((deal) => (
              <motion.div
                key={deal.code}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <div className="h-full bg-[#0b1d35] border border-[#1e3a5f] hover:border-cyan-400/50 rounded-2xl p-5 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_30px_rgba(2,132,199,0.15)] transition-all duration-200">
                  <div>
                    <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
                      {deal.badge}
                    </span>
                    <h4 className="text-lg font-extrabold text-white mt-2.5 tracking-tight">{deal.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">{deal.subtitle}</p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-[#1e3a5f]/80 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-300 tracking-wider bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {deal.code}
                    </span>
                    <button
                      onClick={() => copyCoupon(deal.code)}
                      className="inline-flex items-center gap-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-400/30 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer active:scale-95"
                      title="Copy Coupon Code"
                    >
                      {copiedCode === deal.code ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </AnimatedSection>

      {/* 4. Trending Holiday Packages & Luxury Stays */}
      <AnimatedSection className="py-14 bg-white" delay={0.2} staggerChildren={0.12}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                Handcrafted Journeys
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                Trending Holiday Tours &amp; Luxury Stays
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Handpicked global tour circuits with premium accommodations and private guides.
              </p>
            </div>
            <Link
              href="/holidays"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-rose-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition"
            >
              <span>Explore All Tours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDestinations.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col hover:-translate-y-1"
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
                    <span className="bg-[#071426]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
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
                          className="text-[10.5px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
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
      </AnimatedSection>

      {/* 5. Umrah Pilgrimage Spotlight Banner */}
      <section className="py-14 bg-[#071426] text-white border-b border-[#162a45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/25"
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
                className="text-slate-300 text-sm leading-relaxed"
              >
                Perform your spiritual journey in utmost tranquility. We bundle 5-Star Clock Tower Haram front suites, Dar Al Taqwa Madinah, Saudi 1-Year Multiple Entry eVisa, private GMC Yukon airport transfers, and scholar-guided historical Ziyarat tours.
              </p>

              <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2"
              >
                <div
                  className="bg-[#0b1d35] border border-[#1e3a5f] p-3.5 rounded-xl"
                >
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Makkah Hotel</span>
                  <span className="text-xs font-bold text-white">Fairmont Clock Tower</span>
                  <span className="text-[10px] text-amber-400 block mt-0.5">0m Facing Kaaba</span>
                </div>
                <div
                  className="bg-[#0b1d35] border border-[#1e3a5f] p-3.5 rounded-xl"
                >
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Madinah Hotel</span>
                  <span className="text-xs font-bold text-white">Dar Al Taqwa 5★</span>
                  <span className="text-[10px] text-amber-400 block mt-0.5">50m to Rawdah</span>
                </div>
                <div
                  className="bg-[#0b1d35] border border-[#1e3a5f] p-3.5 rounded-xl"
                >
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Visa &amp; Transfers</span>
                  <span className="text-xs font-bold text-white">1-Year eVisa + GMC</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Included</span>
                </div>
              </div>

              <div
                className="pt-2 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/umrah"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition shadow-sm"
                >
                  Explore All Umrah Packages
                </Link>
                <Link
                  href="/visa"
                  className="bg-[#0b1d35] hover:bg-[#162a45] text-white font-semibold text-xs px-5 py-3 rounded-xl border border-[#1e3a5f] transition"
                >
                  Apply for Saudi eVisa
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 group"
              >
                <img
                  src="https://images.unsplash.com/photo-1564769625905-50e93615e769"
                  alt="Holy Kaaba Makkah"
                  className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span
                    className="text-amber-400 font-bold text-xs uppercase tracking-wider"
                  >Executive Package</span>
                  <h4 className="text-lg font-bold text-white">14 Days Executive VIP Umrah Pilgrimage</h4>
                  <p className="text-xs text-slate-300 mt-1">Starting from {formatPrice(1650)} / Pilgrim (Quad Sharing)</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Medical Tourism & European Circuits Grid */}
      <FadeInUp delay={0.15}>
        <div className="py-14 bg-slate-50/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Medical Tourism Card */}
              <div
                className="relative group bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
                    <HeartPulse className="w-4 h-4" />
                    <span>Global Healthcare Concierge</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Medical Tourism: Save Up to 85% with JCI Accredited Hospitals
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Connect with world-class surgeons at Apollo Hospitals India and Bumrungrad Thailand for Robotic Knee Replacements, Minimally Invasive Heart Surgeries, Cosmetic &amp; Dental Makeovers with zero waitlists.
                  </p>

                  <div className="mt-4 p-3 bg-red-50/60 rounded-xl border border-red-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Robotic Knee Replacement</span>
                      <span className="font-bold text-red-700">Apollo India: $4,800</span>
                    </div>
                    <span className="text-slate-400 text-xs font-semibold">vs US Avg: $35,000</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/medical-tourism"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition"
                  >
                    <span>Request Free 2nd Opinion &amp; Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Europamundo Card */}
              <div
                className="relative group bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center gap-2 text-[#0284c7] font-bold text-xs uppercase tracking-wider mb-2">
                    <Compass className="w-4 h-4" />
                    <span>Official Guided Coach Circuits</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Europamundo European Circuits with Guaranteed Departures
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Travel across Spain, Portugal, Italy, and Switzerland in panoramic luxury coaches. Multilingual audio guides in English, Spanish, and Arabic with 4-star city hotels included.
                  </p>

                  <div className="mt-4 p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Classic Iberian Tour (10 Days)</span>
                      <span className="font-bold text-[#0284c7]">Madrid, Granada, Lisbon, Porto</span>
                    </div>
                    <span className="font-bold text-slate-800">{formatPrice(1450)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/europamundo"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284c7] hover:text-sky-700 transition"
                  >
                    <span>View European Tour Departures</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
