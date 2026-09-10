'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Search,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  FileText,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { VisaCountry, VisaType } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import VisaTrackerModal from '@/components/VisaTrackerModal';

export default function VisaPage() {
  const { formatPrice, addItem } = useCart();
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Selected Country & Application modal state
  const [selectedCountry, setSelectedCountry] = useState<VisaCountry | null>(null);
  const [selectedVisaType, setSelectedVisaType] = useState<VisaType | null>(null);

  // Application form state
  const [applicantName, setApplicantName] = useState('Alex Morgan');
  const [passportNumber, setPassportNumber] = useState('USA98421004');
  const [nationality, setNationality] = useState('United States');
  const [travelDate, setTravelDate] = useState('2026-10-01');
  const [passportUploaded, setPassportUploaded] = useState(true);
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [submittedApp, setSubmittedApp] = useState<any>(null);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const data = await api.getVisaCountries(searchQuery);
      setCountries(data);
      if (data.length > 0 && !selectedCountry) {
        setSelectedCountry(data[0]);
        setSelectedVisaType(data[0].visa_types[0] || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [searchQuery]);

  const handleSelectCountry = (country: VisaCountry) => {
    setSelectedCountry(country);
    setSelectedVisaType(country.visa_types[0] || null);
    setSubmittedApp(null);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry || !selectedVisaType) return;

    addItem({
      booking_type: 'visa',
      title: `Visa Assistance: ${selectedCountry.country_name} (${selectedVisaType.title})`,
      subtitle: `${selectedCountry.flag_emoji} ${selectedCountry.country_name} • ${selectedVisaType.entry_type} • Processing: ${selectedCountry.processing_time_days}`,
      amount: Number(selectedVisaType.total_fee),
      travel_date: travelDate,
      details: {
        country: selectedCountry.country_name,
        visa_type: selectedVisaType.title,
        applicant_name: applicantName,
        passport_number: passportNumber,
        nationality: nationality,
        processing_time: selectedCountry.processing_time_days,
      },
    });

    setSubmittedApp({
      reference: `VISA-${selectedCountry.country_code}-${Math.floor(100000 + Math.random() * 900000)}`,
      country: selectedCountry.country_name,
      type: selectedVisaType.title,
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              99.4% Verified Approval Track Record
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Global Visa Assistance & eVisa Concierge
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fast, paperless visa assistance for 40+ countries. Document pre-audit, official appointment booking, and instant status tracking.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setIsTrackerOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track Existing Application</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Countries Directory Column */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 block uppercase tracking-wider">Select Destination Country</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full bg-slate-50 border border-slate-200 pl-8 pr-3 py-2 text-xs font-semibold rounded-xl outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="max-h-[520px] overflow-y-auto space-y-2 pr-1">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-16 bg-slate-100 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                countries.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCountry(c)}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                      selectedCountry?.id === c.id
                        ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag_emoji}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{c.country_name}</h4>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {c.processing_time_days}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-indigo-700">{formatPrice(c.starting_price)}</span>
                      <span className="text-[9px] text-slate-400 block">starting</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Visa Application & Requirements Area */}
          <div className="lg:col-span-8 space-y-6">
            {selectedCountry && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Country Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{selectedCountry.flag_emoji}</span>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">{selectedCountry.country_name} Visa Assistance</h2>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedCountry.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ⚡ {selectedCountry.processing_time_days}
                  </span>
                </div>

                {/* Visa Tiers */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">1. Select Visa Category</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCountry.visa_types?.map((vt) => (
                      <div
                        key={vt.id}
                        onClick={() => setSelectedVisaType(vt)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                          selectedVisaType?.id === vt.id
                            ? 'bg-indigo-50/80 border-indigo-400 shadow-xs'
                            : 'bg-slate-50/60 border-slate-200 hover:border-indigo-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{vt.title}</span>
                            {selectedVisaType?.id === vt.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">Validity: {vt.validity_duration} • Stay: {vt.stay_duration}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-800">
                          <span className="text-[10px] text-slate-400">{vt.entry_type}</span>
                          <span className="text-indigo-700 text-sm font-black">{formatPrice(vt.total_fee)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Mandatory Requirements Checklist
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {selectedCountry.requirements_checklist?.map((req, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Online Application Form */}
                <form onSubmit={handleApply} className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Applicant Information & Document Upload</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Applicant Full Name (As in Passport)</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Passport Number</label>
                      <input
                        type="text"
                        required
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-slate-900 outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Nationality</label>
                      <input
                        type="text"
                        required
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Intended Travel Date</label>
                      <input
                        type="date"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {/* Document Upload Simulator */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-1 hover:border-indigo-400 transition cursor-pointer">
                      <Upload className="w-5 h-5 text-indigo-500 mx-auto" />
                      <p className="text-xs font-bold text-slate-800">Passport Bio Page Copy</p>
                      <span className="text-[10px] text-emerald-600 font-semibold block">✓ Verified Attachment Attached</span>
                    </div>

                    <div className="p-3 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-1 hover:border-indigo-400 transition cursor-pointer">
                      <Upload className="w-5 h-5 text-indigo-500 mx-auto" />
                      <p className="text-xs font-bold text-slate-800">Passport Photo (White BG)</p>
                      <span className="text-[10px] text-emerald-600 font-semibold block">✓ Photo Specifications Compliant</span>
                    </div>
                  </div>

                  {submittedApp && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Visa application packaged and added to cart!
                      </p>
                      <p className="text-[11px]">Assigned Reference ID: <strong>{submittedApp.reference}</strong></p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                  >
                    Add Visa Application to Unified Cart ({formatPrice(selectedVisaType?.total_fee || 99)})
                  </button>
                </form>

              </div>
            )}
          </div>

        </div>

      </div>

      <VisaTrackerModal isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />
    </div>
  );
}
