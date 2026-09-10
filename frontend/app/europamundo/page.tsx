'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Users,
  Bus,
  ArrowRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { EuropamundoTour } from '@/lib/types';
import { useCart } from '@/context/CartContext';

export default function EuropamundoPage() {
  const { formatPrice, addItem } = useCart();
  const [tours, setTours] = useState<EuropamundoTour[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const data = await api.getEuropamundoTours();
      setTours(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleBook = (tour: EuropamundoTour) => {
    addItem({
      booking_type: 'europamundo',
      title: `Europamundo Circuit: ${tour.title}`,
      subtitle: `${tour.duration_days} Days / ${tour.duration_nights} Nights • Cities: ${tour.cities_visited} • ${tour.hotel_category}`,
      amount: Number(tour.price_usd),
      image: tour.main_image,
      travel_date: '2026-09-20',
      details: {
        tour_code: tour.tour_code,
        cities_visited: tour.cities_visited,
        hotel_category: tour.hotel_category,
        bus_type: tour.bus_type,
      },
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-slate-900 text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-violet-500/20 border border-violet-400/30 text-violet-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              Official Europamundo Partner Catalog
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Europamundo Guided European Coach Circuits
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore Europe with 100% guaranteed departures, panoramic Wi-Fi coach travel, 4-star city center hotels, and multilingual audio guides in English, Spanish, French, and Arabic.
            </p>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200"></div>
          ) : (
            tours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0"
              >
                <div className="lg:col-span-5 relative h-72 lg:h-auto overflow-hidden">
                  <img
                    src={tour.main_image}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-violet-900/90 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {tour.tour_code}
                  </div>
                </div>

                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-violet-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{tour.duration_days} Days / {tour.duration_nights} Nights</span>
                      <span>•</span>
                      <span>Guaranteed Departure</span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mt-1">{tour.title}</h3>
                    
                    <div className="mt-2 p-3 bg-violet-50/60 rounded-2xl border border-violet-100 text-xs">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Cities & Landmarks Visited:</span>
                      <span className="font-bold text-slate-800">{tour.cities_visited}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Coach:</span>
                        <span className="font-semibold text-slate-800">{tour.bus_type}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Accommodation:</span>
                        <span className="font-semibold text-slate-800">{tour.hotel_category}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tour.inclusions?.map((inc, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          ✓ {inc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Circuit Price</span>
                      <span className="text-2xl font-black text-slate-900">{formatPrice(tour.price_usd)}</span>
                    </div>

                    <button
                      onClick={() => handleBook(tour)}
                      className="bg-violet-700 hover:bg-violet-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Book European Circuit
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
