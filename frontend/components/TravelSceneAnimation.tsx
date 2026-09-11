'use client';

import React from 'react';

interface TravelSceneAnimationProps {
  activeTab?: string;
}

export default function TravelSceneAnimation({ activeTab = 'flights' }: TravelSceneAnimationProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-20">
      
      {/* ================= 1. SKY FLIGHT CORRIDOR (AIRPLANES WITH CONTRAILS) ================= */}
      
      {/* Commercial Jetliner 1 (Eastbound - Flying Across Open Sky with Vapor Contrail) */}
      <div className="absolute top-2 sm:top-3 left-0 w-full animate-flight-east pointer-events-auto">
        <div className="relative flex items-center">
          {/* Dual Jet Vapor Contrail */}
          <div className="h-[2.5px] w-48 sm:w-72 bg-gradient-to-l from-white/95 via-white/50 to-transparent rounded-full blur-[0.4px] mr-[-10px] opacity-90" />
          
          {/* Airplane Vector Graphic */}
          <div className="relative group/plane cursor-pointer">
            <svg
              className="w-13 sm:w-16 h-6 sm:h-8 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-115"
              viewBox="0 0 100 48"
              fill="none"
            >
              {/* Aircraft Fuselage */}
              <path
                d="M96 24 C90 18 70 16 35 18 L15 10 L8 12 L22 22 L10 22 L5 19 L0 20 L4 25 L0 30 L5 31 L10 28 L22 28 L8 38 L15 40 L35 32 C70 34 90 32 96 26 Z"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="1.2"
              />
              {/* Tail Fin Livery (Royal Blue / Coral Red) */}
              <path d="M8 12 L15 10 L18 18 L9 18 Z" fill="#eb2026" />
              <path d="M12 11 L16 10 L18 15 L14 15 Z" fill="#0284c7" />
              {/* Cockpit Windshield */}
              <path d="M86 22 Q89 23 86 24 Q83 24 83 22 Z" fill="#0369a1" />
              {/* Passenger Windows */}
              <circle cx="75" cy="23.5" r="1.1" fill="#0284c7" />
              <circle cx="70" cy="23.5" r="1.1" fill="#0284c7" />
              <circle cx="65" cy="23.5" r="1.1" fill="#0284c7" />
              <circle cx="60" cy="23.5" r="1.1" fill="#0284c7" />
              <circle cx="55" cy="23.5" r="1.1" fill="#0284c7" />
              <circle cx="50" cy="23.5" r="1.1" fill="#0284c7" />
              <circle cx="45" cy="23.5" r="1.1" fill="#0284c7" />
              <circle cx="40" cy="23.5" r="1.1" fill="#0284c7" />
              {/* Wings & Turbine Engine */}
              <path d="M44 29 L28 40 L38 40 L50 29 Z" fill="#f0f9ff" stroke="#0284c7" strokeWidth="0.9" />
              <rect x="42" y="30" width="9" height="3.5" rx="1.5" fill="#0284c7" />
              {/* Blinking Wingtip Strobe Light */}
              <circle cx="28" cy="40" r="2" className="fill-rose-500 animate-ping" />
              <circle cx="28" cy="40" r="1.5" fill="#ef4444" />
            </svg>

            {/* Hover Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-1 bg-slate-900/95 text-white text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/plane:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-700">
              ✈️ Flight AI-101 • Mumbai ➔ London (36,000 ft)
            </div>
          </div>
        </div>
      </div>

      {/* High-Altitude Aircraft 2 (Westbound - Stratosphere Cruiser) */}
      <div className="absolute top-1 sm:top-2 right-0 w-full animate-flight-west pointer-events-auto">
        <div className="relative flex items-center justify-end">
          {/* Airplane Graphic (Facing Left) */}
          <div className="scale-x-[-1] scale-75 opacity-90 group/plane2 cursor-pointer relative">
            <svg className="w-11 h-6 filter drop-shadow-sm" viewBox="0 0 100 48" fill="none">
              <path
                d="M96 24 C90 18 70 16 35 18 L15 10 L8 12 L22 22 L10 22 L5 19 L0 20 L4 25 L0 30 L5 31 L10 28 L22 28 L8 38 L15 40 L35 32 C70 34 90 32 96 26 Z"
                fill="#ffffff"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <path d="M8 12 L15 10 L18 18 L9 18 Z" fill="#0284c7" />
              <circle cx="28" cy="40" r="2" className="fill-emerald-400 animate-ping" />
            </svg>

            {/* Tooltip */}
            <div className="scale-x-[-1] absolute top-full right-0 mt-1 px-2.5 py-1 bg-slate-900/95 text-white text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/plane2:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-700">
              ✈️ Emirates EK-505 • Dubai ➔ Mumbai
            </div>
          </div>
          {/* Fading Jet Contrail */}
          <div className="h-[1.5px] w-60 bg-gradient-to-r from-white/80 via-white/35 to-transparent rounded-full blur-[0.4px] ml-[-6px]" />
        </div>
      </div>


      {/* ================= 2. GROUND TRANSIT HORIZON (BULLET TRAIN & COACH BUS) ================= */}
      {/* Positioned at bottom-10 sm:bottom-12 so it is clearly visible ABOVE the bottom ribbon */}
      <div className="absolute bottom-9 sm:bottom-11 left-0 right-0 h-14 sm:h-16 overflow-hidden z-20">
        
        {/* Modern Elevated Rail Viaduct & Highway Strip */}
        <div className="absolute bottom-0 left-0 right-0 h-7 sm:h-8 bg-gradient-to-r from-slate-950/85 via-slate-900/95 to-slate-950/85 backdrop-blur-md border-t border-cyan-500/30 shadow-2xl flex flex-col justify-between px-4 py-0.5">
          {/* Rail Track with Neon Speed Indicator */}
          <div className="relative w-full h-1 border-b border-cyan-400/40">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(56,189,248,0.7)_50%,transparent_100%)] opacity-50 animate-pulse" />
          </div>
          {/* Highway Dashed Center Line */}
          <div className="w-full h-0.5 border-b border-dashed border-amber-400/60" />
        </div>

        {/* 1. HIGH-SPEED BULLET TRAIN (Vande Bharat / Shinkansen Style - Running Left to Right) */}
        <div className="absolute bottom-3 sm:bottom-3.5 left-0 animate-bullet-train pointer-events-auto">
          <div className="relative group/train cursor-pointer flex items-center">
            
            {/* Aerodynamic Multi-Car Bullet Train Vector */}
            <svg className="h-6 sm:h-7 w-60 sm:w-72 filter drop-shadow-[0_4px_12px_rgba(2,132,199,0.6)]" viewBox="0 0 280 32" fill="none">
              <defs>
                <linearGradient id="train-beam" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* High-Beam Headlight Projection Cone */}
              <polygon points="280,24 330,17 330,30 280,25" fill="url(#train-beam)" />

              {/* Train Locomotive Nose (Aerodynamic Bullet Shape) */}
              <path
                d="M280 25 C274 23 252 15 220 15 L160 15 L160 28 L262 28 C274 28 278 26 280 25 Z"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="1.2"
              />
              {/* Cockpit Visor */}
              <path d="M268 23 C262 19 250 17 230 17 L220 17 L220 23 Z" fill="#0f172a" />
              {/* Vande Bharat Cobalt Speed Livery */}
              <path d="M276 25 C260 25 225 21 160 21 L160 23.5 L262 26 Z" fill="#0284c7" />
              <path d="M220 27 L160 27 L160 28 L225 28 Z" fill="#f59e0b" />

              {/* Coach 1 */}
              <rect x="80" y="15" width="76" height="13" rx="1.5" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
              <rect x="80" y="21" width="76" height="2.5" fill="#0284c7" />
              {/* Coach 1 Illuminated Windows */}
              <rect x="85" y="17" width="10" height="3" rx="0.5" fill="#38bdf8" className="animate-pulse" />
              <rect x="98" y="17" width="10" height="3" rx="0.5" fill="#38bdf8" className="animate-pulse" />
              <rect x="111" y="17" width="10" height="3" rx="0.5" fill="#38bdf8" className="animate-pulse" />
              <rect x="124" y="17" width="10" height="3" rx="0.5" fill="#38bdf8" className="animate-pulse" />
              <rect x="137" y="17" width="10" height="3" rx="0.5" fill="#38bdf8" className="animate-pulse" />
              <rect x="80" y="27" width="76" height="1" fill="#f59e0b" />

              {/* Coach 2 */}
              <rect x="2" y="15" width="74" height="13" rx="1.5" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
              <rect x="2" y="21" width="74" height="2.5" fill="#0284c7" />
              {/* Coach 2 Windows */}
              <rect x="7" y="17" width="10" height="3" rx="0.5" fill="#38bdf8" />
              <rect x="20" y="17" width="10" height="3" rx="0.5" fill="#38bdf8" />
              <rect x="33" y="17" width="10" height="3" rx="0.5" fill="#38bdf8" />
              <rect x="46" y="17" width="10" height="3" rx="0.5" fill="#38bdf8" />
              <rect x="59" y="17" width="10" height="3" rx="0.5" fill="#38bdf8" />
              <rect x="2" y="27" width="74" height="1" fill="#f59e0b" />

              {/* Bogie Wheels */}
              <circle cx="20" cy="28.5" r="2.2" fill="#334155" />
              <circle cx="30" cy="28.5" r="2.2" fill="#334155" />
              <circle cx="100" cy="28.5" r="2.2" fill="#334155" />
              <circle cx="110" cy="28.5" r="2.2" fill="#334155" />
              <circle cx="180" cy="28.5" r="2.2" fill="#334155" />
              <circle cx="190" cy="28.5" r="2.2" fill="#334155" />
            </svg>

            {/* Hover Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900/95 text-white text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/train:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-700">
              🚆 Vande Bharat Express • Mumbai ➔ New Delhi (160 km/h)
            </div>
          </div>
        </div>

        {/* 2. MODERN LUXURY COACH BUS (Volvo 9600 Style - Cruising Right to Left on Highway) */}
        <div className="absolute bottom-0.5 sm:bottom-1 right-0 animate-coach-bus pointer-events-auto">
          <div className="relative group/bus cursor-pointer flex items-center scale-x-[-1]">
            
            {/* Volvo Luxury Coach Vector */}
            <svg className="h-6 sm:h-7 w-28 sm:w-34 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" viewBox="0 0 120 32" fill="none">
              <defs>
                <linearGradient id="bus-beam" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Headlight Beam */}
              <polygon points="116,23 155,18 155,29 116,25" fill="url(#bus-beam)" />

              {/* Bus Aerodynamic Body */}
              <path
                d="M4 8 C10 8 106 8 110 10 C115 12 116 16 116 26 L2 26 C2 16 2.5 10 4 8 Z"
                fill="#7c3aed"
                stroke="#6d28d9"
                strokeWidth="1"
              />
              {/* Roof AC Module */}
              <rect x="42" y="6" width="38" height="2.5" rx="1" fill="#4c1d95" />
              
              {/* Windshield */}
              <path d="M104 11 L114 14 L114 20 L104 20 Z" fill="#0f172a" />
              
              {/* Tinted Panoramic Side Windows */}
              <rect x="8" y="11" width="14" height="7.5" rx="1" fill="#38bdf8" opacity="0.95" />
              <rect x="25" y="11" width="14" height="7.5" rx="1" fill="#38bdf8" opacity="0.95" />
              <rect x="42" y="11" width="14" height="7.5" rx="1" fill="#38bdf8" opacity="0.95" />
              <rect x="59" y="11" width="14" height="7.5" rx="1" fill="#38bdf8" opacity="0.95" />
              <rect x="76" y="11" width="14" height="7.5" rx="1" fill="#38bdf8" opacity="0.95" />
              <rect x="93" y="11" width="9" height="7.5" rx="1" fill="#38bdf8" opacity="0.95" />
              
              {/* Luxury Golden Livery Wave */}
              <path d="M4 22 Q45 18 114 23 L114 25 Q45 20 4 24 Z" fill="#f59e0b" />
              
              {/* Wheels */}
              <circle cx="24" cy="26" r="4.2" fill="#0f172a" />
              <circle cx="24" cy="26" r="2.2" fill="#e2e8f0" />
              <circle cx="88" cy="26" r="4.2" fill="#0f172a" />
              <circle cx="88" cy="26" r="2.2" fill="#e2e8f0" />
              <circle cx="99" cy="26" r="4.2" fill="#0f172a" />
              <circle cx="99" cy="26" r="2.2" fill="#e2e8f0" />
            </svg>

            {/* Hover Tooltip (Unflipped) */}
            <div className="scale-x-[-1] absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900/95 text-white text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/bus:opacity-100 transition-opacity duration-200 pointer-events-none border border-slate-700">
              🚌 IntrCity SmartBus • Mumbai ➔ Pune Express
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
