'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Mail,
  Send,
  PhoneCall,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lock,
  Headphones,
  Globe,
  CreditCard
} from 'lucide-react';
import { api } from '@/lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await api.subscribeNewsletter(email.trim());
      setStatus('success');
      setMsg('Welcome to OrbinexGlobal VIP Club! Your exclusive welcome perks are on their way.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMsg(err.message || 'Subscription failed. Please check your email.');
    }
  };

  return (
    <footer className="relative bg-[#0b1e38] text-slate-300 text-sm border-t-2 border-[#163863] overflow-hidden">
      {/* Luminous Top Accent Beam & Ambient Royal Navy Glow */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#0284c7]/15 blur-3xl pointer-events-none" />

      {/* VIP Newsletter Concierge Banner */}
      <div className="border-b border-[#163863] bg-gradient-to-r from-[#0e2749] via-[#0b1e38] to-[#0e2749] py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div className="text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-widest mb-2.5 bg-amber-500/15 border border-amber-400/40 px-3.5 py-1 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Orbinex Privé Travel Club</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              Unlock Secret Flight Tariffs &amp; 5-Star Flash Sales
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
              Join 120,000+ luxury travelers worldwide receiving handpicked unpublished business-class fares, complimentary suite upgrades, and instant visa alerts.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-3 text-[11px] text-slate-300 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No spam ever</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Unsubscribe anytime</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Free VIP access</span>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto lg:mx-0">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your VIP email address..."
                  className="w-full bg-[#08182e] border border-[#1b4273] focus:border-[#38bdf8] text-white text-xs rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all shadow-inner placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#38bdf8] hover:from-[#0369a1] hover:to-[#0284c7] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition shadow-[0_4px_16px_rgba(2,132,199,0.4)] cursor-pointer disabled:opacity-50 active:scale-95 whitespace-nowrap"
              >
                <span>{status === 'loading' ? 'Verifying...' : 'Join VIP Club'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {msg && (
              <p className={`text-xs mt-2.5 flex items-center gap-1.5 ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {msg}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Main Luxury Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
          
          {/* Column 1 & 2: Brand Credentials & Concierge (Col Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-sky-400 to-cyan-300 flex items-center justify-center text-white shadow-[0_4px_16px_rgba(2,132,199,0.4)] group-hover:scale-105 transition-transform duration-300">
                <Compass className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight block">
                  ORBINEX<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">GLOBAL</span>
                </span>
                <span className="text-[9.5px] font-bold uppercase tracking-widest text-sky-300 block -mt-0.5">
                  Luxury Travel &amp; Global Concierge
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-200 leading-relaxed">
              OrbinexGlobal Travel is an international full-stack travel booking &amp; concierge ecosystem delivering end-to-end flight booking across 500+ carriers, 1.2M 5-star hotels &amp; villas, IRCTC rail tickets, intercity luxury buses, bespoke holiday circuits, and Islamic pilgrimage services.
            </p>
            
            {/* Trust & Accreditations Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-2 text-[11px] text-white font-semibold bg-[#0e2749] px-3 py-2 rounded-xl border border-[#183f73]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Secure Booking</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white font-semibold bg-[#0e2749] px-3 py-2 rounded-xl border border-[#183f73]">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>IATA Accredited</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white font-semibold bg-[#0e2749] px-3 py-2 rounded-xl border border-[#183f73]">
                <Lock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white font-semibold bg-[#0e2749] px-3 py-2 rounded-xl border border-[#183f73]">
                <Headphones className="w-4 h-4 text-purple-400 shrink-0" />
                <span>24/7 VIP Concierge</span>
              </div>
            </div>

            {/* Direct Support Hotline */}
            <div className="pt-2 text-xs text-slate-200 space-y-1.5">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-white">Concierge Desk:</span>
                <span className="text-sky-200 font-mono">+1 (800) ORBINEX / +91 (22) 4890-8800</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-white">VIP Inquiries:</span>
                <span className="text-sky-300">concierge@orbinexglobal.com</span>
              </div>
            </div>
          </div>

          {/* Column 3: Aviation & Rail */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Aviation &amp; Rail
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/flights" className="hover:text-white hover:underline transition-colors">International Airfares</Link></li>
              <li><Link href="/flights" className="hover:text-white hover:underline transition-colors">Business &amp; First Class</Link></li>
              <li><Link href="/utilities" className="hover:text-white hover:underline transition-colors">IRCTC Train E-Tickets</Link></li>
              <li><Link href="/bus" className="hover:text-white hover:underline transition-colors">Intercity Volvo &amp; Sleeper Buses</Link></li>
              <li><Link href="/utilities" className="hover:text-white hover:underline transition-colors">Airport Lounge Access</Link></li>
              <li><Link href="/flights" className="hover:text-white hover:underline transition-colors">Seat Selection &amp; Web Check-In</Link></li>
            </ul>
          </div>

          {/* Column 4: Luxury Stays & Escapes */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Stays &amp; Tours
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/hotels" className="hover:text-white hover:underline transition-colors">5-Star Luxury Resorts</Link></li>
              <li><Link href="/hotels" className="hover:text-white hover:underline transition-colors">Overwater Pool Villas</Link></li>
              <li><Link href="/holidays" className="hover:text-white hover:underline transition-colors">Swiss Alps &amp; Bali Circuits</Link></li>
              <li><Link href="/europamundo" className="hover:text-white hover:underline transition-colors">Europamundo Coach Circuits</Link></li>
              <li><Link href="/insurance" className="hover:text-white hover:underline transition-colors">Worldwide Travel Insurance</Link></li>
              <li><Link href="/offers" className="hover:text-white hover:underline transition-colors">Bank Cards &amp; Promo Codes</Link></li>
            </ul>
          </div>

          {/* Column 5: Pilgrimage & Wellness */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Pilgrimage &amp; Care
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/umrah" className="hover:text-white hover:underline transition-colors">VIP 5-Star Umrah Packages</Link></li>
              <li><Link href="/umrah" className="hover:text-white hover:underline transition-colors">Clock Tower Haram Suites</Link></li>
              <li><Link href="/umrah" className="hover:text-white hover:underline transition-colors">Dar Al Taqwa Madinah Stays</Link></li>
              <li><Link href="/umrah" className="hover:text-white hover:underline transition-colors">Scholar Guided Ziyarat</Link></li>
              <li><Link href="/medical-tourism" className="hover:text-white hover:underline transition-colors">Medical Tourism Concierge</Link></li>
              <li><Link href="/medical-tourism" className="hover:text-white hover:underline transition-colors">JCI Accredited Hospitals</Link></li>
            </ul>
          </div>

          {/* Column 6: Visas & Travel Utilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Visas &amp; Utilities
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link href="/visa" className="hover:text-white hover:underline transition-colors">Saudi 1-Year Multiple eVisa</Link></li>
              <li><Link href="/visa" className="hover:text-white hover:underline transition-colors">Dubai &amp; UAE Tourist eVisa</Link></li>
              <li><Link href="/visa" className="hover:text-white hover:underline transition-colors">Schengen Europe Visa Help</Link></li>
              <li><Link href="/utilities" className="hover:text-white hover:underline transition-colors">International 5G eSIMs</Link></li>
              <li><Link href="/utilities" className="hover:text-white hover:underline transition-colors">Multi-Currency Forex Cards</Link></li>
              <li><Link href="/dashboard" className="hover:text-white hover:underline transition-colors">Manage Bookings &amp; Invoices</Link></li>
            </ul>
          </div>

        </div>

        {/* Global Operational Hubs Bar */}
        <div className="mt-12 pt-6 border-t border-[#163863] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white font-bold">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Global Concierge Presence:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-400" /> London (Mayfair)</span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-400" /> Dubai (DIFC)</span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-400" /> New York (Manhattan)</span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-400" /> Singapore (Marina Bay)</span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-400" /> Mumbai (BKC)</span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-400" /> Riyadh (Al Olaya)</span>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Payment Security */}
        <div className="mt-6 pt-6 border-t border-[#163863] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-300 text-center sm:text-left">
            &copy; {new Date().getFullYear()} OrbinexGlobal Travel Inc. All rights reserved. Registered Travel Partner &amp; Luxury Concierge Network.
          </p>

          {/* Certified Payment Gateways Strip */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] text-slate-300 uppercase font-bold mr-1 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-emerald-400" />
              Secured By:
            </span>
            <span className="bg-[#0e2749] text-white font-bold px-2.5 py-1 rounded-md text-[10.5px] border border-[#183f73] shadow-xs">Stripe Verified</span>
            <span className="bg-[#0e2749] text-white font-bold px-2.5 py-1 rounded-md text-[10.5px] border border-[#183f73] shadow-xs">Razorpay 3DS</span>
            <span className="bg-[#0e2749] text-white font-bold px-2.5 py-1 rounded-md text-[10.5px] border border-[#183f73] shadow-xs">Visa / Mastercard</span>
            <span className="bg-[#0e2749] text-white font-bold px-2.5 py-1 rounded-md text-[10.5px] border border-[#183f73] shadow-xs">Amex</span>
            <span className="bg-[#0e2749] text-white font-bold px-2.5 py-1 rounded-md text-[10.5px] border border-[#183f73] shadow-xs">Apple Pay</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
