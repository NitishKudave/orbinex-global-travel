'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  ShoppingBag,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  PhoneCall,
  Search,
  CheckCircle2,
  Tag,
  Ship,
  Car
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { CurrencyCode } from '@/lib/types';
import AuthModal from './AuthModal';
import VisaTrackerModal from './VisaTrackerModal';
import ApiSettingsModal from './ApiSettingsModal';

const CURRENCIES: { code: CurrencyCode; label: string; flag: string }[] = [
  { code: 'INR', label: 'IND | INR', flag: '🇮🇳' },
  { code: 'USD', label: 'USD ($)', flag: '🇺🇸' },
  { code: 'EUR', label: 'EUR (€)', flag: '🇪🇺' },
  { code: 'GBP', label: 'GBP (£)', flag: '🇬🇧' },
  { code: 'AED', label: 'AED (د.إ)', flag: '🇦🇪' },
  { code: 'SAR', label: 'SAR (﷼)', flag: '🇸🇦' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, setIsDrawerOpen, currency, setCurrency } = useCart();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVisaTrackOpen, setIsVisaTrackOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Flights', href: '/flights', icon: Plane },
    { label: 'Hotel', href: '/hotels', icon: Building2, badge: 'Flat 25% Off', badgeColor: 'bg-[#eb2026] text-white' },
    { label: 'Visa', href: '/visa', icon: FileCheck2 },
    { label: 'Holidays', href: '/holidays', icon: Palmtree },
    { label: 'Bus', href: '/bus', icon: Bus, badge: 'New', badgeColor: 'bg-purple-600 text-white' },
    { label: 'Cruise', href: '/holidays', icon: Ship },
    { label: 'Cabs', href: '/utilities', icon: Car },
    { label: 'Umrah', href: '/umrah', icon: Sparkles },
    { label: 'Insurance', href: '/insurance', icon: ShieldCheck },
    { label: 'Medical', href: '/medical-tourism', icon: HeartPulse },
    { label: 'Europamundo', href: '/europamundo', icon: Compass },
    { label: 'Utilities', href: '/utilities', icon: Sparkles },
    { label: 'Offers', href: '/offers', icon: Tag },
  ];

  return (
    <>
      {/* Top Notification / Utility Bar */}
      <div className="bg-[#071426] text-slate-300 text-xs py-2 px-4 border-b border-[#162a45]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Special Promo: Use code <strong className="text-white bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 tracking-wide font-mono">ORBINEX100</strong> for $100 OFF
            </span>
            <button 
              onClick={() => setIsVisaTrackOpen(true)} 
              className="text-cyan-400 hover:text-cyan-300 font-medium transition cursor-pointer hover:underline"
            >
              Track Visa Status
            </button>
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-cyan-400/25 transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Live APIs & Integration</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+18005550199" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline text-slate-400">24/7 Global Concierge:</span>
              <span className="font-medium">+1 (800) 555-0199</span>
            </a>
            
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1.5 bg-[#0b1d35] hover:bg-[#162a45] text-white px-2.5 py-1 rounded-lg text-xs font-medium transition border border-[#1e3a5f] cursor-pointer"
              >
                <span>{CURRENCIES.find((c) => c.code === currency)?.flag}</span>
                <span className="font-semibold">{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCurrencyOpen && (
                <div className="absolute right-0 mt-1 w-38 bg-[#0b1d35] border border-[#1e3a5f] rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-cyan-500/15 transition cursor-pointer ${
                        currency === c.code ? 'text-cyan-400 font-semibold bg-cyan-500/10' : 'text-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">{c.flag} {c.label}</span>
                      {currency === c.code && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className="sticky top-0 z-40 transition-all duration-300"
      >
        <div className={`
          ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(15,23,42,0.06)] border-b border-slate-200/80' : 'bg-white border-b border-slate-100'}
          transition-all duration-300
        `}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center justify-between ${scrolled ? 'h-16' : 'h-19'} transition-all duration-300`}>
             
              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-sm shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-200">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-[#071426] leading-none">
                    ORBINEX<span className="text-[#0284c7]">GLOBAL</span>
                  </span>
                  <span className="text-[9.5px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">
                    Luxury Travel &amp; Concierge
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
                {navLinks.slice(0, 8).map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-180 ${
                        isActive
                          ? 'text-[#0284c7] font-semibold bg-sky-50'
                          : 'text-slate-600 hover:text-[#0284c7] hover:bg-slate-50/80'
                      }`}
                    >
                      {link.badge && (
                        <span className={`absolute -top-2.5 right-1 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-2xs ${link.badgeColor || 'bg-red-500 text-white'}`}>
                          {link.badge}
                        </span>
                      )}
                      <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#0284c7]' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0284c7] rounded-full" />
                      )}
                    </Link>
                  );
                })}

                {/* More Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium text-slate-600 hover:text-[#0284c7] hover:bg-slate-50/80 transition cursor-pointer">
                    <span>More</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#0284c7] transition" />
                  </button>
                  <div className="absolute right-0 top-full pt-1.5 hidden group-hover:block z-50">
                    <div className="w-52 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-2 overflow-hidden animate-fade-in-up-sm">
                      {navLinks.slice(8).map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-2.5 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-sky-50/60 hover:text-[#0284c7] transition"
                          >
                            <Icon className="w-4 h-4 text-cyan-500" />
                            {link.label}
                          </Link>
                        );
                      })}
                      <div className="border-t border-slate-100 my-1.5"></div>
                      <a
                        href="http://127.0.0.1:8000/api/v1/schema/swagger-ui/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-purple-600 hover:bg-purple-50/70 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                        Swagger API Docs
                      </a>
                    </div>
                  </div>
                </div>
              </nav>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2.5">
                
                {/* Unified Cart Button */}
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="relative flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/80 text-slate-800 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition cursor-pointer"
                  title="View Unified Booking Cart"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline">Cart</span>
                  {totalItems > 0 && (
                    <span className="bg-[#0284c7] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center shadow-xs">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Currency Selector (Akbar Travels Style: IND | INR) */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 px-3 py-2 rounded-lg text-xs font-bold transition border border-slate-200 cursor-pointer"
                  >
                    <span>{CURRENCIES.find((c) => c.code === currency)?.flag}</span>
                    <span>{CURRENCIES.find((c) => c.code === currency)?.label || currency}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isCurrencyOpen && (
                    <div className="absolute right-0 mt-1 w-38 bg-white border border-slate-200 rounded-xl shadow-2xl py-1 z-50 overflow-hidden">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCurrency(c.code);
                            setIsCurrencyOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-sky-50 transition cursor-pointer ${
                            currency === c.code ? 'text-[#0284c7] font-bold bg-sky-50/60' : 'text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">{c.flag} {c.label}</span>
                          {currency === c.code && <CheckCircle2 className="w-3 h-3 text-[#0284c7]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* User / Auth Menu */}
                {isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 bg-[#071426] text-white px-3.5 py-2 rounded-xl text-[13px] font-semibold hover:bg-[#0b1d35] transition shadow-xs cursor-pointer border border-[#162a45]"
                    >
                      <div className="w-6 h-6 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold uppercase">
                        {user.first_name?.[0] || user.username[0]}
                      </div>
                      <span className="hidden md:inline">{user.first_name || user.username}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs text-slate-400">Signed in as</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            Platinum Member
                          </span>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Customer Dashboard
                        </Link>
                        <Link
                          href="/dashboard?tab=bookings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-cyan-600 transition"
                        >
                          <Plane className="w-4 h-4 text-slate-400" />
                          My Bookings &amp; Tickets
                        </Link>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="flex items-center gap-1.5 bg-[#eb2026] hover:bg-[#d0181d] text-white px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold uppercase shadow-sm shadow-red-600/20 transition transform hover:-translate-y-0.5 active:scale-98 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>LOGIN / REGISTER</span>
                  </button>
                )}

                {/* Mobile Hamburger Toggle */}
                <button
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileNavOpen && (
            <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-fade-in-up-sm">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileNavOpen(false)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-sky-50 text-[#0284c7] border border-sky-200'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#0284c7]' : 'text-slate-500'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center gap-2 text-xs">
                <button
                  onClick={() => {
                    setIsVisaTrackOpen(true);
                    setIsMobileNavOpen(false);
                  }}
                  className="text-cyan-600 font-semibold hover:underline"
                >
                  Track Visa Reference
                </button>
                <a
                  href="http://127.0.0.1:8000/api/v1/schema/swagger-ui/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Swagger API Docs
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <VisaTrackerModal isOpen={isVisaTrackOpen} onClose={() => setIsVisaTrackOpen(false)} />
      <ApiSettingsModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />
    </>
  );
}
