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
  UserCheck,
  ArrowRight
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
    id: 'medical',
    name: 'Medical Tourism',
    subtitle: 'JCI hospitals & 2nd opinions',
    actionText: 'Get free quote',
    icon: HeartPulse,
    href: '/medical-tourism',
    badge: 'Save up to 80%',
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
  {
    id: 'dashboard',
    name: 'My Dashboard',
    subtitle: 'Manage bookings & e-tickets',
    actionText: 'View portal',
    icon: UserCheck,
    href: '/dashboard',
    badge: 'Live Portal',
  },
];

export default function AllServicesGrid() {
  return (
    <section className="py-14 bg-slate-50/70 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading per Design Direction */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#0284c7] font-bold text-xs uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Comprehensive Travel Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need for Your Journey
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Flights, hotels, buses, holidays, visas and more — all in one place.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>12 Integrated Travel Modules</span>
          </div>
        </div>

        {/* Clean Luxury White Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id}>
                <Link
                  href={service.href}
                  className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] hover:border-sky-300 transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full"
                >
                  <div>
                    {/* Micro Badge */}
                    {service.badge && (
                      <span className="inline-block self-start text-[10px] font-semibold text-slate-500 bg-slate-100 group-hover:bg-sky-50 group-hover:text-[#0284c7] px-2 py-0.5 rounded-full mb-3 transition-colors truncate max-w-full">
                        {service.badge}
                      </span>
                    )}

                    {/* Subtle Icon Container */}
                    <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-sky-50 border border-slate-100 group-hover:border-sky-100 flex items-center justify-center mb-3 text-[#0284c7] transition-all duration-200 group-hover:scale-105">
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Service Info */}
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0284c7] transition-colors leading-snug">
                      {service.name}
                    </h3>
                    <p className="text-[11.5px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Clean Action Link */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-[#0284c7] transition-colors">
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

