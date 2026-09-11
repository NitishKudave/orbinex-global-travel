'use client';

import React from 'react';

interface TravelSceneAnimationProps {
  activeTab?: string;
}

export default function TravelSceneAnimation({ activeTab = 'flights' }: TravelSceneAnimationProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-20">
      
      {/* ========================================================================= */}
      {/* 1. PROPER FLYING FLIGHTS ANIMATION (OPEN SKY CORRIDOR)                     */}
      {/* ========================================================================= */}
      
      {/* Flight 1: Commercial Boeing 787 Dreamliner (Eastbound - Soaring Across the Sky) */}
      <div className="absolute top-[4%] sm:top-[6%] left-0 w-full animate-flight-east pointer-events-auto">
        <div className="relative flex items-center">
          {/* Dual White Jet Engine Vapor Contrail (Expanding Smoke Trail) */}
          <div className="relative flex flex-col gap-1 mr-[-8px]">
            <div className="h-[3px] w-64 sm:w-96 bg-gradient-to-l from-white via-white/60 to-transparent rounded-full blur-[0.4px] opacity-95 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <div className="h-[3px] w-56 sm:w-80 bg-gradient-to-l from-white via-white/50 to-transparent rounded-full blur-[0.4px] opacity-85" />
          </div>

          {/* Large, Detailed Commercial Airliner Vector Graphic */}
          <div className="relative group/plane cursor-pointer transform rotate-[4deg]">
            <svg
              className="w-20 sm:w-26 h-9 sm:h-12 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-115"
              viewBox="0 0 130 52"
              fill="none"
            >
              {/* Airplane Main Body (Aerodynamic Fuselage) */}
              <path
                d="M125 26 C118 19 90 17 45 19 L20 10 L10 12 L28 23 L14 23 L7 20 L0 21 L5 27 L0 33 L7 34 L14 31 L28 31 L10 42 L20 44 L45 35 C90 37 118 35 125 28 Z"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="1.4"
              />

              {/* Airline Tail Fin Livery (Royal Blue & Coral Red) */}
              <path d="M10 12 L20 10 L24 20 L12 20 Z" fill="#eb2026" />
              <path d="M16 11 L21 10 L24 16 L19 16 Z" fill="#0284c7" />

              {/* Cockpit Visor Windows */}
              <path d="M112 24 Q116 25 112 26 Q108 26 108 24 Z" fill="#0f172a" />

              {/* Passenger Cabin Windows with Blue Accent */}
              {[100, 93, 86, 79, 72, 65, 58, 51].map((cx) => (
                <circle key={cx} cx={cx} cy="25.5" r="1.3" fill="#0284c7" />
              ))}

              {/* Swept Main Wing with Turbine Jet Engine */}
              <path d="M58 32 L36 46 L48 46 L66 32 Z" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.1" />
              {/* Jet Turbofan Engine Pod */}
              <rect x="54" y="33" width="13" height="5" rx="2" fill="#0284c7" stroke="#ffffff" strokeWidth="0.8" />
              <ellipse cx="67" cy="35.5" rx="1.5" ry="2.2" fill="#38bdf8" />

              {/* Wingtip Navigation Strobe Lights */}
              {/* Port Wing (Red Strobe) */}
              <circle cx="36" cy="46" r="2.5" className="fill-rose-500 animate-ping" />
              <circle cx="36" cy="46" r="1.8" fill="#ef4444" />
              {/* Starboard Wing (Green Strobe) */}
              <circle cx="20" cy="10" r="2.5" className="fill-emerald-400 animate-ping" />
              <circle cx="20" cy="10" r="1.8" fill="#10b981" />
            </svg>

            {/* Hover Flight Status Card */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-950/95 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/plane:opacity-100 transition-opacity duration-200 pointer-events-none border border-sky-500/40 backdrop-blur-md">
              <span className="text-sky-400">✈️ Air India B787</span> • Mumbai (BOM) ➔ London (LHR) • 38,000 ft
            </div>
          </div>
        </div>
      </div>

      {/* Flight 2: High-Altitude Airbus A350 (Westbound - Stratosphere Cruiser) */}
      <div className="absolute top-[1%] sm:top-[2%] right-0 w-full animate-flight-west pointer-events-auto">
        <div className="relative flex items-center justify-end">
          {/* Airplane Vector Graphic (Facing Left) */}
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
          {/* Long High-Altitude Vapor Contrail */}
          <div className="h-[2px] w-80 bg-gradient-to-r from-white/90 via-white/40 to-transparent rounded-full blur-[0.4px] ml-[-6px]" />
        </div>
      </div>


      {/* ========================================================================= */}
      {/* 2. PROPER RAILWAY TRACK & HIGHWAY ROAD TRANSIT HORIZON                     */}
      {/* ========================================================================= */}
      
      {/* Dedicated Dual Transit Corridor (Rail Road + Highway Road) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 z-20 flex flex-col justify-end">
        
        {/* ================== A. PROPER RAILWAY ROUTE (TRAIN ROAD) ================== */}
        <div className="relative w-full h-8 sm:h-9.5 bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0f172a] border-t-2 border-slate-500 shadow-2xl flex items-center overflow-hidden">
          
          {/* 1. Ballast Stone Gravel Texture Layer */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:5px_5px]" />

          {/* 2. Real Railway Sleepers / Wooden Ties (Ties placed perpendicular across track) */}
          <div className="absolute inset-0 flex justify-between items-center px-1 opacity-70 pointer-events-none">
            {Array.from({ length: 90 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 sm:w-2 h-7 sm:h-8.5 bg-gradient-to-b from-[#475569] via-[#334155] to-[#1e293b] border-x border-[#0f172a] shadow-xs shrink-0 mx-[3px]"
              />
            ))}
          </div>

          {/* 3. Dual Gleaming Metallic Steel Rails (Top & Bottom Rails with Silver Light Gleam) */}
          <div className="absolute top-1.5 sm:top-2 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-slate-200 via-white to-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.9)] border-b border-slate-500/80" />
          <div className="absolute bottom-1.5 sm:bottom-2 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-slate-200 via-white to-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.9)] border-b border-slate-500/80" />

          {/* 4. HIGH-SPEED BULLET TRAIN (Running directly on the steel rails from Left to Right) */}
          <div className="absolute bottom-0.5 sm:bottom-1 left-0 animate-bullet-train pointer-events-auto">
            <div className="relative group/train cursor-pointer flex items-center">
              
              {/* Full Multi-Car Aerodynamic Bullet Train (Vande Bharat Express) */}
              <svg className="h-6 sm:h-8 w-72 sm:w-88 filter drop-shadow-[0_4px_14px_rgba(2,132,199,0.7)]" viewBox="0 0 320 32" fill="none">
                <defs>
                  <linearGradient id="vb-headlight" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Powerful High-Beam Forward Light Cone on the Rails */}
                <polygon points="320,22 380,16 380,28 320,24" fill="url(#vb-headlight)" />

                {/* Locomotive Aerodynamic Nose Engine */}
                <path
                  d="M320 23 C314 21 292 13 258 13 L190 13 L190 27 L300 27 C314 27 318 25 320 23 Z"
                  fill="#ffffff"
                  stroke="#0284c7"
                  strokeWidth="1.4"
                />
                {/* Windshield Cockpit Visor */}
                <path d="M308 21 C302 17 290 15 270 15 L260 15 L260 21 Z" fill="#0f172a" />
                {/* Vande Bharat Cobalt Blue Speed Livery */}
                <path d="M316 23 C300 23 265 19 190 19 L190 22 L300 25 Z" fill="#0284c7" />
                <path d="M260 26 L190 26 L190 27 L265 27 Z" fill="#f59e0b" />

                {/* Passenger Coach 1 (Executive Chair Car) */}
                <rect x="98" y="13" width="90" height="14" rx="1.5" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" />
                <rect x="98" y="19" width="90" height="3" fill="#0284c7" />
                {/* Coach 1 Illuminated Passenger Windows */}
                {[104, 118, 132, 146, 160, 174].map((x) => (
                  <rect key={x} x={x} y="15" width="10" height="3.5" rx="0.5" fill="#38bdf8" className="animate-pulse" />
                ))}
                <rect x="98" y="26" width="90" height="1" fill="#f59e0b" />

                {/* Passenger Coach 2 (AC 3-Tier) */}
                <rect x="4" y="13" width="92" height="14" rx="1.5" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" />
                <rect x="4" y="19" width="92" height="3" fill="#0284c7" />
                {/* Coach 2 Illuminated Windows */}
                {[10, 24, 38, 52, 66, 80].map((x) => (
                  <rect key={x} x={x} y="15" width="10" height="3.5" rx="0.5" fill="#38bdf8" />
                ))}
                <rect x="4" y="26" width="92" height="1" fill="#f59e0b" />

                {/* Heavy Steel Bogie Wheels Rolling on Rails */}
                {[20, 32, 72, 84, 114, 126, 166, 178, 206, 218].map((cx) => (
                  <g key={cx}>
                    <circle cx={cx} cy="27.5" r="2.8" fill="#1e293b" />
                    <circle cx={cx} cy="27.5" r="1.6" fill="#94a3b8" />
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950/95 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/train:opacity-100 transition-opacity duration-200 pointer-events-none border border-emerald-500/40 backdrop-blur-md">
                <span className="text-emerald-400">🚆 Vande Bharat Express</span> • Mumbai Central ➔ New Delhi (160 km/h) • On Time
              </div>
            </div>
          </div>
        </div>


        {/* ================== B. PROPER HIGHWAY ROUTE (BUS ROAD) ================== */}
        <div className="relative w-full h-8 sm:h-9.5 bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#1e293b] border-t-2 border-slate-700 shadow-xl flex items-center overflow-hidden">
          
          {/* 1. Asphalt Road Surface Texture */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:4px_4px]" />

          {/* 2. Crisp White Shoulder Lines */}
          <div className="absolute top-0.5 left-0 right-0 h-[2px] bg-white/90 shadow-xs" />
          <div className="absolute bottom-0.5 left-0 right-0 h-[2px] bg-white/90 shadow-xs" />

          {/* 3. Highway Dashed Yellow Lane Divider */}
          <div className="w-full h-0.5 border-b-2 border-dashed border-amber-400/90" />

          {/* 4. LUXURY COACH BUS (Cruising in the Highway Lane from Right to Left) */}
          <div className="absolute bottom-0.5 sm:bottom-1 right-0 animate-coach-bus pointer-events-auto">
            <div className="relative group/bus cursor-pointer flex items-center scale-x-[-1]">
              
              {/* Detailed Volvo 9600 Multi-Axle Sleeper Coach */}
              <svg className="h-6 sm:h-8 w-32 sm:w-40 filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]" viewBox="0 0 130 34" fill="none">
                <defs>
                  <linearGradient id="bus-light" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Forward Glowing Headlight Beams Casting Light on Highway */}
                <polygon points="126,24 175,18 175,30 126,27" fill="url(#bus-light)" />

                {/* Aerodynamic Luxury Bus Coach Body */}
                <path
                  d="M4 8 C12 8 116 8 120 10 C125 12 126 16 126 27 L2 27 C2 16 2.5 10 4 8 Z"
                  fill="#6d28d9"
                  stroke="#5b21b6"
                  strokeWidth="1.2"
                />

                {/* Roof Climate Control Unit */}
                <rect x="46" y="6" width="42" height="2.5" rx="1" fill="#4c1d95" />

                {/* Driver Cockpit Windshield */}
                <path d="M112 11 L124 14 L124 21 L112 21 Z" fill="#0f172a" />

                {/* Tinted Panoramic Passenger Sleeper Windows */}
                {[8, 26, 44, 62, 80].map((x) => (
                  <rect key={x} x={x} y="11" width="15" height="8" rx="1" fill="#38bdf8" opacity="0.95" />
                ))}
                <rect x="98" y="11" width="11" height="8" rx="1" fill="#38bdf8" opacity="0.95" />

                {/* Luxury Golden Livery Wave Accent */}
                <path d="M4 23 Q48 19 124 24 L124 26 Q48 21 4 25 Z" fill="#f59e0b" />

                {/* Chrome Alloy Wheels Rolling on Asphalt */}
                <g>
                  <circle cx="26" cy="27" r="4.5" fill="#0f172a" />
                  <circle cx="26" cy="27" r="2.5" fill="#e2e8f0" />
                  <circle cx="96" cy="27" r="4.5" fill="#0f172a" />
                  <circle cx="96" cy="27" r="2.5" fill="#e2e8f0" />
                  <circle cx="108" cy="27" r="4.5" fill="#0f172a" />
                  <circle cx="108" cy="27" r="2.5" fill="#e2e8f0" />
                </g>
              </svg>

              {/* Hover Tooltip (Unflipped) */}
              <div className="scale-x-[-1] absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950/95 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/bus:opacity-100 transition-opacity duration-200 pointer-events-none border border-purple-500/40 backdrop-blur-md">
                <span className="text-purple-400">🚌 IntrCity SmartBus</span> • Mumbai ➔ Pune Express • Volvo Multi-Axle
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
