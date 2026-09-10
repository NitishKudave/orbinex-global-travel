'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CreditCard,
  Sparkles,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Wifi,
  Coins,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { api } from '@/lib/api';
import { EsimPackage, ForexRate, AirportLounge } from '@/lib/types';
import { useCart } from '@/context/CartContext';

export default function UtilitiesPage() {
  const { formatPrice, addItem } = useCart();
  const [activeTab, setActiveTab] = useState<'esim' | 'forex' | 'lounges'>('esim');

  const [esims, setEsims] = useState<EsimPackage[]>([]);
  const [forex, setForex] = useState<ForexRate[]>([]);
  const [lounges, setLounges] = useState<AirportLounge[]>([]);
  const [loading, setLoading] = useState(true);

  // Forex Calculator state
  const [calcAmountUSD, setCalcAmountUSD] = useState<number>(1000);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('EUR');

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [es, fx, lg] = await Promise.all([
          api.getEsimPackages(),
          api.getForexRates(),
          api.getAirportLounges(),
        ]);
        setEsims(es);
        setForex(fx);
        setLounges(lg);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const handleAddEsim = (pkg: EsimPackage) => {
    addItem({
      booking_type: 'utility',
      title: `eSIM Pass: ${pkg.country_or_region}`,
      subtitle: `${pkg.data_allowance} • ${pkg.validity_days} Days Validity • Instant QR Delivery`,
      amount: Number(pkg.price_usd),
      details: {
        utility_type: 'esim',
        region: pkg.country_or_region,
        data: pkg.data_allowance,
      },
    });
  };

  const handleAddLounge = (lg: AirportLounge) => {
    addItem({
      booking_type: 'utility',
      title: `Lounge Pass: ${lg.airport_code} (${lg.lounge_name})`,
      subtitle: `${lg.airport_name} • ${lg.terminal} • 24/7 Access`,
      amount: Number(lg.price_usd),
      details: {
        utility_type: 'lounge',
        airport: lg.airport_code,
        lounge_name: lg.lounge_name,
      },
    });
  };

  const currentRateObj = forex.find((f) => f.currency_code === selectedCurrency) || forex[0];
  const calculatedForeignAmount = currentRateObj ? (calcAmountUSD / Number(currentRateObj.buy_rate_usd)).toFixed(2) : '0.00';

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 border border-teal-400/30 text-teal-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Essential Travel Utilities
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Global eSIMs, Forex Cards & Airport Lounges
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stay connected in 120+ countries with instant QR eSIM delivery, get zero forex markup currency cards, and relax in VIP airport lounges worldwide.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-2xl bg-white p-1.5 border border-slate-200 shadow-xs max-w-lg mx-auto">
          {[
            { id: 'esim', label: 'International eSIM', icon: Smartphone },
            { id: 'forex', label: 'Forex & Currency', icon: Coins },
            { id: 'lounges', label: 'Airport Lounges', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ESIM TAB */}
        {activeTab === 'esim' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-xl font-black text-slate-900">Instant 5G Data eSIM Packages</h2>
              <p className="text-xs text-slate-500 mt-1">Scan the digital QR code upon checkout and enjoy seamless high-speed internet without physical SIM swaps.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {esims.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition duration-300 space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100">
                        {pkg.validity_days} Days Active
                      </span>
                      <span className="text-xs font-bold text-emerald-600">5G / 4G LTE</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mt-2">{pkg.country_or_region}</h3>
                    <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">{pkg.data_allowance}</span>
                      <QrCode className="w-5 h-5 text-slate-400" />
                    </div>

                    <ul className="space-y-1.5 mt-3 text-xs text-slate-600">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Instant QR Activation Code in Email</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Hotspot & Personal Tethering Included</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900">{formatPrice(pkg.price_usd)}</span>
                    <button
                      onClick={() => handleAddEsim(pkg)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Buy eSIM Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOREX TAB */}
        {activeTab === 'forex' && (
          <div className="space-y-6">
            {/* Currency Calculator Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">Zero-Markup Multi-Currency Forex Card Calculator</h3>
                <p className="text-xs text-slate-500">Lock in competitive live exchange rates with zero international ATM withdrawal markups.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">You Pay (USD)</label>
                  <input
                    type="number"
                    value={calcAmountUSD}
                    onChange={(e) => setCalcAmountUSD(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-black text-lg text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Destination Currency</label>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-black text-lg text-slate-900 outline-none"
                  >
                    {forex.map((fx) => (
                      <option key={fx.currency_code} value={fx.currency_code}>
                        {fx.flag_emoji} {fx.currency_code} - {fx.currency_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-semibold block">You Receive Loaded onto Card:</span>
                  <span className="text-2xl font-black text-emerald-900">
                    {calculatedForeignAmount} {selectedCurrency}
                  </span>
                </div>

                <button
                  onClick={() => {
                    addItem({
                      booking_type: 'utility',
                      title: `Forex Card: ${calcAmountUSD} USD to ${selectedCurrency}`,
                      subtitle: `Loaded: ${calculatedForeignAmount} ${selectedCurrency} • Zero Markup Rate`,
                      amount: calcAmountUSD,
                      details: {
                        utility_type: 'forex',
                        currency_loaded: selectedCurrency,
                        amount_loaded: calculatedForeignAmount,
                      },
                    });
                  }}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition cursor-pointer"
                >
                  Order Forex Card
                </button>
              </div>
            </div>

            {/* Live Exchange Rates Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm max-w-3xl mx-auto">
              <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-700">
                Live Exchange Rates Relative to USD ($)
              </div>
              <div className="divide-y divide-slate-100">
                {forex.map((fx) => (
                  <div key={fx.currency_code} className="p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{fx.flag_emoji}</span>
                      <div>
                        <span className="font-bold text-slate-900">{fx.currency_code}</span>
                        <p className="text-[11px] text-slate-400">{fx.currency_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-800">1 USD = {(1 / Number(fx.buy_rate_usd)).toFixed(4)} {fx.currency_code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOUNGES TAB */}
        {activeTab === 'lounges' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-xl font-black text-slate-900">VIP Airport Lounge Access Passes</h2>
              <p className="text-xs text-slate-500 mt-1">Enjoy open gourmet buffets, luxury shower rooms, high-speed Wi-Fi, and plush recliner seating before your flight.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lounges.map((lg) => (
                <div
                  key={lg.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition duration-300 space-y-4"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {lg.airport_code} Airport
                    </span>

                    <h3 className="text-lg font-black text-slate-900 mt-2">{lg.lounge_name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{lg.airport_name} • {lg.terminal}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {lg.amenities?.map((am, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                          ✓ {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900">{formatPrice(lg.price_usd)}</span>
                    <button
                      onClick={() => handleAddLounge(lg)}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
                    >
                      Get Lounge Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
