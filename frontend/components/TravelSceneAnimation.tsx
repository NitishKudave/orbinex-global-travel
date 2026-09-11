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
      
      {/* Flight 1: Commercial Boeing 787 Dreamliner (Eastbound - Soaring Across Sky) */}
      <div className="absolute top-[4%] sm:top-[6%] left-0 w-full animate-flight-east pointer-events-auto">
        <div className="relative flex items-center">
          {/* Dual White Jet Engine Vapor Contrails (Expanding Smoke Trail) */}
          <div className="relative flex flex-col gap-1 mr-[-8px]">
            <div className="h-[3px] w-64 sm:w-96 bg-gradient-to-l from-white via-white/70 to-transparent rounded-full blur-[0.4px] opacity-95 shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
            <div className="h-[3px] w-56 sm:w-80 bg-gradient-to-l from-white via-white/55 to-transparent rounded-full blur-[0.4px] opacity-85" />
          </div>

          {/* Large, Detailed Commercial Airliner Vector Graphic */}
          <div className="relative group/plane cursor-pointer transform rotate-[3deg]">
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
              <span className="text-sky-400">✈️ Air India B787 Dreamliner</span> • Mumbai (BOM) ➔ London (LHR) • 38,000 ft
            </div>
          </div>
        </div>
      </div>

      {/* Flight 2: High-Altitude Airbus A350 (Westbound - Stratosphere Cruiser) */}
      <div className="absolute top-[1.5%] sm:top-[2%] right-0 w-full animate-flight-west pointer-events-auto">
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
      {/* 2. REALISTIC DUAL-TRACK RAILWAY CORRIDOR & HIGHWAY TRANSIT CORRIDOR        */}
      {/* ========================================================================= */}
      
      {/* Framed Infrastructure Corridor Container at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col justify-end shadow-[0_-6px_25px_rgba(0,0,0,0.4)]">
        
        {/* ========================================================================= */}
        {/* A. DUAL-TRACK RAILWAY ROUTE (UP LINE + DOWN LINE WITH CROSSING TRAINS)    */}
        {/* ========================================================================= */}
        <div className="relative w-full bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#090d16] border-t-2 border-slate-600/80 shadow-2xl py-1 overflow-hidden">
          
          {/* 1. Ballast Stone Gravel Texture Layer */}
          <div className="absolute inset-0 opacity-45 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:4px_4px]" />
          
          {/* Overhead Catenary Electric Wire Indicator */}
          <div className="absolute top-0.5 left-0 right-0 h-[1px] bg-sky-400/30 shadow-[0_0_6px_rgba(56,189,248,0.4)]" />

          {/* ----------------- TRACK 1: UP LINE (EASTBOUND: LEFT TO RIGHT) ----------------- */}
          <div className="relative w-full h-6 sm:h-7 flex items-center overflow-hidden border-b border-slate-800/80">
            {/* Perpendicular Sleepers / Concrete Ties */}
            <div className="absolute inset-0 flex justify-between items-center px-0.5 opacity-65 pointer-events-none">
              {Array.from({ length: 95 }).map((_, i) => (
                <div
                  key={`t1-${i}`}
                  className="w-1.5 sm:w-2 h-5 sm:h-6 bg-gradient-to-b from-[#475569] via-[#334155] to-[#1e293b] border-x border-[#0f172a] shadow-xs shrink-0 mx-[2.5px]"
                />
              ))}
            </div>

            {/* Gleaming Steel Rails for Track 1 */}
            <div className="absolute top-1 left-0 right-0 h-[2px] bg-gradient-to-r from-slate-200 via-white to-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            <div className="absolute bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-slate-200 via-white to-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />

            {/* TRAIN 1: Vande Bharat Express (Gliding Left to Right) */}
            <div className="absolute bottom-0 left-0 animate-train-east pointer-events-auto z-10">
              <div className="relative group/train1 cursor-pointer flex items-center">
                {/* Full Aerodynamic Train Vector */}
                <svg className="h-5.5 sm:h-6.5 w-68 sm:w-80 filter drop-shadow-[0_3px_10px_rgba(2,132,199,0.8)]" viewBox="0 0 300 28" fill="none">
                  <defs>
                    <linearGradient id="t1-light" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Powerful Front Headlight Beam */}
                  <polygon points="300,19 360,13 360,25 300,21" fill="url(#t1-light)" />

                  {/* Vande Bharat Aerodynamic Locomotive Engine */}
                  <path
                    d="M300 20 C294 18 274 11 242 11 L180 11 L180 24 L282 24 C294 24 298 22 300 20 Z"
                    fill="#ffffff"
                    stroke="#0284c7"
                    strokeWidth="1.2"
                  />
                  {/* Cockpit Visor */}
                  <path d="M288 18 C282 14 272 13 254 13 L246 13 L246 18 Z" fill="#0f172a" />
                  {/* Blue Speed Stripe */}
                  <path d="M296 20 C282 20 250 17 180 17 L180 19 L282 22 Z" fill="#0284c7" />
                  <path d="M246 23 L180 23 L180 24 L250 24 Z" fill="#f59e0b" />

                  {/* Passenger Coach 1 */}
                  <rect x="92" y="11" width="84" height="13" rx="1.5" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
                  <rect x="92" y="16" width="84" height="2.5" fill="#0284c7" />
                  {[98, 110, 122, 134, 146, 158].map((x) => (
                    <rect key={x} x={x} y="13" width="9" height="3" rx="0.5" fill="#38bdf8" className="animate-pulse" />
                  ))}

                  {/* Passenger Coach 2 */}
                  <rect x="4" y="11" width="84" height="13" rx="1.5" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
                  <rect x="4" y="16" width="84" height="2.5" fill="#0284c7" />
                  {[10, 22, 34, 46, 58, 70].map((x) => (
                    <rect key={x} x={x} y="13" width="9" height="3" rx="0.5" fill="#38bdf8" />
                  ))}

                  {/* Rolling Steel Bogie Wheels */}
                  {[16, 26, 62, 72, 104, 114, 150, 160, 194, 204].map((cx) => (
                    <g key={cx}>
                      <circle cx={cx} cy="24.5" r="2.5" fill="#1e293b" />
                      <circle cx={cx} cy="24.5" r="1.4" fill="#cbd5e1" />
                    </g>
                  ))}
                </svg>

                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950/95 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/train1:opacity-100 transition-opacity duration-200 pointer-events-none border border-sky-500/40 backdrop-blur-md">
                  <span className="text-sky-400">🚆 Vande Bharat Express 20608</span> • Mumbai ➔ New Delhi (160 km/h) • Up Line
                </div>
              </div>
            </div>
          </div>

          {/* ----------------- TRACK 2: DOWN LINE (WESTBOUND: RIGHT TO LEFT) ----------------- */}
          <div className="relative w-full h-6 sm:h-7 flex items-center overflow-hidden">
            {/* Perpendicular Sleepers for Track 2 */}
            <div className="absolute inset-0 flex justify-between items-center px-0.5 opacity-65 pointer-events-none">
              {Array.from({ length: 95 }).map((_, i) => (
                <div
                  key={`t2-${i}`}
                  className="w-1.5 sm:w-2 h-5 sm:h-6 bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0f172a] border-x border-[#0f172a] shadow-xs shrink-0 mx-[2.5px]"
                />
              ))}
            </div>

            {/* Gleaming Steel Rails for Track 2 */}
            <div className="absolute top-1 left-0 right-0 h-[2px] bg-gradient-to-r from-slate-200 via-white to-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            <div className="absolute bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-slate-200 via-white to-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />

            {/* TRAIN 2: Tejas / Orange Express (Gliding Right to Left, CROSSING Train 1!) */}
            <div className="absolute bottom-0 left-0 animate-train-west pointer-events-auto z-20">
              <div className="relative group/train2 cursor-pointer flex items-center scale-x-[-1]">
                {/* Full Aerodynamic Train Vector Facing Left (flipped) */}
                <svg className="h-5.5 sm:h-6.5 w-68 sm:w-80 filter drop-shadow-[0_3px_12px_rgba(245,158,11,0.85)]" viewBox="0 0 300 28" fill="none">
                  <defs>
                    <linearGradient id="t2-light" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Front Golden Headlight Beam */}
                  <polygon points="300,19 360,13 360,25 300,21" fill="url(#t2-light)" />

                  {/* Saffron & Charcoal Modern Bullet Train Livery */}
                  <path
                    d="M300 20 C294 18 274 11 242 11 L180 11 L180 24 L282 24 C294 24 298 22 300 20 Z"
                    fill="#1e293b"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                  />
                  {/* Cockpit Visor */}
                  <path d="M288 18 C282 14 272 13 254 13 L246 13 L246 18 Z" fill="#0284c7" />
                  {/* Saffron Speed Stripe */}
                  <path d="M296 20 C282 20 250 17 180 17 L180 19 L282 22 Z" fill="#f59e0b" />
                  <path d="M246 23 L180 23 L180 24 L250 24 Z" fill="#ef4444" />

                  {/* Passenger Coach 1 */}
                  <rect x="92" y="11" width="84" height="13" rx="1.5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                  <rect x="92" y="16" width="84" height="2.5" fill="#f59e0b" />
                  {[98, 110, 122, 134, 146, 158].map((x) => (
                    <rect key={x} x={x} y="13" width="9" height="3" rx="0.5" fill="#fef08a" className="animate-pulse" />
                  ))}

                  {/* Passenger Coach 2 */}
                  <rect x="4" y="11" width="84" height="13" rx="1.5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                  <rect x="4" y="16" width="84" height="2.5" fill="#f59e0b" />
                  {[10, 22, 34, 46, 58, 70].map((x) => (
                    <rect key={x} x={x} y="13" width="9" height="3" rx="0.5" fill="#fef08a" />
                  ))}

                  {/* Rolling Steel Bogie Wheels */}
                  {[16, 26, 62, 72, 104, 114, 150, 160, 194, 204].map((cx) => (
                    <g key={cx}>
                      <circle cx={cx} cy="24.5" r="2.5" fill="#0f172a" />
                      <circle cx={cx} cy="24.5" r="1.4" fill="#f59e0b" />
                    </g>
                  ))}
                </svg>

                {/* Hover Tooltip (Unflipped) */}
                <div className="scale-x-[-1] absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950/95 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/train2:opacity-100 transition-opacity duration-200 pointer-events-none border border-amber-500/40 backdrop-blur-md">
                  <span className="text-amber-400">🚄 Tejas Superfast Express 82902</span> • Ahmedabad ➔ Mumbai (160 km/h) • Down Line
                </div>
              </div>
            </div>
          </div>

        </div>


        {/* ========================================================================= */}
        {/* B. PROPER DUAL-LANE HIGHWAY CORRIDOR (CRUISING BUSES BOTH DIRECTIONS)     */}
        {/* ========================================================================= */}
        <div className="relative w-full h-8 sm:h-9 bg-gradient-to-b from-[#111827] via-[#0b0f19] to-[#111827] border-t-2 border-slate-700 shadow-2xl flex items-center overflow-hidden">
          
          {/* 1. Asphalt Road Bitumen Texture */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:4px_4px]" />

          {/* 2. Crisp White Shoulder Boundary Lines */}
          <div className="absolute top-0.5 left-0 right-0 h-[2px] bg-white/90 shadow-xs" />
          <div className="absolute bottom-0.5 left-0 right-0 h-[2px] bg-white/90 shadow-xs" />

          {/* 3. Highway Dashed Yellow Center Divider */}
          <div className="w-full h-0.5 border-b-2 border-dashed border-amber-400/90 shadow-[0_0_4px_rgba(251,191,36,0.5)]" />

          {/* 4. BUS 1: VOLVO 9600 MULTI-AXLE (Westbound: Right to Left in Upper Lane) */}
          <div className="absolute top-0.5 left-0 animate-bus-west pointer-events-auto z-10">
            <div className="relative group/bus1 cursor-pointer flex items-center scale-x-[-1]">
              <svg className="h-5 sm:h-6 w-28 sm:w-34 filter drop-shadow-[0_4px_12px_rgba(109,40,217,0.7)]" viewBox="0 0 130 30" fill="none">
                <defs>
                  <linearGradient id="b1-beam" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Headlight Forward Beam */}
                <polygon points="126,20 170,14 170,26 126,23" fill="url(#b1-beam)" />

                {/* Aerodynamic Body */}
                <path
                  d="M4 6 C12 6 116 6 120 8 C125 10 126 14 126 24 L2 24 C2 14 2.5 8 4 6 Z"
                  fill="#6d28d9"
                  stroke="#5b21b6"
                  strokeWidth="1"
                />
                {/* AC Roof */}
                <rect x="46" y="4" width="40" height="2" rx="1" fill="#4c1d95" />
                {/* Windshield */}
                <path d="M112 9 L124 12 L124 18 L112 18 Z" fill="#0f172a" />
                {/* Tinted Sleeper Windows */}
                {[8, 26, 44, 62, 80].map((x) => (
                  <rect key={x} x={x} y="9" width="15" height="7" rx="1" fill="#38bdf8" opacity="0.95" />
                ))}
                <rect x="98" y="9" width="11" height="7" rx="1" fill="#38bdf8" opacity="0.95" />
                {/* Gold Livery Wave */}
                <path d="M4 20 Q48 16 124 21 L124 23 Q48 18 4 22 Z" fill="#f59e0b" />
                {/* Wheels */}
                <circle cx="26" cy="24" r="3.8" fill="#0f172a" />
                <circle cx="26" cy="24" r="2" fill="#e2e8f0" />
                <circle cx="96" cy="24" r="3.8" fill="#0f172a" />
                <circle cx="96" cy="24" r="2" fill="#e2e8f0" />
                <circle cx="108" cy="24" r="3.8" fill="#0f172a" />
                <circle cx="108" cy="24" r="2" fill="#e2e8f0" />
              </svg>

              {/* Hover Tooltip */}
              <div className="scale-x-[-1] absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950/95 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/bus1:opacity-100 transition-opacity duration-200 pointer-events-none border border-purple-500/40 backdrop-blur-md">
                <span className="text-purple-400">🚌 IntrCity SmartBus</span> • Mumbai ➔ Pune Express • Volvo 9600
              </div>
            </div>
          </div>

          {/* 5. BUS 2: MERCEDES TOURIST COACH (Eastbound: Left to Right in Lower Lane) */}
          <div className="absolute bottom-0.5 left-0 animate-bus-east pointer-events-auto z-10">
            <div className="relative group/bus2 cursor-pointer flex items-center">
              <svg className="h-5 sm:h-6 w-28 sm:w-34 filter drop-shadow-[0_4px_12px_rgba(16,185,129,0.7)]" viewBox="0 0 130 30" fill="none">
                <defs>
                  <linearGradient id="b2-beam" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Headlight Forward Beam */}
                <polygon points="126,20 170,14 170,26 126,23" fill="url(#b2-beam)" />

                {/* Emerald & Silver Luxury Coach Body */}
                <path
                  d="M4 6 C12 6 116 6 120 8 C125 10 126 14 126 24 L2 24 C2 14 2.5 8 4 6 Z"
                  fill="#059669"
                  stroke="#047857"
                  strokeWidth="1"
                />
                <rect x="46" y="4" width="40" height="2" rx="1" fill="#065f46" />
                <path d="M112 9 L124 12 L124 18 L112 18 Z" fill="#0f172a" />
                {[8, 26, 44, 62, 80].map((x) => (
                  <rect key={x} x={x} y="9" width="15" height="7" rx="1" fill="#6ee7b7" opacity="0.9" />
                ))}
                <rect x="98" y="9" width="11" height="7" rx="1" fill="#6ee7b7" opacity="0.9" />
                <path d="M4 20 Q48 16 124 21 L124 23 Q48 18 4 22 Z" fill="#ffffff" />
                <circle cx="26" cy="24" r="3.8" fill="#0f172a" />
                <circle cx="26" cy="24" r="2" fill="#e2e8f0" />
                <circle cx="96" cy="24" r="3.8" fill="#0f172a" />
                <circle cx="96" cy="24" r="2" fill="#e2e8f0" />
                <circle cx="108" cy="24" r="3.8" fill="#0f172a" />
                <circle cx="108" cy="24" r="2" fill="#e2e8f0" />
              </svg>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950/95 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/bus2:opacity-100 transition-opacity duration-200 pointer-events-none border border-emerald-500/40 backdrop-blur-md">
                <span className="text-emerald-400">🚌 Zingbus Luxury Lounge</span> • Delhi ➔ Manali • Mercedes Coach
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
