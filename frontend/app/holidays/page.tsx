'use client';

import React, { useState, useEffect } from 'react';
import {
  Palmtree,
  Star,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  Users,
  Compass
} from 'lucide-react';
import { api } from '@/lib/api';
import { HolidayPackage } from '@/lib/types';
import { useCart } from '@/context/CartContext';

export default function HolidaysPage() {
  const { formatPrice, addItem } = useCart();
  const [packages, setPackages] = useState<HolidayPackage[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPkg, setSelectedPkg] = useState<HolidayPackage | null>(null);
  const [travelersCount, setTravelersCount] = useState(2);
  const [departureDate, setDepartureDate] = useState('2026-09-20');

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await api.getHolidayPackages();
      setPackages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleBook = (pkg: HolidayPackage) => {
    const total = Number(pkg.price_per_person) * travelersCount;
    addItem({
      booking_type: 'holiday',
      title: `Tour: ${pkg.title}`,
      subtitle: `${pkg.duration_days} Days / ${pkg.duration_nights} Nights • ${travelersCount} Traveler(s) • ${pkg.destination.name}`,
      amount: total,
      image: pkg.main_image,
      travel_date: departureDate,
      details: {
        package_title: pkg.title,
        destination: pkg.destination.name,
        duration: `${pkg.duration_days}D/${pkg.duration_nights}N`,
        travelers_count: travelersCount,
      },
    });
    setSelectedPkg(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Palmtree className="w-3.5 h-3.5" />
              All-Inclusive Luxury Tour Packages
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Curated Holiday Packages & Guided Tours
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore unforgettable journeys with premium 4 & 5-star hotels, private chauffeurs, English guides, and daily breakfast.
            </p>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            [1, 2].map((n) => (
              <div key={n} className="h-80 bg-white rounded-3xl animate-pulse border border-slate-200"></div>
            ))
          ) : (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={pkg.main_image}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {pkg.duration_days} Days / {pkg.duration_nights} Nights
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-1 text-xs text-rose-600 font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{pkg.destination.name}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900">{pkg.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{pkg.overview}</p>

                    {/* Inclusions */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Package Inclusions</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {pkg.inclusions?.slice(0, 4).map((inc, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 line-through block">{formatPrice(pkg.original_price)}</span>
                    <span className="text-2xl font-black text-slate-900">{formatPrice(pkg.price_per_person)}</span>
                    <span className="text-[10px] text-slate-400 block">per person</span>
                  </div>

                  <button
                    onClick={() => setSelectedPkg(pkg)}
                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
                  >
                    View Itinerary & Book
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

      {/* Itinerary Detail & Booking Modal */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-400">Day-by-Day Itinerary</span>
                <h3 className="text-base font-bold">{selectedPkg.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPkg(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Day-Wise Tour Timeline</h4>
                {selectedPkg.itinerary_days?.map((day) => (
                  <div key={day.day_number} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-700">Day {day.day_number}: {day.title}</span>
                      <span className="text-[10px] font-semibold text-slate-400">Meals: {day.meals_today}</span>
                    </div>
                    <p className="text-xs text-slate-600">{day.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {day.activities?.map((act, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                          • {act}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Booking Controls */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Travel Date</label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl font-bold text-slate-900 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Travelers</label>
                  <select
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-xl font-bold text-slate-900 bg-slate-50"
                  >
                    <option value={1}>1 Traveler</option>
                    <option value={2}>2 Travelers (Twin Sharing)</option>
                    <option value={4}>4 Travelers (Family Group)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs block">Total Price:</span>
                  <span className="text-xl font-black text-rose-700">
                    {formatPrice(Number(selectedPkg.price_per_person) * travelersCount)}
                  </span>
                </div>

                <button
                  onClick={() => handleBook(selectedPkg)}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
                >
                  Confirm & Add to Cart
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
