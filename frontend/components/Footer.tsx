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
  AlertCircle
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
      setMsg('Thank you for subscribing to OrbinexGlobal VIP deals!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMsg(err.message || 'Subscription failed. Please check your email.');
    }
  };

  return (
    <footer className="bg-[#071426] text-slate-400 text-sm border-t border-[#162a45]">
      
      {/* Newsletter VIP Banner */}
      <div className="border-b border-[#162a45] bg-gradient-to-r from-[#0b1d35] via-[#071426] to-[#0b1d35] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Orbinex VIP Travel Club
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Unlock Secret Flight Flash Sales &amp; Exclusive Tour Perks
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Join 120,000+ luxury travelers receiving our handpicked weekly deals and instant visa updates.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto lg:mx-0">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-[#071426] border border-[#1e3a5f] text-white text-xs rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#0284c7] transition"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50 active:scale-98"
              >
                <span>{status === 'loading' ? 'Joining...' : 'Subscribe Free'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {msg && (
              <p className={`text-xs mt-2 flex items-center gap-1.5 ${status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {msg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                ORBINEX<span className="text-[#0284c7]">GLOBAL</span>
              </span>
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              OrbinexGlobal Travel is an international full-stack travel booking &amp; concierge platform delivering end-to-end flight booking, 5-star hotel accommodations, religious pilgrimage tours, worldwide medical travel, and seamless visa processing.
            </p>
            
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-[#0b1d35] px-3 py-1.5 rounded-lg border border-[#1e3a5f]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Financial Protection
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold bg-[#0b1d35] px-3 py-1.5 rounded-lg border border-[#1e3a5f]">
                <Award className="w-4 h-4 text-amber-400" />
                IATA Accredited
              </div>
            </div>
          </div>

          {/* Column 2: Flights & Stays */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Aviation & Stays</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/flights" className="hover:text-cyan-400 transition">International Flights</Link></li>
              <li><Link href="/flights" className="hover:text-cyan-400 transition">Business & First Class</Link></li>
              <li><Link href="/hotels" className="hover:text-cyan-400 transition">5-Star Luxury Hotels</Link></li>
              <li><Link href="/hotels" className="hover:text-cyan-400 transition">Private Pool Villas</Link></li>
              <li><Link href="/bus" className="hover:text-cyan-400 transition">Intercity Luxury Buses</Link></li>
              <li><Link href="/utilities" className="hover:text-cyan-400 transition">Airport Lounge Passes</Link></li>
            </ul>
          </div>

          {/* Column 3: Holidays & Pilgrimage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Tours & Pilgrimage</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/umrah" className="hover:text-cyan-400 transition">VIP Umrah Packages</Link></li>
              <li><Link href="/umrah" className="hover:text-cyan-400 transition">Clock Tower Haram Suites</Link></li>
              <li><Link href="/holidays" className="hover:text-cyan-400 transition">Bali & Swiss Alps Tours</Link></li>
              <li><Link href="/europamundo" className="hover:text-cyan-400 transition">Europamundo Circuits</Link></li>
              <li><Link href="/medical-tourism" className="hover:text-cyan-400 transition">Medical Tourism Concierge</Link></li>
              <li><Link href="/offers" className="hover:text-cyan-400 transition">Bank Discount Coupons</Link></li>
            </ul>
          </div>

          {/* Column 4: Visas & Travel Utilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Visas & Utilities</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/visa" className="hover:text-cyan-400 transition">UAE & Dubai Tourist eVisa</Link></li>
              <li><Link href="/visa" className="hover:text-cyan-400 transition">Schengen Europe Visa Support</Link></li>
              <li><Link href="/insurance" className="hover:text-cyan-400 transition">Worldwide Travel Insurance</Link></li>
              <li><Link href="/utilities" className="hover:text-cyan-400 transition">International 5G eSIMs</Link></li>
              <li><Link href="/utilities" className="hover:text-cyan-400 transition">Forex Multi-Currency Cards</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-400 transition">Customer Portal & Invoices</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip: Copyright & Gateways */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © {new Date().getFullYear()} OrbinexGlobal Travel Inc. All rights reserved. Version 1.0.0
          </p>

          {/* Payment Badges Representation */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Protected Gateways:</span>
            <span className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded text-[10px] border border-slate-700">Stripe</span>
            <span className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded text-[10px] border border-slate-700">Razorpay</span>
            <span className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded text-[10px] border border-slate-700">Apple Pay</span>
            <span className="bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded text-[10px] border border-slate-700">Visa / MC</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
