'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Building2,
  Star,
  MapPin,
  Wifi,
  Waves,
  Sparkles,
  Utensils,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  Search,
  X,
  Calendar,
  Users,
  Compass,
  BedDouble,
  Coffee
} from 'lucide-react';
import { api } from '@/lib/api';
import { Hotel, HotelRoom } from '@/lib/types';
import { useCart } from '@/context/CartContext';

function HotelsContent() {
  const searchParams = useSearchParams();
  const { formatPrice, addItem } = useCart();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState(searchParams.get('city') || 'Dubai');
  const [starRating, setStarRating] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [freeCancel, setFreeCancel] = useState(false);
  const [breakfastOnly, setBreakfastOnly] = useState(false);
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState<Hotel | null>(null);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await api.searchHotels({
        city: city || undefined,
        star_rating: starRating || undefined,
        max_price: maxPrice,
        free_cancellation: freeCancel || undefined,
        breakfast_included: breakfastOnly || undefined,
      });
      setHotels(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [city, starRating, maxPrice, freeCancel, breakfastOnly]);

  const handleBookHotel = (hotel: Hotel, roomIndex: number = 0) => {
    const room = hotel.rooms?.[roomIndex] || {
      room_name: 'Deluxe King Room',
      price_per_night: hotel.price_per_night_start,
    };
    const nights = 3;
    const totalAmount = Number(room.price_per_night) * nights;

    addItem({
      booking_type: 'hotel',
      title: `Hotel Stay: ${hotel.name} (${room.room_name})`,
      subtitle: `${nights} Night(s) in ${hotel.city}, ${hotel.country} • Free Breakfast • ${hotel.star_rating}★`,
      amount: totalAmount,
      image: hotel.main_image,
      travel_date: '2026-09-15',
      return_date: '2026-09-18',
      details: {
        hotel_name: hotel.name,
        city: hotel.city,
        country: hotel.country,
        address: hotel.address,
        room_name: room.room_name,
        nights: nights,
        star_rating: hotel.star_rating,
      },
    });

    setSelectedHotelForRooms(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Luxury Hero Search Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
          
          <div className="relative z-10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  <Building2 className="w-3.5 h-3.5" />
                  Orbinex Luxury Stays & 5-Star Resorts
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
                  World-Class Hotels, Suites & Private Villas
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-200/80 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs border border-white/10 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Best Rate & VIP Concierge Guarantee
                </span>
              </div>
            </div>

            {/* Interactive Search Bar */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 text-slate-900 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                
                {/* Destination Input */}
                <div className="md:col-span-6 relative p-3 rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 transition">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Destination City or Hotel Name
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Pune, Mumbai, Dubai, Paris, Singapore, London, Goa"
                      className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none placeholder:text-slate-400"
                    />
                    {city && (
                      <button
                        type="button"
                        onClick={() => setCity('')}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Dates Selector */}
                <div className="md:col-span-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Stay Duration
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">3 Nights (Flexible Dates)</span>
                  </div>
                </div>

                {/* Guests */}
                <div className="md:col-span-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Guests & Rooms
                  </label>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-800">2 Adults, 1 Luxury Suite</span>
                  </div>
                </div>

              </div>

              {/* Quick Destination Chips */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-slate-700">Popular Destinations:</span>
                  {['Pune', 'Mumbai', 'Dubai', 'Goa', 'Paris', 'Singapore', 'London', 'Jaipur'].map((popCity) => (
                    <button
                      key={popCity}
                      type="button"
                      onClick={() => setCity(popCity)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                        city.toLowerCase() === popCity.toLowerCase()
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      {popCity}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={fetchHotels}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Refresh Search</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-600" />
                Hotel Filters
              </h3>
              <button
                onClick={() => {
                  setStarRating(null);
                  setMaxPrice(2000);
                  setFreeCancel(false);
                  setBreakfastOnly(false);
                }}
                className="text-[11px] text-amber-600 font-semibold hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Star Category</label>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="stars"
                    checked={starRating === null}
                    onChange={() => setStarRating(null)}
                    className="text-amber-600"
                  />
                  <span>All Star Ratings</span>
                </label>
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="stars"
                    checked={starRating === 5}
                    onChange={() => setStarRating(5)}
                    className="text-amber-600"
                  />
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    ★★★★★ 5-Star Luxury Stays
                  </span>
                </label>
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="radio"
                    name="stars"
                    checked={starRating === 4}
                    onChange={() => setStarRating(4)}
                    className="text-amber-600"
                  />
                  <span>4-Star & Above</span>
                </label>
              </div>
            </div>

            {/* Max Nightly Rate */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Max Nightly Rate</span>
                <span className="text-amber-600">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            {/* Privileges */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Hotel Privileges</label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freeCancel}
                    onChange={(e) => setFreeCancel(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Free Cancellation</span>
                </label>
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={breakfastOnly}
                    onChange={(e) => setBreakfastOnly(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Complimentary Gourmet Breakfast</span>
                </label>
              </div>
            </div>

          </div>

          {/* Results List */}
          <div className="lg:col-span-9 space-y-4">
            
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-bold text-slate-800">
                {loading ? 'Searching luxury properties...' : `${hotels.length} luxury properties available for "${city || 'Global'}"`}
              </span>
              <span>Sorted by Guest Rating</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-64 bg-white rounded-3xl animate-pulse border border-slate-200"></div>
                ))}
              </div>
            ) : hotels.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No hotels found matching "{city}"</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try searching for <strong>Pune</strong>, <strong>Mumbai</strong>, <strong>Delhi</strong>, <strong>Dubai</strong>, <strong>Paris</strong>, or <strong>Singapore</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setCity('Pune')}
                  className="bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer"
                >
                  View Pune Luxury Stays
                </button>
              </div>
            ) : (
              hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-amber-200 transition grid grid-cols-1 md:grid-cols-12"
                >
                  {/* Hotel Image */}
                  <div className="md:col-span-4 relative h-56 md:h-full min-h-[220px]">
                    <img
                      src={hotel.main_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{hotel.guest_rating} ({hotel.reviews_count} reviews)</span>
                    </div>

                    {hotel.featured && (
                      <div className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                        Orbinex Elite Choice
                      </div>
                    )}
                  </div>

                  {/* Hotel Details */}
                  <div className="md:col-span-8 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500 text-xs">
                            {Array.from({ length: hotel.star_rating }).map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1.5">
                              5-Star Luxury
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 mt-0.5">{hotel.name}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{hotel.address}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {hotel.description}
                      </p>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {hotel.free_cancellation && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            ✓ Free Cancellation
                          </span>
                        )}
                        {hotel.breakfast_included && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            ☕ Breakfast Included
                          </span>
                        )}
                        {hotel.amenities?.slice(0, 3).map((am) => (
                          <span key={am.id} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {am.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Booking CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting Nightly Rate</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-900">{formatPrice(hotel.price_per_night_start)}</span>
                          <span className="text-xs text-slate-400">/ night</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedHotelForRooms(hotel)}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer"
                        >
                          View Rooms ({hotel.rooms?.length || 3})
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBookHotel(hotel, 0)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1"
                        >
                          <span>Reserve Stay</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}

          </div>

        </div>

      </div>

      {/* Room Tiers Selector Modal */}
      {selectedHotelForRooms && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">Select Room Tier</span>
                <h3 className="text-base font-bold">{selectedHotelForRooms.name} ({selectedHotelForRooms.city})</h3>
              </div>
              <button
                onClick={() => setSelectedHotelForRooms(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {selectedHotelForRooms.rooms?.map((room, idx) => (
                <div
                  key={room.id || idx}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50/60 hover:bg-white transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-amber-600" />
                      {room.room_name}
                    </h4>
                    <p className="text-xs text-slate-500">{room.description || `${room.room_size_sqm || 45} sqm • ${room.bed_type || 'King Bed'} • Max ${room.max_guests || 2} Guests`}</p>
                    <div className="flex gap-2 text-[10px] text-emerald-600 font-semibold pt-1">
                      <span>✓ Free Wi-Fi 5G</span>
                      <span>✓ Complimentary Breakfast</span>
                      <span>✓ Free Cancellation</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 block">{formatPrice(room.price_per_night)}</span>
                      <span className="text-[10px] text-slate-400">per night</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookHotel(selectedHotelForRooms, idx)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition mt-2 cursor-pointer"
                    >
                      Select Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">Loading Luxury Hotels...</div>}>
      <HotelsContent />
    </Suspense>
  );
}
