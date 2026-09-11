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
  GraduationCap,
  Globe2,
  Moon,
  Ship,
  Package,
  Train,
  Briefcase,
  Coins,
  ChevronDown,
  Check,
  CheckCircle2,
  Shield,
  Stethoscope
} from 'lucide-react';
import BusSearchAutocomplete from '@/components/BusSearchAutocomplete';
import TravelSceneAnimation from '@/components/TravelSceneAnimation';

type TabType = 'flights' | 'hotels' | 'train' | 'bus' | 'holidays' | 'umrah' | 'visa' | 'insurance' | 'medical';

const AIRPORT_INFO: Record<string, { city: string; desc: string }> = {
  BOM: { city: 'Mumbai', desc: 'BOM, Chhatrapati Shivaji International Airport' },
  DEL: { city: 'New Delhi', desc: 'DEL, Indira Gandhi International Airport' },
  DXB: { city: 'Dubai', desc: 'DXB, Dubai International Airport' },
  LHR: { city: 'London', desc: 'LHR, London Heathrow Airport' },
  JFK: { city: 'New York', desc: 'JFK, John F. Kennedy International Airport' },
  SIN: { city: 'Singapore', desc: 'SIN, Singapore Changi Airport' },
  JED: { city: 'Jeddah', desc: 'JED, King Abdulaziz International Airport' },
  PNQ: { city: 'Pune', desc: 'PNQ, Pune International Airport' },
  GOI: { city: 'Goa', desc: 'GOI, Dabolim International Airport' },
  BLR: { city: 'Bengaluru', desc: 'BLR, Kempegowda International Airport' },
};

const TRAIN_STATION_INFO: Record<string, { name: string; desc: string }> = {
  CSMT: { name: 'Mumbai CSMT', desc: 'Chhatrapati Shivaji Maharaj Terminus' },
  NDLS: { name: 'New Delhi (NDLS)', desc: 'New Delhi Railway Station' },
  PUNE: { name: 'Pune Jn (PUNE)', desc: 'Pune Junction' },
  HWH: { name: 'Kolkata Howrah', desc: 'Howrah Railway Station' },
  SBC: { name: 'Bengaluru (SBC)', desc: 'KSR Bengaluru City Station' },
  MAS: { name: 'Chennai Central', desc: 'Puratchi Thalaivar Dr. MGR Central' },
  ADI: { name: 'Ahmedabad Jn', desc: 'Ahmedabad Junction' },
  MAO: { name: 'Goa Madgaon', desc: 'Madgaon Junction' },
  BSB: { name: 'Varanasi Jn', desc: 'Varanasi Junction' },
  JP: { name: 'Jaipur Jn', desc: 'Jaipur Junction' },
};

export default function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('flights');

  // Flight search states
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');
  const [origin, setOrigin] = useState('BOM');
  const [destination, setDestination] = useState('DEL');
  const [departDate, setDepartDate] = useState('2026-09-15');
  const [returnDate, setReturnDate] = useState('2026-09-22');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');

  // Special fare options (MakeMyTrip style)
  const [selectedFare, setSelectedFare] = useState<'regular' | 'student' | 'defence' | 'senior' | 'doctor' | 'direct'>('regular');
  const [priceDropProtection, setPriceDropProtection] = useState(false);

  // Train search states (IRCTC Integration)
  const [trainOrigin, setTrainOrigin] = useState('CSMT');
  const [trainDestination, setTrainDestination] = useState('NDLS');
  const [trainDate, setTrainDate] = useState('2026-09-15');
  const [trainClass, setTrainClass] = useState('ALL');
  const [trainQuota, setTrainQuota] = useState('GN');

  // Hotel search states
  const [hotelCity, setHotelCity] = useState('Dubai');
  const [hotelCheckIn, setHotelCheckIn] = useState('2026-09-15');
  const [hotelCheckOut, setHotelCheckOut] = useState('2026-09-20');
  const [hotelGuests, setHotelGuests] = useState(2);
  const [hotelRooms, setHotelRooms] = useState(1);

  // Bus search states
  const [busOrigin, setBusOrigin] = useState('Mumbai');
  const [busDestination, setBusDestination] = useState('Pune');

  // Holiday search states
  const [holidayDest, setHolidayDest] = useState('Bali, Indonesia');
  const [holidayMonth, setHolidayMonth] = useState('Sep 2026');

  // Visa search states
  const [visaCountry, setVisaCountry] = useState('United Arab Emirates');
  const [visaType, setVisaType] = useState('Tourist 30 Days');

  // Umrah search states
  const [umrahCity, setUmrahCity] = useState('Mumbai');
  const [umrahPackage, setUmrahPackage] = useState('VIP 5-Star Kaaba View');

  // Insurance states
  const [insuranceDest, setInsuranceDest] = useState('Worldwide (incl. USA/Canada)');
  const [insuranceTravellers, setInsuranceTravellers] = useState('1 Adult');

  // Medical Tourism states
  const [medicalSpecialty, setMedicalSpecialty] = useState('Cardiology & Heart Care');
  const [medicalCity, setMedicalCity] = useState('Apollo Hospitals, Mumbai');

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleTrainSwap = () => {
    const temp = trainOrigin;
    setTrainOrigin(trainDestination);
    setTrainDestination(temp);
  };

  const handleFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/flights?origin=${origin}&destination=${destination}&cabin=${cabinClass}&passengers=${passengers}&tripType=${tripType}&fare=${selectedFare}`);
  };

  const handleTrainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/utilities?type=trains&from=${trainOrigin}&to=${trainDestination}&date=${trainDate}&class=${trainClass}&quota=${trainQuota}`);
  };

  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/hotels?city=${encodeURIComponent(hotelCity)}&guests=${hotelGuests}&rooms=${hotelRooms}`);
  };

  const handleBusSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/bus?origin=${encodeURIComponent(busOrigin)}&destination=${encodeURIComponent(busDestination)}`);
  };

  const handleHolidaySearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/holidays?destination=${encodeURIComponent(holidayDest)}&month=${encodeURIComponent(holidayMonth)}`);
  };

  const handleVisaSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/visa?country=${encodeURIComponent(visaCountry)}&type=${encodeURIComponent(visaType)}`);
  };

  const handleUmrahSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/umrah?city=${encodeURIComponent(umrahCity)}&pkg=${encodeURIComponent(umrahPackage)}`);
  };

  const handleInsuranceSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/insurance?dest=${encodeURIComponent(insuranceDest)}`);
  };

  const handleMedicalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/medical-tourism?specialty=${encodeURIComponent(medicalSpecialty)}`);
  };

  // Big, impressive service navigation tabs (MakeMyTrip / Goibibo vertical icon format)
  const tabs = [
    { id: 'flights', label: 'Flights', icon: Plane, color: 'text-sky-600', activeBg: 'bg-sky-50' },
    { id: 'hotels', label: 'Hotels', icon: Building2, badge: 'Flat 25% Off', badgeColor: 'bg-[#eb2026] text-white', color: 'text-rose-600', activeBg: 'bg-rose-50' },
    { id: 'train', label: 'Trains', icon: Train, badge: 'IRCTC', badgeColor: 'bg-emerald-600 text-white', color: 'text-emerald-600', activeBg: 'bg-emerald-50' },
    { id: 'bus', label: 'Buses', icon: Bus, badge: 'New', badgeColor: 'bg-purple-600 text-white', color: 'text-purple-600', activeBg: 'bg-purple-50' },
    { id: 'holidays', label: 'Holidays', icon: Palmtree, badge: 'Deals', badgeColor: 'bg-amber-500 text-slate-950', color: 'text-amber-600', activeBg: 'bg-amber-50' },
    { id: 'visa', label: 'Visa', icon: FileCheck2, color: 'text-cyan-600', activeBg: 'bg-cyan-50' },
    { id: 'umrah', label: 'Umrah', icon: Sparkles, badge: 'VIP', badgeColor: 'bg-emerald-700 text-amber-300', color: 'text-emerald-700', activeBg: 'bg-emerald-50' },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck, color: 'text-blue-600', activeBg: 'bg-blue-50' },
    { id: 'medical', label: 'Medical', icon: HeartPulse, color: 'text-rose-500', activeBg: 'bg-rose-50' },
  ];

  // Helper date display
  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { day: '15', monthYear: "Sep'26", weekday: 'Tuesday' };
    const day = d.getDate();
    const monthYear = d.toLocaleDateString('en-US', { month: 'short' }) + "'" + String(d.getFullYear()).slice(-2);
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    return { day, monthYear, weekday };
  };

  const departDisplay = formatDateDisplay(departDate);
  const returnDisplay = formatDateDisplay(returnDate);
  const hotelInDisplay = formatDateDisplay(hotelCheckIn);
  const hotelOutDisplay = formatDateDisplay(hotelCheckOut);

  const originInfo = AIRPORT_INFO[origin] || { city: origin, desc: `${origin} International Airport` };
  const destInfo = AIRPORT_INFO[destination] || { city: destination, desc: `${destination} International Airport` };

  return (
    <div className="relative">
      
      {/* 1. IMPRESSIVE WORLD LANDMARKS TRAVEL HERO CANVAS & LIVE TRANSIT ANIMATIONS */}
      <div
        className="relative min-h-[620px] sm:min-h-[670px] pt-6 pb-28 px-3 sm:px-6 lg:px-8 bg-cover bg-top overflow-hidden transition-all duration-500"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(10, 32, 64, 0.14), rgba(6, 20, 42, 0.36)), url('/world_landmarks_travel_hero.jpg')"
        }}
      >
        {/* Dynamic Flying Flights, High-Speed Train & Cruising Coach Bus Animations */}
        <TravelSceneAnimation activeTab={activeTab} />

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          
          {/* Top Title Strip inside Hero */}
          <div className="flex flex-wrap items-center justify-between text-white pb-1 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-black tracking-widest text-amber-300 bg-amber-950/60 px-3.5 py-1 rounded-full border border-amber-400/40 shadow-xs backdrop-blur-xs">
                ★ India&apos;s Premium Full-Service Travel Concierge
              </span>
            </div>

            <div className="text-xs sm:text-sm font-black text-white/90 flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Fare Integration &amp; Instant E-Tickets</span>
            </div>
          </div>

          {/* 2. THE SUPER-NAV WIDGET (Elevated White Card with BIG Vertical Icons - MakeMyTrip & Goibibo Signature) */}
          <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.22)] border border-slate-200/90 px-3 sm:px-6 pt-3 pb-2.5 max-w-5xl mx-auto overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-4 md:gap-6 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`group relative flex flex-col items-center justify-center px-3.5 sm:px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-sky-600 font-black'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    {/* Floating Promotional Badge */}
                    {tab.badge && (
                      <span className={`absolute -top-2.5 text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-xs pointer-events-none z-10 leading-none whitespace-nowrap ${tab.badgeColor}`}>
                        {tab.badge}
                      </span>
                    )}

                    {/* BIG ICON (w-7 h-7 sm:w-8 sm:h-8) - Vibrant, Clean, Impressive */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? `${tab.activeBg} ${tab.color} scale-110 shadow-sm ring-1 ring-sky-300/40`
                        : 'text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-100 group-hover:scale-105'
                    }`}>
                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.9]'}`} />
                    </div>

                    {/* Bold Label Below Icon */}
                    <span className="text-xs sm:text-[13px] font-extrabold mt-1.5 tracking-tight whitespace-nowrap">
                      {tab.label}
                    </span>

                    {/* Active Underline Notch */}
                    {isActive && (
                      <span className="absolute -bottom-2.5 w-10 h-1 bg-sky-500 rounded-full shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. MAIN WHITE BOOKING CARD WITH BIG BOLD TILES (MakeMyTrip / Goibibo Style) */}
          <div className="bg-white text-slate-900 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.28)] border border-slate-200 p-5 sm:p-7 pt-6 pb-12 relative">
            
            {/* ================= FLIGHTS TAB ================= */}
            {activeTab === 'flights' && (
              <form onSubmit={handleFlightSearch} className="space-y-4">
                
                {/* Trip Type Selector + Header Tag */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-6">
                    {[
                      { id: 'oneway', label: 'One Way' },
                      { id: 'roundtrip', label: 'Round Trip' },
                      { id: 'multicity', label: 'Multi City' },
                    ].map((type) => (
                      <label key={type.id} className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-black text-slate-800 hover:text-sky-600 transition">
                        <input
                          type="radio"
                          name="tripType"
                          checked={tripType === type.id}
                          onChange={() => {
                            setTripType(type.id as any);
                            if (type.id === 'roundtrip' && !returnDate) setReturnDate('2026-09-22');
                          }}
                          className="w-4 h-4 text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                        <span className={tripType === type.id ? 'text-sky-600' : 'text-slate-700'}>{type.label}</span>
                      </label>
                    ))}
                  </div>

                  <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                    Book International and Domestic Flights
                  </span>
                </div>

                {/* Main Connected Tiles Container (MakeMyTrip 5-Column Grid with Huge Typography) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-slate-200 rounded-2xl overflow-visible bg-white shadow-xs divide-y md:divide-y-0 md:divide-x divide-slate-200 relative">
                  
                  {/* FROM TILE */}
                  <div className="md:col-span-3 p-4 sm:p-4.5 hover:bg-sky-50/40 transition relative group cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      From
                    </span>
                    <div className="relative">
                      <select
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 outline-none cursor-pointer tracking-tight appearance-none pr-6 z-10 relative"
                      >
                        <option value="BOM">Mumbai</option>
                        <option value="DEL">New Delhi</option>
                        <option value="DXB">Dubai</option>
                        <option value="LHR">London</option>
                        <option value="JFK">New York</option>
                        <option value="SIN">Singapore</option>
                        <option value="JED">Jeddah</option>
                        <option value="PNQ">Pune</option>
                        <option value="GOI">Goa</option>
                        <option value="BLR">Bengaluru</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium truncate mt-1">
                      {originInfo.desc}
                    </p>

                    {/* Swap Button (Floating right on the border between From & To) */}
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="hidden md:flex absolute -right-4.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-white text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-full shadow-lg border border-slate-200 items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                      title="Swap Origin and Destination"
                    >
                      <ArrowRightLeft className="w-4 h-4 stroke-[2.4]" />
                    </button>
                  </div>

                  {/* TO TILE */}
                  <div className="md:col-span-3 p-4 sm:p-4.5 hover:bg-sky-50/40 transition relative group cursor-pointer md:pl-6">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      To
                    </span>
                    <div className="relative">
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 outline-none cursor-pointer tracking-tight appearance-none pr-6 z-10 relative"
                      >
                        <option value="DEL">New Delhi</option>
                        <option value="BOM">Mumbai</option>
                        <option value="DXB">Dubai</option>
                        <option value="LHR">London</option>
                        <option value="JFK">New York</option>
                        <option value="SIN">Singapore</option>
                        <option value="JED">Jeddah</option>
                        <option value="PNQ">Pune</option>
                        <option value="GOI">Goa</option>
                        <option value="BLR">Bengaluru</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium truncate mt-1">
                      {destInfo.desc}
                    </p>
                  </div>

                  {/* DEPARTURE TILE */}
                  <div className="md:col-span-2 p-4 sm:p-4.5 hover:bg-sky-50/40 transition cursor-pointer relative">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Departure ▾
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{departDisplay.day}</span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-800 ml-1">{departDisplay.monthYear}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">{departDisplay.weekday}</p>
                    <input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full z-10"
                      title="Select departure date"
                    />
                  </div>

                  {/* RETURN TILE */}
                  <div
                    onClick={() => {
                      if (tripType !== 'roundtrip') {
                        setTripType('roundtrip');
                        if (!returnDate) setReturnDate('2026-09-22');
                      }
                    }}
                    className={`md:col-span-2 p-4 sm:p-4.5 transition cursor-pointer relative ${
                      tripType === 'roundtrip' ? 'bg-sky-50/40 hover:bg-sky-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Return ▾
                    </span>
                    {tripType === 'roundtrip' ? (
                      <>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{returnDisplay.day}</span>
                          <span className="text-base sm:text-lg font-extrabold text-slate-800 ml-1">{returnDisplay.monthYear}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-1">{returnDisplay.weekday}</p>
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="opacity-0 absolute inset-0 cursor-pointer w-full h-full z-10"
                          title="Select return date"
                        />
                      </>
                    ) : (
                      <div className="mt-1">
                        <span className="text-xs font-bold text-slate-400 leading-tight block">
                          Tap to add a return date for bigger discounts
                        </span>
                      </div>
                    )}
                  </div>

                  {/* TRAVELLERS & CLASS TILE */}
                  <div className="md:col-span-2 p-4 sm:p-4.5 hover:bg-sky-50/40 transition cursor-pointer relative">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Travellers &amp; Class ▾
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="bg-transparent text-2xl sm:text-3xl font-black text-slate-900 outline-none cursor-pointer"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5+</option>
                      </select>
                      <span className="text-base sm:text-lg font-extrabold text-slate-800 ml-1">
                        {passengers === 1 ? 'Adult' : 'Travellers'}
                      </span>
                    </div>
                    <select
                      value={cabinClass}
                      onChange={(e) => setCabinClass(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-500 outline-none cursor-pointer capitalize mt-1 block w-full"
                    >
                      <option value="economy">Economy / Premium</option>
                      <option value="premium">Premium Economy</option>
                      <option value="business">Business Class</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>

                </div>

                {/* Special Fare Selection Chips (MakeMyTrip Signature) */}
                <div className="pt-2">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    <span className="text-xs font-black text-slate-800 mr-1">
                      Select a special fare:
                    </span>
                    {[
                      { id: 'regular', title: 'Regular', subtitle: 'Regular fares' },
                      { id: 'student', title: 'Student', subtitle: 'Extra discounts & baggage' },
                      { id: 'defence', title: 'Armed Forces', subtitle: 'Up to ₹600 off' },
                      { id: 'senior', title: 'Senior Citizen', subtitle: 'Up to ₹600 off' },
                      { id: 'doctor', title: 'Doctors & Nurses', subtitle: 'Up to ₹600 off' },
                      { id: 'direct', title: 'Direct Flights', subtitle: 'Non-stop only' },
                    ].map((fare) => {
                      const isSelected = selectedFare === fare.id;
                      return (
                        <button
                          key={fare.id}
                          type="button"
                          onClick={() => setSelectedFare(fare.id as any)}
                          className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-sky-500 bg-sky-50/90 text-sky-950 ring-1 ring-sky-400 shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-sky-600 bg-sky-600' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-black leading-tight">{fare.title}</span>
                            <span className={`text-[10px] leading-tight ${isSelected ? 'text-sky-700 font-bold' : 'text-slate-400'}`}>
                              {fare.subtitle}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Drop Protection Banner (MakeMyTrip Style Trust Element) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-150">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={priceDropProtection}
                      onChange={(e) => setPriceDropProtection(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                    />
                    <span>Add Price Drop Protection: Price drops, we&apos;ll refund the difference.</span>
                  </label>
                  <span className="text-sky-600 font-black text-[11px] flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> 100% Guaranteed Refund
                  </span>
                </div>

                {/* THE MASSIVE CENTERED FLOATING SEARCH BUTTON (MakeMyTrip / Goibibo Style) */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:to-blue-800 text-white font-black text-lg sm:text-xl px-14 sm:px-24 py-3.5 sm:py-4 rounded-full shadow-[0_12px_35px_rgba(2,132,199,0.45)] hover:shadow-[0_16px_45px_rgba(2,132,199,0.6)] transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-wider"
                  >
                    <span>SEARCH</span>
                    <Search className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>

              </form>
            )}

            {/* ================= HOTELS TAB ================= */}
            {activeTab === 'hotels' && (
              <form onSubmit={handleHotelSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-slate-200 rounded-2xl overflow-visible bg-white shadow-xs divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  
                  {/* CITY / PROPERTY */}
                  <div className="md:col-span-4 p-4 hover:bg-rose-50/40 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      City, Property or Location
                    </span>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-rose-500 shrink-0" />
                      <input
                        type="text"
                        value={hotelCity}
                        onChange={(e) => setHotelCity(e.target.value)}
                        placeholder="e.g. Dubai, Mumbai, London"
                        className="w-full bg-transparent font-black text-2xl sm:text-3xl text-slate-900 outline-none tracking-tight"
                      />
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">India, UAE &amp; Worldwide Luxury Stays</p>
                  </div>

                  {/* CHECK-IN */}
                  <div className="md:col-span-3 p-4 hover:bg-rose-50/40 transition relative cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Check-In ▾
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{hotelInDisplay.day}</span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-800 ml-1">{hotelInDisplay.monthYear}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">{hotelInDisplay.weekday}</p>
                    <input
                      type="date"
                      value={hotelCheckIn}
                      onChange={(e) => setHotelCheckIn(e.target.value)}
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                    />
                  </div>

                  {/* CHECK-OUT */}
                  <div className="md:col-span-3 p-4 hover:bg-rose-50/40 transition relative cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Check-Out ▾
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{hotelOutDisplay.day}</span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-800 ml-1">{hotelOutDisplay.monthYear}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">{hotelOutDisplay.weekday}</p>
                    <input
                      type="date"
                      value={hotelCheckOut}
                      onChange={(e) => setHotelCheckOut(e.target.value)}
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                    />
                  </div>

                  {/* ROOMS & GUESTS */}
                  <div className="md:col-span-2 p-4 hover:bg-rose-50/40 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Rooms &amp; Guests ▾
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <select
                        value={hotelGuests}
                        onChange={(e) => setHotelGuests(Number(e.target.value))}
                        className="bg-transparent text-2xl sm:text-3xl font-black text-slate-900 outline-none cursor-pointer"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={6}>6+</option>
                      </select>
                      <span className="text-base sm:text-lg font-extrabold text-slate-800 ml-1">Guests</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">1 Room, Deluxe Stay</p>
                  </div>

                </div>

                {/* Floating Search Button */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-rose-500 via-red-600 to-red-700 hover:from-rose-600 hover:to-red-800 text-white font-black text-lg sm:text-xl px-14 sm:px-24 py-3.5 sm:py-4 rounded-full shadow-[0_12px_35px_rgba(225,29,72,0.4)] hover:shadow-[0_16px_45px_rgba(225,29,72,0.55)] transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-wider"
                  >
                    <span>SEARCH HOTELS</span>
                    <Search className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= TRAINS TAB ================= */}
            {activeTab === 'train' && (
              <form onSubmit={handleTrainSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-slate-200 rounded-2xl overflow-visible bg-white shadow-xs divide-y md:divide-y-0 md:divide-x divide-slate-200 relative">
                  
                  {/* FROM STATION */}
                  <div className="md:col-span-3 p-4 hover:bg-emerald-50/40 transition relative">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      From Station
                    </span>
                    <select
                      value={trainOrigin}
                      onChange={(e) => setTrainOrigin(e.target.value)}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                    >
                      <option value="CSMT">Mumbai CSMT</option>
                      <option value="NDLS">New Delhi (NDLS)</option>
                      <option value="PUNE">Pune Jn (PUNE)</option>
                      <option value="HWH">Kolkata Howrah (HWH)</option>
                      <option value="SBC">Bengaluru City (SBC)</option>
                      <option value="MAS">Chennai Central (MAS)</option>
                    </select>
                    <p className="text-xs text-slate-500 font-medium truncate mt-1">
                      {TRAIN_STATION_INFO[trainOrigin]?.desc || 'Indian Railways Station'}
                    </p>

                    <button
                      type="button"
                      onClick={handleTrainSwap}
                      className="hidden md:flex absolute -right-4.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-white text-emerald-600 hover:bg-emerald-50 rounded-full shadow-lg border border-slate-200 items-center justify-center transition hover:scale-110 cursor-pointer"
                    >
                      <ArrowRightLeft className="w-4 h-4 stroke-[2.4]" />
                    </button>
                  </div>

                  {/* TO STATION */}
                  <div className="md:col-span-3 p-4 hover:bg-emerald-50/40 transition md:pl-6">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      To Station
                    </span>
                    <select
                      value={trainDestination}
                      onChange={(e) => setTrainDestination(e.target.value)}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                    >
                      <option value="NDLS">New Delhi (NDLS)</option>
                      <option value="CSMT">Mumbai CSMT</option>
                      <option value="MAO">Goa Madgaon (MAO)</option>
                      <option value="BSB">Varanasi Jn (BSB)</option>
                      <option value="PUNE">Pune Jn (PUNE)</option>
                    </select>
                    <p className="text-xs text-slate-500 font-medium truncate mt-1">
                      {TRAIN_STATION_INFO[trainDestination]?.desc || 'Indian Railways Station'}
                    </p>
                  </div>

                  {/* DATE */}
                  <div className="md:col-span-2 p-4 hover:bg-emerald-50/40 transition relative cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Travel Date ▾
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{formatDateDisplay(trainDate).day}</span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-800 ml-1">{formatDateDisplay(trainDate).monthYear}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">{formatDateDisplay(trainDate).weekday}</p>
                    <input
                      type="date"
                      value={trainDate}
                      onChange={(e) => setTrainDate(e.target.value)}
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                    />
                  </div>

                  {/* CLASS */}
                  <div className="md:col-span-2 p-4 hover:bg-emerald-50/40 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Class ▾
                    </span>
                    <select
                      value={trainClass}
                      onChange={(e) => setTrainClass(e.target.value)}
                      className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Classes</option>
                      <option value="1A">AC First (1A)</option>
                      <option value="2A">AC 2 Tier (2A)</option>
                      <option value="3A">AC 3 Tier (3A)</option>
                      <option value="SL">Sleeper (SL)</option>
                    </select>
                    <p className="text-xs text-emerald-600 font-bold mt-1">Free Cancellation</p>
                  </div>

                  {/* QUOTA */}
                  <div className="md:col-span-2 p-4 hover:bg-emerald-50/40 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Quota ▾
                    </span>
                    <select
                      value={trainQuota}
                      onChange={(e) => setTrainQuota(e.target.value)}
                      className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="GN">General</option>
                      <option value="TQ">Tatkal</option>
                      <option value="LD">Ladies</option>
                      <option value="SS">Senior Citizen</option>
                    </select>
                    <p className="text-xs text-slate-500 font-medium mt-1">IRCTC Authorized</p>
                  </div>

                </div>

                {/* Floating Search Button */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-lg sm:text-xl px-14 sm:px-24 py-3.5 sm:py-4 rounded-full shadow-[0_12px_35px_rgba(5,150,105,0.45)] hover:shadow-[0_16px_45px_rgba(5,150,105,0.6)] transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-wider"
                  >
                    <span>SEARCH TRAINS</span>
                    <Search className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= BUSES TAB ================= */}
            {activeTab === 'bus' && (
              <form onSubmit={handleBusSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                  <div className="md:col-span-5">
                    <BusSearchAutocomplete
                      label="From (City or Boarding Point)"
                      type="from"
                      placeholder="e.g. Mumbai, Borivali, Pune"
                      value={busOrigin}
                      onChange={(val) => setBusOrigin(val)}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <BusSearchAutocomplete
                      label="To (City or Dropping Point)"
                      type="to"
                      placeholder="e.g. Pune, Swargate, Goa"
                      value={busDestination}
                      onChange={(val) => setBusDestination(val)}
                    />
                  </div>
                  <div className="md:col-span-3 p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-500 transition relative cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Journey Date ▾
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">{formatDateDisplay(departDate).day}</span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-800 ml-1">{formatDateDisplay(departDate).monthYear}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">{formatDateDisplay(departDate).weekday}</p>
                    <input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>

                {/* Floating Search Button */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-black text-lg sm:text-xl px-14 sm:px-24 py-3.5 sm:py-4 rounded-full shadow-[0_12px_35px_rgba(147,51,234,0.45)] hover:shadow-[0_16px_45px_rgba(147,51,234,0.6)] transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-wider"
                  >
                    <span>SEARCH BUSES</span>
                    <Search className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= HOLIDAYS TAB ================= */}
            {activeTab === 'holidays' && (
              <form onSubmit={handleHolidaySearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</span>
                    <select
                      value={holidayDest}
                      onChange={(e) => setHolidayDest(e.target.value)}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="Bali, Indonesia">Bali, Indonesia</option>
                      <option value="Swiss Alps & Paris">Swiss Alps &amp; Paris</option>
                      <option value="Dubai & Abu Dhabi">Dubai &amp; Abu Dhabi</option>
                      <option value="Maldives Luxury Resort">Maldives Luxury Resort</option>
                      <option value="Kashmir Paradise">Kashmir Paradise</option>
                    </select>
                    <p className="text-xs text-slate-500 font-medium mt-1">Handcrafted Luxury Itineraries</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Departure Month</span>
                    <select
                      value={holidayMonth}
                      onChange={(e) => setHolidayMonth(e.target.value)}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="Sep 2026">September 2026</option>
                      <option value="Oct 2026">October 2026 (Diwali)</option>
                      <option value="Nov 2026">November 2026</option>
                      <option value="Dec 2026">December 2026 (New Year)</option>
                    </select>
                    <p className="text-xs text-amber-600 font-bold mt-1">Guaranteed Early Bird Savings</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Package Category</span>
                    <div className="text-2xl font-black text-slate-900">5-Star All-Inclusive</div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Flights, Stays, Transfers &amp; Meals</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-lg sm:text-xl px-14 sm:px-24 py-3.5 sm:py-4 rounded-full shadow-[0_12px_35px_rgba(245,158,11,0.45)] transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-wider"
                  >
                    <span>EXPLORE HOLIDAYS</span>
                    <Search className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= VISA TAB ================= */}
            {activeTab === 'visa' && (
              <form onSubmit={handleVisaSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-cyan-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Country</span>
                    <select
                      value={visaCountry}
                      onChange={(e) => setVisaCountry(e.target.value)}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Schengen Visa (Europe)">Schengen Visa (Europe)</option>
                      <option value="Singapore">Singapore</option>
                      <option value="United States (B1/B2)">United States (B1/B2)</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                    </select>
                    <p className="text-xs text-slate-500 font-medium mt-1">99.4% Approval Guarantee</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-cyan-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Visa Type</span>
                    <select
                      value={visaType}
                      onChange={(e) => setVisaType(e.target.value)}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="Tourist 30 Days">Tourist 30 Days Express</option>
                      <option value="Tourist 60 Days">Tourist 60 Days Multiple</option>
                      <option value="Business Transit">Business / Investor</option>
                    </select>
                    <p className="text-xs text-cyan-600 font-bold mt-1">Government Approved Processing</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-cyan-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Applicant Nationality</span>
                    <div className="text-2xl font-black text-slate-900">🇮🇳 Indian Passport</div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Doorstep Biometrics &amp; Docs Pickup</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-600 to-sky-700 hover:from-cyan-700 hover:to-sky-800 text-white font-black text-lg sm:text-xl px-14 sm:px-24 py-3.5 sm:py-4 rounded-full shadow-[0_12px_35px_rgba(8,145,178,0.45)] transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-wider"
                  >
                    <span>APPLY E-VISA</span>
                    <Search className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= UMRAH TAB ================= */}
            {activeTab === 'umrah' && (
              <form onSubmit={handleUmrahSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-600 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Departure City</span>
                    <select
                      value={umrahCity}
                      onChange={(e) => setUmrahCity(e.target.value)}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="Mumbai">Mumbai (BOM)</option>
                      <option value="New Delhi">New Delhi (DEL)</option>
                      <option value="Hyderabad">Hyderabad (HYD)</option>
                      <option value="Bengaluru">Bengaluru (BLR)</option>
                    </select>
                    <p className="text-xs text-slate-500 font-medium mt-1">Direct Flights to Jeddah / Madinah</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-600 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Package Tier</span>
                    <select
                      value={umrahPackage}
                      onChange={(e) => setUmrahPackage(e.target.value)}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="VIP 5-Star Kaaba View">VIP 5-Star Kaaba View (Fairmont)</option>
                      <option value="Deluxe 15-Day Package">Deluxe 15-Day Package (Pullman)</option>
                      <option value="Ramadan Mubarak Special">Ramadan Mubarak Special</option>
                    </select>
                    <p className="text-xs text-emerald-700 font-bold mt-1">Ministry of Hajj &amp; Umrah Authorized</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-600 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Services Included</span>
                    <div className="text-2xl font-black text-slate-900">Visa + Flights + Haram Hotel</div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Ziyarat Tours &amp; Buffet Catering</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-700 to-teal-900 hover:from-emerald-800 hover:to-teal-950 text-amber-300 font-black text-lg sm:text-xl px-14 sm:px-24 py-3.5 sm:py-4 rounded-full shadow-[0_12px_35px_rgba(4,120,87,0.5)] transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-wider"
                  >
                    <span>VIEW UMRAH PACKAGES</span>
                    <Search className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= INSURANCE TAB ================= */}
            {activeTab === 'insurance' && (
              <form onSubmit={handleInsuranceSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Destination</span>
                    <select
                      value={insuranceDest}
                      onChange={(e) => setInsuranceDest(e.target.value)}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="Worldwide (incl. USA/Canada)">Worldwide (incl. USA/Canada)</option>
                      <option value="Worldwide (excl. USA/Canada)">Worldwide (excl. USA/Canada)</option>
                      <option value="Schengen Countries">Schengen Countries (Europe)</option>
                      <option value="Asia & Middle East">Asia &amp; Middle East</option>
                    </select>
                    <p className="text-xs text-slate-500 font-medium mt-1">Cashless Hospitalization Worldwide</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Travellers</span>
                    <select
                      value={insuranceTravellers}
                      onChange={(e) => setInsuranceTravellers(e.target.value)}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="1 Adult">1 Adult (18-40 yrs)</option>
                      <option value="2 Adults">2 Adults (Family Plan)</option>
                      <option value="Family + Kids">Family with Children</option>
                      <option value="Senior Citizen">Senior Citizen (60+ yrs)</option>
                    </select>
                    <p className="text-xs text-blue-600 font-bold mt-1">Up to $500,000 Medical Sum Insured</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Instant Coverage</span>
                    <div className="text-2xl font-black text-slate-900">Baggage &amp; Delay Protection</div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Embassy &amp; Visa Compliant Policy</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-lg sm:text-xl px-14 sm:px-24 py-3.5 sm:py-4 rounded-full shadow-[0_12px_35px_rgba(37,99,235,0.45)] transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-wider"
                  >
                    <span>GET INSTANT QUOTE</span>
                    <Search className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= MEDICAL TAB ================= */}
            {activeTab === 'medical' && (
              <form onSubmit={handleMedicalSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-rose-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Specialty Treatment</span>
                    <select
                      value={medicalSpecialty}
                      onChange={(e) => setMedicalSpecialty(e.target.value)}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="Cardiology & Heart Care">Cardiology &amp; Heart Care</option>
                      <option value="Orthopedic & Joint Replacement">Orthopedic &amp; Joint Replacement</option>
                      <option value="Oncology & Cancer Care">Oncology &amp; Cancer Care</option>
                      <option value="IVF & Fertility Treatments">IVF &amp; Fertility Treatments</option>
                      <option value="Cosmetic & Reconstructive">Cosmetic &amp; Reconstructive</option>
                    </select>
                    <p className="text-xs text-slate-500 font-medium mt-1">JCI Accredited Hospital Partners</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-rose-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Partner Network</span>
                    <select
                      value={medicalCity}
                      onChange={(e) => setMedicalCity(e.target.value)}
                      className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="Apollo Hospitals, Mumbai">Apollo Hospitals, Mumbai</option>
                      <option value="Fortis Healthcare, Delhi NCR">Fortis Healthcare, Delhi NCR</option>
                      <option value="Max Super Speciality, New Delhi">Max Super Speciality, New Delhi</option>
                      <option value="Manipal Hospitals, Bengaluru">Manipal Hospitals, Bengaluru</option>
                    </select>
                    <p className="text-xs text-rose-600 font-bold mt-1">Zero Consultation Waiting Time</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-rose-500 transition">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Concierge Inclusions</span>
                    <div className="text-2xl font-black text-slate-900">Medical Visa + Airport Transfer</div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Dedicated Patient Liaison Officer</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-lg sm:text-xl px-14 sm:px-24 py-3.5 sm:py-4 rounded-full shadow-[0_12px_35px_rgba(244,63,94,0.45)] transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-wider"
                  >
                    <span>CONSULT DOCTOR</span>
                    <Search className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>

      {/* 4. LUXURY FLOATING SERVICES RIBBON BAR (MakeMyTrip / Corporate Style) */}
      <div className="max-w-7xl mx-auto px-4 mt-3 sm:mt-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] border border-slate-200/90 py-3.5 px-6 sm:px-8 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          {[
            { label: 'Academy', icon: GraduationCap, href: '/utilities', color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Study Abroad', icon: Globe2, href: '/holidays', color: 'text-cyan-600 bg-cyan-50' },
            { label: 'Umrah Packages', icon: Moon, href: '/umrah', color: 'text-emerald-700 bg-emerald-50' },
            { label: 'Passport & Visa', icon: FileCheck2, href: '/visa', color: 'text-amber-600 bg-amber-50' },
            { label: 'Air Charters', icon: Plane, href: '/flights', color: 'text-sky-600 bg-sky-50' },
            { label: 'Cargo & Courier', icon: Package, href: '/utilities', color: 'text-orange-600 bg-orange-50' },
            { label: 'IRCTC Agent', icon: Train, href: '/utilities', color: 'text-emerald-600 bg-emerald-50' },
            { label: 'MICE & Corporate', icon: Briefcase, href: '/utilities', color: 'text-purple-600 bg-purple-50' },
            { label: 'Forex & Currency', icon: Coins, href: '/utilities', color: 'text-yellow-600 bg-yellow-50' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="group flex items-center gap-2 text-xs sm:text-[13px] font-extrabold text-slate-700 hover:text-sky-600 whitespace-nowrap transition-all duration-150 py-1 px-2.5 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${item.color}`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
}
