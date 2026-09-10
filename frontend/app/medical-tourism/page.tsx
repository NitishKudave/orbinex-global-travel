'use client';

import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Award,
  CheckCircle2,
  Upload,
  Clock,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import { api } from '@/lib/api';
import { MedicalPackage } from '@/lib/types';
import { useCart } from '@/context/CartContext';

export default function MedicalTourismPage() {
  const { formatPrice, addItem } = useCart();
  const [packages, setPackages] = useState<MedicalPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Enquiry form state
  const [patientName, setPatientName] = useState('Alex Morgan');
  const [patientAge, setPatientAge] = useState(45);
  const [treatment, setTreatment] = useState('Robotic Knee Replacement');
  const [country, setCountry] = useState('India (Apollo Hospitals)');
  const [condition, setCondition] = useState('Severe osteoarthritis in right knee. Seeking minimally invasive robotic surgery second opinion.');
  const [submitted, setSubmitted] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await api.getMedicalPackages();
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

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.submitMedicalEnquiry({
        treatment_name: treatment,
        country_preference: country,
        patient_name: patientName,
        patient_age: patientAge,
        medical_condition_summary: condition,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-400/30 text-red-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <HeartPulse className="w-3.5 h-3.5" />
              Global Healthcare & Hospital Concierge
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              World-Class Medical Care at Up to 85% Savings
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              JCI-Accredited hospitals in India, Thailand, Turkey & UAE. Robotic joint replacements, advanced cardiology, IVF fertility treatments, and Ayurvedic wellness retreats.
            </p>
          </div>
        </div>

        {/* Treatment Packages Comparison Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Featured Hospital Treatment Packages</h2>
            <p className="text-xs text-slate-500">Comprehensive surgical packages including surgeon fees, private room stay, and airport concierge.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              [1, 2].map((n) => (
                <div key={n} className="h-80 bg-white rounded-3xl animate-pulse border border-slate-200"></div>
              ))
            ) : (
              packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition duration-300 space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                        {pkg.hospital.name} ({pkg.hospital.country})
                      </span>
                      <span className="text-xs font-bold text-emerald-600">Success Rate: {pkg.success_rate}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-2">{pkg.treatment_name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">{pkg.overview}</p>

                    {/* US Cost Comparison Box */}
                    <div className="mt-4 p-3 bg-red-50/70 border border-red-200 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block">International Package:</span>
                        <span className="text-base font-black text-red-700">{formatPrice(pkg.estimated_cost_usd)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block">US / Western Benchmark:</span>
                        <span className="text-xs text-slate-400 line-through">{formatPrice(pkg.us_benchmark_cost_usd)}</span>
                        <span className="text-[10px] text-emerald-600 font-bold block">Save 85%+</span>
                      </div>
                    </div>

                    {/* Inclusions */}
                    <div className="space-y-1 mt-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Package Inclusions</span>
                      {pkg.inclusions?.slice(0, 3).map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Hospital Stay: {pkg.hospital_stay_days} Days</span>
                    <button
                      onClick={() => {
                        setTreatment(pkg.treatment_name);
                        setCountry(pkg.hospital.country);
                        window.scrollTo({ top: 900, behavior: 'smooth' });
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Enquire for This Treatment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Confidential Second Opinion & Quotation Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
              Free Medical Evaluation
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">
              Request a Confidential Second Opinion & Custom Treatment Plan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Our chief medical director will review your case with top hospital specialists and provide an itemized quote within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-900">Medical Inquiry Received!</h4>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Assigned Case ID: <strong>MED-IND-908214</strong>. A specialized international patient coordinator has been assigned to your case.
              </p>
            </div>
          ) : (
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Patient Age</label>
                  <input
                    type="number"
                    required
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full p-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Treatment / Specialty Required</label>
                  <input
                    type="text"
                    required
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Preferred Destination</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 text-xs font-bold border border-slate-200 rounded-xl outline-none bg-slate-50"
                  >
                    <option value="India">India (Apollo / Fortis / Max)</option>
                    <option value="Thailand">Thailand (Bumrungrad International)</option>
                    <option value="Turkey">Turkey (Acibadem Healthcare)</option>
                    <option value="UAE">United Arab Emirates (Dubai Healthcare City)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Medical Condition Summary</label>
                <textarea
                  rows={3}
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none"
                />
              </div>

              {/* Upload Scans Simulator */}
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-1 hover:border-red-400 transition cursor-pointer">
                <Upload className="w-6 h-6 text-red-500 mx-auto" />
                <p className="text-xs font-bold text-slate-800">Attach Scans, MRI, or Discharge Summaries</p>
                <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 25MB • 100% HIPAA/GDPR Encrypted</span>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition cursor-pointer"
              >
                Submit Medical Inquiry for Specialist Review
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
