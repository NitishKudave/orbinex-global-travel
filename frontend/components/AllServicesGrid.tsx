'use client';

import React from 'react';
import Link from 'next/link';
import {
  Plane,
  Building2,
  Bus,
  FileCheck2,
  ShieldCheck,
  Palmtree,
  Sparkles,
  HeartPulse,
  Compass,
  Smartphone,
  Tag,
  ArrowRight,
  Train
} from 'lucide-react';

interface ServiceTile {
  id: string;
  name: string;
  subtitle: string;
  actionText: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

const SERVICES: ServiceTile[] = [
  {
    id: 'flights',
    name: 'Flights',
    subtitle: 'Domestic & global airfares',
    actionText: 'Search flights',
    icon: Plane,
    href: '/flights',
    badge: '500+ Airlines',
  },
  {
    id: 'hotels',
    name: 'Hotels & Resorts',
    subtitle: '5-Star luxury & villas',
    actionText: 'Browse stays',
    icon: Building2,
    href: '/hotels',
    badge: 'Free Breakfast',
  },
  {
    id: 'trains',
    name: 'IRCTC Trains',
    subtitle: 'Tatkal, Rajdhani & superfast',
    actionText: 'Book train tickets',
    icon: Train,
    href: '/utilities',
    badge: 'IRCTC Authorized',
  },
  {
    id: 'bus',
    name: 'Buses & Coaches',
    subtitle: 'AC sleeper & Volvo express',
    actionText: 'Book seats',
    icon: Bus,
    href: '/bus',
    badge: 'Seat Selection',
  },
  {
    id: 'holidays',
    name: 'Holiday Packages',
    subtitle: 'Bespoke guided global circuits',
    actionText: 'Explore tours',
    icon: Palmtree,
    href: '/holidays',
    badge: 'Trending Escapes',
  },
  {
    id: 'umrah',
    name: 'Umrah Pilgrimage',
    subtitle: 'Fairmont Clock Tower & Haram',
    actionText: 'View packages',
    icon: Sparkles,
    href: '/umrah',
    badge: 'VIP Concierge',
  },
  {
    id: 'visa',
    name: 'Visa Assistance',
    subtitle: '40+ countries online eVisa',
    actionText: 'Apply online',
    icon: FileCheck2,
    href: '/visa',
    badge: '99.4% Approval',
  },
  {
    id: 'insurance',
    name: 'Travel Insurance',
    subtitle: 'Worldwide $1M medical cover',
    actionText: 'Compare plans',
    icon: ShieldCheck,
    href: '/insurance',
    badge: 'Instant PDF',
  },
  {
    id: 'europamundo',
    name: 'Europamundo',
    subtitle: 'Official European coach circuits',
    actionText: 'View departures',
    icon: Compass,
    href: '/europamundo',
    badge: 'Guaranteed Dates',
  },
  {
    id: 'medical',
    name: 'Medical Tourism',
    subtitle: 'JCI hospitals & 2nd opinions',
    actionText: 'Get free quote',
    icon: HeartPulse,
    href: '/medical-tourism',
    badge: 'Save up to 80%',
  },
  {
    id: 'utilities',
    name: 'Travel Utilities',
    subtitle: 'Forex, instant eSIMs & lounges',
    actionText: 'Manage utilities',
    icon: Smartphone,
    href: '/utilities',
    badge: 'Instant QR',
  },
  {
    id: 'offers',
    name: 'Offers & Coupons',
    subtitle: 'Exclusive discounts & bank cards',
    actionText: 'View 18 deals',
    icon: Tag,
    href: '/offers',
    badge: 'Promo Codes',
  },
];

export default function AllServicesGrid() {
  return (
    <section className="relative py-16 overflow-hidden border-b border-slate-200/80">
      {/* Travel Environment Panoramic Montage (Flights, Train, Hotel Resort, Luxury Bus) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-[1.01]"
        style={{ backgroundImage: `url('/travel_ecosystem_bg.jpg')` }}
      />
      {/* Frosted Glass Overlay: Keeps background vivid while ensuring 100% card & text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/84 to-white/94 backdrop-blur-[1.5px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#0284c7] font-bold text-xs uppercase tracking-wider mb-1.5 bg-sky-50/90 border border-sky-200/80 px-3 py-1 rounded-full backdrop-blur-sm shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Comprehensive Travel Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight drop-shadow-xs">
              Everything You Need for Your Journey
            </h2>
            <p className="text-sm font-medium text-slate-600 mt-1 max-w-2xl drop-shadow-xs">
              Flights, hotels, trains, buses, holidays, visas and more — all in one integrated luxury portal.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-sky-800 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-100 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>12 Integrated Travel Modules Active</span>
          </div>
        </div>

        {/* Clean Luxury Glassmorphic Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id}>
                <Link
                  href={service.href}
                  className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white/92 hover:bg-white backdrop-blur-md border border-white/90 hover:border-sky-300 shadow-[0_4px_16px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_32px_rgba(2,132,199,0.16)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer h-full"
                >
                  <div>
                    {/* Micro Badge */}
                    {service.badge && (
                      <span className="inline-block self-start text-[10px] font-bold text-slate-600 bg-slate-100/90 group-hover:bg-sky-50 group-hover:text-[#0284c7] px-2.5 py-0.5 rounded-full mb-3 transition-colors truncate max-w-full border border-slate-200/50">
                        {service.badge}
                      </span>
                    )}

                    {/* Icon Container */}
                    <div className="w-10 h-10 rounded-xl bg-slate-50/90 group-hover:bg-sky-50 border border-slate-200/80 group-hover:border-sky-200 flex items-center justify-center mb-3 text-[#0284c7] transition-all duration-300 group-hover:scale-110 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Service Info */}
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors leading-snug">
                      {service.name}
                    </h3>
                    <p className="text-[11.5px] text-slate-500 group-hover:text-slate-600 mt-1 line-clamp-2 leading-relaxed font-normal">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Clean Action Link */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 group-hover:text-[#0284c7] transition-colors">
                    <span>{service.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

