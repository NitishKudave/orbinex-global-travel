'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plane, Search, MapPin, Sparkles, ChevronDown } from 'lucide-react';

export interface AirportOption {
  code: string;
  city: string;
  name: string;
  country: string;
  isPopular?: boolean;
  category?: 'visa_free' | 'evisa' | 'popular';
}

export const GLOBAL_AIRPORTS: AirportOption[] = [
  // Popular Indian Domestic
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport', country: 'India', isPopular: true, category: 'popular' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj Intl', country: 'India', isPopular: true, category: 'popular' },
  { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International Airport', country: 'India', isPopular: true, category: 'popular' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport', country: 'India', isPopular: true, category: 'popular' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport', country: 'India', isPopular: true, category: 'popular' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhash Chandra Bose Intl', country: 'India', isPopular: true, category: 'popular' },
  { code: 'PNQ', city: 'Pune', name: 'Pune International Airport', country: 'India', isPopular: true, category: 'popular' },
  { code: 'GOI', city: 'Goa', name: 'Dabolim Airport', country: 'India', isPopular: true, category: 'popular' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel Intl', country: 'India', isPopular: true, category: 'popular' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur International Airport', country: 'India', isPopular: true, category: 'popular' },
  { code: 'COK', city: 'Kochi', name: 'Cochin International Airport', country: 'India', isPopular: true, category: 'popular' },
  // Visa-Free / Visa-on-Arrival
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thailand', isPopular: true, category: 'visa_free' },
  { code: 'MLE', city: 'Male', name: 'Velana International Airport', country: 'Maldives', isPopular: true, category: 'visa_free' },
  { code: 'KUL', city: 'Kuala Lumpur', name: 'Kuala Lumpur International', country: 'Malaysia', isPopular: true, category: 'visa_free' },
  { code: 'CMB', city: 'Colombo', name: 'Bandaranaike International Airport', country: 'Sri Lanka', isPopular: true, category: 'visa_free' },
  { code: 'MRU', city: 'Mauritius', name: 'Sir Seewoosagur Ramgoolam Intl', country: 'Mauritius', isPopular: true, category: 'visa_free' },
  { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong International Airport', country: 'Hong Kong', isPopular: true, category: 'visa_free' },
  { code: 'MNL', city: 'Manila', name: 'Ninoy Aquino International Airport', country: 'Philippines', isPopular: true, category: 'visa_free' },
  // E-Visa
  { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'UAE', isPopular: true, category: 'evisa' },
  { code: 'DPS', city: 'Bali (Denpasar)', name: 'Ngurah Rai Intl Airport', country: 'Indonesia', isPopular: true, category: 'evisa' },
  { code: 'SGN', city: 'Ho Chi Minh', name: 'Tan Son Nhat International Airport', country: 'Vietnam', isPopular: true, category: 'evisa' },
  { code: 'NRT', city: 'Tokyo', name: 'Narita International Airport', country: 'Japan', isPopular: true, category: 'evisa' },
  { code: 'TBS', city: 'Tbilisi', name: 'Tbilisi International Airport', country: 'Georgia', isPopular: true, category: 'evisa' },
  // Popular Global
  { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'United Kingdom', isPopular: true, category: 'popular' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy Intl Airport', country: 'USA', isPopular: true, category: 'popular' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport', country: 'Singapore', isPopular: true, category: 'popular' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle Airport', country: 'France', isPopular: true, category: 'popular' },
  { code: 'DOH', city: 'Doha', name: 'Hamad International Airport', country: 'Qatar', isPopular: true, category: 'popular' },
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith Airport', country: 'Australia', isPopular: true, category: 'popular' },
  { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport', country: 'Turkey', isPopular: true, category: 'popular' },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco International Airport', country: 'USA', isPopular: true, category: 'popular' },
];

interface FlightAirportAutocompleteProps {
  label: string;
  type: 'from' | 'to';
  value: string;
  onChange: (airportCode: string, airportCity: string) => void;
  placeholder?: string;
}

export default function FlightAirportAutocomplete({
  label,
  type,
  value,
  onChange,
}: FlightAirportAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedAirport = GLOBAL_AIRPORTS.find(
    (a) => a.code.toLowerCase() === value.toLowerCase() || a.city.toLowerCase() === value.toLowerCase()
  );

  const displayCity = selectedAirport ? selectedAirport.city : value || (type === 'from' ? 'Delhi' : 'Dubai');
  const displayDetails = selectedAirport
    ? `${selectedAirport.code}, ${selectedAirport.name}`
    : `${value.toUpperCase()}, International Airport`;

  // Calculate fixed position based on trigger's screen coordinates
  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = Math.min(680, window.innerWidth - 32);
    let left = rect.left;
    // Prevent right overflow
    if (left + dropdownWidth > window.innerWidth - 16) {
      left = window.innerWidth - dropdownWidth - 16;
    }
    if (left < 8) left = 8;
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom + 8,
      left,
      width: dropdownWidth,
      zIndex: 9999,
    });
  }, []);

  const openDropdown = () => {
    updateDropdownPosition();
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    function handleScroll() {
      if (isOpen) updateDropdownPosition();
    }
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updateDropdownPosition);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen, updateDropdownPosition]);

  const filteredAirports = GLOBAL_AIRPORTS.filter((a) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.city.toLowerCase().includes(term) ||
      a.code.toLowerCase().includes(term) ||
      a.name.toLowerCase().includes(term) ||
      a.country.toLowerCase().includes(term)
    );
  });

  const visaFreeAirports = GLOBAL_AIRPORTS.filter((a) => a.category === 'visa_free');
  const evisaAirports = GLOBAL_AIRPORTS.filter((a) => a.category === 'evisa');
  const popularAirports = GLOBAL_AIRPORTS.filter((a) => a.category === 'popular');

  const handleSelect = (airport: AirportOption) => {
    onChange(airport.code, airport.city);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full" ref={triggerRef}>
      {/* Input Trigger Box */}
      <div
        onClick={openDropdown}
        className={`p-3.5 sm:p-4 rounded-2xl border bg-white hover:border-cyan-500 transition cursor-pointer shadow-xs group ${isOpen ? 'border-cyan-500 ring-2 ring-cyan-100' : 'border-slate-200'}`}
      >
        <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider group-hover:text-cyan-600 transition">
          {label}
        </span>
        <div className="flex items-center justify-between mt-0.5 gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none truncate">
              {displayCity}
            </span>
            <span className="text-xs text-slate-500 font-medium truncate mt-1">
              {displayDetails}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-cyan-600 flex-shrink-0 transition transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* FIXED-POSITION Dropdown — breaks out of all parent overflow constraints */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header strip */}
          <div className="px-5 pt-5 pb-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search city or airport (e.g. Pune, Mumbai, DEL, DXB, London…)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-cyan-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Scrollable content */}
          <div className="max-h-[440px] overflow-y-auto p-5 space-y-5">

            {searchTerm.trim() !== '' ? (
              /* --- Search results mode --- */
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 px-1">
                  Matching Airports ({filteredAirports.length})
                </p>
                {filteredAirports.length === 0 ? (
                  <div className="py-8 text-center space-y-3">
                    <Plane className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm text-slate-500">No match for &quot;{searchTerm}&quot;</p>
                    <button
                      type="button"
                      onClick={() => { onChange(searchTerm.toUpperCase(), searchTerm); setIsOpen(false); setSearchTerm(''); }}
                      className="text-xs font-bold text-cyan-600 underline cursor-pointer"
                    >
                      Use &quot;{searchTerm.toUpperCase()}&quot; anyway
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredAirports.map((airport) => (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => handleSelect(airport)}
                        className="w-full text-left px-3 py-3 rounded-2xl hover:bg-cyan-50 border border-transparent hover:border-cyan-200 transition flex items-center gap-3 group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-cyan-100 flex items-center justify-center flex-shrink-0 transition">
                          <Plane className="w-4 h-4 text-slate-500 group-hover:text-cyan-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900 truncate">{airport.city}</span>
                            <span className="text-[10px] font-bold text-slate-400 shrink-0">({airport.country})</span>
                          </div>
                          <span className="text-xs text-slate-500 truncate block">{airport.name}</span>
                        </div>
                        <span className="text-xs font-black text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-lg shrink-0">
                          {airport.code}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* --- Default browse mode --- */
              <>
                {/* Visa-Free Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Visa-Free / Visa-on-Arrival Destinations
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {visaFreeAirports.map((ap) => (
                      <button
                        key={ap.code}
                        type="button"
                        onClick={() => handleSelect(ap)}
                        className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-400 rounded-2xl text-center transition cursor-pointer group"
                      >
                        <span className="text-sm font-black text-slate-900 group-hover:text-amber-800 block truncate leading-tight">{ap.city}</span>
                        <span className="text-[11px] font-bold text-amber-600 uppercase">{ap.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* E-Visa Section */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      E-Visa Destinations
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {evisaAirports.map((ap) => (
                      <button
                        key={ap.code}
                        type="button"
                        onClick={() => handleSelect(ap)}
                        className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-400 rounded-2xl text-center transition cursor-pointer group"
                      >
                        <span className="text-sm font-black text-slate-900 group-hover:text-purple-800 block truncate leading-tight">{ap.city}</span>
                        <span className="text-[11px] font-bold text-purple-600 uppercase">{ap.code}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Searches */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 px-1">
                    Popular Searches
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {popularAirports.slice(0, 10).map((airport) => (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => handleSelect(airport)}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition flex items-center justify-between gap-2 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span className="text-sm font-extrabold text-slate-900 truncate">{airport.city}</span>
                          <span className="text-xs font-bold text-slate-400 shrink-0">{airport.code}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 shrink-0">{airport.country}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
