'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Bus,
  Clock,
  MapPin,
  Wifi,
  Star,
  CheckCircle2,
  Armchair,
  Filter,
  X,
  ArrowRight,
  Sparkles,
  ArrowRightLeft,
  Calendar,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { api } from '@/lib/api';
import { BusTrip } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import BusSearchAutocomplete, { BusLocationSuggestion } from '@/components/BusSearchAutocomplete';

function BusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formatPrice, addItem } = useCart();

  // Search Bar States
  const [origin, setOrigin] = useState(searchParams.get('origin') || 'Mumbai');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'Pune');
  const [journeyDate, setJourneyDate] = useState('2026-08-18');
  const [isWomenBooking, setIsWomenBooking] = useState(false);

  // Search Results & Filter States
  const [buses, setBuses] = useState<BusTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusType, setSelectedBusType] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [selectedBoardingFilter, setSelectedBoardingFilter] = useState<string>('');
  const [selectedDroppingFilter, setSelectedDroppingFilter] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [smartFilter, setSmartFilter] = useState<string>('');
  const [maxFare, setMaxFare] = useState<number>(3000);

  // Seat Modal State
  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<'lower' | 'upper'>('lower');
  const [selectedBoarding, setSelectedBoarding] = useState('');
  const [selectedDropping, setSelectedDropping] = useState('');

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const data = await api.searchBuses({
        origin,
        destination,
        bus_type: selectedBusType || undefined,
      });
      setBuses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [origin, destination, selectedBusType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/bus?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
    fetchBuses();
  };

  const handleSwapRoute = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSeatClick = (seatNo: string, isLadies: boolean = false) => {
    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNo));
    } else {
      setSelectedSeats([...selectedSeats, seatNo]);
    }
  };

  const handleBookTrip = () => {
    if (!selectedTrip || selectedSeats.length === 0) return;
    const isSleeper = selectedDeck === 'upper';
    const unitFare = isSleeper ? Number(selectedTrip.fare_sleeper) : Number(selectedTrip.fare_seater);
    const totalAmount = unitFare * selectedSeats.length;

    addItem({
      booking_type: 'bus',
      title: `Bus: ${selectedTrip.origin} to ${selectedTrip.destination} (${selectedTrip.operator.name})`,
      subtitle: `${selectedSeats.length} Seat(s): ${selectedSeats.join(', ')} • ${selectedTrip.bus_type} • Boarding: ${selectedBoarding || selectedTrip.boarding_points?.[0]?.location}`,
      amount: totalAmount,
      travel_date: journeyDate,
      details: {
        operator: selectedTrip.operator.name,
        bus_type: selectedTrip.bus_type,
        origin: selectedTrip.origin,
        destination: selectedTrip.destination,
        departure_time: selectedTrip.departure_time,
        arrival_time: selectedTrip.arrival_time,
        selected_seats: selectedSeats.join(', '),
        deck: selectedDeck,
        boarding_point: selectedBoarding || selectedTrip.boarding_points?.[0]?.location,
        dropping_point: selectedDropping || selectedTrip.dropping_points?.[0]?.location,
      },
    });

    setSelectedTrip(null);
    setSelectedSeats([]);
  };

  // Collect unique boarding & dropping points from available trips for dynamic filters
  const allBoardingPoints = Array.from(
    new Set(buses.flatMap((b) => b.boarding_points?.map((bp: any) => bp.location) || []))
  );
  const allDroppingPoints = Array.from(
    new Set(buses.flatMap((b) => b.dropping_points?.map((dp: any) => dp.location) || []))
  );
  const allOperators = Array.from(new Set(buses.map((b) => b.operator.name)));

  // Filtered trips
  const filteredBuses = buses.filter((b) => {
    if (selectedOperator && b.operator.name !== selectedOperator) return false;
    if (Number(b.fare_seater) > maxFare) return false;
    if (selectedBoardingFilter) {
      const match = b.boarding_points?.some((bp: any) => bp.location.toLowerCase().includes(selectedBoardingFilter.toLowerCase()));
      if (!match) return false;
    }
    if (selectedDroppingFilter) {
      const match = b.dropping_points?.some((dp: any) => dp.location.toLowerCase().includes(selectedDroppingFilter.toLowerCase()));
      if (!match) return false;
    }

    // redBus Smart Filter Tags
    if (smartFilter === 'primo' && !b.bus_name.toLowerCase().includes('primo') && !b.operator.name.toLowerCase().includes('primo')) return false;
    if (smartFilter === 'ac' && !b.bus_type.toLowerCase().includes('ac') && !b.bus_name.toLowerCase().includes('ac') && !b.bus_name.toLowerCase().includes('volvo')) return false;
    if (smartFilter === 'non_ac' && (b.bus_type.toLowerCase().includes('ac') || b.bus_name.toLowerCase().includes('ac') || b.bus_name.toLowerCase().includes('volvo'))) return false;
    if (smartFilter === 'sleeper' && !b.bus_type.toLowerCase().includes('sleeper') && !b.bus_name.toLowerCase().includes('sleeper')) return false;
    if (smartFilter === 'seater' && b.bus_type.toLowerCase().includes('sleeper')) return false;
    if (smartFilter === 'high_rated' && Number(b.operator.rating) < 4.2) return false;
    if (smartFilter === 'night' && (!b.departure_time.includes('PM') && !b.departure_time.includes('11:'))) return false;
    if (smartFilter === 'morning' && !b.departure_time.includes('AM')) return false;

    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* redBus-Style High-Impact Search Header Bar */}
        <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  <Bus className="w-3.5 h-3.5" />
                  India & Global Intercity Coach Booking
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
                  Online Bus Ticket Booking & Seat Selection
                </h1>
              </div>

              {/* Booking for Women Toggle */}
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-xs p-2.5 rounded-2xl border border-white/20">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👩</span>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">Booking for women</span>
                    <span className="text-[10px] text-rose-200 block">Highlights ladies-only seats</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWomenBooking(!isWomenBooking)}
                  className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                    isWomenBooking ? 'bg-white justify-end' : 'bg-white/30 justify-start'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full transition shadow-xs ${
                    isWomenBooking ? 'bg-red-600' : 'bg-white'
                  }`}></div>
                </button>
              </div>
            </div>

            {/* redBus Search Input Group */}
            <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl p-3 sm:p-4 text-slate-900 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                
                {/* From (Boarding Point Autocomplete) */}
                <div className="lg:col-span-4 relative">
                  <BusSearchAutocomplete
                    label="From"
                    type="from"
                    placeholder="e.g. Mumbai, Borivali East, Thane"
                    value={origin}
                    onChange={(val) => setOrigin(val)}
                  />
                </div>

                {/* Swap Button */}
                <div className="hidden lg:flex lg:col-span-1 justify-center">
                  <button
                    type="button"
                    onClick={handleSwapRoute}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 flex items-center justify-center transition shadow-xs cursor-pointer"
                    title="Swap Origin & Destination"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* To (Dropping Point Autocomplete) */}
                <div className="lg:col-span-4 relative">
                  <BusSearchAutocomplete
                    label="To"
                    type="to"
                    placeholder="e.g. Pune, Wakad, Swargate, Goa"
                    value={destination}
                    onChange={(val) => setDestination(val)}
                  />
                </div>

                {/* Date of Journey with Today / Tomorrow Quick Chips */}
                <div className="lg:col-span-3 space-y-1">
                  <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Date of Journey</label>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setJourneyDate('2026-08-18')}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md transition ${
                            journeyDate === '2026-08-18' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => setJourneyDate('2026-08-19')}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md transition ${
                            journeyDate === '2026-08-19' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          Tomorrow
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={journeyDate}
                        onChange={(e) => setJourneyDate(e.target.value)}
                        className="w-full bg-transparent font-bold text-slate-900 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Button Strip */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Popular Routes:</span>
                  <button type="button" onClick={() => { setOrigin('Mumbai'); setDestination('Pune'); }} className="hover:text-red-600 underline font-medium">Mumbai → Pune</button>
                  <span>•</span>
                  <button type="button" onClick={() => { setOrigin('Mumbai'); setDestination('Goa'); }} className="hover:text-red-600 underline font-medium">Mumbai → Goa</button>
                  <span>•</span>
                  <button type="button" onClick={() => { setOrigin('Bangalore'); setDestination('Hyderabad'); }} className="hover:text-red-600 underline font-medium">Bangalore → Hyderabad</button>
                  <span>•</span>
                  <button type="button" onClick={() => { setOrigin('Dubai'); setDestination('Abu Dhabi'); }} className="hover:text-red-600 underline font-medium">Dubai → Abu Dhabi</button>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-red-600/30 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Bus className="w-4 h-4" />
                  <span>Search Buses</span>
                </button>
              </div>
            </form>

          </div>
        </div>

        {/* Search Results Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Filters Sidebar (redBus Style AI Smart Filter) */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Filters</span>
              </h3>
              <button
                onClick={() => {
                  setSelectedBusType('');
                  setSelectedOperator('');
                  setSelectedBoardingFilter('');
                  setSelectedDroppingFilter('');
                  setSmartFilter('');
                  setMaxFare(3000);
                }}
                className="text-[11px] text-red-600 font-semibold hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* redBus AI Smart Filter Prompt Input Box */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">AI Smart Filter</span>
              <div className="relative flex items-center">
                <div className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-2.5 flex items-center gap-2 shadow-xs">
                  <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Try 'Morning bus under ₹800'"
                    className="w-full bg-transparent text-xs text-slate-800 placeholder-purple-400 outline-none font-medium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.toLowerCase();
                        if (val.includes('ac')) setSmartFilter('ac');
                        if (val.includes('sleeper')) setSmartFilter('sleeper');
                        if (val.includes('primo')) setSmartFilter('primo');
                        if (val.includes('morning')) setSmartFilter('morning');
                        if (val.includes('night')) setSmartFilter('night');
                      }
                    }}
                  />
                  <span className="text-base cursor-pointer hover:scale-110 transition" title="Voice Search">🎤</span>
                </div>
              </div>
            </div>

            {/* redBus Quick Filter Chips */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Smart Filters</span>
              <div className="flex flex-col gap-2 text-xs font-medium">
                {[
                  { id: 'primo', label: '⭐ Primo Bus', count: 6 },
                  { id: 'free_cancel', label: '🛡️ Free Cancellation', count: 12 },
                  { id: 'ac', label: '❄️ AC', count: 11 },
                  { id: 'sleeper', label: '🛏️ SLEEPER', count: 8 },
                  { id: 'single_seats', label: '👤 Single Seats', count: 6 },
                  { id: 'seater', label: '💺 SEATER', count: 7 },
                  { id: 'non_ac', label: '🚌 NONAC', count: 3 },
                  { id: 'night', label: '🌙 18:00-24:00 (Night)', count: 6 },
                  { id: 'morning', label: '☀️ 06:00-12:00 (Morning)', count: 4 },
                  { id: 'high_rated', label: '★ High Rated Buses', count: 9 },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setSmartFilter(smartFilter === chip.id ? '' : chip.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                      smartFilter === chip.id
                        ? 'bg-red-50 border-red-500 text-red-700 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{chip.label}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                      ({chip.count})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Boarding Points Filter */}
            {allBoardingPoints.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Boarding Points in {origin}
                </label>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 text-xs">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-900">
                    <input
                      type="radio"
                      name="bpFilter"
                      checked={selectedBoardingFilter === ''}
                      onChange={() => setSelectedBoardingFilter('')}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>All Boarding Points</span>
                  </label>
                  {allBoardingPoints.map((bp) => (
                    <label key={bp} className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-900">
                      <input
                        type="radio"
                        name="bpFilter"
                        checked={selectedBoardingFilter === bp}
                        onChange={() => setSelectedBoardingFilter(bp)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="truncate">{bp}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Dropping Points Filter */}
            {allDroppingPoints.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Dropping Points in {destination}
                </label>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 text-xs">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-900">
                    <input
                      type="radio"
                      name="dpFilter"
                      checked={selectedDroppingFilter === ''}
                      onChange={() => setSelectedDroppingFilter('')}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>All Dropping Points</span>
                  </label>
                  {allDroppingPoints.map((dp) => (
                    <label key={dp} className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-slate-900">
                      <input
                        type="radio"
                        name="dpFilter"
                        checked={selectedDroppingFilter === dp}
                        onChange={() => setSelectedDroppingFilter(dp)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="truncate">{dp}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Operators Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Bus Operators</label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="opFilter"
                    checked={selectedOperator === ''}
                    onChange={() => setSelectedOperator('')}
                    className="text-red-600"
                  />
                  <span>All Operators</span>
                </label>
                {allOperators.map((op) => (
                  <label key={op} className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="opFilter"
                      checked={selectedOperator === op}
                      onChange={() => setSelectedOperator(op)}
                      className="text-red-600"
                    />
                    <span className="truncate">{op}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Max Fare Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Max Fare</span>
                <span className="text-red-600 font-extrabold">{formatPrice(maxFare)}</span>
              </div>
              <input
                type="range"
                min={200}
                max={3000}
                step={50}
                value={maxFare}
                onChange={(e) => setMaxFare(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

          </div>

          {/* Bus Results List (redBus Style) */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* redBus Special Offers Banner Carousel */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">Special offers just for you</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">%</div>
                    <div>
                      <span className="text-xs font-black text-emerald-900 block">FIRST</span>
                      <span className="text-[11px] text-emerald-700 font-medium block">Save up to ₹500 on your first bus booking</span>
                    </div>
                  </div>
                  <button type="button" className="text-xs font-bold bg-white text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-300 hover:bg-emerald-100 transition cursor-pointer">
                    Copy
                  </button>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">%</div>
                    <div>
                      <span className="text-xs font-black text-emerald-900 block">RED500</span>
                      <span className="text-[11px] text-emerald-700 font-medium block">Save up to ₹500 on return ticket</span>
                    </div>
                  </div>
                  <button type="button" className="text-xs font-bold bg-white text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-300 hover:bg-emerald-100 transition cursor-pointer">
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-2">
              <span className="font-bold text-slate-800">
                {loading ? 'Searching routes...' : `${filteredBuses.length} Buses found for ${origin} → ${destination}`}
              </span>
              <span>Sorted by Fare</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-48 bg-white rounded-3xl animate-pulse border border-slate-200"></div>
                ))}
              </div>
            ) : filteredBuses.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                <Bus className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No buses found for "{origin} → {destination}"</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try searching for <strong>Barshi → Swargate</strong>, <strong>Mumbai → Pune</strong>, <strong>Solapur → Pune</strong>, or <strong>Mumbai → Goa</strong>.
                </p>
                <button
                  onClick={() => { setOrigin('Barshi'); setDestination('Pune'); }}
                  className="bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm cursor-pointer"
                >
                  View Barshi → Pune Buses
                </button>
              </div>
            ) : (
              filteredBuses.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-red-200 transition space-y-4 relative overflow-hidden"
                >
                  {/* Operator Header & Rating */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">{trip.operator.name}</h3>
                        {trip.bus_name.toLowerCase().includes('primo') && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                            ⭐ Primo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{trip.bus_name}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                        {trip.operator.rating}
                        <span className="text-[10px] text-emerald-100 font-normal">({trip.operator.total_reviews})</span>
                      </span>
                      <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                        {trip.available_seats_count || 42} Seats ({Math.floor((trip.available_seats_count || 42)/3)} Single)
                      </span>
                    </div>
                  </div>

                  {/* redBus Feature Offer Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                    <span className="bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-md border border-sky-200">New Bus</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md border border-indigo-200">On Time</span>
                    <span className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-md border border-purple-200">Free date change</span>
                    <span className="bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-md border border-amber-200">Minimum 10% off on return ticket</span>
                  </div>

                  {/* Route Timeline with Boarding & Dropping Points Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    
                    {/* Origin & Primary Boarding Point */}
                    <div className="sm:col-span-4">
                      <span className="text-lg font-black text-slate-900">{trip.departure_time}</span>
                      <p className="text-xs font-bold text-slate-800">{trip.origin}</p>
                      <span className="text-[11px] text-red-600 font-semibold block truncate mt-0.5">
                        📍 {trip.boarding_points?.[0]?.location}
                      </span>
                      {trip.boarding_points && trip.boarding_points.length > 1 && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          +{trip.boarding_points.length - 1} more boarding points
                        </span>
                      )}
                    </div>

                    {/* Duration Graphic */}
                    <div className="sm:col-span-4 text-center space-y-1">
                      <span className="text-xs font-semibold text-slate-600 flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-red-600" />
                        {trip.duration}
                      </span>
                      <div className="relative flex items-center justify-center my-1">
                        <div className="w-full h-0.5 bg-slate-300"></div>
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white"></div>
                      </div>
                      <span className="text-[10px] text-slate-400 capitalize">{trip.bus_type.replace(/_/g, ' ')}</span>
                    </div>

                    {/* Destination & Primary Dropping Point */}
                    <div className="sm:col-span-4 text-right">
                      <span className="text-lg font-black text-slate-900">{trip.arrival_time}</span>
                      <p className="text-xs font-bold text-slate-800">{trip.destination}</p>
                      <span className="text-[11px] text-emerald-600 font-semibold block truncate mt-0.5">
                        🏁 {trip.dropping_points?.[0]?.location}
                      </span>
                      {trip.dropping_points && trip.dropping_points.length > 1 && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          +{trip.dropping_points.length - 1} more dropping points
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Actions & Fare Breakdown */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {trip.amenities?.slice(0, 4).map((am: string) => (
                        <span key={am} className="text-[10px] text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                          ✓ {am}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900">
                          {formatPrice(trip.fare_seater)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Onwards</span>
                      </div>

                      {/* redBus Signature Red View Seats Pill Button */}
                      <button
                        onClick={() => {
                          setSelectedTrip(trip);
                          setSelectedSeats([]);
                          setSelectedBoarding(trip.boarding_points?.[0]?.location || '');
                          setSelectedDropping(trip.dropping_points?.[0]?.location || '');
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-7 py-2.5 rounded-full shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        View seats
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}

          </div>

        </div>

      </div>

      {/* Interactive Seat & Boarding/Dropping Point Selection Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-400">Select Seats, Boarding & Dropping Points</span>
                <h3 className="text-base font-bold">{selectedTrip.operator.name} ({selectedTrip.origin} → {selectedTrip.destination})</h3>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
              
              {/* Deck Toggle */}
              <div className="flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setSelectedDeck('lower')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    selectedDeck === 'lower' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Lower Deck (Seater • {formatPrice(selectedTrip.fare_seater)})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDeck('upper')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    selectedDeck === 'upper' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Upper Deck (Sleeper Beds • {formatPrice(selectedTrip.fare_sleeper)})
                </button>
              </div>

              {/* Legend Strip */}
              <div className="flex items-center justify-around text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-red-600"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-white border border-slate-300"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-pink-200 border border-pink-400"></div>
                  <span>Ladies Only</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-slate-300"></div>
                  <span>Booked</span>
                </div>
              </div>

              {/* Bus Interior Simulator */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold px-2">
                  <span>🚗 Driver / Front Entry</span>
                  <span>Exit Door</span>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {selectedDeck === 'lower' ? (
                    ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'].map((seat) => {
                      const isSel = selectedSeats.includes(seat);
                      const isBooked = ['L3', 'L7'].includes(seat);
                      const isLadies = ['L1', 'L2'].includes(seat);
                      return (
                        <button
                          key={seat}
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSeatClick(seat, isLadies)}
                          className={`p-3 rounded-xl text-xs font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                            isBooked
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                              : isSel
                              ? 'bg-red-600 text-white shadow-md'
                              : isLadies
                              ? 'bg-pink-50 border-2 border-pink-300 text-pink-700 hover:bg-pink-100'
                              : 'bg-white border border-slate-300 text-slate-700 hover:border-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Armchair className="w-4 h-4" />
                          <span>{seat}</span>
                          {isLadies && <span className="text-[8px] uppercase font-black text-pink-600">Ladies</span>}
                        </button>
                      );
                    })
                  ) : (
                    ['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8'].map((seat) => {
                      const isSel = selectedSeats.includes(seat);
                      const isBooked = ['U2', 'U6'].includes(seat);
                      return (
                        <button
                          key={seat}
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSeatClick(seat)}
                          className={`p-3.5 rounded-xl text-xs font-bold text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                            isBooked
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                              : isSel
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-white border border-slate-300 text-slate-700 hover:border-red-500 hover:bg-red-50'
                          }`}
                        >
                          <span className="text-[10px]">🛏️ Sleeper</span>
                          <span>{seat}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Boarding Point & Dropping Point Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Boarding Points Selection */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">
                    Select Boarding Point ({origin})
                  </label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs">
                    {selectedTrip.boarding_points?.map((bp: any) => (
                      <label
                        key={bp.location}
                        className={`p-2 rounded-xl border flex items-start justify-between cursor-pointer transition ${
                          selectedBoarding === bp.location
                            ? 'bg-red-50 border-red-300 font-bold text-red-800'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="radio"
                            name="boardingPointRadio"
                            checked={selectedBoarding === bp.location}
                            onChange={() => setSelectedBoarding(bp.location)}
                            className="text-red-600 mt-0.5"
                          />
                          <div>
                            <span className="block">{bp.location}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{bp.address}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-900 shrink-0">{bp.time}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dropping Points Selection */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">
                    Select Dropping Point ({destination})
                  </label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs">
                    {selectedTrip.dropping_points?.map((dp: any) => (
                      <label
                        key={dp.location}
                        className={`p-2 rounded-xl border flex items-start justify-between cursor-pointer transition ${
                          selectedDropping === dp.location
                            ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="radio"
                            name="droppingPointRadio"
                            checked={selectedDropping === dp.location}
                            onChange={() => setSelectedDropping(dp.location)}
                            className="text-emerald-600 mt-0.5"
                          />
                          <div>
                            <span className="block">{dp.location}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{dp.address}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-900 shrink-0">{dp.time}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* Summary & Add to Cart */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs block">Seats Selected ({selectedSeats.length}):</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedSeats.join(', ') || 'None selected'}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-xs block">Total Fare:</span>
                  <span className="text-xl font-black text-red-600">
                    {formatPrice(
                      (selectedDeck === 'upper' ? Number(selectedTrip.fare_sleeper) : Number(selectedTrip.fare_seater)) * (selectedSeats.length || 1)
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={handleBookTrip}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-4 rounded-xl shadow-lg shadow-red-600/30 transition disabled:opacity-50 cursor-pointer"
              >
                Add Bus Ticket to Cart ({selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''})
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function BusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">Loading Bus Routes & Points...</div>}>
      <BusContent />
    </Suspense>
  );
}
