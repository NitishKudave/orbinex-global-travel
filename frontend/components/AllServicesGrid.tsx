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
  iconGradient: string;
  iconGlow: string;
  borderHover: string;
  shadowHover: string;
  textHover: string;
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
    iconGradient: 'from-sky-500 to-blue-600',
    iconGlow: 'group-hover:shadow-sky-500/40',
    borderHover: 'hover:border-sky-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(14,165,233,0.25)]',
    textHover: 'group-hover:text-sky-600',
  },
  {
    id: 'hotels',
    name: 'Hotels & Resorts',
    subtitle: '5-Star luxury & villas',
    actionText: 'Browse stays',
    icon: Building2,
    href: '/hotels',
    badge: 'Free Breakfast',
    iconGradient: 'from-rose-500 to-red-600',
    iconGlow: 'group-hover:shadow-rose-500/40',
    borderHover: 'hover:border-rose-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(244,63,94,0.20)]',
    textHover: 'group-hover:text-rose-600',
  },
  {
    id: 'trains',
    name: 'IRCTC Trains',
    subtitle: 'Tatkal, Rajdhani & superfast',
    actionText: 'Book train tickets',
    icon: Train,
    href: '/utilities',
    badge: 'IRCTC Authorized',
    iconGradient: 'from-emerald-500 to-teal-600',
    iconGlow: 'group-hover:shadow-emerald-500/40',
    borderHover: 'hover:border-emerald-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(16,185,129,0.20)]',
    textHover: 'group-hover:text-emerald-600',
  },
  {
    id: 'bus',
    name: 'Buses & Coaches',
    subtitle: 'AC sleeper & Volvo express',
    actionText: 'Book seats',
    icon: Bus,
    href: '/bus',
    badge: 'Seat Selection',
    iconGradient: 'from-purple-500 to-indigo-600',
    iconGlow: 'group-hover:shadow-purple-500/40',
    borderHover: 'hover:border-purple-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(168,85,247,0.20)]',
    textHover: 'group-hover:text-purple-600',
  },
  {
    id: 'holidays',
    name: 'Holiday Packages',
    subtitle: 'Bespoke guided global circuits',
    actionText: 'Explore tours',
    icon: Palmtree,
    href: '/holidays',
    badge: 'Trending Escapes',
    iconGradient: 'from-amber-500 to-orange-600',
    iconGlow: 'group-hover:shadow-amber-500/40',
    borderHover: 'hover:border-amber-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(245,158,11,0.20)]',
    textHover: 'group-hover:text-amber-600',
  },
  {
    id: 'umrah',
    name: 'Umrah Pilgrimage',
    subtitle: 'Fairmont Clock Tower & Haram',
    actionText: 'View packages',
    icon: Sparkles,
    href: '/umrah',
    badge: 'VIP Concierge',
    iconGradient: 'from-emerald-700 to-teal-800',
    iconGlow: 'group-hover:shadow-emerald-700/40',
    borderHover: 'hover:border-emerald-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(6,95,70,0.20)]',
    textHover: 'group-hover:text-emerald-700',
  },
  {
    id: 'visa',
    name: 'Visa Assistance',
    subtitle: '40+ countries online eVisa',
    actionText: 'Apply online',
    icon: FileCheck2,
    href: '/visa',
    badge: '99.4% Approval',
    iconGradient: 'from-cyan-500 to-teal-600',
    iconGlow: 'group-hover:shadow-cyan-500/40',
    borderHover: 'hover:border-cyan-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(6,182,212,0.20)]',
    textHover: 'group-hover:text-cyan-600',
  },
  {
    id: 'insurance',
    name: 'Travel Insurance',
    subtitle: 'Worldwide $1M medical cover',
    actionText: 'Compare plans',
    icon: ShieldCheck,
    href: '/insurance',
    badge: 'Instant PDF',
    iconGradient: 'from-blue-600 to-indigo-700',
    iconGlow: 'group-hover:shadow-blue-500/40',
    borderHover: 'hover:border-blue-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(37,99,235,0.20)]',
    textHover: 'group-hover:text-blue-600',
  },
  {
    id: 'europamundo',
    name: 'Europamundo',
    subtitle: 'Official European coach circuits',
    actionText: 'View departures',
    icon: Compass,
    href: '/europamundo',
    badge: 'Guaranteed Dates',
    iconGradient: 'from-violet-600 to-purple-700',
    iconGlow: 'group-hover:shadow-violet-500/40',
    borderHover: 'hover:border-violet-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(124,58,237,0.20)]',
    textHover: 'group-hover:text-violet-600',
  },
  {
    id: 'medical',
    name: 'Medical Tourism',
    subtitle: 'JCI hospitals & 2nd opinions',
    actionText: 'Get free quote',
    icon: HeartPulse,
    href: '/medical-tourism',
    badge: 'Save up to 80%',
    iconGradient: 'from-pink-500 to-rose-600',
    iconGlow: 'group-hover:shadow-pink-500/40',
    borderHover: 'hover:border-pink-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(236,72,153,0.20)]',
    textHover: 'group-hover:text-pink-600',
  },
  {
    id: 'utilities',
    name: 'Travel Utilities',
    subtitle: 'Forex, instant eSIMs & lounges',
    actionText: 'Manage utilities',
    icon: Smartphone,
    href: '/utilities',
    badge: 'Instant QR',
    iconGradient: 'from-teal-500 to-cyan-600',
    iconGlow: 'group-hover:shadow-teal-500/40',
    borderHover: 'hover:border-teal-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(20,184,166,0.20)]',
    textHover: 'group-hover:text-teal-600',
  },
  {
    id: 'offers',
    name: 'Offers & Coupons',
    subtitle: 'Exclusive discounts & bank cards',
    actionText: 'View 18 deals',
    icon: Tag,
    href: '/offers',
    badge: 'Promo Codes',
    iconGradient: 'from-red-500 to-orange-500',
    iconGlow: 'group-hover:shadow-red-500/40',
    borderHover: 'hover:border-red-300',
    shadowHover: 'hover:shadow-[0_16px_32px_rgba(239,68,68,0.20)]',
    textHover: 'group-hover:text-red-600',
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider mb-2 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border" style={{background: 'linear-gradient(135deg, rgba(2,132,199,0.1), rgba(124,58,237,0.1))', borderColor: 'rgba(2,132,199,0.25)', color: '#0284c7'}}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Comprehensive Travel Ecosystem</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-xs">
              <span className="text-slate-900">Everything You Need</span>
              <br />
              <span style={{background: 'linear-gradient(135deg, #0284c7, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>for Your Journey</span>
            </h2>
            <p className="text-sm font-medium text-slate-600 mt-2 max-w-2xl drop-shadow-xs">
              Flights, hotels, trains, buses, holidays, visas and more — all in one integrated luxury portal.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-sky-800 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-100 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>12 Integrated Travel Modules Active</span>
          </div>
        </div>

        {/* Premium Colorful Service Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id}>
                <Link
                  href={service.href}
                  className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white/95 hover:bg-white backdrop-blur-md border border-white/90 ${service.borderHover} shadow-[0_4px_16px_rgba(15,23,42,0.05)] ${service.shadowHover} transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full`}
                >
                  <div>
                    {/* Micro Badge */}
                    {service.badge && (
                      <span className="inline-block self-start text-[10px] font-bold text-slate-500 bg-slate-100/90 px-2.5 py-0.5 rounded-full mb-3 transition-colors truncate max-w-full border border-slate-200/50">
                        {service.badge}
                      </span>
                    )}

                    {/* BIG COLORFUL Icon Container — 60px with gradient */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.iconGradient} flex items-center justify-center mb-4 text-white transition-all duration-300 group-hover:scale-110 shadow-md ${service.iconGlow} group-hover:shadow-lg`}>
                      <Icon className="w-7 h-7 stroke-[2.2]" />
                    </div>

                    {/* Service Info */}
                    <h3 className={`text-sm font-bold text-slate-900 ${service.textHover} transition-colors leading-snug`}>
                      {service.name}
                    </h3>
                    <p className="text-[11.5px] text-slate-500 group-hover:text-slate-600 mt-1 line-clamp-2 leading-relaxed font-normal">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className={`mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 ${service.textHover} transition-colors`}>
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

