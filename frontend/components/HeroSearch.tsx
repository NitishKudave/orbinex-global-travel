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
  ArrowLeftRight,
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
  Stethoscope,
  PlaneTakeoff,
  PlaneLanding,
  Compass,
  Tag,
  Clock
} from 'lucide-react';
import BusSearchAutocomplete from '@/components/BusSearchAutocomplete';
import TravelSceneAnimation from '@/components/TravelSceneAnimation';
import { useSearchTab, SearchTabType } from '@/context/SearchTabContext';

const SERVICE_HEADINGS: Record<SearchTabType, { title: string; highlight: string; subtitle: string }> = {
  flights: {
    title: 'Your World ',
    highlight: 'Awaits ✈',
    subtitle: 'Book Domestic & International Flights at Guaranteed Lowest Airline Fares',
  },
  hotels: {
    title: 'Find Your Perfect ',
    highlight: 'Luxury Stay 🏨',
    subtitle: '5-Star Hotels, Luxury Resorts & Boutique Villas with Flat 25% Off',
  },
  train: {
    title: 'Indian Railways ',
    highlight: 'IRCTC Authorized 🚆',
    subtitle: 'Instant Train Bookings with Zero Convenience Fee & Instant Refund',
  },
  bus: {
    title: 'Intercity Luxury ',
    highlight: 'Coach Travel 🚌',
    subtitle: 'Volvo, Sleeper & AC Buses Across 100,000+ Verified Routes',
  },
  holidays: {
    title: 'Handcrafted Global ',
    highlight: 'Vacations 🌴',
    subtitle: 'All-Inclusive Luxury Holiday Packages with Custom Tour Itineraries',
  },
  visa: {
    title: 'Seamless Online ',
    highlight: 'E-Visa Concierge 📄',
    subtitle: '99.4% Approval Rate with Doorstep Biometrics & Express Processing',
  },
  umrah: {
    title: 'Blessed & Sacred ',
    highlight: 'Umrah Journeys 🕋',
    subtitle: 'Ministry Authorized 5-Star Kaaba View Packages & Private Transfers',
  },
  insurance: {
    title: 'Global Comprehensive ',
    highlight: 'Travel Shield 🛡️',
    subtitle: 'Cashless Hospitalization, Flight Delay & Baggage Loss Protection',
  },
  medical: {
    title: 'World-Class Healthcare ',
    highlight: 'Concierge 🩺',
    subtitle: 'JCI Accredited Hospital Partners with Zero Consultation Waiting Time',
  },
};

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
  const { activeTab, selectTab } = useSearchTab();

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
  const [busDate, setBusDate] = useState('2026-09-15');

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
    router.push(`/bus?origin=${encodeURIComponent(busOrigin)}&destination=${encodeURIComponent(busDestination)}&date=${encodeURIComponent(busDate)}`);
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
      
      {/* 1. IMPRESSIVE LUXURY GLOBAL TRAVEL PANORAMA & LIVE FLIGHTS ANIMATION */}
      <div
        className="relative pt-2 sm:pt-2.5 pb-7 sm:pb-8 px-3 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden transition-all duration-500"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(5, 15, 35, 0.20) 0%, rgba(3, 12, 28, 0.18) 50%, rgba(2, 8, 20, 0.55) 100%), url('/luxury_tropical_sunset_hero.jpg')"
        }}
      >
        {/* Dynamic Flying Flights Animation */}
        <TravelSceneAnimation activeTab={activeTab} />

        <div className="max-w-[1200px] mx-auto relative z-30 space-y-2.5 sm:space-y-3">
          
          {/* ✨ DYNAMIC CINEMATIC HERO TITLE (Syncs with Selected Service) */}
          <div className="text-center pt-0.5 sm:pt-1 pb-1">
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
              <span>{SERVICE_HEADINGS[activeTab]?.title || 'Your World '}</span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 35%, #ec4899 70%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {SERVICE_HEADINGS[activeTab]?.highlight || 'Awaits ✈'}
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs font-semibold text-white/90 drop-shadow-md mt-0.5">
              {SERVICE_HEADINGS[activeTab]?.subtitle || 'Flights · Hotels · Trains · Buses · Holidays · Visa · Umrah & Luxury Concierge'}
            </p>
          </div>

          {/* 2. THE UNIFIED TRAVEL SEARCH SUPERCARD */}
          <div className="w-full shadow-[0_25px_70px_rgba(0,0,0,0.32)] rounded-3xl overflow-visible relative border border-slate-200/90 bg-white">
            
            {/* MAIN BOOKING CONTENT BODY */}
            <div className="p-4 sm:p-6 sm:px-7 pt-4 sm:pt-5 pb-8 sm:pb-8.5 relative rounded-3xl">
            
            {/* ================= FLIGHTS TAB ================= */}
            {activeTab === 'flights' && (
              <form onSubmit={handleFlightSearch} className="space-y-3.5">
                
                {/* Luxury Trip Type Segmented Selector */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="inline-flex items-center bg-slate-100/90 p-1 rounded-xl gap-1 border border-slate-200/70">
                    {[
                      { id: 'oneway', label: 'One Way', icon: PlaneTakeoff },
                      { id: 'roundtrip', label: 'Round Trip', icon: ArrowRightLeft },
                      { id: 'multicity', label: 'Multi City', icon: Compass },
                    ].map((type) => {
                      const isSelected = tripType === type.id;
                      const TypeIcon = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => {
                            setTripType(type.id as any);
                            if (type.id === 'roundtrip' && !returnDate) setReturnDate('2026-09-22');
                          }}
                          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white text-sky-700 shadow-xs border border-slate-200/90 ring-1 ring-sky-500/20'
                              : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                          }`}
                        >
                          <TypeIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-600 stroke-[2.5]' : 'text-slate-400'}`} />
                          <span>{type.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Book International &amp; Domestic Flights</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-sky-600 font-extrabold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-500" /> Instant Confirmation
                    </span>
                  </div>
                </div>

                {/* Main Connected Tiles Container (5-Column Luxury Modular Card Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 relative items-stretch">
                  
                  {/* 1. FROM CARD */}
                  <div className="md:col-span-3 relative group">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-sky-200/90 bg-gradient-to-br from-sky-50/70 via-white to-sky-50/30 hover:border-sky-500 hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-sky-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-sky-100 text-sky-600 flex items-center justify-center shadow-2xs">
                            <PlaneTakeoff className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>FROM</span>
                        </span>
                        <span className="font-black text-sky-700 bg-sky-100/90 border border-sky-300/80 px-2 py-0.5 rounded-md text-[10.5px] uppercase tracking-wider">
                          {origin}
                        </span>
                      </div>
                      <div className="my-0.5">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-sky-950 tracking-tight leading-tight block truncate">
                          {originInfo.city}
                        </span>
                        <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                          {originInfo.desc}
                        </p>
                      </div>
                    </div>

                    {/* Invisible full-tile select */}
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Select origin city"
                    >
                      <option value="BOM">Mumbai [BOM]</option>
                      <option value="DEL">New Delhi [DEL]</option>
                      <option value="DXB">Dubai [DXB]</option>
                      <option value="LHR">London [LHR]</option>
                      <option value="JFK">New York [JFK]</option>
                      <option value="SIN">Singapore [SIN]</option>
                      <option value="JED">Jeddah [JED]</option>
                      <option value="PNQ">Pune [PNQ]</option>
                      <option value="GOI">Goa [GOI]</option>
                      <option value="BLR">Bengaluru [BLR]</option>
                    </select>

                    {/* Centered Floating Luxury Swap Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSwap();
                      }}
                      className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-30 w-7.5 h-7.5 bg-white text-sky-600 hover:text-white hover:bg-gradient-to-r hover:from-sky-500 hover:to-blue-600 border-2 border-sky-300 hover:border-transparent rounded-full shadow-md hover:shadow-lg hover:shadow-sky-500/30 items-center justify-center transition-all duration-200 hover:scale-115 active:scale-95 cursor-pointer"
                      title="Swap Origin and Destination"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 stroke-[2.4]" />
                    </button>
                  </div>

                  {/* 2. TO CARD */}
                  <div className="md:col-span-3 relative group">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-blue-200/90 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-blue-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shadow-2xs">
                            <PlaneLanding className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>TO</span>
                        </span>
                        <span className="font-black text-blue-700 bg-blue-100/90 border border-blue-300/80 px-2 py-0.5 rounded-md text-[10.5px] uppercase tracking-wider">
                          {destination}
                        </span>
                      </div>
                      <div className="my-0.5">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-950 tracking-tight leading-tight block truncate">
                          {destInfo.city}
                        </span>
                        <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                          {destInfo.desc}
                        </p>
                      </div>
                    </div>

                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Select destination city"
                    >
                      <option value="DEL">New Delhi [DEL]</option>
                      <option value="BOM">Mumbai [BOM]</option>
                      <option value="DXB">Dubai [DXB]</option>
                      <option value="LHR">London [LHR]</option>
                      <option value="JFK">New York [JFK]</option>
                      <option value="SIN">Singapore [SIN]</option>
                      <option value="JED">Jeddah [JED]</option>
                      <option value="PNQ">Pune [PNQ]</option>
                      <option value="GOI">Goa [GOI]</option>
                      <option value="BLR">Bengaluru [BLR]</option>
                    </select>
                  </div>

                  {/* 3. DEPARTURE CARD */}
                  <div className="md:col-span-2 relative group cursor-pointer">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-indigo-200/90 bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-indigo-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-2xs">
                            <Calendar className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>DEPARTURE</span>
                        </span>
                      </div>
                      <div className="my-0.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-indigo-950 leading-none">
                            {departDisplay.day}
                          </span>
                          <span className="text-xs sm:text-sm font-black text-slate-800">
                            {departDisplay.monthYear}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-indigo-600 font-bold mt-0.5 truncate">
                          {departDisplay.weekday}
                        </p>
                      </div>
                    </div>
                    <input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch {}
                      }}
                      className="full-tile-date-input"
                      title="Select departure date"
                    />
                  </div>

                  {/* 4. RETURN CARD */}
                  <div
                    onClick={() => {
                      if (tripType !== 'roundtrip') {
                        setTripType('roundtrip');
                        if (!returnDate) setReturnDate('2026-09-22');
                      }
                    }}
                    className="md:col-span-2 relative group cursor-pointer"
                  >
                    <div className={`h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between ${
                      tripType === 'roundtrip'
                        ? 'border-emerald-300 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10'
                        : 'border-slate-200/90 border-dashed bg-gradient-to-br from-slate-50/80 via-white to-emerald-50/20 hover:border-emerald-400 hover:bg-emerald-50/30 hover:shadow-md'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-emerald-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs">
                            <Calendar className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>RETURN</span>
                        </span>
                        {tripType !== 'roundtrip' && (
                          <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300/90 px-1.5 py-0.2 rounded-full shadow-2xs">
                            Save 15%
                          </span>
                        )}
                      </div>
                      {tripType === 'roundtrip' ? (
                        <div className="my-0.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-950 leading-none">
                              {returnDisplay.day}
                            </span>
                            <span className="text-xs sm:text-sm font-black text-slate-800">
                              {returnDisplay.monthYear}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-emerald-600 font-bold mt-0.5 truncate">
                            {returnDisplay.weekday}
                          </p>
                        </div>
                      ) : (
                        <div className="my-0.5">
                          <div className="text-sm sm:text-base font-black text-slate-700 group-hover:text-emerald-700 leading-tight transition-colors">
                            + Add Return
                          </div>
                          <p className="text-[10.5px] text-slate-400 font-medium mt-0.5 truncate">
                            Round trip savings
                          </p>
                        </div>
                      )}
                    </div>
                    {tripType === 'roundtrip' && (
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        onClick={(e) => {
                          try {
                            (e.target as HTMLInputElement).showPicker();
                          } catch {}
                        }}
                        className="full-tile-date-input"
                        title="Select return date"
                      />
                    )}
                  </div>

                  {/* 5. TRAVELLERS & CLASS CARD */}
                  <div className="md:col-span-2 relative group cursor-pointer">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-purple-200/90 bg-gradient-to-br from-purple-50/70 via-white to-purple-50/30 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-purple-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center shadow-2xs">
                            <Users className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>TRAVELLERS</span>
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                      <div className="my-0.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-purple-950 leading-none">
                            {passengers}
                          </span>
                          <span className="text-xs sm:text-sm font-black text-slate-800">
                            {passengers === 1 ? 'Adult' : 'Travellers'}
                          </span>
                        </div>
                        <p className="text-[10.5px] font-bold text-purple-700 capitalize mt-0.5 truncate">
                          {cabinClass === 'economy' ? 'Economy / Premium' : cabinClass}
                        </p>
                      </div>
                    </div>

                    <div className="flex absolute inset-0 opacity-0 z-10">
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="w-1/2 h-full cursor-pointer"
                        title="Select travellers"
                      >
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Travellers</option>
                        <option value={3}>3 Travellers</option>
                        <option value={4}>4 Travellers</option>
                        <option value={5}>5+ Travellers</option>
                      </select>
                      <select
                        value={cabinClass}
                        onChange={(e) => setCabinClass(e.target.value)}
                        className="w-1/2 h-full cursor-pointer"
                        title="Select cabin class"
                      >
                        <option value="economy">Economy</option>
                        <option value="premium">Premium Economy</option>
                        <option value="business">Business Class</option>
                        <option value="first">First Class</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Special Fare Selection Chips & Assurance (Unified Luxury Bar) */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1.5 pb-0.5">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] font-black text-slate-800 mr-0.5 shrink-0 flex items-center gap-1">
                      <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <Tag className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>Special Fares:</span>
                    </span>
                    {[
                      { id: 'regular', title: 'Regular', subtitle: 'Regular fares', icon: '⭐', activeBg: 'border-sky-500 bg-sky-50/90 text-sky-950 ring-2 ring-sky-500/20' },
                      { id: 'student', title: 'Student', subtitle: 'Extra baggage', icon: '🎓', activeBg: 'border-emerald-500 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-500/20' },
                      { id: 'defence', title: 'Armed Forces', subtitle: '₹600 off', icon: '🎖️', activeBg: 'border-amber-500 bg-amber-50/90 text-amber-950 ring-2 ring-amber-500/20' },
                      { id: 'senior', title: 'Senior Citizen', subtitle: '₹600 off', icon: '👴', activeBg: 'border-purple-500 bg-purple-50/90 text-purple-950 ring-2 ring-purple-500/20' },
                      { id: 'doctor', title: 'Doctors & Nurses', subtitle: '₹600 off', icon: '🩺', activeBg: 'border-rose-500 bg-rose-50/90 text-rose-950 ring-2 ring-rose-500/20' },
                      { id: 'direct', title: 'Direct Flights', subtitle: 'Non-stop', icon: '⚡', activeBg: 'border-cyan-500 bg-cyan-50/90 text-cyan-950 ring-2 ring-cyan-500/20' },
                    ].map((fare) => {
                      const isSelected = selectedFare === fare.id;
                      return (
                        <button
                          key={fare.id}
                          type="button"
                          onClick={() => setSelectedFare(fare.id as any)}
                          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? `${fare.activeBg} shadow-xs scale-[1.02]`
                              : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700 shadow-2xs'
                          }`}
                        >
                          <span className="text-xs">{fare.icon}</span>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black leading-tight group-hover:text-slate-900">{fare.title}</span>
                            <span className={`text-[9px] leading-tight font-extrabold ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                              {fare.subtitle}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 ml-auto">
                    <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 transition bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/80">
                      <input
                        type="checkbox"
                        checked={priceDropProtection}
                        onChange={(e) => setPriceDropProtection(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer accent-sky-600"
                      />
                      <span className="text-[11px] font-bold text-slate-700">Price Drop Protection</span>
                    </label>
                    <div className="text-emerald-800 font-black flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 px-3 py-1 rounded-full border border-emerald-300/80 shadow-2xs text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                      <span>100% Refund Guarantee</span>
                    </div>
                  </div>
                </div>

                {/* THE MASSIVE CENTERED FLOATING SEARCH BUTTON */}
                <div className="absolute -bottom-5 sm:-bottom-5.5 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#0284c7] via-[#2563eb] to-[#1d4ed8] hover:from-[#0369a1] hover:via-[#1d4ed8] hover:to-[#1e40af] text-white font-black text-base sm:text-lg px-16 sm:px-24 py-3 sm:py-3.5 rounded-full shadow-[0_12px_36px_rgba(37,99,235,0.45)] hover:shadow-[0_16px_45px_rgba(37,99,235,0.65)] ring-4 ring-white transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-widest group"
                  >
                    <span>SEARCH FLIGHTS</span>
                    <Search className="w-5 h-5 stroke-[2.8] group-hover:rotate-12 transition-transform" />
                  </button>
                </div>

              </form>
            )}

            {/* ================= HOTELS TAB ================= */}
            {activeTab === 'hotels' && (
              <form onSubmit={handleHotelSearch} className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 relative items-stretch">
                  
                  {/* CITY / PROPERTY */}
                  <div className="md:col-span-4 relative group">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-rose-200/90 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-rose-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shadow-2xs">
                            <Building2 className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>CITY, PROPERTY OR LOCATION</span>
                        </span>
                      </div>
                      <div className="my-0.5">
                        <input
                          type="text"
                          value={hotelCity}
                          onChange={(e) => setHotelCity(e.target.value)}
                          placeholder="e.g. Dubai, Mumbai, London"
                          className="w-full bg-transparent font-black text-xl sm:text-2xl text-slate-900 group-hover:text-rose-950 outline-none tracking-tight leading-tight"
                        />
                        <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">India, UAE &amp; Worldwide Luxury Stays</p>
                      </div>
                    </div>
                  </div>

                  {/* CHECK-IN */}
                  <div className="md:col-span-3 relative group cursor-pointer">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-rose-200/90 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-rose-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shadow-2xs">
                            <Calendar className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>CHECK-IN</span>
                        </span>
                      </div>
                      <div className="my-0.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none group-hover:text-rose-950">{hotelInDisplay.day}</span>
                          <span className="text-xs sm:text-sm font-black text-slate-800">{hotelInDisplay.monthYear}</span>
                        </div>
                        <p className="text-[10.5px] text-rose-600 font-bold mt-0.5 truncate">{hotelInDisplay.weekday}</p>
                      </div>
                    </div>
                    <input
                      type="date"
                      value={hotelCheckIn}
                      onChange={(e) => setHotelCheckIn(e.target.value)}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch {}
                      }}
                      className="full-tile-date-input"
                      title="Select check-in date"
                    />
                  </div>

                  {/* CHECK-OUT */}
                  <div className="md:col-span-3 relative group cursor-pointer">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-rose-200/90 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-rose-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shadow-2xs">
                            <Calendar className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>CHECK-OUT</span>
                        </span>
                      </div>
                      <div className="my-0.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none group-hover:text-rose-950">{hotelOutDisplay.day}</span>
                          <span className="text-xs sm:text-sm font-black text-slate-800">{hotelOutDisplay.monthYear}</span>
                        </div>
                        <p className="text-[10.5px] text-rose-600 font-bold mt-0.5 truncate">{hotelOutDisplay.weekday}</p>
                      </div>
                    </div>
                    <input
                      type="date"
                      value={hotelCheckOut}
                      onChange={(e) => setHotelCheckOut(e.target.value)}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch {}
                      }}
                      className="full-tile-date-input"
                      title="Select check-out date"
                    />
                  </div>

                  {/* ROOMS & GUESTS */}
                  <div className="md:col-span-2 relative group cursor-pointer">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-rose-200/90 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-rose-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shadow-2xs">
                            <Users className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>ROOMS &amp; GUESTS</span>
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-rose-400 group-hover:text-rose-600 transition-colors" />
                      </div>
                      <div className="my-0.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none group-hover:text-rose-950">{hotelGuests}</span>
                          <span className="text-xs sm:text-sm font-black text-slate-800">Guests</span>
                        </div>
                        <p className="text-[10.5px] font-bold text-rose-700 mt-0.5 truncate">{hotelRooms} Room, Deluxe Stay</p>
                      </div>
                    </div>
                    <select
                      value={hotelGuests}
                      onChange={(e) => setHotelGuests(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Select guests"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                      <option value={6}>6+ Guests</option>
                    </select>
                  </div>

                </div>

                {/* Floating Search Button */}
                <div className="absolute -bottom-5 sm:-bottom-5.5 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-rose-500 via-red-600 to-rose-700 hover:from-rose-600 hover:to-red-800 text-white font-black text-base sm:text-lg px-16 sm:px-24 py-3 sm:py-3.5 rounded-full shadow-[0_12px_36px_rgba(225,29,72,0.45)] hover:shadow-[0_16px_45px_rgba(225,29,72,0.65)] ring-4 ring-white transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-widest group"
                  >
                    <span>SEARCH HOTELS</span>
                    <Search className="w-5 h-5 stroke-[2.8] group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= TRAINS TAB ================= */}
            {activeTab === 'train' && (
              <form onSubmit={handleTrainSearch} className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 relative items-stretch">
                  
                  {/* FROM STATION */}
                  <div className="md:col-span-3 relative group">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-emerald-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs">
                            <Train className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>FROM STATION</span>
                        </span>
                        <span className="font-black text-emerald-700 bg-emerald-100/90 border border-emerald-300/80 px-2 py-0.5 rounded-md text-[10.5px] uppercase tracking-wider">
                          {trainOrigin}
                        </span>
                      </div>
                      <div className="my-0.5">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-950 tracking-tight leading-tight block truncate">
                          {TRAIN_STATION_INFO[trainOrigin]?.name || trainOrigin}
                        </span>
                        <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                          {TRAIN_STATION_INFO[trainOrigin]?.desc || 'Indian Railways Station'}
                        </p>
                      </div>
                    </div>
                    <select
                      value={trainOrigin}
                      onChange={(e) => setTrainOrigin(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Select origin station"
                    >
                      <option value="CSMT">Mumbai CSMT</option>
                      <option value="NDLS">New Delhi (NDLS)</option>
                      <option value="PUNE">Pune Jn (PUNE)</option>
                      <option value="HWH">Kolkata Howrah (HWH)</option>
                      <option value="SBC">Bengaluru City (SBC)</option>
                      <option value="MAS">Chennai Central (MAS)</option>
                    </select>

                    {/* Swap button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrainSwap();
                      }}
                      className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-30 w-7.5 h-7.5 bg-white text-emerald-600 hover:text-white hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 border-2 border-emerald-300 hover:border-transparent rounded-full shadow-md hover:shadow-lg hover:shadow-emerald-500/30 items-center justify-center transition-all duration-200 hover:scale-115 active:scale-95 cursor-pointer"
                      title="Swap Stations"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 stroke-[2.4]" />
                    </button>
                  </div>

                  {/* TO STATION */}
                  <div className="md:col-span-3 relative group">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-teal-200/90 bg-gradient-to-br from-teal-50/70 via-white to-teal-50/30 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-teal-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-teal-100 text-teal-600 flex items-center justify-center shadow-2xs">
                            <Train className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>TO STATION</span>
                        </span>
                        <span className="font-black text-teal-700 bg-teal-100/90 border border-teal-300/80 px-2 py-0.5 rounded-md text-[10.5px] uppercase tracking-wider">
                          {trainDestination}
                        </span>
                      </div>
                      <div className="my-0.5">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-teal-950 tracking-tight leading-tight block truncate">
                          {TRAIN_STATION_INFO[trainDestination]?.name || trainDestination}
                        </span>
                        <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                          {TRAIN_STATION_INFO[trainDestination]?.desc || 'Indian Railways Station'}
                        </p>
                      </div>
                    </div>
                    <select
                      value={trainDestination}
                      onChange={(e) => setTrainDestination(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Select destination station"
                    >
                      <option value="NDLS">New Delhi (NDLS)</option>
                      <option value="CSMT">Mumbai CSMT</option>
                      <option value="MAO">Goa Madgaon (MAO)</option>
                      <option value="BSB">Varanasi Jn (BSB)</option>
                      <option value="PUNE">Pune Jn (PUNE)</option>
                    </select>
                  </div>

                  {/* DATE */}
                  <div className="md:col-span-2 relative group cursor-pointer">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-emerald-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs">
                            <Calendar className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>TRAVEL DATE</span>
                        </span>
                      </div>
                      <div className="my-0.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none group-hover:text-emerald-950">{formatDateDisplay(trainDate).day}</span>
                          <span className="text-xs sm:text-sm font-black text-slate-800">{formatDateDisplay(trainDate).monthYear}</span>
                        </div>
                        <p className="text-[10.5px] text-emerald-600 font-bold mt-0.5 truncate">{formatDateDisplay(trainDate).weekday}</p>
                      </div>
                    </div>
                    <input
                      type="date"
                      value={trainDate}
                      onChange={(e) => setTrainDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch {}
                      }}
                      className="full-tile-date-input"
                      title="Select travel date"
                    />
                  </div>

                  {/* CLASS */}
                  <div className="md:col-span-2 relative group cursor-pointer">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-emerald-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                            ₹
                          </div>
                          <span>CLASS</span>
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <div className="my-0.5">
                        <span className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-950 block truncate">
                          {trainClass === 'ALL' ? 'All Classes' : trainClass}
                        </span>
                        <p className="text-[10.5px] text-emerald-700 font-bold mt-0.5 truncate">Free Cancellation</p>
                      </div>
                    </div>
                    <select
                      value={trainClass}
                      onChange={(e) => setTrainClass(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Select class"
                    >
                      <option value="ALL">All Classes</option>
                      <option value="1A">AC First (1A)</option>
                      <option value="2A">AC 2 Tier (2A)</option>
                      <option value="3A">AC 3 Tier (3A)</option>
                      <option value="SL">Sleeper (SL)</option>
                    </select>
                  </div>

                  {/* QUOTA */}
                  <div className="md:col-span-2 relative group cursor-pointer">
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-emerald-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs">
                            <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>QUOTA</span>
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <div className="my-0.5">
                        <span className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-950 block truncate">
                          {trainQuota === 'GN' ? 'General' : trainQuota === 'TQ' ? 'Tatkal' : trainQuota === 'LD' ? 'Ladies' : 'Senior'}
                        </span>
                        <p className="text-[10.5px] text-slate-500 font-medium mt-0.5 truncate">IRCTC Authorized</p>
                      </div>
                    </div>
                    <select
                      value={trainQuota}
                      onChange={(e) => setTrainQuota(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Select quota"
                    >
                      <option value="GN">General</option>
                      <option value="TQ">Tatkal</option>
                      <option value="LD">Ladies</option>
                      <option value="SS">Senior Citizen</option>
                    </select>
                  </div>

                </div>

                {/* Floating Search Button */}
                <div className="absolute -bottom-5 sm:-bottom-5.5 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-base sm:text-lg px-16 sm:px-24 py-3 sm:py-3.5 rounded-full shadow-[0_12px_36px_rgba(5,150,105,0.45)] hover:shadow-[0_16px_45px_rgba(5,150,105,0.65)] ring-4 ring-white transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-widest group"
                  >
                    <span>SEARCH TRAINS</span>
                    <Search className="w-5 h-5 stroke-[2.8] group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= BUSES TAB ================= */}
            {activeTab === 'bus' && (
              <form onSubmit={handleBusSearch} className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 items-stretch">
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
                  <div
                    className="md:col-span-3 relative group cursor-pointer"
                    onClick={() => {
                      try {
                        const el = document.getElementById('hero-bus-date-input') as HTMLInputElement;
                        el?.showPicker();
                      } catch {}
                    }}
                  >
                    <div className="h-full p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-purple-200/90 bg-gradient-to-br from-purple-50/70 via-white to-purple-50/30 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10.5px] font-black text-purple-700 tracking-wider uppercase">
                          <div className="w-5 h-5 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center shadow-2xs">
                            <Calendar className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>JOURNEY DATE</span>
                        </span>
                        <span className="text-[9px] font-black text-purple-700 bg-purple-100/90 border border-purple-300/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Select Date
                        </span>
                      </div>
                      <div className="my-0.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-purple-950 leading-none">{formatDateDisplay(busDate).day}</span>
                          <span className="text-xs sm:text-sm font-black text-slate-800">{formatDateDisplay(busDate).monthYear}</span>
                        </div>
                        <p className="text-[10.5px] text-purple-600 font-bold mt-0.5 truncate">{formatDateDisplay(busDate).weekday}</p>
                      </div>
                    </div>
                    <input
                      id="hero-bus-date-input"
                      type="date"
                      value={busDate}
                      onChange={(e) => setBusDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch {}
                      }}
                      className="full-tile-date-input"
                      title="Select bus journey date"
                    />
                  </div>
                </div>

                {/* Floating Search Button */}
                <div className="absolute -bottom-5 sm:-bottom-5.5 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white font-black text-base sm:text-lg px-16 sm:px-24 py-3 sm:py-3.5 rounded-full shadow-[0_12px_36px_rgba(147,51,234,0.45)] hover:shadow-[0_16px_45px_rgba(147,51,234,0.65)] ring-4 ring-white transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-widest group"
                  >
                    <span>SEARCH BUSES</span>
                    <Search className="w-5 h-5 stroke-[2.8] group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= HOLIDAYS TAB ================= */}
            {activeTab === 'holidays' && (
              <form onSubmit={handleHolidaySearch} className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5 items-stretch">
                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-amber-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
                        <Palmtree className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>DESTINATION</span>
                    </span>
                    <div className="my-0.5">
                      <select
                        value={holidayDest}
                        onChange={(e) => setHolidayDest(e.target.value)}
                        className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                      >
                        <option value="Bali, Indonesia">Bali, Indonesia</option>
                        <option value="Swiss Alps & Paris">Swiss Alps &amp; Paris</option>
                        <option value="Dubai & Abu Dhabi">Dubai &amp; Abu Dhabi</option>
                        <option value="Maldives Luxury Resort">Maldives Luxury Resort</option>
                        <option value="Kashmir Paradise">Kashmir Paradise</option>
                      </select>
                      <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">Handcrafted Luxury Itineraries</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-amber-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
                        <Calendar className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>DEPARTURE MONTH</span>
                    </span>
                    <div className="my-0.5">
                      <select
                        value={holidayMonth}
                        onChange={(e) => setHolidayMonth(e.target.value)}
                        className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                      >
                        <option value="Sep 2026">September 2026</option>
                        <option value="Oct 2026">October 2026 (Diwali)</option>
                        <option value="Nov 2026">November 2026</option>
                        <option value="Dec 2026">December 2026 (New Year)</option>
                      </select>
                      <p className="text-[10.5px] text-amber-700 font-bold truncate mt-0.5">Guaranteed Early Bird Savings</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-amber-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
                        <Sparkles className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>PACKAGE CATEGORY</span>
                    </span>
                    <div className="my-0.5">
                      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">5-Star All-Inclusive</div>
                      <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">Flights, Stays, Transfers &amp; Meals</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 sm:-bottom-5.5 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-base sm:text-lg px-16 sm:px-24 py-3 sm:py-3.5 rounded-full shadow-[0_12px_36px_rgba(245,158,11,0.45)] hover:shadow-[0_16px_45px_rgba(245,158,11,0.65)] ring-4 ring-white transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-widest group"
                  >
                    <span>EXPLORE HOLIDAYS</span>
                    <Search className="w-5 h-5 stroke-[2.8] group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= VISA TAB ================= */}
            {activeTab === 'visa' && (
              <form onSubmit={handleVisaSearch} className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5 items-stretch">
                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-cyan-200/90 bg-gradient-to-br from-cyan-50/70 via-white to-cyan-50/30 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-cyan-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-cyan-100 text-cyan-600 flex items-center justify-center shadow-2xs">
                        <FileCheck2 className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>SELECT COUNTRY</span>
                    </span>
                    <div className="my-0.5">
                      <select
                        value={visaCountry}
                        onChange={(e) => setVisaCountry(e.target.value)}
                        className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                      >
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Schengen Visa (Europe)">Schengen Visa (Europe)</option>
                        <option value="Singapore">Singapore</option>
                        <option value="United States (B1/B2)">United States (B1/B2)</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                      </select>
                      <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">99.4% Approval Guarantee</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-cyan-200/90 bg-gradient-to-br from-cyan-50/70 via-white to-cyan-50/30 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-cyan-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-cyan-100 text-cyan-600 flex items-center justify-center shadow-2xs">
                        <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>VISA TYPE</span>
                    </span>
                    <div className="my-0.5">
                      <select
                        value={visaType}
                        onChange={(e) => setVisaType(e.target.value)}
                        className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                      >
                        <option value="Tourist 30 Days">Tourist 30 Days Express</option>
                        <option value="Tourist 60 Days">Tourist 60 Days Multiple</option>
                        <option value="Business Transit">Business / Investor</option>
                      </select>
                      <p className="text-[10.5px] text-cyan-700 font-bold truncate mt-0.5">Government Approved Processing</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-cyan-200/90 bg-gradient-to-br from-cyan-50/70 via-white to-cyan-50/30 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-cyan-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-cyan-100 text-cyan-600 flex items-center justify-center shadow-2xs">
                        <Globe2 className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>APPLICANT NATIONALITY</span>
                    </span>
                    <div className="my-0.5">
                      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">🇮🇳 Indian Passport</div>
                      <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">Doorstep Biometrics &amp; Docs Pickup</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 sm:-bottom-5.5 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-600 via-sky-600 to-cyan-700 hover:from-cyan-700 hover:to-sky-800 text-white font-black text-base sm:text-lg px-16 sm:px-24 py-3 sm:py-3.5 rounded-full shadow-[0_12px_36px_rgba(8,145,178,0.45)] hover:shadow-[0_16px_45px_rgba(8,145,178,0.65)] ring-4 ring-white transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-widest group"
                  >
                    <span>APPLY E-VISA</span>
                    <Search className="w-5 h-5 stroke-[2.8] group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= UMRAH TAB ================= */}
            {activeTab === 'umrah' && (
              <form onSubmit={handleUmrahSearch} className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5 items-stretch">
                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-emerald-800 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
                        <PlaneTakeoff className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>DEPARTURE CITY</span>
                    </span>
                    <div className="my-0.5">
                      <select
                        value={umrahCity}
                        onChange={(e) => setUmrahCity(e.target.value)}
                        className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                      >
                        <option value="Mumbai">Mumbai (BOM)</option>
                        <option value="New Delhi">New Delhi (DEL)</option>
                        <option value="Hyderabad">Hyderabad (HYD)</option>
                        <option value="Bengaluru">Bengaluru (BLR)</option>
                      </select>
                      <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">Direct Flights to Jeddah / Madinah</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-emerald-800 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
                        <Sparkles className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>PACKAGE TIER</span>
                    </span>
                    <div className="my-0.5">
                      <select
                        value={umrahPackage}
                        onChange={(e) => setUmrahPackage(e.target.value)}
                        className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                      >
                        <option value="VIP 5-Star Kaaba View">VIP 5-Star Kaaba View (Fairmont)</option>
                        <option value="Deluxe 15-Day Package">Deluxe 15-Day Package (Pullman)</option>
                        <option value="Ramadan Mubarak Special">Ramadan Mubarak Special</option>
                      </select>
                      <p className="text-[10.5px] text-emerald-700 font-bold truncate mt-0.5">Ministry of Hajj &amp; Umrah Authorized</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-emerald-800 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
                        <Moon className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>SERVICES INCLUDED</span>
                    </span>
                    <div className="my-0.5">
                      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Visa + Flights + Haram Hotel</div>
                      <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">Ziyarat Tours &amp; Buffet Catering</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 sm:-bottom-5.5 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 hover:from-emerald-800 hover:to-teal-950 text-amber-300 font-black text-base sm:text-lg px-16 sm:px-24 py-3 sm:py-3.5 rounded-full shadow-[0_12px_36px_rgba(4,120,87,0.5)] hover:shadow-[0_16px_45px_rgba(4,120,87,0.7)] ring-4 ring-white transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-widest group"
                  >
                    <span>VIEW UMRAH PACKAGES</span>
                    <Search className="w-5 h-5 stroke-[2.8] group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= INSURANCE TAB ================= */}
            {activeTab === 'insurance' && (
              <form onSubmit={handleInsuranceSearch} className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5 items-stretch">
                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-blue-200/90 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-blue-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shadow-2xs">
                        <Globe2 className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>DESTINATION</span>
                    </span>
                    <div className="my-0.5">
                      <select
                        value={insuranceDest}
                        onChange={(e) => setInsuranceDest(e.target.value)}
                        className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                      >
                        <option value="Worldwide (incl. USA/Canada)">Worldwide (incl. USA/Canada)</option>
                        <option value="Worldwide (excl. USA/Canada)">Worldwide (excl. USA/Canada)</option>
                        <option value="Schengen Countries">Schengen Countries (Europe)</option>
                        <option value="Asia & Middle East">Asia &amp; Middle East</option>
                      </select>
                      <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">Cashless Hospitalization Worldwide</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-blue-200/90 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-blue-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shadow-2xs">
                        <Users className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>TRAVELLERS</span>
                    </span>
                    <div className="my-0.5">
                      <select
                        value={insuranceTravellers}
                        onChange={(e) => setInsuranceTravellers(e.target.value)}
                        className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                      >
                        <option value="1 Adult">1 Adult (18-40 yrs)</option>
                        <option value="2 Adults">2 Adults (Family Plan)</option>
                        <option value="Family + Kids">Family with Children</option>
                        <option value="Senior Citizen">Senior Citizen (60+ yrs)</option>
                      </select>
                      <p className="text-[10.5px] text-blue-700 font-bold truncate mt-0.5">Up to $500,000 Medical Sum Insured</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-blue-200/90 bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-blue-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shadow-2xs">
                        <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>INSTANT COVERAGE</span>
                    </span>
                    <div className="my-0.5">
                      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Baggage &amp; Delay Protection</div>
                      <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">Embassy &amp; Visa Compliant Policy</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 sm:-bottom-5.5 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-base sm:text-lg px-16 sm:px-24 py-3 sm:py-3.5 rounded-full shadow-[0_12px_36px_rgba(37,99,235,0.45)] hover:shadow-[0_16px_45px_rgba(37,99,235,0.65)] ring-4 ring-white transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-widest group"
                  >
                    <span>GET INSTANT QUOTE</span>
                    <Search className="w-5 h-5 stroke-[2.8] group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </form>
            )}

            {/* ================= MEDICAL TAB ================= */}
            {activeTab === 'medical' && (
              <form onSubmit={handleMedicalSearch} className="space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5 items-stretch">
                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-rose-200/90 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-rose-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shadow-2xs">
                        <HeartPulse className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>SPECIALTY TREATMENT</span>
                    </span>
                    <div className="my-0.5">
                      <select
                        value={medicalSpecialty}
                        onChange={(e) => setMedicalSpecialty(e.target.value)}
                        className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                      >
                        <option value="Cardiology & Heart Care">Cardiology &amp; Heart Care</option>
                        <option value="Orthopedic & Joint Replacement">Orthopedic &amp; Joint Replacement</option>
                        <option value="Oncology & Cancer Care">Oncology &amp; Cancer Care</option>
                        <option value="IVF & Fertility Treatments">IVF &amp; Fertility Treatments</option>
                        <option value="Cosmetic & Reconstructive">Cosmetic &amp; Reconstructive</option>
                      </select>
                      <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">JCI Accredited Hospital Partners</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-rose-200/90 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-rose-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shadow-2xs">
                        <Building2 className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>PARTNER NETWORK</span>
                    </span>
                    <div className="my-0.5">
                      <select
                        value={medicalCity}
                        onChange={(e) => setMedicalCity(e.target.value)}
                        className="w-full bg-transparent text-xl sm:text-2xl font-black text-slate-900 outline-none cursor-pointer tracking-tight"
                      >
                        <option value="Apollo Hospitals, Mumbai">Apollo Hospitals, Mumbai</option>
                        <option value="Fortis Healthcare, Delhi NCR">Fortis Healthcare, Delhi NCR</option>
                        <option value="Max Super Speciality, New Delhi">Max Super Speciality, New Delhi</option>
                        <option value="Manipal Hospitals, Bengaluru">Manipal Hospitals, Bengaluru</option>
                      </select>
                      <p className="text-[10.5px] text-rose-700 font-bold truncate mt-0.5">Zero Consultation Waiting Time</p>
                    </div>
                  </div>

                  <div className="p-2.5 sm:py-3 px-3.5 rounded-2xl border-2 border-rose-200/90 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-200 flex flex-col justify-between">
                    <span className="flex items-center gap-1.5 text-[10.5px] font-black text-rose-700 tracking-wider uppercase">
                      <div className="w-5 h-5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shadow-2xs">
                        <Stethoscope className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>CONCIERGE INCLUSIONS</span>
                    </span>
                    <div className="my-0.5">
                      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Medical Visa + Airport Transfer</div>
                      <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">Dedicated Patient Liaison Officer</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-5 sm:-bottom-5.5 left-1/2 -translate-x-1/2 z-30">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-base sm:text-lg px-16 sm:px-24 py-3 sm:py-3.5 rounded-full shadow-[0_12px_36px_rgba(244,63,94,0.45)] hover:shadow-[0_16px_45px_rgba(244,63,94,0.65)] ring-4 ring-white transition-all duration-200 transform hover:scale-105 active:scale-98 cursor-pointer flex items-center gap-3 uppercase tracking-widest group"
                  >
                    <span>CONSULT DOCTOR</span>
                    <Search className="w-5 h-5 stroke-[2.8] group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>

      {/* 4. LUXURY FLOATING SERVICES RIBBON BAR (MakeMyTrip / Corporate Style) */}
      <div className="max-w-[1200px] mx-auto px-4 mt-6 sm:mt-7 relative z-20">
        <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] border border-slate-200/90 py-3.5 px-6 sm:px-8 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          {[
            { label: 'Academy', icon: GraduationCap, href: '/utilities', color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Study Abroad', icon: Globe2, href: '/holidays', tab: 'holidays' as SearchTabType, color: 'text-cyan-600 bg-cyan-50' },
            { label: 'Umrah Packages', icon: Moon, href: '/umrah', tab: 'umrah' as SearchTabType, color: 'text-emerald-700 bg-emerald-50' },
            { label: 'Passport & Visa', icon: FileCheck2, href: '/visa', tab: 'visa' as SearchTabType, color: 'text-amber-600 bg-amber-50' },
            { label: 'Air Charters', icon: Plane, href: '/flights', tab: 'flights' as SearchTabType, color: 'text-sky-600 bg-sky-50' },
            { label: 'Cargo & Courier', icon: Package, href: '/utilities', color: 'text-orange-600 bg-orange-50' },
            { label: 'IRCTC Agent', icon: Train, href: '/utilities', tab: 'train' as SearchTabType, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'MICE & Corporate', icon: Briefcase, href: '/utilities', color: 'text-purple-600 bg-purple-50' },
            { label: 'Forex & Currency', icon: Coins, href: '/utilities', color: 'text-yellow-600 bg-yellow-50' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.tab) {
                    e.preventDefault();
                    selectTab(item.tab);
                  }
                }}
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
