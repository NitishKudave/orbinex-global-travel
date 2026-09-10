'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  FileCheck2,
  Car,
  HeartHandshake
} from 'lucide-react';
import { api } from '@/lib/api';
import { UmrahPackage } from '@/lib/types';
import { useCart } from '@/context/CartContext';

export default function UmrahPage() {
  const { formatPrice, addItem } = useCart();
  const [packages, setPackages] = useState<UmrahPackage[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSharing, setSelectedSharing] = useState<'double' | 'triple' | 'quad'>('double');
  const [pilgrimsCount, setPilgrimsCount] = useState(2);
  const [departureDate, setDepartureDate] = useState('2026-10-10');

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await api.getUmrahPackages();
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

  const handleBookUmrah = (pkg: UmrahPackage) => {
    const unitPrice = selectedSharing === 'double' ? Number(pkg.price_double) : (selectedSharing === 'triple' ? Number(pkg.price_triple) : Number(pkg.price_quad));
    const total = unitPrice * pilgrimsCount;

    addItem({
      booking_type: 'umrah',
      title: `Umrah: ${pkg.title}`,
      subtitle: `${pkg.duration_days} Days (${pkg.makkah_nights}N Makkah + ${pkg.madinah_nights}N Madinah) • ${pilgrimsCount} Pilgrim(s) • ${selectedSharing.toUpperCase()} Sharing`,
      amount: total,
      image: pkg.main_image,
      travel_date: departureDate,
      details: {
        package_title: pkg.title,
        makkah_hotel: pkg.makkah_hotel.name,
        makkah_distance: pkg.makkah_hotel.distance_from_haram,
        madinah_hotel: pkg.madinah_hotel.name,
        madinah_distance: pkg.madinah_hotel.distance_from_haram,
        pilgrims_count: pilgrimsCount,
        room_sharing: selectedSharing,
      },
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0F2942] via-[#0B192C] to-[#071322] text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Complete Spiritual Care & Concierge
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              VIP 5-Star & Classic Umrah Pilgrimage Packages
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stay steps away from the Holy Kaaba and the Prophet’s Mosque. We arrange 5-star Haram facing suites, Saudi eVisas with insurance, luxury GMC Yukon private transfers, and scholar-guided Ziyarat.
            </p>
          </div>
        </div>

        {/* Room Sharing Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Room Sharing:</span>
            <div className="flex rounded-xl bg-slate-100 p-1">
              {[
                { id: 'double', label: 'Double Sharing' },
                { id: 'triple', label: 'Triple Sharing' },
                { id: 'quad', label: 'Quad Sharing (Best Value)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSharing(s.id as any)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    selectedSharing === s.id ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Pilgrims:</span>
            <select
              value={pilgrimsCount}
              onChange={(e) => setPilgrimsCount(Number(e.target.value))}
              className="bg-slate-100 px-3 py-1.5 rounded-xl font-bold text-xs text-slate-900 outline-none"
            >
              <option value={1}>1 Pilgrim</option>
              <option value={2}>2 Pilgrims</option>
              <option value={3}>3 Pilgrims</option>
              <option value={4}>4 Pilgrims</option>
            </select>
          </div>
        </div>

        {/* Umrah Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            [1, 2].map((n) => (
              <div key={n} className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200"></div>
            ))
          ) : (
            packages.map((pkg) => {
              const unitPrice = selectedSharing === 'double' ? Number(pkg.price_double) : (selectedSharing === 'triple' ? Number(pkg.price_triple) : Number(pkg.price_quad));
              const total = unitPrice * pilgrimsCount;

              return (
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
                      <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {pkg.duration_days} Days Pilgrimage
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-black text-slate-900">{pkg.title}</h3>
                      
                      {/* Hotels Distance Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
                          <span className="text-[10px] uppercase font-bold text-amber-800 block">🕋 Makkah Stay ({pkg.makkah_nights}N)</span>
                          <span className="font-bold text-slate-900">{pkg.makkah_hotel.name}</span>
                          <span className="text-[11px] text-amber-700 font-semibold block mt-0.5">{pkg.makkah_hotel.distance_from_haram}</span>
                        </div>

                        <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 block">🕌 Madinah Stay ({pkg.madinah_nights}N)</span>
                          <span className="font-bold text-slate-900">{pkg.madinah_hotel.name}</span>
                          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">{pkg.madinah_hotel.distance_from_haram}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{pkg.overview}</p>

                      {/* Inclusions */}
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Bundled Inclusions</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {pkg.inclusions?.slice(0, 4).map((inc, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="truncate">{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900">{formatPrice(unitPrice)}</span>
                      <span className="text-[10px] text-slate-400 block">per pilgrim ({selectedSharing})</span>
                    </div>

                    <button
                      onClick={() => handleBookUmrah(pkg)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Book Umrah Package
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
