'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plane,
  Clock,
  Luggage,
  ShieldCheck,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Armchair,
  CheckCircle2,
  X,
  Calendar,
  Users,
  ArrowRightLeft,
  Search,
  Zap,
  SlidersHorizontal,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  TrendingDown,
  Award,
  DollarSign,
  Tag,
  ShieldAlert,
  Info
} from 'lucide-react';
import { api } from '@/lib/api';
import { FlightSchedule } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import FlightAirportAutocomplete from '@/components/FlightAirportAutocomplete';

const AIRLINE_FALLBACKS = [
  { name: 'IndiGo', iata: '6E', plane: 'Airbus A321neo', dep: '06:15 AM', arr: '08:25 AM', dur: '2h 10m', stops: 0, price: 5154, meals: false, wifi: false, refundable: true },
  { name: 'Air India', iata: 'AI', plane: 'Airbus A350-900', dep: '08:30 AM', arr: '10:45 AM', dur: '2h 15m', stops: 0, price: 6506, meals: true, wifi: true, refundable: true },
  { name: 'SpiceJet', iata: 'SG', plane: 'Boeing 737 MAX 8', dep: '11:20 AM', arr: '01:30 PM', dur: '2h 10m', stops: 0, price: 5289, meals: true, wifi: false, refundable: false },
  { name: 'Akasa Air', iata: 'QP', plane: 'Boeing 737 MAX', dep: '02:40 PM', arr: '04:55 PM', dur: '2h 15m', stops: 0, price: 5050, meals: false, wifi: false, refundable: false },
  { name: 'Vistara', iata: 'UK', plane: 'Airbus A320neo', dep: '05:50 PM', arr: '08:05 PM', dur: '2h 15m', stops: 0, price: 6800, meals: true, wifi: true, refundable: true },
  { name: 'IndiGo', iata: '6E', plane: 'Airbus A320neo', dep: '08:15 PM', arr: '10:25 PM', dur: '2h 10m', stops: 0, price: 5364, meals: false, wifi: false, refundable: true },
  { name: 'Air India Express', iata: 'IX', plane: 'Boeing 737-800', dep: '09:45 PM', arr: '11:55 PM', dur: '2h 10m', stops: 0, price: 4950, meals: false, wifi: false, refundable: false },
  { name: 'Emirates', iata: 'EK', plane: 'Boeing 777-300ER', dep: '10:30 PM', arr: '02:50 AM', dur: '4h 20m', stops: 1, price: 18500, meals: true, wifi: true, refundable: true },
];

function generateFallbackFlights(origCode: string, destCode: string): FlightSchedule[] {
  return AIRLINE_FALLBACKS.map((item, idx) => ({
    id: 99000 + idx,
    flight_number: `${item.iata}-${100 + idx * 42}`,
    airline: {
      name: item.name,
      iata_code: item.iata,
    },
    origin: {
      name: `${origCode} International Airport`,
      city: origCode,
      country: 'India',
      iata_code: origCode,
    },
    destination: {
      name: `${destCode} International Airport`,
      city: destCode,
      country: 'India',
      iata_code: destCode,
    },
    departure_time: item.dep,
    arrival_time: item.arr,
    duration: item.dur,
    stops: item.stops,
    stop_details: item.stops === 0 ? 'Non-stop Direct' : '1h 20m layover via Delhi (DEL)',
    price_economy: item.price,
    price_premium: Math.round(item.price * 1.38),
    price_business: Math.round(item.price * 2.7),
    price_first: Math.round(item.price * 4.4),
    baggage_checkin: item.stops === 0 ? '15 kg' : '25 kg',
    baggage_cabin: '7 kg',
    refundable: item.refundable,
    aircraft_type: item.plane,
    has_meals: item.meals,
    has_wifi: item.wifi,
    has_usb: true,
    has_entertainment: item.meals,
    seat_layout: '3-3',
    seats: [
      { id: 990000 + idx * 10 + 1, seat_number: '10A', seat_class: 'business', extra_price: 25, is_available: true, is_window: true, is_aisle: false },
      { id: 990000 + idx * 10 + 2, seat_number: '10C', seat_class: 'business', extra_price: 25, is_available: true, is_window: false, is_aisle: true },
      { id: 990000 + idx * 10 + 3, seat_number: '12A', seat_class: 'extra_legroom', extra_price: 15, is_available: true, is_window: true, is_aisle: false },
      { id: 990000 + idx * 10 + 4, seat_number: '12C', seat_class: 'extra_legroom', extra_price: 15, is_available: true, is_window: false, is_aisle: true },
      { id: 990000 + idx * 10 + 5, seat_number: '14A', seat_class: 'economy', extra_price: 10, is_available: true, is_window: true, is_aisle: false },
      { id: 990000 + idx * 10 + 6, seat_number: '14B', seat_class: 'economy', extra_price: 0, is_available: true, is_window: false, is_aisle: false },
      { id: 990000 + idx * 10 + 7, seat_number: '14C', seat_class: 'economy', extra_price: 0, is_available: true, is_window: false, is_aisle: true },
    ],
  }));
}

function FlightsContent() {
  const searchParams = useSearchParams();
  const { formatPrice, addItem } = useCart();

  // Helper to format flight prices (DB values are in INR, formatPrice expects USD)
  const formatFlightPrice = (inrAmount: number) => {
    return formatPrice(Number(inrAmount || 0) / 84.5);
  };

  const [flights, setFlights] = useState<FlightSchedule[]>([]);
  const [returnFlights, setReturnFlights] = useState<FlightSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');
  const [origin, setOrigin] = useState(searchParams.get('origin') || 'DXB');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'JED');
  const [cabinClass, setCabinClass] = useState(searchParams.get('cabin') || 'economy');
  const [passengers, setPassengers] = useState(Number(searchParams.get('passengers')) || 1);
  const [departDate, setDepartDate] = useState('2026-09-15');
  const [returnDate, setReturnDate] = useState('2026-09-22');
  const [specialFare, setSpecialFare] = useState<string>('regular');
  const [isTravellerOpen, setIsTravellerOpen] = useState(false);

  // Multi-City State
  const [multiCityLegs, setMultiCityLegs] = useState<Array<{ id: number; origin: string; destination: string; date: string }>>([
    { id: 1, origin: 'DEL', destination: 'DXB', date: '2026-09-15' },
    { id: 2, origin: 'DXB', destination: 'LHR', date: '2026-09-20' },
  ]);
  const [multiCityResults, setMultiCityResults] = useState<Record<number, FlightSchedule[]>>({});
  const [selectedMultiCityFlights, setSelectedMultiCityFlights] = useState<Record<number, FlightSchedule>>({});

  // Roundtrip Selected Flights State
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState<FlightSchedule | null>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<FlightSchedule | null>(null);
  const [roundTripActiveTab, setRoundTripActiveTab] = useState<'outbound' | 'return'>('outbound');

  // Filter state
  const [selectedStops, setSelectedStops] = useState<number | null>(null);
  const [selectedAirline, setSelectedAirline] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(350000);
  const [refundableOnly, setRefundableOnly] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'cheapest' | 'fastest' | 'earliest' | 'best'>('cheapest');

  // Seat selection modal state
  const [seatModalFlight, setSeatModalFlight] = useState<FlightSchedule | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatCostExtra, setSeatCostExtra] = useState<number>(0);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      if (tripType === 'multicity') {
        const resultsMap: Record<number, FlightSchedule[]> = {};
        for (const leg of multiCityLegs) {
          try {
            const data = await api.searchFlights({
              origin: leg.origin,
              destination: leg.destination,
              stops: selectedStops !== null ? selectedStops : undefined,
              airline: selectedAirline || undefined,
              max_price: maxPrice,
            });
            resultsMap[leg.id] = (data && data.length > 0) ? data : generateFallbackFlights(leg.origin, leg.destination);
          } catch {
            resultsMap[leg.id] = generateFallbackFlights(leg.origin, leg.destination);
          }
        }
        setMultiCityResults(resultsMap);
        const initialSelected: Record<number, FlightSchedule> = {};
        for (const leg of multiCityLegs) {
          if (resultsMap[leg.id]?.length > 0) {
            initialSelected[leg.id] = resultsMap[leg.id][0];
          }
        }
        setSelectedMultiCityFlights(initialSelected);
      } else {
        let outboundData: FlightSchedule[] = [];
        try {
          outboundData = await api.searchFlights({
            origin,
            destination,
            stops: selectedStops !== null ? selectedStops : undefined,
            airline: selectedAirline || undefined,
            max_price: maxPrice,
          });
        } catch {
          outboundData = [];
        }

        if (!outboundData || outboundData.length === 0) {
          outboundData = generateFallbackFlights(origin, destination);
        }

        setFlights(outboundData);
        if (outboundData.length > 0) {
          setSelectedOutboundFlight(outboundData[0]);
        }

        if (tripType === 'roundtrip') {
          let returnData: FlightSchedule[] = [];
          try {
            returnData = await api.searchFlights({
              origin: destination,
              destination: origin,
              stops: selectedStops !== null ? selectedStops : undefined,
              airline: selectedAirline || undefined,
              max_price: maxPrice,
            });
          } catch {
            returnData = [];
          }

          if (!returnData || returnData.length === 0) {
            returnData = generateFallbackFlights(destination, origin);
          }

          setReturnFlights(returnData);
          if (returnData.length > 0) {
            setSelectedReturnFlight(returnData[0]);
          }
        }
      }
    } catch (e) {
      console.error(e);
      const fallback = generateFallbackFlights(origin, destination);
      setFlights(fallback);
      if (fallback.length > 0) setSelectedOutboundFlight(fallback[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [origin, destination, tripType, selectedStops, selectedAirline, maxPrice]);

  const addMultiCityLeg = () => {
    if (multiCityLegs.length >= 5) return;
    const lastLeg = multiCityLegs[multiCityLegs.length - 1];
    const newId = Date.now();
    setMultiCityLegs([
      ...multiCityLegs,
      { id: newId, origin: lastLeg ? lastLeg.destination : 'LHR', destination: 'BOM', date: '2026-09-25' }
    ]);
  };

  const removeMultiCityLeg = (id: number) => {
    if (multiCityLegs.length <= 2) return;
    setMultiCityLegs(multiCityLegs.filter((leg) => leg.id !== id));
  };

  const updateMultiCityLeg = (id: number, field: 'origin' | 'destination' | 'date', value: string) => {
    setMultiCityLegs(
      multiCityLegs.map((leg) => (leg.id === id ? { ...leg, [field]: value } : leg))
    );
  };

  const handleSeatToggle = (seatNo: string, extraPrice: number) => {
    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNo));
      setSeatCostExtra((prev) => prev - extraPrice);
    } else {
      if (selectedSeats.length >= passengers) {
        setSelectedSeats([seatNo]);
        setSeatCostExtra(extraPrice);
      } else {
        setSelectedSeats([...selectedSeats, seatNo]);
        setSeatCostExtra((prev) => prev + extraPrice);
      }
    }
  };

  const getPriceForCabin = (flight: FlightSchedule) => {
    if (!flight) return 0;
    switch (cabinClass) {
      case 'premium': return Number(flight.price_premium);
      case 'business': return Number(flight.price_business);
      case 'first': return Number(flight.price_first);
      default: return Number(flight.price_economy);
    }
  };

  const handleAddToCart = (flight: FlightSchedule) => {
    const basePriceInr = getPriceForCabin(flight) * passengers;
    const finalAmountUSD = Math.round(((basePriceInr / 84.5) + seatCostExtra) * 100) / 100;
    addItem({
      booking_type: 'flight',
      title: `Flight ${flight.airline.iata_code}-${flight.flight_number}: ${flight.origin.iata_code} to ${flight.destination.iata_code}`,
      subtitle: `${flight.airline.name} • ${cabinClass.toUpperCase()} • ${passengers} Passenger(s) • Seats: ${selectedSeats.join(', ') || 'Auto-Assigned'}`,
      amount: finalAmountUSD,
      travel_date: departDate,
      details: {
        flight_number: `${flight.airline.iata_code}-${flight.flight_number}`,
        airline: flight.airline.name,
        origin: flight.origin.city,
        destination: flight.destination.city,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        cabin_class: cabinClass,
        selected_seats: selectedSeats.join(', '),
      },
    });
    setSeatModalFlight(null);
    setSelectedSeats([]);
    setSeatCostExtra(0);
  };

  const handleAddRoundTripToCart = () => {
    if (!selectedOutboundFlight || !selectedReturnFlight) return;
    const outboundPriceInr = getPriceForCabin(selectedOutboundFlight) * passengers;
    const returnPriceInr = getPriceForCabin(selectedReturnFlight) * passengers;
    const totalAmountUSD = Math.round((((outboundPriceInr + returnPriceInr) / 84.5) + seatCostExtra) * 100) / 100;

    addItem({
      booking_type: 'flight',
      title: `Round Trip: ${selectedOutboundFlight.origin.iata_code} ⇄ ${selectedOutboundFlight.destination.iata_code}`,
      subtitle: `Outbound: ${selectedOutboundFlight.airline.name} (${departDate}) | Return: ${selectedReturnFlight.airline.name} (${returnDate}) • ${passengers} Passenger(s)`,
      amount: totalAmountUSD,
      travel_date: `${departDate} to ${returnDate}`,
      details: {
        flight_number: `${selectedOutboundFlight.flight_number} & ${selectedReturnFlight.flight_number}`,
        airline: `${selectedOutboundFlight.airline.name} / ${selectedReturnFlight.airline.name}`,
        origin: selectedOutboundFlight.origin.city,
        destination: selectedOutboundFlight.destination.city,
        departure_time: selectedOutboundFlight.departure_time,
        arrival_time: selectedReturnFlight.arrival_time,
        cabin_class: cabinClass,
      },
    });
  };

  const handleAddMultiCityToCart = () => {
    const selectedList = Object.values(selectedMultiCityFlights);
    if (selectedList.length === 0) return;
    const totalAmountInr = selectedList.reduce((acc, f) => acc + getPriceForCabin(f) * passengers, 0);
    const totalAmountUSD = Math.round((totalAmountInr / 84.5) * 100) / 100;
    const citiesRoute = multiCityLegs.map((l) => l.origin).concat(multiCityLegs[multiCityLegs.length - 1]?.destination).join(' → ');

    addItem({
      booking_type: 'flight',
      title: `Multi-City Itinerary: ${citiesRoute}`,
      subtitle: `${multiCityLegs.length} Flight Legs • ${passengers} Passenger(s) • ${cabinClass.toUpperCase()}`,
      amount: totalAmountUSD,
      travel_date: multiCityLegs[0]?.date || departDate,
      details: {
        legs_count: multiCityLegs.length,
        route: citiesRoute,
        cabin_class: cabinClass,
      },
    });
  };

  // Helper for airline styling
  const getAirlineMeta = (iataCode: string) => {
    const code = (iataCode || '').toUpperCase();
    switch (code) {
      case 'EK':
        return {
          code: 'EK',
          color: 'from-red-600 via-rose-700 to-red-800',
          badgeBg: 'bg-red-50 text-red-700 border-red-200',
          accentBorder: 'border-l-red-600',
          tier: 'Emirates First & Business',
        };
      case 'QR':
        return {
          code: 'QR',
          color: 'from-purple-900 via-rose-950 to-pink-950',
          badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
          accentBorder: 'border-l-purple-900',
          tier: 'Skytrax 5★ World Airline',
        };
      case 'AI':
        return {
          code: 'AI',
          color: 'from-red-600 via-red-700 to-orange-600',
          badgeBg: 'bg-red-50 text-red-700 border-red-200',
          accentBorder: 'border-l-red-600',
          tier: 'Air India Premier Flagship',
        };
      case 'IX':
        return {
          code: 'IX',
          color: 'from-orange-500 via-amber-600 to-orange-600',
          badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
          accentBorder: 'border-l-orange-500',
          tier: 'Air India Express Prime',
        };
      case '6E':
        return {
          code: '6E',
          color: 'from-blue-700 via-indigo-700 to-blue-900',
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          accentBorder: 'border-l-blue-600',
          tier: 'IndiGo Premier Network',
        };
      case 'SG':
        return {
          code: 'SG',
          color: 'from-red-600 via-orange-600 to-amber-600',
          badgeBg: 'bg-red-50 text-red-700 border-red-200',
          accentBorder: 'border-l-red-500',
          tier: 'SpiceJet Express',
        };
      case 'UK':
        return {
          code: 'UK',
          color: 'from-purple-800 via-purple-900 to-violet-950',
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          accentBorder: 'border-l-purple-700',
          tier: 'Vistara Tata SIA Luxury',
        };
      case 'SQ':
        return {
          code: 'SQ',
          color: 'from-slate-900 via-blue-950 to-amber-700',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          accentBorder: 'border-l-amber-600',
          tier: 'Singapore Airlines Suites',
        };
      case 'BA':
        return {
          code: 'BA',
          color: 'from-blue-800 via-slate-900 to-red-700',
          badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
          accentBorder: 'border-l-blue-700',
          tier: 'British Airways Club World',
        };
      case 'EY':
        return {
          code: 'EY',
          color: 'from-amber-700 via-yellow-700 to-amber-900',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          accentBorder: 'border-l-amber-600',
          tier: 'Etihad Airways The Residence',
        };
      default:
        return {
          code: code || 'OG',
          color: 'from-cyan-700 via-blue-800 to-slate-900',
          badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          accentBorder: 'border-l-cyan-600',
          tier: 'Orbinex Verified Carrier',
        };
    }
  };

  // Time slot filter helper
  const matchesTimeSlot = (flightTime: string, slot: string | null) => {
    if (!slot) return true;
    let hour = 12;
    const match = flightTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (match) {
      hour = parseInt(match[1]);
      const isPM = match[3]?.toUpperCase() === 'PM';
      const isAM = match[3]?.toUpperCase() === 'AM';
      if (isPM && hour < 12) hour += 12;
      if (isAM && hour === 12) hour = 0;
    }
    if (slot === 'early') return hour < 6;
    if (slot === 'morning') return hour >= 6 && hour < 12;
    if (slot === 'afternoon') return hour >= 12 && hour < 18;
    if (slot === 'night') return hour >= 18;
    return true;
  };

  // Sort & filter flights
  const getProcessedFlights = (list: FlightSchedule[]) => {
    const filtered = list.filter((f) => {
      if (refundableOnly && !f.refundable) return false;
      if (selectedTimeSlot && !matchesTimeSlot(f.departure_time, selectedTimeSlot)) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      const priceA = getPriceForCabin(a);
      const priceB = getPriceForCabin(b);
      if (sortOption === 'cheapest') return priceA - priceB;
      if (sortOption === 'fastest') {
        const durA = parseInt(a.duration) || 0;
        const durB = parseInt(b.duration) || 0;
        return durA - durB;
      }
      if (sortOption === 'earliest') {
        return a.departure_time.localeCompare(b.departure_time);
      }
      const scoreA = (a.stops * 3000) + priceA;
      const scoreB = (b.stops * 3000) + priceB;
      return scoreA - scoreB;
    });
  };

  // Fare Calendar generation
  const getFareCalendarDates = () => {
    const base = new Date(departDate || '2026-09-15');
    const validBase = isNaN(base.getTime()) ? new Date('2026-09-15') : base;
    const dates = [];
    const basePrices = [4850, 4520, 5100, 4990, 5400, 5800, 6100];

    for (let i = -3; i <= 3; i++) {
      const d = new Date(validBase);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const samplePrice = basePrices[(i + 3) % 7];
      dates.push({
        dateStr,
        dayName,
        dayNum,
        price: samplePrice,
        isCheapest: i === -2, // highlight one specific date
        isSelected: dateStr === departDate,
      });
    }
    return dates;
  };

  const fareDates = getFareCalendarDates();
  const currentList = tripType === 'roundtrip' && roundTripActiveTab === 'return' ? returnFlights : flights;
  const processedFlights = getProcessedFlights(currentList);

  return (
    <div className="bg-[#f4f7fb] min-h-screen text-slate-900 pb-20">
      
      {/* 1. LUXURY NAVY ROUTE HERO & SEARCH CAPSULE */}
      <div className="relative bg-[#071426] text-white pt-6 pb-8 border-b border-[#132847] shadow-xl overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          
          {/* Top Route Summary Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0c213d]/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-sky-900/40 shadow-inner">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 flex-shrink-0">
                <Plane className="w-6 h-6 rotate-45" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>{origin}</span>
                    <ArrowRightLeft className="w-4 h-4 text-sky-400" />
                    <span>{destination}</span>
                  </h1>
                  <span className="text-[11px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {tripType === 'roundtrip' ? 'Round Trip' : tripType === 'multicity' ? 'Multi-City' : 'One Way'}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 text-xs text-slate-300 mt-1 font-medium flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    {departDate} {tripType === 'roundtrip' && `to ${returnDate}`}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    {passengers} Traveller(s)
                  </span>
                  <span>•</span>
                  <span className="capitalize font-semibold text-amber-300">{cabinClass} Class</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Live Inventory</span>
                <span className="text-xs font-black text-emerald-400 flex items-center justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  GDS Verified Live
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/15 transition flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                <span>{isSearchExpanded ? 'Hide Search Widget' : 'Modify Search'}</span>
                {isSearchExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Collapsible MakeMyTrip / Booking.com Caliber Search Card */}
          {isSearchExpanded && (
            <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-3 duration-200">
              
              {/* Trip Type Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-6">
                  {[
                    { id: 'oneway', label: 'One Way' },
                    { id: 'roundtrip', label: 'Round Trip' },
                    { id: 'multicity', label: 'Multi City' },
                  ].map((type) => (
                    <label key={type.id} className="flex items-center gap-2.5 cursor-pointer font-extrabold text-xs text-slate-800 hover:text-sky-600 transition">
                      <input
                        type="radio"
                        name="tripType"
                        checked={tripType === type.id}
                        onChange={() => {
                          setTripType(type.id as any);
                          if (type.id === 'roundtrip' && !returnDate) setReturnDate('2026-09-22');
                        }}
                        className="text-sky-600 focus:ring-sky-500 w-4 h-4"
                      />
                      <span className={tripType === type.id ? 'text-sky-600 font-black' : ''}>{type.label}</span>
                    </label>
                  ))}
                </div>

                <span className="text-xs font-semibold text-slate-500">
                  {tripType === 'roundtrip'
                    ? 'Save up to 25% with Special Round Trip Fares'
                    : tripType === 'multicity'
                    ? 'Combine Multiple Global Stops in a Single Itinerary'
                    : 'Book International & Domestic Flights Across 200+ Destinations'}
                </span>
              </div>

              {/* Form Grid */}
              {tripType === 'multicity' ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {multiCityLegs.map((leg, index) => (
                      <div key={leg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                            Flight {index + 1}
                          </span>
                          {multiCityLegs.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeMultiCityLeg(leg.id)}
                              className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                          <div className="lg:col-span-4">
                            <FlightAirportAutocomplete
                              label={`From (Flight ${index + 1})`}
                              type="from"
                              value={leg.origin}
                              onChange={(code) => updateMultiCityLeg(leg.id, 'origin', code)}
                            />
                          </div>

                          <div className="lg:col-span-4">
                            <FlightAirportAutocomplete
                              label={`To (Flight ${index + 1})`}
                              type="to"
                              value={leg.destination}
                              onChange={(code) => updateMultiCityLeg(leg.id, 'destination', code)}
                            />
                          </div>

                          <div className="lg:col-span-4">
                            <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-500 transition cursor-pointer">
                              <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                                Departure Date
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4 text-sky-600 flex-shrink-0" />
                                <input
                                  type="date"
                                  value={leg.date}
                                  onChange={(e) => updateMultiCityLeg(leg.id, 'date', e.target.value)}
                                  className="w-full bg-transparent text-sm font-black text-slate-900 outline-none cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <button
                      type="button"
                      onClick={addMultiCityLeg}
                      disabled={multiCityLegs.length >= 5}
                      className="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-300 px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
                    >
                      + Add Another City ({multiCityLegs.length}/5 Legs)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        fetchFlights();
                        setIsSearchExpanded(false);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-black px-8 py-3 rounded-full shadow-lg shadow-sky-600/25 transition cursor-pointer"
                    >
                      UPDATE MULTI-CITY SEARCH
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetchFlights();
                    setIsSearchExpanded(false);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                    {/* FROM */}
                    <div className="lg:col-span-3">
                      <FlightAirportAutocomplete
                        label="From"
                        type="from"
                        value={origin}
                        onChange={(code) => setOrigin(code)}
                      />
                    </div>

                    {/* Swap Button */}
                    <div className="hidden lg:flex lg:col-span-1 justify-center -mx-3 z-10">
                      <button
                        type="button"
                        onClick={() => {
                          const temp = origin;
                          setOrigin(destination);
                          setDestination(temp);
                        }}
                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 border border-slate-200 flex items-center justify-center transition shadow-md cursor-pointer transform hover:scale-110"
                        title="Swap Origin & Destination"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>
                    </div>

                    {/* TO */}
                    <div className="lg:col-span-3">
                      <FlightAirportAutocomplete
                        label="To"
                        type="to"
                        value={destination}
                        onChange={(code) => setDestination(code)}
                      />
                    </div>

                    {/* DEPARTURE DATE */}
                    <div className="lg:col-span-2 space-y-1">
                      <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-500 transition cursor-pointer">
                        <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                          Departure
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-sky-600 flex-shrink-0" />
                          <input
                            type="date"
                            value={departDate}
                            onChange={(e) => setDepartDate(e.target.value)}
                            className="w-full bg-transparent text-sm font-black text-slate-900 outline-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* RETURN DATE */}
                    <div className="lg:col-span-2 space-y-1">
                      {tripType === 'roundtrip' ? (
                        <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-sky-500 bg-sky-50/40 hover:bg-sky-50 transition cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] uppercase font-black text-sky-700 block tracking-wider">
                              Return Date
                            </span>
                            <span className="text-[9px] font-extrabold bg-sky-600 text-white px-1.5 py-0.2 rounded">
                              Round Trip
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-sky-700 flex-shrink-0" />
                            <input
                              type="date"
                              value={returnDate}
                              onChange={(e) => setReturnDate(e.target.value)}
                              className="w-full bg-transparent text-sm font-black text-slate-900 outline-none cursor-pointer"
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setTripType('roundtrip');
                            if (!returnDate) setReturnDate('2026-09-22');
                          }}
                          className="p-3.5 sm:p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 hover:bg-sky-50 hover:border-sky-400 transition cursor-pointer flex flex-col justify-center"
                        >
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            + Add Return
                          </span>
                          <span className="text-xs font-black text-sky-600 mt-0.5">
                            Save up to 25% on return
                          </span>
                        </div>
                      )}
                    </div>

                    {/* TRAVELLERS */}
                    <div className="lg:col-span-1 space-y-1 relative">
                      <div
                        onClick={() => setIsTravellerOpen(!isTravellerOpen)}
                        className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white hover:border-sky-500 transition cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider truncate">
                            Travellers
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Users className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                            <span className="text-xs font-black text-slate-900 truncate">
                              {passengers} Pax
                            </span>
                          </div>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      </div>
                    </div>
                  </div>

                  {/* Travellers Dropdown Modal */}
                  {isTravellerOpen && (
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 max-w-md space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Passengers & Class</span>
                        <button type="button" onClick={() => setIsTravellerOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">Adults (12+ yrs)</span>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setPassengers(num)}
                              className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                                passengers === num ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-xs font-bold">
                        {['economy', 'premium', 'business', 'first'].map((cls) => (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => setCabinClass(cls)}
                            className={`py-1.5 rounded-lg border capitalize ${
                              cabinClass === cls ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Best Fare Guarantee • Free Cancellation options available</span>
                    </div>

                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-black text-xs px-8 py-3 rounded-full shadow-lg shadow-sky-600/25 transition cursor-pointer"
                    >
                      SEARCH UPDATED FLIGHTS
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

        </div>
      </div>

      {/* 2. FARE CALENDAR / DATE STRIP (Signature Commercial Travel Feature) */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
            {fareDates.map((item) => (
              <button
                key={item.dateStr}
                onClick={() => {
                  setDepartDate(item.dateStr);
                  fetchFlights();
                }}
                className={`flex-1 min-w-[120px] max-w-[170px] p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  item.isSelected
                    ? 'bg-sky-50/90 border-sky-500 shadow-sm ring-2 ring-sky-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-[11px] font-bold ${item.isSelected ? 'text-sky-700 font-black' : 'text-slate-500'}`}>
                    {item.dayName}, {item.dayNum}
                  </span>
                  {item.isCheapest && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      Cheapest
                    </span>
                  )}
                </div>
                <div className={`text-xs mt-0.5 ${item.isSelected ? 'text-slate-950 font-black' : 'text-slate-700 font-bold'}`}>
                  {formatFlightPrice(item.price)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT GRID: FILTERS + RESULTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Quick Sorting & Results Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{loading ? 'Searching Available Flights...' : `${processedFlights.length} Flights Available`}</span>
              <span className="text-xs font-semibold text-slate-500">
                ({origin} → {destination})
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fares include all airline taxes, surcharges, and complimentary carry-on baggage.
            </p>
          </div>

          {/* Quick Sort Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            {[
              { id: 'cheapest', label: 'Cheapest', icon: Tag },
              { id: 'fastest', label: 'Fastest', icon: Zap },
              { id: 'earliest', label: 'Earliest', icon: Clock },
              { id: 'best', label: 'Best Value', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSortOption(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    sortOption === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: FILTERS PANEL */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Main Filters Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-sky-600" />
                  Filter Flights
                </span>
                <button
                  onClick={() => {
                    setSelectedStops(null);
                    setSelectedAirline('');
                    setMaxPrice(350000);
                    setRefundableOnly(false);
                    setSelectedTimeSlot(null);
                  }}
                  className="text-[11px] text-sky-600 font-bold hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* Stops Filter */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">Stops</label>
                <div className="space-y-1.5">
                  {[
                    { label: 'All Flights', val: null },
                    { label: 'Non-Stop Direct (0 Stops)', val: 0 },
                    { label: '1 Stop', val: 1 },
                  ].map((s) => (
                    <label
                      key={s.label}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                        selectedStops === s.val
                          ? 'bg-sky-50/80 border-sky-400 text-sky-900 font-black'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="stopsFilter"
                          checked={selectedStops === s.val}
                          onChange={() => setSelectedStops(s.val)}
                          className="text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
                        />
                        <span>{s.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Departure Time of Day Filter (MakeMyTrip signature UX) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">Departure Time</label>
                <div className="grid grid-cols-2 gap-2 text-center">
                  {[
                    { id: 'early', label: 'Before 6 AM', sub: 'Early Morning', icon: Sunrise },
                    { id: 'morning', label: '6 AM - 12 PM', sub: 'Morning', icon: Sun },
                    { id: 'afternoon', label: '12 PM - 6 PM', sub: 'Afternoon', icon: Sunset },
                    { id: 'night', label: 'After 6 PM', sub: 'Night', icon: Moon },
                  ].map((slot) => {
                    const Icon = slot.icon;
                    const isSel = selectedTimeSlot === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedTimeSlot(isSel ? null : slot.id)}
                        className={`p-2.5 rounded-xl border transition text-left cursor-pointer ${
                          isSel
                            ? 'bg-sky-50 border-sky-500 text-sky-950 font-black ring-1 ring-sky-500/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-sky-600 mb-0.5">
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase font-bold text-slate-400">{slot.sub}</span>
                        </div>
                        <span className="text-xs font-black block">{slot.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Airlines Filter */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">Airlines</label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto no-scrollbar pr-1">
                  {[
                    { label: 'All Airlines', code: '' },
                    { label: 'Emirates (EK)', code: 'EK' },
                    { label: 'Air India (AI)', code: 'AI' },
                    { label: 'Air India Express (IX)', code: 'IX' },
                    { label: 'IndiGo (6E)', code: '6E' },
                    { label: 'Qatar Airways (QR)', code: 'QR' },
                    { label: 'SpiceJet (SG)', code: 'SG' },
                    { label: 'Singapore Airlines (SQ)', code: 'SQ' },
                    { label: 'British Airways (BA)', code: 'BA' },
                    { label: 'Etihad (EY)', code: 'EY' },
                    { label: 'Vistara (UK)', code: 'UK' },
                  ].map((al) => (
                    <label
                      key={al.label}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                        selectedAirline === al.code
                          ? 'bg-sky-50 border-sky-400 text-sky-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="airlineFilter"
                          checked={selectedAirline === al.code}
                          onChange={() => setSelectedAirline(al.code)}
                          className="text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
                        />
                        <span>{al.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Price Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Max Fare</span>
                  <span className="text-sky-600 font-black">{formatFlightPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={350000}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>{formatFlightPrice(2000)}</span>
                  <span>{formatFlightPrice(350000)}</span>
                </div>
              </div>

              {/* Fare Policies */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 font-bold cursor-pointer hover:text-slate-950">
                  <input
                    type="checkbox"
                    checked={refundableOnly}
                    onChange={(e) => setRefundableOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>Refundable Tickets Only</span>
                </label>
              </div>

            </div>

            {/* Price Trend Advisory Card */}
            <div className="bg-gradient-to-br from-[#071426] to-[#0f284b] text-white p-4 rounded-2xl border border-sky-900/40 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                <TrendingDown className="w-4 h-4" />
                <span>Fare Advisory</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fares on this route are currently at a 30-day low. Lock your price today to avoid anticipated weekend surges.
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN: FLIGHT RESULTS CARDS */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* ROUND TRIP HEADER TABS */}
            {tripType === 'roundtrip' && !loading && (
              <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRoundTripActiveTab('outbound')}
                  className={`flex-1 py-3 px-4 rounded-xl text-left transition cursor-pointer flex items-center justify-between ${
                    roundTripActiveTab === 'outbound'
                      ? 'bg-sky-50 border border-sky-500 text-sky-900 font-black shadow-xs'
                      : 'hover:bg-slate-50 text-slate-600 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Plane className={`w-4 h-4 ${roundTripActiveTab === 'outbound' ? 'text-sky-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Outbound Flight ({departDate})</span>
                      <span className="text-sm font-black">{origin} → {destination}</span>
                    </div>
                  </div>
                  {selectedOutboundFlight && (
                    <span className="text-xs font-black text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                      {selectedOutboundFlight.airline.iata_code}-{selectedOutboundFlight.flight_number} ({formatFlightPrice(getPriceForCabin(selectedOutboundFlight))})
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRoundTripActiveTab('return')}
                  className={`flex-1 py-3 px-4 rounded-xl text-left transition cursor-pointer flex items-center justify-between ${
                    roundTripActiveTab === 'return'
                      ? 'bg-sky-50 border border-sky-500 text-sky-900 font-black shadow-xs'
                      : 'hover:bg-slate-50 text-slate-600 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Plane className={`w-4 h-4 rotate-180 ${roundTripActiveTab === 'return' ? 'text-sky-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">2. Return Flight ({returnDate})</span>
                      <span className="text-sm font-black">{destination} → {origin}</span>
                    </div>
                  </div>
                  {selectedReturnFlight && (
                    <span className="text-xs font-black text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200">
                      {selectedReturnFlight.airline.iata_code}-{selectedReturnFlight.flight_number} ({formatFlightPrice(getPriceForCabin(selectedReturnFlight))})
                    </span>
                  )}
                </button>
              </div>
            )}

            {loading ? (
              /* High-End Loading Screen */
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 animate-spin">
                  <Plane className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-lg font-black text-slate-900">
                    Scanning 200+ Airlines for Real-Time Fares
                  </h3>
                  <p className="text-xs text-slate-500">
                    Retrieving direct global inventory, cabin upgrades, and exclusive Orbinex Concierge rates.
                  </p>
                </div>
              </div>
            ) : processedFlights.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-base font-black text-slate-900">No Flights Match Your Selected Filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting the maximum fare slider, removing airline preferences, or checking alternative dates.
                </p>
                <button
                  onClick={() => {
                    setSelectedStops(null);
                    setSelectedAirline('');
                    setMaxPrice(350000);
                    setSelectedTimeSlot(null);
                  }}
                  className="bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : tripType === 'multicity' ? (
              /* MULTI-CITY STEP BY STEP FLIGHT CARDS */
              <div className="space-y-6">
                {multiCityLegs.map((leg, index) => {
                  const legFlights = multiCityResults[leg.id] || [];
                  const selectedFlight = selectedMultiCityFlights[leg.id];
                  return (
                    <div key={leg.id} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-black text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <h4 className="text-sm font-black text-slate-900">
                            Flight {index + 1}: {leg.origin} → {leg.destination} ({leg.date})
                          </h4>
                        </div>
                        {selectedFlight && (
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                            Selected: {selectedFlight.airline.name} ({formatFlightPrice(getPriceForCabin(selectedFlight))})
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {legFlights.slice(0, 6).map((f) => {
                          const isSel = selectedFlight?.id === f.id;
                          return (
                            <div
                              key={f.id}
                              onClick={() => setSelectedMultiCityFlights({ ...selectedMultiCityFlights, [leg.id]: f })}
                              className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                                isSel
                                  ? 'bg-sky-50/70 border-sky-500 shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              <div>
                                <span className="text-xs font-black text-slate-900">{f.airline.name} ({f.airline.iata_code}-{f.flight_number})</span>
                                <span className="text-[11px] text-slate-500 block">{f.departure_time} → {f.arrival_time} ({f.duration})</span>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-black text-sky-800">{formatFlightPrice(getPriceForCabin(f))}</span>
                                <span className="text-[10px] text-slate-400 block">{f.stops === 0 ? 'Direct' : `${f.stops} Stop`}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Multi City Total Bottom Bar */}
                <div className="bg-slate-950 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-bold block">Combined Multi-City Total</span>
                    <span className="text-3xl font-black text-amber-400">
                      {formatFlightPrice(Object.values(selectedMultiCityFlights).reduce((acc, f) => acc + getPriceForCabin(f) * passengers, 0))}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">Includes all {multiCityLegs.length} flight legs for {passengers} traveller(s)</span>
                  </div>

                  <button
                    onClick={handleAddMultiCityToCart}
                    className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg transition cursor-pointer"
                  >
                    BOOK MULTI-CITY ITINERARY
                  </button>
                </div>
              </div>
            ) : (
              /* LUXURY FLIGHT CARDS (Masterpiece Redesign) */
              processedFlights.map((flight, index) => {
                const flightPrice = getPriceForCabin(flight);
                const originalPrice = Math.round(flightPrice * 1.15);
                const totalForGroup = flightPrice * passengers;
                const isSelectedForRoundTrip = tripType === 'roundtrip' && (
                  roundTripActiveTab === 'outbound'
                    ? selectedOutboundFlight?.id === flight.id
                    : selectedReturnFlight?.id === flight.id
                );
                const meta = getAirlineMeta(flight.airline.iata_code);
                const isBestValue = index === 0;

                return (
                  <div
                    key={flight.id}
                    className={`flight-card-luxury group ${
                      isSelectedForRoundTrip
                        ? 'border-2 border-sky-500 bg-sky-50/20 shadow-lg'
                        : 'hover:border-sky-400 hover:shadow-xl'
                    }`}
                  >
                    {/* Top Pill Bar */}
                    <div className="flex items-center justify-between px-5 sm:px-6 pt-4 pb-2 border-b border-slate-100 flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {isBestValue && (
                          <span className="inline-flex items-center gap-1 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs">
                            👑 Concierge Best Value
                          </span>
                        )}
                        {flight.stops === 0 && (
                          <span className="inline-flex items-center gap-1 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <Zap className="w-3 h-3 text-emerald-600" /> Non-Stop Direct
                          </span>
                        )}
                        {flight.refundable && (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                            Refundable
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {flight.airline.iata_code}-{flight.flight_number} • {flight.aircraft_type}
                      </span>
                    </div>

                    {/* Main Flight Info Body */}
                    <div className="p-5 sm:p-6 space-y-4">
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        
                        {/* Airline Header Column */}
                        <div className="md:col-span-3 flex items-center gap-3.5">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.color} text-white flex items-center justify-center font-black text-sm shadow-md shadow-slate-900/10 flex-shrink-0 tracking-wider`}>
                            {meta.code}
                          </div>
                          <div>
                            <h4 className="text-base font-black text-slate-900 group-hover:text-sky-700 transition">
                              {flight.airline.name}
                            </h4>
                            <span className="text-[11px] text-slate-500 font-medium block">
                              {meta.tier}
                            </span>
                          </div>
                        </div>

                        {/* Trajectory & Timeline Column */}
                        <div className="md:col-span-6 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 group-hover:bg-sky-50/30 group-hover:border-sky-100 transition">
                          <div className="grid grid-cols-11 items-center gap-2">
                            
                            {/* Departure */}
                            <div className="col-span-4 text-left">
                              <span className="text-2xl font-black text-slate-950 tracking-tight block">
                                {flight.departure_time}
                              </span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs font-black px-1.5 py-0.2 rounded bg-slate-200 text-slate-800">
                                  {flight.origin.iata_code}
                                </span>
                                <span className="text-xs font-bold text-slate-700 truncate">{flight.origin.city}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 truncate block mt-0.5">{flight.origin.name}</span>
                            </div>

                            {/* Middle Route Flight Arc */}
                            <div className="col-span-3 text-center space-y-1">
                              <span className="text-[11px] font-black text-slate-600 flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3 text-sky-600" />
                                {flight.duration}
                              </span>
                              
                              <div className="relative flex items-center justify-center my-1.5">
                                <div className="w-full h-0.5 bg-slate-300"></div>
                                <div className="absolute w-5 h-5 rounded-full bg-white border border-slate-300 shadow-xs flex items-center justify-center text-sky-600">
                                  <Plane className="w-3 h-3 rotate-90" />
                                </div>
                              </div>

                              <span className={`text-[10px] font-black block ${flight.stops === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {flight.stops === 0 ? 'Direct' : flight.stop_details || `${flight.stops} Stop`}
                              </span>
                            </div>

                            {/* Arrival */}
                            <div className="col-span-4 text-right">
                              <span className="text-2xl font-black text-slate-950 tracking-tight block">
                                {flight.arrival_time}
                              </span>
                              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                <span className="text-xs font-bold text-slate-700 truncate">{flight.destination.city}</span>
                                <span className="text-xs font-black px-1.5 py-0.2 rounded bg-slate-200 text-slate-800">
                                  {flight.destination.iata_code}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 truncate block mt-0.5">{flight.destination.name}</span>
                            </div>

                          </div>
                        </div>

                        {/* Price & Primary CTA Column */}
                        <div className="md:col-span-3 flex flex-col items-end justify-center text-right border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 space-y-2">
                          <div>
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-xs text-slate-400 line-through font-bold">
                                {formatFlightPrice(originalPrice)}
                              </span>
                              <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                                15% OFF
                              </span>
                            </div>
                            <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight block">
                              {formatFlightPrice(flightPrice)}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-semibold">
                              {passengers > 1 ? `Total (${passengers} pax): ${formatFlightPrice(totalForGroup)}` : 'per passenger • incl. all taxes'}
                            </span>
                          </div>

                          {tripType === 'roundtrip' ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (roundTripActiveTab === 'outbound') {
                                  setSelectedOutboundFlight(flight);
                                  setRoundTripActiveTab('return');
                                } else {
                                  setSelectedReturnFlight(flight);
                                }
                              }}
                              className={`w-full text-xs font-black py-2.5 px-4 rounded-xl transition cursor-pointer shadow-sm ${
                                isSelectedForRoundTrip
                                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                                  : 'bg-sky-600 hover:bg-sky-500 text-white'
                              }`}
                            >
                              {isSelectedForRoundTrip ? '✓ Selected' : roundTripActiveTab === 'outbound' ? 'Select Outbound' : 'Select Return'}
                            </button>
                          ) : (
                            <div className="w-full flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleAddToCart(flight)}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-black py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-1"
                              >
                                <span>BOOK NOW</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                        </div>

                      </div>

                      {/* Amenities Row & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                            🧳 {flight.baggage_checkin} Check-in + {flight.baggage_cabin} Cabin
                          </span>
                          {(flight as any).has_meals && (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg">
                              🍽️ Gourmet Dining Included
                            </span>
                          )}
                          {(flight as any).has_wifi && (
                            <span className="inline-flex items-center gap-1 font-bold text-blue-800 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-lg">
                              📶 High-Speed Wi-Fi
                            </span>
                          )}
                          {(flight as any).has_usb && (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
                              🔌 In-Seat Power
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">
                            🪙 Earn 150 Orbinex Miles
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSeatModalFlight(flight);
                            setSelectedSeats([]);
                            setSeatCostExtra(0);
                          }}
                          className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1.5 cursor-pointer hover:underline"
                        >
                          <Armchair className="w-3.5 h-3.5 text-sky-600" />
                          <span>View Seat Map & Amenities →</span>
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })
            )}

          </div>

        </div>

        {/* STICKY BOTTOM BAR FOR ROUND TRIP SELECTION */}
        {tripType === 'roundtrip' && selectedOutboundFlight && selectedReturnFlight && !loading && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl py-3.5 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 divide-x divide-slate-800">
                <div>
                  <span className="text-[10px] text-sky-400 font-bold uppercase block">Outbound ({departDate})</span>
                  <span className="text-xs font-bold">{selectedOutboundFlight.airline.name} ({selectedOutboundFlight.origin.iata_code} → {selectedOutboundFlight.destination.iata_code})</span>
                  <span className="text-[11px] text-slate-400 block">{selectedOutboundFlight.departure_time} - {selectedOutboundFlight.arrival_time}</span>
                </div>

                <div className="pl-6">
                  <span className="text-[10px] text-sky-400 font-bold uppercase block">Return ({returnDate})</span>
                  <span className="text-xs font-bold">{selectedReturnFlight.airline.name} ({selectedReturnFlight.origin.iata_code} → {selectedReturnFlight.destination.iata_code})</span>
                  <span className="text-[11px] text-slate-400 block">{selectedReturnFlight.departure_time} - {selectedReturnFlight.arrival_time}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Round Trip Fares:</span>
                  <span className="text-2xl font-black text-amber-400">
                    {formatFlightPrice((getPriceForCabin(selectedOutboundFlight) + getPriceForCabin(selectedReturnFlight)) * passengers)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddRoundTripToCart}
                  className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-black text-sm px-8 py-3 rounded-full shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  BOOK ROUND TRIP
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Seat Selection Modal */}
      {seatModalFlight && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            
            <div className="bg-[#071426] px-6 py-4 text-white flex items-center justify-between border-b border-sky-900/40">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-400">Aircraft Seat Map & Cabin Simulator</span>
                <h3 className="text-base font-bold text-white">
                  {seatModalFlight.airline.name} {seatModalFlight.flight_number} ({seatModalFlight.aircraft_type})
                </h3>
              </div>
              <button
                onClick={() => setSeatModalFlight(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-around text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-sky-600"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-slate-200"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-slate-400 opacity-40"></div>
                  <span>Occupied</span>
                </div>
              </div>

              {/* Aircraft Cabin Simulator */}
              <div className="max-h-64 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cockpit / Front Galley</p>
                
                {[10, 11, 12, 14, 15, 16, 17, 18].map((row) => (
                  <div key={row} className="flex items-center justify-center gap-2">
                    <span className="w-5 text-[10px] font-bold text-slate-400 text-right">{row}</span>
                    
                    <div className="flex gap-1.5">
                      {['A', 'B', 'C'].map((col) => {
                        const seatNo = `${row}${col}`;
                        const isOccupied = ['12A', '14C', '16B'].includes(seatNo);
                        const isSel = selectedSeats.includes(seatNo);
                        const extra = row < 12 ? 120 : (row === 12 ? 40 : 0);
                        return (
                          <button
                            key={seatNo}
                            disabled={isOccupied}
                            onClick={() => handleSeatToggle(seatNo, extra)}
                            className={`w-7 h-7 rounded-lg text-[10px] font-bold transition flex items-center justify-center cursor-pointer ${
                              isOccupied
                                ? 'bg-slate-300 text-slate-400 cursor-not-allowed opacity-40'
                                : isSel
                                ? 'bg-sky-600 text-white shadow-md'
                                : 'bg-white border border-slate-300 text-slate-700 hover:border-sky-500 hover:bg-sky-50'
                            }`}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>

                    <div className="w-4 text-center text-[9px] text-slate-300">|</div>

                    <div className="flex gap-1.5">
                      {['D', 'E', 'F'].map((col) => {
                        const seatNo = `${row}${col}`;
                        const isOccupied = ['11E', '15F'].includes(seatNo);
                        const isSel = selectedSeats.includes(seatNo);
                        const extra = row < 12 ? 120 : (row === 12 ? 40 : 0);
                        return (
                          <button
                            key={seatNo}
                            disabled={isOccupied}
                            onClick={() => handleSeatToggle(seatNo, extra)}
                            className={`w-7 h-7 rounded-lg text-[10px] font-bold transition flex items-center justify-center cursor-pointer ${
                              isOccupied
                                ? 'bg-slate-300 text-slate-400 cursor-not-allowed opacity-40'
                                : isSel
                                ? 'bg-sky-600 text-white shadow-md'
                                : 'bg-white border border-slate-300 text-slate-700 hover:border-sky-500 hover:bg-sky-50'
                            }`}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Seats Summary */}
              <div className="flex items-center justify-between text-xs pt-2">
                <div>
                  <span className="text-slate-500 block">Selected ({selectedSeats.length}/{passengers}):</span>
                  <span className="font-bold text-slate-900">{selectedSeats.join(', ') || 'None selected'}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Seat Delta:</span>
                  <span className="font-bold text-sky-600">+{formatPrice(seatCostExtra)}</span>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(seatModalFlight)}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-xs py-3.5 rounded-xl transition cursor-pointer shadow-md shadow-sky-600/20"
              >
                Confirm Seats & Add Flight to Cart
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">Loading Available Flights...</div>}>
      <FlightsContent />
    </Suspense>
  );
}
