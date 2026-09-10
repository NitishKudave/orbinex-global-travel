'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plane,
  Building2,
  Bus,
  FileCheck2,
  ShieldCheck,
  Palmtree,
  Sparkles,
  HeartPulse,
  Search,
  Calendar,
  Users,
  MapPin,
  ArrowRightLeft,
  PhoneCall
} from 'lucide-react';
import BusSearchAutocomplete from '@/components/BusSearchAutocomplete';

type TabType = 'flights' | 'hotels' | 'bus' | 'holidays' | 'umrah' | 'visa' | 'insurance' | 'medical';

export default function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('flights');

  // Flight search states
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [origin, setOrigin] = useState('DXB');
  const [destination, setDestination] = useState('LHR');
  const [departDate, setDepartDate] = useState('2026-09-15');
  const [returnDate, setReturnDate] = useState('2026-09-25');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [isSwapped, setIsSwapped] = useState(false);

  // Hotel search states
  const [hotelCity, setHotelCity] = useState('Dubai');
  const [hotelCheckIn, setHotelCheckIn] = useState('2026-09-15');
  const [hotelCheckOut, setHotelCheckOut] = useState('2026-09-20');
  const [hotelGuests, setHotelGuests] = useState(2);

  // Bus search states
  const [busOrigin, setBusOrigin] = useState('Dubai');
  const [busDestination, setBusDestination] = useState('Abu Dhabi');

  const handleSwap = () => {
    setIsSwapped((prev) => !prev);
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/flights?origin=${origin}&destination=${destination}&cabin=${cabinClass}&passengers=${passengers}&tripType=${tripType}`);
  };

  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/hotels?city=${encodeURIComponent(hotelCity)}&guests=${hotelGuests}`);
  };

  const handleBusSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/bus?origin=${encodeURIComponent(busOrigin)}&destination=${encodeURIComponent(busDestination)}`);
  };

  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'bus', label: 'Buses', icon: Bus },
    { id: 'holidays', label: 'Holidays', icon: Palmtree },
    { id: 'umrah', label: 'Umrah', icon: Sparkles },
    { id: 'visa', label: 'Visa', icon: FileCheck2 },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
    { id: 'medical', label: 'Medical', icon: HeartPulse },
  ];

  return (
    <div className="relative bg-[#071426] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Subtle Background Glows — Sophisticated & Non-distracting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-12 right-1/4 w-[240px] h-[240px] bg-sky-400/8 blur-[100px] rounded-full" />
        <div className="absolute bottom-16 left-1/4 w-[220px] h-[220px] bg-amber-500/5 blur-[90px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Hero Headline & Proposition */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-[#0b1d35] border border-[#1e3a5f] text-cyan-300 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>PREMIUM GLOBAL TRAVEL CONCIERGE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-white tracking-tight leading-[1.15]">
            Discover the World with{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-200 bg-clip-text text-transparent">
              OrbinexGlobal
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-[15px] mt-3 max-w-2xl mx-auto leading-relaxed">
            Instant booking for 500+ airlines, luxury 5-star hotels, bespoke holiday tours, Umrah pilgrimages, and guaranteed electronic visas.
          </p>
        </div>

        {/* BOOKING SEARCH BOX (MakeMyTrip / Booking.com / RedBus Caliber) */}
        <div className="bg-white text-slate-900 rounded-[22px] sm:rounded-3xl shadow-[0_12px_45px_-10px_rgba(15,23,42,0.12)] border border-slate-100 p-4 sm:p-6 lg:p-7 max-w-5xl mx-auto">
          
          {/* Top Module Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-3.5 mb-5 border-b border-slate-100 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-180 cursor-pointer ${
                    isActive
                      ? 'bg-[#071426] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#071426] hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* FLIGHTS TAB */}
          {activeTab === 'flights' && (
            <form onSubmit={handleFlightSearch} className="space-y-4">
              
              {/* Trip Type & Cabin Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-600 pb-1">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      checked={tripType === 'oneway'}
                      onChange={() => setTripType('oneway')}
                      className="text-[#0284c7] focus:ring-[#0284c7] w-3.5 h-3.5"
                    />
                    <span className={tripType === 'oneway' ? 'text-slate-900 font-bold' : 'text-slate-600'}>One Way</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      checked={tripType === 'roundtrip'}
                      onChange={() => setTripType('roundtrip')}
                      className="text-[#0284c7] focus:ring-[#0284c7] w-3.5 h-3.5"
                    />
                    <span className={tripType === 'roundtrip' ? 'text-slate-900 font-bold' : 'text-slate-600'}>Round Trip</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Cabin:</span>
                  <div className="relative">
                    <select
                      value={cabinClass}
                      onChange={(e) => setCabinClass(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-[#0284c7] cursor-pointer"
                    >
                      <option value="economy">Economy</option>
                      <option value="premium">Premium Economy</option>
                      <option value="business">Business Class</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Fields: Desktop Horizontal, Tablet 2-Col, Mobile Stacked */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 relative items-stretch">
                
                {/* FROM (Departure) */}
                <div className="md:col-span-3 relative p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] focus-within:bg-white focus-within:border-[#0284c7] focus-within:ring-2 focus-within:ring-sky-500/15 transition-all duration-180">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    FROM
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0284c7] shrink-0" />
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none cursor-pointer"
                    >
                      <option value="DXB">Dubai (DXB)</option>
                      <option value="LHR">London (LHR)</option>
                      <option value="JFK">New York (JFK)</option>
                      <option value="SIN">Singapore (SIN)</option>
                      <option value="BOM">Mumbai (BOM)</option>
                      <option value="CDG">Paris (CDG)</option>
                      <option value="DEL">Delhi (DEL)</option>
                      <option value="JED">Jeddah (JED)</option>
                    </select>
                  </div>

                  {/* Desktop Swap Button Overlap */}
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-white border border-slate-200 rounded-full shadow-xs items-center justify-center text-slate-500 hover:text-[#0284c7] hover:border-[#0284c7] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ transform: `translate(0%, -50%) rotate(${isSwapped ? 180 : 0}deg)` }}
                    title="Swap Origin and Destination"
                    aria-label="Swap origin and destination"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mobile Swap Button */}
                <div className="md:hidden flex justify-center -my-1">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="w-8 h-8 bg-white border border-slate-200 rounded-full shadow-xs flex items-center justify-center text-slate-600 hover:text-[#0284c7] transition-transform duration-300 active:scale-95 cursor-pointer"
                    style={{ transform: `rotate(${isSwapped ? 180 : 0}deg)` }}
                    title="Swap Origin and Destination"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* TO (Destination) */}
                <div className="md:col-span-3 relative p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] focus-within:bg-white focus-within:border-[#0284c7] focus-within:ring-2 focus-within:ring-sky-500/15 transition-all duration-180">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    TO
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none cursor-pointer"
                    >
                      <option value="LHR">London (LHR)</option>
                      <option value="DXB">Dubai (DXB)</option>
                      <option value="JFK">New York (JFK)</option>
                      <option value="SIN">Singapore (SIN)</option>
                      <option value="JED">Jeddah / Umrah (JED)</option>
                      <option value="CDG">Paris (CDG)</option>
                      <option value="BOM">Mumbai (BOM)</option>
                      <option value="DEL">Delhi (DEL)</option>
                    </select>
                  </div>
                </div>

                {/* DEPARTURE (and Return if Roundtrip) */}
                <div className="md:col-span-3 relative p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] focus-within:bg-white focus-within:border-[#0284c7] focus-within:ring-2 focus-within:ring-sky-500/15 transition-all duration-180">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    {tripType === 'roundtrip' ? 'DEPARTURE & RETURN' : 'DEPARTURE'}
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    {tripType === 'roundtrip' ? (
                      <div className="grid grid-cols-2 gap-1 w-full">
                        <input
                          type="date"
                          value={departDate}
                          onChange={(e) => setDepartDate(e.target.value)}
                          className="bg-transparent font-semibold text-slate-800 text-xs outline-none cursor-pointer"
                          title="Departure Date"
                        />
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="bg-transparent font-semibold text-slate-800 text-xs outline-none cursor-pointer border-l border-slate-200 pl-1"
                          title="Return Date"
                        />
                      </div>
                    ) : (
                      <input
                        type="date"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="w-full bg-transparent font-semibold text-slate-800 text-xs outline-none cursor-pointer"
                      />
                    )}
                  </div>
                </div>

                {/* PASSENGERS */}
                <div className="md:col-span-3 relative p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] focus-within:bg-white focus-within:border-[#0284c7] focus-within:ring-2 focus-within:ring-sky-500/15 transition-all duration-180">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    PASSENGERS
                  </label>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none cursor-pointer"
                    >
                      <option value={1}>1 Adult</option>
                      <option value={2}>2 Adults</option>
                      <option value={3}>3 Passengers</option>
                      <option value={4}>4+ Family Group</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer: Popular Route Chips & Search CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                
                {/* Popular Routes Redesigned as Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600 text-[11px] mr-1">Popular:</span>
                  {[
                    { from: 'DXB', to: 'LHR', label: 'Dubai → London' },
                    { from: 'LHR', to: 'JFK', label: 'London → New York' },
                    { from: 'DXB', to: 'JED', label: 'Dubai → Jeddah' }
                  ].map((route) => (
                    <button
                      key={route.label}
                      type="button"
                      onClick={() => {
                        setOrigin(route.from);
                        setDestination(route.to);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] border border-slate-200/80 hover:border-sky-200 text-[11px] font-medium transition cursor-pointer"
                    >
                      <span>{route.label}</span>
                    </button>
                  ))}
                </div>

                {/* Strong Primary CTA */}
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md shadow-sky-600/25 transition-all duration-180 hover:-translate-y-0.5 active:scale-98 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Flights</span>
                </button>
              </div>
            </form>
          )}

          {/* HOTELS TAB */}
          {activeTab === 'hotels' && (
            <form onSubmit={handleHotelSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] transition">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    CITY / DESTINATION
                  </label>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0284c7]" />
                    <input
                      type="text"
                      value={hotelCity}
                      onChange={(e) => setHotelCity(e.target.value)}
                      placeholder="e.g. Dubai, Paris, Singapore"
                      className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] transition">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    CHECK-IN DATE
                  </label>
                  <input
                    type="date"
                    value={hotelCheckIn}
                    onChange={(e) => setHotelCheckIn(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-800 text-xs outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] transition">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    CHECK-OUT DATE
                  </label>
                  <input
                    type="date"
                    value={hotelCheckOut}
                    onChange={(e) => setHotelCheckOut(e.target.value)}
                    className="w-full bg-transparent font-semibold text-slate-800 text-xs outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] transition">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    ROOMS & GUESTS
                  </label>
                  <select
                    value={hotelGuests}
                    onChange={(e) => setHotelGuests(Number(e.target.value))}
                    className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none cursor-pointer"
                  >
                    <option value={1}>1 Room, 1 Guest</option>
                    <option value={2}>1 Room, 2 Guests</option>
                    <option value={4}>2 Rooms, 4 Guests</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md shadow-sky-600/25 transition-all duration-180 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search 5-Star Hotels</span>
                </button>
              </div>
            </form>
          )}

          {/* BUSES TAB */}
          {activeTab === 'bus' && (
            <form onSubmit={handleBusSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5">
                  <BusSearchAutocomplete
                    label="From (City or Boarding Point)"
                    type="from"
                    placeholder="e.g. Mumbai, Borivali East, Thane"
                    value={busOrigin}
                    onChange={(val) => setBusOrigin(val)}
                  />
                </div>
                <div className="md:col-span-4">
                  <BusSearchAutocomplete
                    label="To (City or Dropping Point)"
                    type="to"
                    placeholder="e.g. Pune, Wakad, Swargate, Goa"
                    value={busDestination}
                    onChange={(val) => setBusDestination(val)}
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] transition">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">JOURNEY DATE</label>
                    <input
                      type="date"
                      defaultValue="2026-08-18"
                      className="w-full bg-transparent font-bold text-slate-900 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Popular:</span>
                  <button type="button" onClick={() => { setBusOrigin('Mumbai'); setBusDestination('Pune'); }} className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] font-medium text-[11px] transition">Mumbai → Pune</button>
                  <button type="button" onClick={() => { setBusOrigin('Mumbai'); setBusDestination('Goa'); }} className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] font-medium text-[11px] transition">Mumbai → Goa</button>
                  <button type="button" onClick={() => { setBusOrigin('Bangalore'); setBusDestination('Hyderabad'); }} className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] font-medium text-[11px] transition">Bangalore → Hyderabad</button>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-md shadow-sky-600/25 cursor-pointer transition"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Buses</span>
                </button>
              </div>
            </form>
          )}

          {/* HOLIDAYS TAB */}
          {activeTab === 'holidays' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Explore Handcrafted Holiday Packages</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">All-inclusive stays, private guides, and customized itineraries in Bali, Switzerland, Paris & Dubai.</p>
              </div>
              <button
                onClick={() => router.push('/holidays')}
                className="w-full sm:w-auto bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition cursor-pointer"
              >
                Browse Holiday Catalog
              </button>
            </div>
          )}

          {/* UMRAH TAB */}
          {activeTab === 'umrah' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">Spiritual Journeys</span>
                <h3 className="font-bold text-slate-900 text-base mt-1.5">VIP & Classic Umrah Pilgrimage Packages</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">Fairmont Makkah Clock Tower, Dar Al Taqwa Madinah, Scholar-guided Ziyarat & Saudi eVisa bundled.</p>
              </div>
              <button
                onClick={() => router.push('/umrah')}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition cursor-pointer"
              >
                View Umrah Packages
              </button>
            </div>
          )}

          {/* VISA TAB */}
          {activeTab === 'visa' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Online Visa Assistance & Status Tracker</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">Instant electronic tourist visas for UAE, Schengen, UK, Saudi Arabia, Singapore & USA.</p>
              </div>
              <button
                onClick={() => router.push('/visa')}
                className="w-full sm:w-auto bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition cursor-pointer"
              >
                Apply for Visa Online
              </button>
            </div>
          )}

          {/* INSURANCE TAB */}
          {activeTab === 'insurance' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Worldwide Travel Insurance Plans</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">Up to $1,000,000 cashless medical hospitalization, flight delay & baggage loss cover.</p>
              </div>
              <button
                onClick={() => router.push('/insurance')}
                className="w-full sm:w-auto bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition cursor-pointer"
              >
                Compare Insurance Plans
              </button>
            </div>
          )}

          {/* MEDICAL TAB */}
          {activeTab === 'medical' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Medical Tourism & Hospital Concierge</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">Save up to 85% on Robotic Knee Replacements, Cardiac Surgery & Dental Implants in India, Thailand & Turkey.</p>
              </div>
              <button
                onClick={() => router.push('/medical-tourism')}
                className="w-full sm:w-auto bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition cursor-pointer"
              >
                Get Free Second Opinion
              </button>
            </div>
          )}

        </div>

        {/* SUBTLE TRUST INDICATORS BAR */}
        <div className="mt-8 pt-6 border-t border-[#162a45]/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-slate-300">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-slate-300">24/7 Global Concierge</span>
          </div>
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-slate-300">500+ Airlines</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-slate-300">Verified Hotels</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
            <span className="font-medium text-slate-300">Visa Assistance</span>
          </div>
        </div>

      </div>
    </div>
  );
}

