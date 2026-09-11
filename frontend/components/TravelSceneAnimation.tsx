'use client';

import React from 'react';

interface TravelSceneAnimationProps {
  activeTab?: string;
}

export default function TravelSceneAnimation({ activeTab = 'flights' }: TravelSceneAnimationProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      
      {/* ========================================================================= */}
      {/* FLYING FLIGHTS ANIMATION (OPEN SKY CORRIDOR)                              */}
      {/* ========================================================================= */}
      
      {/* Flight 1: Commercial Boeing 787 Dreamliner (Eastbound - Soaring Across Sky) */}
      <div className="absolute top-[4%] sm:top-[6%] left-0 w-full animate-flight-east pointer-events-auto">
        <div className="relative flex items-center">
          {/* Dual White Jet Engine Vapor Contrails */}
          <div className="relative flex flex-col gap-1 mr-[-8px]">
            <div className="h-[3px] w-64 sm:w-96 bg-gradient-to-l from-white via-white/70 to-transparent rounded-full blur-[0.4px] opacity-95 shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            <div className="h-[3px] w-56 sm:w-80 bg-gradient-to-l from-white via-white/55 to-transparent rounded-full blur-[0.4px] opacity-85" />
          </div>

          {/* Large Commercial Airliner Vector Graphic */}
          <div className="relative group/plane cursor-pointer transform rotate-[3deg]">
            <svg
              className="w-20 sm:w-26 h-9 sm:h-12 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-115"
              viewBox="0 0 130 52"
              fill="none"
            >
              <path
                d="M125 26 C118 19 90 17 45 19 L20 10 L10 12 L28 23 L14 23 L7 20 L0 21 L5 27 L0 33 L7 34 L14 31 L28 31 L10 42 L20 44 L45 35 C90 37 118 35 125 28 Z"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="1.4"
              />
              <path d="M10 12 L20 10 L24 20 L12 20 Z" fill="#eb2026" />
              <path d="M16 11 L21 10 L24 16 L19 16 Z" fill="#0284c7" />
              <path d="M112 24 Q116 25 112 26 Q108 26 108 24 Z" fill="#0f172a" />
              {[100, 93, 86, 79, 72, 65, 58, 51].map((cx) => (
                <circle key={cx} cx={cx} cy="25.5" r="1.3" fill="#0284c7" />
              ))}
              <path d="M58 32 L36 46 L48 46 L66 32 Z" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.1" />
              <rect x="54" y="33" width="13" height="5" rx="2" fill="#0284c7" stroke="#ffffff" strokeWidth="0.8" />
              <ellipse cx="67" cy="35.5" rx="1.5" ry="2.2" fill="#38bdf8" />
              <circle cx="36" cy="46" r="2.5" className="fill-rose-500 animate-ping" />
              <circle cx="36" cy="46" r="1.8" fill="#ef4444" />
              <circle cx="20" cy="10" r="2.5" className="fill-emerald-400 animate-ping" />
              <circle cx="20" cy="10" r="1.8" fill="#10b981" />
            </svg>

            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-950/95 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/plane:opacity-100 transition-opacity duration-200 pointer-events-none border border-sky-500/40 backdrop-blur-md">
              <span className="text-sky-400">✈️ Air India B787 Dreamliner</span> • Mumbai (BOM) ➔ London (LHR) • 38,000 ft
            </div>
          </div>
        </div>
      </div>

      {/* Flight 2: High-Altitude Airbus A350 (Westbound) */}
      <div className="absolute top-[1.5%] sm:top-[2%] right-0 w-full animate-flight-west pointer-events-auto">
        <div className="relative flex items-center justify-end">
          <div className="scale-x-[-1] scale-80 opacity-90 group/plane2 cursor-pointer relative">
            <svg className="w-13 h-7 filter drop-shadow-md" viewBox="0 0 100 48" fill="none">
              <path
                d="M96 24 C90 18 70 16 35 18 L15 10 L8 12 L22 22 L10 22 L5 19 L0 20 L4 25 L0 30 L5 31 L10 28 L22 28 L8 38 L15 40 L35 32 C70 34 90 32 96 26 Z"
                fill="#ffffff"
                stroke="#0369a1"
                strokeWidth="1.3"
              />
              <path d="M8 12 L15 10 L18 18 L9 18 Z" fill="#0284c7" />
              <circle cx="28" cy="40" r="2" className="fill-emerald-400 animate-ping" />
            </svg>

            <div className="scale-x-[-1] absolute top-full right-0 mt-1 px-2.5 py-1 bg-slate-900/95 text-white text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/plane2:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-700">
              ✈️ Emirates A350 • Dubai ➔ Mumbai
            </div>
          </div>
          <div className="h-[2px] w-80 bg-gradient-to-r from-white/90 via-white/40 to-transparent rounded-full blur-[0.4px] ml-[-6px]" />
        </div>
      </div>

    </div>
  );
}
