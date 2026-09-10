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
  Check
} from 'lucide-react';
import BusSearchAutocomplete from '@/components/BusSearchAutocomplete';

type TabType = 'flights' | 'hotels' | 'train' | 'bus' | 'holidays' | 'umrah' | 'visa' | 'insurance' | 'medical';

const AIRPORT_INFO: Record<string, { city: string; desc: string }> = {
  BOM: { city: 'Mumbai', desc: 'BOM, Chhatrapati Shivaji International' },
  DEL: { city: 'New Delhi', desc: 'DEL, Indira Gandhi International' },
  DXB: { city: 'Dubai', desc: 'DXB, Dubai International Airport' },
  LHR: { city: 'London', desc: 'LHR, London Heathrow Airport' },
  JFK: { city: 'New York', desc: 'JFK, John F. Kennedy International' },
  SIN: { city: 'Singapore', desc: 'SIN, Singapore Changi Airport' },
  JED: { city: 'Jeddah', desc: 'JED, King Abdulaziz International' },
  PNQ: { city: 'Pune', desc: 'PNQ, Pune International Airport' },
  GOI: { city: 'Goa', desc: 'GOI, Dabolim International Airport' },
  BLR: { city: 'Bengaluru', desc: 'BLR, Kempegowda International' },
};

const TRAIN_STATION_INFO: Record<string, { name: string; desc: string }> = {
  CSMT: { name: 'Mumbai CSMT', desc: 'Chhatrapati Shivaji Maharaj Terminus' },
  NDLS: { name: 'New Delhi (NDLS)', desc: 'New Delhi Railway Station' },
  PUNE: { name: 'Pune Jn (PUNE)', desc: 'Pune Junction' },
  HWH: { name: 'Kolkata Howrah', desc: 'Howrah Railway Station' },
  SBC: { name: 'Bengaluru (SBC)', desc: 'KSR Bengaluru Station' },
  MAS: { name: 'Chennai Central', desc: 'Puratchi Thalaivar Dr. MGR Central' },
  ADI: { name: 'Ahmedabad Jn', desc: 'Ahmedabad Junction' },
  MAO: { name: 'Goa Madgaon', desc: 'Madgaon Junction' },
  BSB: { name: 'Varanasi Jn', desc: 'Varanasi Junction' },
  JP: { name: 'Jaipur Jn', desc: 'Jaipur Junction' },
};

export default function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('flights');

  // Flight search states (Akbar Travels layout)
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');
  const [origin, setOrigin] = useState('BOM');
  const [destination, setDestination] = useState('DEL');
  const [departDate, setDepartDate] = useState('2026-09-15');
  const [returnDate, setReturnDate] = useState('2026-09-22');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [isSwapped, setIsSwapped] = useState(false);

  // Akbar Travels special fare checkboxes
  const [directOnly, setDirectOnly] = useState(false);
  const [defenceFare, setDefenceFare] = useState(false);
  const [studentFare, setStudentFare] = useState(false);
  const [seniorFare, setSeniorFare] = useState(false);

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

  // Bus search states
  const [busOrigin, setBusOrigin] = useState('Mumbai');
  const [busDestination, setBusDestination] = useState('Pune');

  const handleSwap = () => {
    setIsSwapped((prev) => !prev);
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
    router.push(`/flights?origin=${origin}&destination=${destination}&cabin=${cabinClass}&passengers=${passengers}&tripType=${tripType}`);
  };

  const handleTrainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/utilities?type=trains&from=${trainOrigin}&to=${trainDestination}&date=${trainDate}&class=${trainClass}&quota=${trainQuota}`);
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
    { id: 'hotels', label: 'Hotel', icon: Building2, badge: 'Flat 25% Off', badgeColor: 'bg-[#eb2026] text-white' },
    { id: 'train', label: 'Trains', icon: Train, badge: 'IRCTC', badgeColor: 'bg-emerald-600 text-white' },
    { id: 'visa', label: 'Visa', icon: FileCheck2 },
    { id: 'holidays', label: 'Holidays', icon: Palmtree },
    { id: 'bus', label: 'Bus', icon: Bus, badge: 'New', badgeColor: 'bg-purple-600 text-white' },
    { id: 'umrah', label: 'Umrah', icon: Sparkles },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
    { id: 'medical', label: 'Medical', icon: HeartPulse },
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

  const originInfo = AIRPORT_INFO[origin] || { city: origin, desc: `${origin} Airport` };
  const destInfo = AIRPORT_INFO[destination] || { city: destination, desc: `${destination} Airport` };

  return (
    <div className="relative">
      
      {/* 1. SCENIC MOUNTAIN HERO CANVAS (Akbar Travels Signature Look) */}
      <div
        className="relative min-h-[460px] sm:min-h-[500px] pt-6 pb-16 px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(10, 35, 70, 0.42), rgba(7, 20, 38, 0.65)), url('/travel_mountain_hero.jpg')"
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          
          {/* Top Title Strip inside Hero */}
          <div className="flex items-center justify-between text-white pb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-black tracking-widest text-sky-300 bg-sky-950/60 px-3.5 py-1 rounded-full border border-sky-400/30">
                Official Travel Partner
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 drop-shadow-md">
              {activeTab === 'flights' && (
                <>
                  <Plane className="w-5 h-5 text-sky-400 rotate-45" />
                  <span>Book Flight Tickets</span>
                </>
              )}
              {activeTab === 'hotels' && (
                <>
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span>Book Hotels &amp; Luxury Stays</span>
                </>
              )}
              {activeTab === 'train' && (
                <>
                  <Train className="w-5 h-5 text-emerald-400" />
                  <span>Book IRCTC Train Tickets</span>
                </>
              )}
              {activeTab === 'bus' && (
                <>
                  <Bus className="w-5 h-5 text-purple-400" />
                  <span>Book Intercity Bus Tickets</span>
                </>
              )}
              {activeTab === 'visa' && (
                <>
                  <FileCheck2 className="w-5 h-5 text-cyan-400" />
                  <span>Apply Global e-Visa</span>
                </>
              )}
              {activeTab === 'holidays' && (
                <>
                  <Palmtree className="w-5 h-5 text-emerald-400" />
                  <span>Explore Holiday Tours</span>
                </>
              )}
              {activeTab === 'umrah' && (
                <>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>VIP Umrah Packages</span>
                </>
              )}
              {activeTab === 'insurance' && (
                <>
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                  <span>International Travel Insurance</span>
                </>
              )}
              {activeTab === 'medical' && (
                <>
                  <HeartPulse className="w-5 h-5 text-rose-400" />
                  <span>Medical Tourism Concierge</span>
                </>
              )}
            </h2>
          </div>

          {/* MAIN WHITE SEARCH CARD (Akbar Travels Signature Search Box - Taking Full Place) */}
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 p-5 sm:p-7 relative">
            
            {/* Top Row: Navigation Category Tabs (with generous top padding so floating badges never get cut off) */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pt-4 pb-3 mb-5 border-b border-slate-100 no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-[15px] font-extrabold whitespace-nowrap transition-all duration-180 cursor-pointer ${
                      isActive
                        ? 'text-[#0284c7] bg-sky-50/90 border-b-2 border-[#0284c7] shadow-2xs'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    {tab.badge && (
                      <span className={`absolute -top-3 right-1 text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-xs pointer-events-none z-10 leading-none whitespace-nowrap ${tab.badgeColor}`}>
                        {tab.badge}
                      </span>
                    )}
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#0284c7] stroke-[2.4]' : 'text-slate-400 stroke-[2]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* FLIGHTS TAB CONTENT */}
            {activeTab === 'flights' && (
              <form onSubmit={handleFlightSearch} className="space-y-4">
                
                {/* Trip Type Radio Selector */}
                <div className="flex items-center gap-6 pb-2">
                  {[
                    { id: 'oneway', label: 'One Way' },
                    { id: 'roundtrip', label: 'Round Trip' },
                    { id: 'multicity', label: 'Multi City' },
                  ].map((type) => (
                    <label key={type.id} className="flex items-center gap-2 cursor-pointer text-xs font-black text-slate-800 hover:text-sky-600 transition">
                      <input
                        type="radio"
                        name="tripType"
                        checked={tripType === type.id}
                        onChange={() => {
                          setTripType(type.id as any);
                          if (type.id === 'roundtrip' && !returnDate) setReturnDate('2026-09-22');
                        }}
                        className="text-[#eb2026] focus:ring-[#eb2026] w-4 h-4"
                      />
                      <span className={tripType === type.id ? 'text-[#eb2026]' : ''}>{type.label}</span>
                    </label>
                  ))}
                </div>

                {/* Main Connected Inputs Grid (Akbar Travels Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 lg:gap-0 lg:divide-x lg:divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  
                  {/* FROM Field */}
                  <div className="md:col-span-3 p-3 sm:p-3.5 hover:bg-slate-50 transition relative group cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      From
                    </span>
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full bg-transparent text-xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
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
                    <span className="text-[11px] text-slate-500 truncate block font-medium mt-0.5">
                      {originInfo.desc}
                    </span>

                    {/* Swap Button (Desktop floating between From and To) */}
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-full shadow-md items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                      title="Swap Cities"
                      aria-label="Swap origin and destination"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* TO Field */}
                  <div className="md:col-span-3 p-3 sm:p-3.5 hover:bg-slate-50 transition cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      To
                    </span>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-transparent text-xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
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
                    <span className="text-[11px] text-slate-500 truncate block font-medium mt-0.5">
                      {destInfo.desc}
                    </span>
                  </div>

                  {/* DEPARTURE Field */}
                  <div className="md:col-span-2 p-3 sm:p-3.5 hover:bg-slate-50 transition cursor-pointer relative">
                    <div className="flex items-center justify-between">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Departure ▾
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-slate-900">{departDisplay.day}</span>
                      <span className="text-sm font-bold text-slate-800">{departDisplay.monthYear}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[11px] text-slate-500 font-medium">{departDisplay.weekday}</span>
                      <input
                        type="date"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="opacity-0 absolute inset-0 cursor-pointer w-full"
                        title="Select departure date"
                      />
                    </div>
                  </div>

                  {/* RETURN Field */}
                  <div
                    onClick={() => {
                      if (tripType !== 'roundtrip') {
                        setTripType('roundtrip');
                        if (!returnDate) setReturnDate('2026-09-22');
                      }
                    }}
                    className={`md:col-span-2 p-3 sm:p-3.5 transition cursor-pointer relative ${
                      tripType === 'roundtrip' ? 'bg-sky-50/40 hover:bg-sky-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Return ▾
                    </span>
                    {tripType === 'roundtrip' ? (
                      <>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black text-slate-900">{returnDisplay.day}</span>
                          <span className="text-sm font-bold text-slate-800">{returnDisplay.monthYear}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{returnDisplay.weekday}</span>
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="opacity-0 absolute inset-0 cursor-pointer w-full"
                          title="Select return date"
                        />
                      </>
                    ) : (
                      <div className="mt-1">
                        <span className="text-xs font-bold text-slate-400 block leading-tight">
                          Book a round trip to save more
                        </span>
                      </div>
                    )}
                  </div>

                  {/* TRAVELLERS & CLASS */}
                  <div className="md:col-span-2 p-3 sm:p-3.5 hover:bg-slate-50 transition cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      Travellers &amp; Class ▾
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="bg-transparent text-xl font-black text-slate-900 outline-none cursor-pointer"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5+</option>
                      </select>
                      <span className="text-sm font-bold text-slate-800">Traveller(s)</span>
                    </div>
                    <select
                      value={cabinClass}
                      onChange={(e) => setCabinClass(e.target.value)}
                      className="bg-transparent text-[11px] font-bold text-slate-500 outline-none cursor-pointer capitalize mt-0.5"
                    >
                      <option value="economy">Economy</option>
                      <option value="premium">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>

                </div>

                {/* Bottom Row: Checkbox Special Fares + High-Impact Coral Red SEARCH CTA */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
                  
                  {/* Akbar Travels Style Special Fare Checkboxes */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={directOnly}
                        onChange={(e) => setDirectOnly(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                      />
                      <span>Direct Flights</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={defenceFare}
                        onChange={(e) => setDefenceFare(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                      />
                      <span>Defence Fare</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={studentFare}
                        onChange={(e) => setStudentFare(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                      />
                      <span>Student Fare</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={seniorFare}
                        onChange={(e) => setSeniorFare(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                      />
                      <span>Senior Citizen Fare</span>
                    </label>
                  </div>

                  {/* SIGNATURE RED SEARCH BUTTON (Akbar Travels Style) */}
                  <button
                    type="submit"
                    className="bg-[#eb2026] hover:bg-[#d0181d] text-white font-black text-base px-10 py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 active:scale-98 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
                  >
                    <span>SEARCH</span>
                    <Search className="w-4 h-4 stroke-[3]" />
                  </button>

                </div>

              </form>
            )}

            {/* HOTELS TAB */}
            {activeTab === 'hotels' && (
              <form onSubmit={handleHotelSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] transition">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">CITY / DESTINATION</label>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#0284c7]" />
                      <input
                        type="text"
                        value={hotelCity}
                        onChange={(e) => setHotelCity(e.target.value)}
                        placeholder="e.g. Dubai, Mumbai, London"
                        className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] transition">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">CHECK-IN</label>
                    <input
                      type="date"
                      value={hotelCheckIn}
                      onChange={(e) => setHotelCheckIn(e.target.value)}
                      className="w-full bg-transparent font-semibold text-slate-800 text-xs outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] transition">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">CHECK-OUT</label>
                    <input
                      type="date"
                      value={hotelCheckOut}
                      onChange={(e) => setHotelCheckOut(e.target.value)}
                      className="w-full bg-transparent font-semibold text-slate-800 text-xs outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] transition">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">ROOMS &amp; GUESTS</label>
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
                    className="bg-[#eb2026] hover:bg-[#d0181d] text-white font-black text-sm px-8 py-3 rounded-xl shadow-md cursor-pointer flex items-center gap-2 uppercase tracking-wide"
                  >
                    <span>SEARCH HOTELS</span>
                    <Search className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </form>
            )}

            {/* TRAINS TAB (IRCTC Booking) */}
            {activeTab === 'train' && (
              <form onSubmit={handleTrainSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 lg:gap-0 lg:divide-x lg:divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  
                  {/* FROM STATION */}
                  <div className="md:col-span-3 p-3.5 sm:p-4 hover:bg-slate-50 transition relative group cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      FROM STATION ▾
                    </span>
                    <select
                      value={trainOrigin}
                      onChange={(e) => setTrainOrigin(e.target.value)}
                      className="w-full bg-transparent text-xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                    >
                      <option value="CSMT">Mumbai CSMT</option>
                      <option value="NDLS">New Delhi (NDLS)</option>
                      <option value="PUNE">Pune Jn (PUNE)</option>
                      <option value="HWH">Kolkata Howrah (HWH)</option>
                      <option value="SBC">Bengaluru City (SBC)</option>
                      <option value="MAS">Chennai Central (MAS)</option>
                      <option value="ADI">Ahmedabad Jn (ADI)</option>
                      <option value="BSB">Varanasi Jn (BSB)</option>
                      <option value="JP">Jaipur Jn (JP)</option>
                    </select>
                    <span className="text-[11px] text-slate-500 truncate block font-medium mt-0.5">
                      {TRAIN_STATION_INFO[trainOrigin]?.desc || 'Indian Railways Station'}
                    </span>

                    {/* Swap Button */}
                    <button
                      type="button"
                      onClick={handleTrainSwap}
                      className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-full shadow-md items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                      title="Swap Stations"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* TO STATION */}
                  <div className="md:col-span-3 p-3.5 sm:p-4 hover:bg-slate-50 transition cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      TO STATION ▾
                    </span>
                    <select
                      value={trainDestination}
                      onChange={(e) => setTrainDestination(e.target.value)}
                      className="w-full bg-transparent text-xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                    >
                      <option value="NDLS">New Delhi (NDLS)</option>
                      <option value="CSMT">Mumbai CSMT</option>
                      <option value="MAO">Goa Madgaon (MAO)</option>
                      <option value="BSB">Varanasi Jn (BSB)</option>
                      <option value="JP">Jaipur Jn (JP)</option>
                      <option value="PUNE">Pune Jn (PUNE)</option>
                      <option value="HWH">Kolkata Howrah (HWH)</option>
                      <option value="SBC">Bengaluru City (SBC)</option>
                    </select>
                    <span className="text-[11px] text-slate-500 truncate block font-medium mt-0.5">
                      {TRAIN_STATION_INFO[trainDestination]?.desc || 'Indian Railways Station'}
                    </span>
                  </div>

                  {/* JOURNEY DATE */}
                  <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-slate-50 transition cursor-pointer relative">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      JOURNEY DATE ▾
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-black text-slate-900">{formatDateDisplay(trainDate).day}</span>
                      <span className="text-sm font-bold text-slate-800">{formatDateDisplay(trainDate).monthYear}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{formatDateDisplay(trainDate).weekday}</span>
                    <input
                      type="date"
                      value={trainDate}
                      onChange={(e) => setTrainDate(e.target.value)}
                      className="opacity-0 absolute inset-0 cursor-pointer w-full"
                    />
                  </div>

                  {/* CLASS */}
                  <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-slate-50 transition cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      CLASS ▾
                    </span>
                    <select
                      value={trainClass}
                      onChange={(e) => setTrainClass(e.target.value)}
                      className="w-full bg-transparent text-lg font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="ALL">All Classes</option>
                      <option value="1A">AC First (1A)</option>
                      <option value="2A">AC 2 Tier (2A)</option>
                      <option value="3A">AC 3 Tier (3A)</option>
                      <option value="3E">AC 3 Economy</option>
                      <option value="SL">Sleeper (SL)</option>
                      <option value="CC">Chair Car (CC)</option>
                    </select>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">Free Cancellation</span>
                  </div>

                  {/* QUOTA */}
                  <div className="md:col-span-2 p-3.5 sm:p-4 hover:bg-slate-50 transition cursor-pointer">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      QUOTA ▾
                    </span>
                    <select
                      value={trainQuota}
                      onChange={(e) => setTrainQuota(e.target.value)}
                      className="w-full bg-transparent text-lg font-black text-slate-900 outline-none cursor-pointer"
                    >
                      <option value="GN">General</option>
                      <option value="TQ">Tatkal</option>
                      <option value="LD">Ladies</option>
                      <option value="SS">Senior Citizen</option>
                    </select>
                    <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">IRCTC Authorized</span>
                  </div>

                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      ✓ ₹0 Gateway Fee on UPI
                    </span>
                    <span className="inline-flex items-center gap-1 text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                      ✓ Instant IRCTC Confirmation
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#eb2026] hover:bg-[#d0181d] text-white font-black text-base px-10 py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 active:scale-98 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
                  >
                    <span>SEARCH TRAINS</span>
                    <Search className="w-4 h-4 stroke-[3]" />
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
                  <div className="md:col-span-3">
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#0284c7] transition">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">JOURNEY DATE</label>
                      <input
                        type="date"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="w-full bg-transparent font-semibold text-slate-800 text-xs outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#eb2026] hover:bg-[#d0181d] text-white font-black text-sm px-8 py-3 rounded-xl shadow-md cursor-pointer flex items-center gap-2 uppercase tracking-wide"
                  >
                    <span>SEARCH BUSES</span>
                    <Search className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>

      {/* 2. FLOATING SERVICES RIBBON BAR (Akbar Travels Signature Ribbon) */}
      <div className="max-w-7xl mx-auto px-4 -mt-7 relative z-20">
        <div className="bg-white rounded-full shadow-[0_10px_35px_rgba(15,23,42,0.12)] border border-slate-200/90 py-3 px-6 sm:px-8 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          {[
            { label: 'Academy', icon: GraduationCap, href: '/utilities' },
            { label: 'Study Abroad', icon: Globe2, href: '/holidays' },
            { label: 'Umrah', icon: Moon, href: '/umrah' },
            { label: 'Passport', icon: FileCheck2, href: '/visa' },
            { label: 'Charters', icon: Plane, href: '/flights' },
            { label: 'Cargo', icon: Package, href: '/utilities' },
            { label: 'IRCTC Agent', icon: Train, href: '/utilities' },
            { label: 'MICE', icon: Globe2, href: '/holidays' },
            { label: 'Corporate', icon: Briefcase, href: '/utilities' },
            { label: 'Forex', icon: Coins, href: '/utilities' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0284c7] whitespace-nowrap transition-colors duration-150 py-0.5 cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
}
