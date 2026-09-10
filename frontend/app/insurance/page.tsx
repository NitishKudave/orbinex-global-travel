'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  HeartPulse,
  Luggage,
  Plane,
  FileCheck2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { InsurancePlan } from '@/lib/types';
import { useCart } from '@/context/CartContext';

export default function InsurancePage() {
  const { formatPrice, addItem } = useCart();
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [loading, setLoading] = useState(true);

  const [region, setRegion] = useState('worldwide');
  const [durationDays, setDurationDays] = useState(14);
  const [destination, setDestination] = useState('Worldwide (US, Europe, UAE)');
  const [travelersCount, setTravelersCount] = useState(1);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await api.getInsurancePlans(region);
      setPlans(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [region]);

  const handleBuyPlan = (plan: InsurancePlan) => {
    const totalAmount = Number(plan.flat_price) * travelersCount;
    addItem({
      booking_type: 'insurance',
      title: `Travel Insurance: ${plan.plan_name}`,
      subtitle: `Medical Cover: ${plan.medical_coverage_amount} • ${destination} • ${durationDays} Days Policy`,
      amount: totalAmount,
      travel_date: '2026-09-15',
      return_date: '2026-09-29',
      details: {
        plan_name: plan.plan_name,
        provider: plan.provider.name,
        destination,
        duration_days: durationDays,
        medical_coverage: plan.medical_coverage_amount,
        travelers_count: travelersCount,
      },
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Embassy Approved Comprehensive Cover
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Worldwide Travel Medical & Trip Insurance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Zero deductible cashless hospitalization up to $1,000,000, emergency evacuation, baggage delay compensation, and instant policy PDF certificate issuance.
            </p>
          </div>
        </div>

        {/* Region & Duration Filter Box */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Destination Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-xs text-slate-800 outline-none"
            >
              <option value="worldwide">Worldwide (Including USA & Canada)</option>
              <option value="worldwide_ex_us">Worldwide (Excluding USA & Canada)</option>
              <option value="schengen">Schengen Europe Mandatory (€30,000+)</option>
              <option value="asia">Asia Pacific Region</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Trip Duration</label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-xs text-slate-800 outline-none"
            >
              <option value={7}>7 Days Trip</option>
              <option value={14}>14 Days Trip</option>
              <option value={30}>30 Days Comprehensive</option>
              <option value={90}>90 Days Multi-Trip Annual</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Insured Travelers</label>
            <select
              value={travelersCount}
              onChange={(e) => setTravelersCount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold text-xs text-slate-800 outline-none"
            >
              <option value={1}>1 Individual Traveler</option>
              <option value={2}>2 Travelers (Couple)</option>
              <option value={4}>Family (Up to 4 members)</option>
            </select>
          </div>
        </div>

        {/* Side-by-Side Plans Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {loading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200"></div>
            ))
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition duration-300 relative ${
                  plan.is_bestseller
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200'
                }`}
              >
                {plan.is_bestseller && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                    Most Popular Choice
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{plan.provider.name}</span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">{plan.plan_name}</h3>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">Claim Settlement Ratio: {plan.provider.claim_settlement_ratio}</p>
                  </div>

                  {/* Coverage Limits Table */}
                  <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 flex items-center gap-1">
                        <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                        Medical Emergency
                      </span>
                      <span className="font-bold text-slate-900">{plan.medical_coverage_amount}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Luggage className="w-3.5 h-3.5 text-amber-500" />
                        Baggage Loss
                      </span>
                      <span className="font-bold text-slate-900">{plan.baggage_loss_amount}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Plane className="w-3.5 h-3.5 text-sky-500" />
                        Flight Delay
                      </span>
                      <span className="font-bold text-slate-900">{plan.flight_delay_amount}</span>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Included Privileges</span>
                    {plan.benefits_list?.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Policy Cost</span>
                    <span className="text-2xl font-black text-slate-900">
                      {formatPrice(Number(plan.flat_price) * travelersCount)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyPlan(plan)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition cursor-pointer"
                  >
                    Select Plan
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
