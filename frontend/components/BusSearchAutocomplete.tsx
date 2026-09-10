'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bus, MapPin, X, ChevronDown, Check, Building } from 'lucide-react';
import { api } from '@/lib/api';

export interface BusLocationSuggestion {
  id: string;
  city: string;
  display_name: string;
  landmark: string;
  is_city: boolean;
  state?: string;
  country?: string;
  type?: string;
}

interface BusSearchAutocompleteProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string, selectedPoint?: BusLocationSuggestion) => void;
  type?: 'from' | 'to';
  className?: string;
}

export default function BusSearchAutocomplete({
  label,
  placeholder = 'Enter city or boarding point',
  value,
  onChange,
  type = 'from',
  className = '',
}: BusSearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<BusLocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal input value with props
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Fetch suggestions on input change
  useEffect(() => {
    let active = true;
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const data = await api.getBusSuggestions(inputValue);
        if (active) {
          if (data && data.length > 0) {
            setSuggestions(data);
          } else if (inputValue && inputValue.trim().length >= 2) {
            const formatted = inputValue.trim().charAt(0).toUpperCase() + inputValue.trim().slice(1);
            setSuggestions([
              {
                id: `city_${inputValue.toLowerCase()}`,
                city: formatted,
                display_name: `${formatted}, All Locations`,
                landmark: `All Intercity Bus Stops in ${formatted}`,
                is_city: true,
                type: 'both'
              },
              {
                id: `pt_${inputValue.toLowerCase()}_cbs`,
                city: formatted,
                display_name: `Central ST Bus Stand, ${formatted}`,
                landmark: `Main RTC Bus Terminal ${formatted}`,
                is_city: false,
                type: 'both'
              },
              {
                id: `pt_${inputValue.toLowerCase()}_rly`,
                city: formatted,
                display_name: `Railway Station Chowk, ${formatted}`,
                landmark: `Station Main Road ${formatted}`,
                is_city: false,
                type: 'both'
              },
              {
                id: `pt_${inputValue.toLowerCase()}_bypass`,
                city: formatted,
                display_name: `${formatted} Highway Bypass`,
                landmark: `National Highway Toll Point ${formatted}`,
                is_city: false,
                type: 'both'
              }
            ]);
          } else {
            setSuggestions([]);
          }
        }
      } catch (e) {
        if (active && inputValue && inputValue.trim().length >= 2) {
          const formatted = inputValue.trim().charAt(0).toUpperCase() + inputValue.trim().slice(1);
          setSuggestions([
            {
              id: `city_${inputValue.toLowerCase()}`,
              city: formatted,
              display_name: `${formatted}, All Locations`,
              landmark: `All Intercity Bus Stops in ${formatted}`,
              is_city: true,
              type: 'both'
            },
            {
              id: `pt_${inputValue.toLowerCase()}_cbs`,
              city: formatted,
              display_name: `Central ST Bus Stand, ${formatted}`,
              landmark: `Main RTC Bus Terminal ${formatted}`,
              is_city: false,
              type: 'both'
            }
          ]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSuggestions();

    return () => {
      active = false;
    };
  }, [inputValue]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: BusLocationSuggestion) => {
    // If it's a city e.g. "Mumbai, All Locations", use city name, else use point name
    const selectedText = item.is_city ? item.city : item.display_name;
    setInputValue(selectedText);
    onChange(selectedText, item);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue('');
    onChange('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(true)}
        className={`p-3 rounded-2xl border transition bg-slate-50 hover:bg-white cursor-text ${
          isOpen ? 'border-red-500 bg-white ring-2 ring-red-500/10 shadow-sm' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </label>
          {type === 'from' ? (
            <span className="text-[9px] font-bold text-red-600 uppercase">Boarding Point</span>
          ) : (
            <span className="text-[9px] font-bold text-emerald-600 uppercase">Dropping Point</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          {type === 'from' ? (
            <Bus className="w-4 h-4 text-red-500 shrink-0" />
          ) : (
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
          )}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full bg-transparent font-bold text-slate-900 text-sm outline-none placeholder:text-slate-400"
          />

          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* redBus-Style Auto-Complete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-80 overflow-y-auto animate-fade-in">
          
          <div className="p-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>{type === 'from' ? 'Popular Boarding Points' : 'Popular Dropping Points'}</span>
            <span className="text-[10px] text-slate-400">{suggestions.length} locations</span>
          </div>

          {suggestions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching points found for &quot;{inputValue}&quot;. Try searching for <strong>Mumbai</strong>, <strong>Pune</strong>, <strong>Goa</strong>, <strong>Bangalore</strong>, <strong>Delhi</strong>, or <strong>Dubai</strong>.
            </div>
          ) : (
            suggestions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`p-3.5 hover:bg-red-50/50 transition cursor-pointer flex items-center justify-between gap-3 group ${
                  item.is_city ? 'bg-slate-50/60 font-black' : ''
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    item.is_city ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600 group-hover:bg-red-100 group-hover:text-red-600'
                  }`}>
                    {item.is_city ? <Building className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${item.is_city ? 'font-black text-slate-900' : 'font-bold text-slate-800 group-hover:text-red-700'} truncate`}>
                        {item.display_name}
                      </span>
                      {item.is_city && (
                        <span className="text-[9px] uppercase font-bold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                          City All
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.landmark}
                    </p>
                  </div>
                </div>

                {/* Right Badge: "Board at" or "Drop at" */}
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    type === 'from' 
                      ? 'bg-red-50 text-red-700 border border-red-200/60' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  }`}>
                    {type === 'from' ? `Board at ${item.city}` : `Drop at ${item.city}`}
                  </span>
                </div>
              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
}
