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


      {/* ========================================================================= */}
      {/* 2. REALISTIC DUAL-TRACK RAILWAY CORRIDOR & HIGHWAY TRANSIT CORRIDOR        */}
      {/* ========================================================================= */}
      
      {/* Framed Infrastructure Corridor Container at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col justify-end shadow-[0_-6px_25px_rgba(0,0,0,0.5)]">
        
        {/* ========================================================================= */}
        {/* A. DUAL-TRACK RAILWAY ROUTE (TOP-VIEW HIGH-SPEED TRAINS CROSSING)         */}
        {/* ========================================================================= */}
        <div className="relative w-full bg-gradient-to-b from-[#1a2233] via-[#0f172a] to-[#070b12] border-t-2 border-slate-500/80 shadow-2xl py-1 overflow-hidden">
          
          {/* Ballast Gravel Texture */}
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:4px_4px]" />
          
          {/* ----------------- TRACK 1: UP LINE (TOP VIEW - EASTBOUND: LEFT TO RIGHT) ----------------- */}
          <div className="relative w-full h-7 sm:h-8 flex items-center overflow-hidden border-b border-slate-800/90">
            {/* Real Top-View Sleepers / Ties (Wooden/Concrete Ties running across track) */}
            <div className="absolute inset-0 flex justify-between items-center px-0.5 opacity-60 pointer-events-none">
              {Array.from({ length: 110 }).map((_, i) => (
                <div
                  key={`t1-tie-${i}`}
                  className="w-1.5 sm:w-2 h-5.5 sm:h-6.5 bg-gradient-to-b from-[#475569] via-[#334155] to-[#1e293b] border-x border-[#0b101b] shadow-xs shrink-0 mx-[2px]"
                />
              ))}
            </div>

            {/* Top Steel Rail for Track 1 */}
            <div className="absolute top-1 sm:top-1.5 left-0 right-0 h-[2.5px] bg-gradient-to-r from-slate-300 via-white to-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />
            {/* Bottom Steel Rail for Track 1 */}
            <div className="absolute bottom-1 sm:bottom-1.5 left-0 right-0 h-[2.5px] bg-gradient-to-r from-slate-300 via-white to-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />

            {/* TOP-VIEW TRAIN 1: Vande Bharat Express (Gliding Left to Right with 5 Linked Cars) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 animate-train-east pointer-events-auto z-10">
              <div className="relative group/train1 cursor-pointer flex items-center">
                
                {/* 5-Car Articulated High-Speed Bullet Train (TOP VIEW) */}
                <svg className="h-4.5 sm:h-5.5 w-[420px] sm:w-[500px] filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]" viewBox="0 0 500 20" fill="none">
                  <defs>
                    {/* Headlight Cone on Rails */}
                    <linearGradient id="vb-top-light" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Forward Twin Headlight Beams Casting Light on Rails Ahead */}
                  <polygon points="496,10 560,2 560,18 496,10" fill="url(#vb-top-light)" />

                  {/* CAR 1 (REAR CAB): Trailing Aerodynamic Nose with Red Tail Marker Lights */}
                  <g id="vb-rear">
                    <path d="M22 2 L85 2 L85 18 L22 18 C12 18 4 14 2 10 C4 6 12 2 22 2 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
                    {/* Center Speed Stripe */}
                    <rect x="4" y="8.5" width="81" height="3" fill="#0284c7" />
                    {/* Rear Red Marker Lights */}
                    <circle cx="4" cy="5" r="1.2" fill="#ef4444" />
                    <circle cx="4" cy="15" r="1.2" fill="#ef4444" />
                    {/* Roof HVAC Unit */}
                    <rect x="35" y="5.5" width="28" height="9" rx="2" fill="#e2e8f0" stroke="#0284c7" strokeWidth="0.8" />
                  </g>

                  {/* GANGWAY COUPLER 1 (Flexible Bellows) */}
                  <rect x="85" y="4" width="6" height="12" rx="1" fill="#0f172a" />
                  <line x1="88" y1="4" x2="88" y2="16" stroke="#475569" strokeWidth="1" />

                  {/* CAR 2 (PASSENGER COACH): Executive Chair Car */}
                  <g id="vb-coach1">
                    <rect x="91" y="2" width="90" height="16" rx="2" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
                    <rect x="91" y="8.5" width="90" height="3" fill="#0284c7" />
                    <rect x="91" y="12" width="90" height="0.8" fill="#f59e0b" />
                    {/* Roof AC Unit & Ventilation Grille */}
                    <rect x="120" y="5" width="32" height="10" rx="2" fill="#e2e8f0" stroke="#0284c7" strokeWidth="0.7" />
                    {[124, 130, 136, 142, 148].map((lx) => (
                      <line key={lx} x1={lx} y1="6.5" x2={lx} y2="13.5" stroke="#94a3b8" strokeWidth="0.8" />
                    ))}
                  </g>

                  {/* GANGWAY COUPLER 2 */}
                  <rect x="181" y="4" width="6" height="12" rx="1" fill="#0f172a" />
                  <line x1="184" y1="4" x2="184" y2="16" stroke="#475569" strokeWidth="1" />

                  {/* CAR 3 (PANTO COACH): Coach with High-Speed Pantograph on Roof */}
                  <g id="vb-coach2">
                    <rect x="187" y="2" width="90" height="16" rx="2" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
                    <rect x="187" y="8.5" width="90" height="3" fill="#0284c7" />
                    {/* Roof Pantograph (Diamond / Single-Arm Electric Collector) */}
                    <circle cx="232" cy="10" r="3.5" fill="#f59e0b" />
                    <line x1="225" y1="10" x2="239" y2="10" stroke="#0f172a" strokeWidth="1.2" />
                    <rect x="200" y="5" width="20" height="10" rx="1.5" fill="#e2e8f0" stroke="#0284c7" strokeWidth="0.7" />
                    <rect x="244" y="5" width="20" height="10" rx="1.5" fill="#e2e8f0" stroke="#0284c7" strokeWidth="0.7" />
                  </g>

                  {/* GANGWAY COUPLER 3 */}
                  <rect x="277" y="4" width="6" height="12" rx="1" fill="#0f172a" />
                  <line x1="280" y1="4" x2="280" y2="16" stroke="#475569" strokeWidth="1" />

                  {/* CAR 4 (PASSENGER COACH 3) */}
                  <g id="vb-coach3">
                    <rect x="283" y="2" width="90" height="16" rx="2" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
                    <rect x="283" y="8.5" width="90" height="3" fill="#0284c7" />
                    <rect x="283" y="12" width="90" height="0.8" fill="#f59e0b" />
                    <rect x="312" y="5" width="32" height="10" rx="2" fill="#e2e8f0" stroke="#0284c7" strokeWidth="0.7" />
                  </g>

                  {/* GANGWAY COUPLER 4 */}
                  <rect x="373" y="4" width="6" height="12" rx="1" fill="#0f172a" />
                  <line x1="376" y1="4" x2="376" y2="16" stroke="#475569" strokeWidth="1" />

                  {/* CAR 5 (LEAD LOCOMOTIVE): Aerodynamic Bullet Nose Facing Forward (Right) */}
                  <g id="vb-lead">
                    <path d="M379 2 L450 2 C475 2 494 6 498 10 C494 14 475 18 450 18 L379 18 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" />
                    {/* Blue Speed Livery Wave */}
                    <path d="M379 8.5 L460 8.5 C480 8.5 492 9.5 496 10 C492 10.5 480 11.5 460 11.5 L379 11.5 Z" fill="#0284c7" />
                    {/* Cockpit Visor Glass (Top Curved Window) */}
                    <path d="M465 5 C478 6 486 8 488 10 C486 12 478 14 465 15 Z" fill="#0f172a" />
                    {/* Twin Forward Glowing Headlights */}
                    <circle cx="494" cy="6.5" r="1.5" fill="#fef08a" />
                    <circle cx="494" cy="13.5" r="1.5" fill="#fef08a" />
                    {/* Roof AC Fairing */}
                    <rect x="400" y="5" width="35" height="10" rx="2" fill="#e2e8f0" stroke="#0284c7" strokeWidth="0.8" />
                  </g>
                </svg>

                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950/95 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/train1:opacity-100 transition-opacity duration-200 pointer-events-none border border-sky-500/40 backdrop-blur-md">
                  <span className="text-sky-400">🚆 Vande Bharat Express 20608</span> • Mumbai ➔ New Delhi (160 km/h) • Up Line
                </div>
              </div>
            </div>
          </div>

          {/* ----------------- TRACK 2: DOWN LINE (TOP VIEW - WESTBOUND: RIGHT TO LEFT) ----------------- */}
          <div className="relative w-full h-7 sm:h-8 flex items-center overflow-hidden">
            {/* Sleepers for Track 2 */}
            <div className="absolute inset-0 flex justify-between items-center px-0.5 opacity-60 pointer-events-none">
              {Array.from({ length: 110 }).map((_, i) => (
                <div
                  key={`t2-tie-${i}`}
                  className="w-1.5 sm:w-2 h-5.5 sm:h-6.5 bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0f172a] border-x border-[#0b101b] shadow-xs shrink-0 mx-[2px]"
                />
              ))}
            </div>

            {/* Top Steel Rail for Track 2 */}
            <div className="absolute top-1 sm:top-1.5 left-0 right-0 h-[2.5px] bg-gradient-to-r from-slate-300 via-white to-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />
            {/* Bottom Steel Rail for Track 2 */}
            <div className="absolute bottom-1 sm:bottom-1.5 left-0 right-0 h-[2.5px] bg-gradient-to-r from-slate-300 via-white to-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />

            {/* TOP-VIEW TRAIN 2: Tejas / Orange Express (Gliding Right to Left, CROSSING Train 1!) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 animate-train-west pointer-events-auto z-20">
              <div className="relative group/train2 cursor-pointer flex items-center scale-x-[-1]">
                
                {/* 5-Car Articulated Saffron Bullet Train (TOP VIEW) */}
                <svg className="h-4.5 sm:h-5.5 w-[420px] sm:w-[500px] filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]" viewBox="0 0 500 20" fill="none">
                  <defs>
                    <linearGradient id="tejas-top-light" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Golden Headlight Cone on Track 2 */}
                  <polygon points="496,10 560,2 560,18 496,10" fill="url(#tejas-top-light)" />

                  {/* CAR 1 (REAR CAB): Trailing Aerodynamic Nose */}
                  <g id="tejas-rear">
                    <path d="M22 2 L85 2 L85 18 L22 18 C12 18 4 14 2 10 C4 6 12 2 22 2 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                    <rect x="4" y="8.5" width="81" height="3" fill="#f59e0b" />
                    <circle cx="4" cy="5" r="1.2" fill="#ef4444" />
                    <circle cx="4" cy="15" r="1.2" fill="#ef4444" />
                    <rect x="35" y="5.5" width="28" height="9" rx="2" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.8" />
                  </g>

                  {/* GANGWAY COUPLER 1 */}
                  <rect x="85" y="4" width="6" height="12" rx="1" fill="#020617" />
                  <line x1="88" y1="4" x2="88" y2="16" stroke="#f59e0b" strokeWidth="0.8" />

                  {/* CAR 2 (PASSENGER COACH 1) */}
                  <g id="tejas-coach1">
                    <rect x="91" y="2" width="90" height="16" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                    <rect x="91" y="8.5" width="90" height="3" fill="#f59e0b" />
                    <rect x="91" y="12" width="90" height="0.8" fill="#ef4444" />
                    <rect x="120" y="5" width="32" height="10" rx="2" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.7" />
                  </g>

                  {/* GANGWAY COUPLER 2 */}
                  <rect x="181" y="4" width="6" height="12" rx="1" fill="#020617" />
                  <line x1="184" y1="4" x2="184" y2="16" stroke="#f59e0b" strokeWidth="0.8" />

                  {/* CAR 3 (PANTO COACH) */}
                  <g id="tejas-coach2">
                    <rect x="187" y="2" width="90" height="16" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                    <rect x="187" y="8.5" width="90" height="3" fill="#f59e0b" />
                    <circle cx="232" cy="10" r="3.5" fill="#f59e0b" />
                    <line x1="225" y1="10" x2="239" y2="10" stroke="#ffffff" strokeWidth="1.2" />
                    <rect x="200" y="5" width="20" height="10" rx="1.5" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.7" />
                    <rect x="244" y="5" width="20" height="10" rx="1.5" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.7" />
                  </g>

                  {/* GANGWAY COUPLER 3 */}
                  <rect x="277" y="4" width="6" height="12" rx="1" fill="#020617" />
                  <line x1="280" y1="4" x2="280" y2="16" stroke="#f59e0b" strokeWidth="0.8" />

                  {/* CAR 4 (PASSENGER COACH 3) */}
                  <g id="tejas-coach3">
                    <rect x="283" y="2" width="90" height="16" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                    <rect x="283" y="8.5" width="90" height="3" fill="#f59e0b" />
                    <rect x="312" y="5" width="32" height="10" rx="2" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.7" />
                  </g>

                  {/* GANGWAY COUPLER 4 */}
                  <rect x="373" y="4" width="6" height="12" rx="1" fill="#020617" />
                  <line x1="376" y1="4" x2="376" y2="16" stroke="#f59e0b" strokeWidth="0.8" />

                  {/* CAR 5 (LEAD LOCOMOTIVE): Aerodynamic Saffron Nose */}
                  <g id="tejas-lead">
                    <path d="M379 2 L450 2 C475 2 494 6 498 10 C494 14 475 18 450 18 L379 18 Z" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.2" />
                    <path d="M379 8.5 L460 8.5 C480 8.5 492 9.5 496 10 C492 10.5 480 11.5 460 11.5 L379 11.5 Z" fill="#f59e0b" />
                    <path d="M465 5 C478 6 486 8 488 10 C486 12 478 14 465 15 Z" fill="#0284c7" />
                    <circle cx="494" cy="6.5" r="1.5" fill="#fef08a" />
                    <circle cx="494" cy="13.5" r="1.5" fill="#fef08a" />
                    <rect x="400" y="5" width="35" height="10" rx="2" fill="#0f172a" stroke="#f59e0b" strokeWidth="0.8" />
                  </g>
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
        {/* B. PROPER HIGHWAY CORRIDOR (AUTHENTIC SIDE-VIEW LUXURY BUSES)             */}
        {/* ========================================================================= */}
        <div className="relative w-full h-10 sm:h-12 bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#090d16] border-t-2 border-slate-600/90 shadow-2xl flex items-center overflow-hidden">
          
          {/* Asphalt Road Bitumen Texture */}
          <div className="absolute inset-0 opacity-35 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:4px_4px]" />

          {/* Crisp White Shoulder Lines */}
          <div className="absolute top-1 left-0 right-0 h-[2px] bg-white/85 shadow-xs" />
          <div className="absolute bottom-1 left-0 right-0 h-[2px] bg-white/95 shadow-xs" />

          {/* Highway Dashed Yellow Center Lane Divider */}
          <div className="w-full h-0.5 border-b-2 border-dashed border-amber-400/90 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />

          {/* SIDE-VIEW BUS 1: VOLVO 9600 MULTI-AXLE (Westbound: Right to Left, Facing Left) */}
          <div className="absolute bottom-1 sm:bottom-1.5 left-0 animate-bus-west pointer-events-auto z-10">
            <div className="relative group/bus1 cursor-pointer flex items-center scale-x-[-1]">
              
              {/* Detailed Side-View Volvo Luxury Sleeper Coach */}
              <svg className="h-7 sm:h-8.5 w-34 sm:w-42 filter drop-shadow-[0_4px_12px_rgba(109,40,217,0.75)]" viewBox="0 0 140 34" fill="none">
                <defs>
                  <linearGradient id="b1-side-beam" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Forward Glowing Headlight Beams Casting Light on Asphalt Ahead */}
                <polygon points="136,24 195,16 195,33 136,28" fill="url(#b1-side-beam)" />

                {/* Aerodynamic Luxury Coach Body */}
                <path
                  d="M4 8 C14 8 124 8 129 10 C135 12 136 16 136 27 L2 27 C2 15 3 10 4 8 Z"
                  fill="#6d28d9"
                  stroke="#5b21b6"
                  strokeWidth="1.2"
                />

                {/* Roof Climate Control Unit */}
                <rect x="50" y="6" width="46" height="2.5" rx="1" fill="#4c1d95" />

                {/* Windshield Cockpit Visor & Driver Window */}
                <path d="M120 10 L134 14 L134 20 L120 20 Z" fill="#0f172a" />
                {/* Driver Door Frame */}
                <line x1="120" y1="10" x2="120" y2="27" stroke="#4c1d95" strokeWidth="0.8" />

                {/* Tinted Panoramic Passenger Sleeper Windows (Upper & Lower Row Look) */}
                {[8, 26, 44, 62, 80, 98].map((x) => (
                  <g key={x}>
                    <rect x={x} y="10" width="16" height="4.2" rx="0.8" fill="#38bdf8" opacity="0.95" />
                    <rect x={x} y="15.2" width="16" height="4.5" rx="0.8" fill="#38bdf8" opacity="0.9" />
                  </g>
                ))}

                {/* Luxury Golden Livery Wave Accent Running Across Side */}
                <path d="M4 22 Q52 17 134 23 L134 25 Q52 19 4 24 Z" fill="#f59e0b" />
                <path d="M10 24 Q60 21 130 25 L130 25.8 Q60 22 10 25 Z" fill="#fde047" />

                {/* Rear Vertical LED Taillight Cluster */}
                <rect x="2" y="14" width="2" height="8" rx="0.5" fill="#ef4444" />

                {/* Chrome Alloy Wheels Rolling on the Road (Multi-Axle: 1 Front + 2 Rear) */}
                <g id="volvo-wheels">
                  {/* Front Steering Axle */}
                  <circle cx="28" cy="27" r="4.8" fill="#0f172a" />
                  <circle cx="28" cy="27" r="2.8" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
                  <circle cx="28" cy="27" r="1.2" fill="#0f172a" />

                  {/* Rear Drive Axle */}
                  <circle cx="104" cy="27" r="4.8" fill="#0f172a" />
                  <circle cx="104" cy="27" r="2.8" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
                  <circle cx="104" cy="27" r="1.2" fill="#0f172a" />

                  {/* Rear Tag Axle (Volvo Multi-Axle Signature) */}
                  <circle cx="117" cy="27" r="4.8" fill="#0f172a" />
                  <circle cx="117" cy="27" r="2.8" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
                  <circle cx="117" cy="27" r="1.2" fill="#0f172a" />
                </g>
              </svg>

              {/* Hover Tooltip */}
              <div className="scale-x-[-1] absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950/95 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/bus1:opacity-100 transition-opacity duration-200 pointer-events-none border border-purple-500/40 backdrop-blur-md">
                <span className="text-purple-400">🚌 IntrCity SmartBus</span> • Mumbai ➔ Pune Express • Volvo 9600 Multi-Axle
              </div>
            </div>
          </div>

          {/* SIDE-VIEW BUS 2: MERCEDES TOURIST COACH (Eastbound: Left to Right, Facing Right) */}
          <div className="absolute bottom-1 sm:bottom-1.5 left-0 animate-bus-east pointer-events-auto z-10">
            <div className="relative group/bus2 cursor-pointer flex items-center">
              
              {/* Detailed Side-View Mercedes Tourist Coach */}
              <svg className="h-7 sm:h-8.5 w-34 sm:w-42 filter drop-shadow-[0_4px_12px_rgba(16,185,129,0.75)]" viewBox="0 0 140 34" fill="none">
                <defs>
                  <linearGradient id="b2-side-beam" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Forward Glowing Headlight Beams */}
                <polygon points="136,24 195,16 195,33 136,28" fill="url(#b2-side-beam)" />

                {/* Emerald Green Luxury Coach Body */}
                <path
                  d="M4 8 C14 8 124 8 129 10 C135 12 136 16 136 27 L2 27 C2 15 3 10 4 8 Z"
                  fill="#059669"
                  stroke="#047857"
                  strokeWidth="1.2"
                />

                {/* AC Unit */}
                <rect x="50" y="6" width="46" height="2.5" rx="1" fill="#065f46" />

                {/* Windshield */}
                <path d="M120 10 L134 14 L134 20 L120 20 Z" fill="#0f172a" />

                {/* Panoramic Tinted Passenger Windows */}
                {[8, 26, 44, 62, 80, 98].map((x) => (
                  <g key={x}>
                    <rect x={x} y="10" width="16" height="4.2" rx="0.8" fill="#6ee7b7" opacity="0.95" />
                    <rect x={x} y="15.2" width="16" height="4.5" rx="0.8" fill="#6ee7b7" opacity="0.9" />
                  </g>
                ))}

                {/* Silver & White Livery Wave */}
                <path d="M4 22 Q52 17 134 23 L134 25 Q52 19 4 24 Z" fill="#ffffff" />
                <path d="M10 24 Q60 21 130 25 L130 25.8 Q60 22 10 25 Z" fill="#e2e8f0" />

                {/* Rear Taillights */}
                <rect x="2" y="14" width="2" height="8" rx="0.5" fill="#ef4444" />

                {/* Chrome Wheels Rolling on Road */}
                <g id="merc-wheels">
                  <circle cx="28" cy="27" r="4.8" fill="#0f172a" />
                  <circle cx="28" cy="27" r="2.8" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
                  <circle cx="28" cy="27" r="1.2" fill="#0f172a" />

                  <circle cx="104" cy="27" r="4.8" fill="#0f172a" />
                  <circle cx="104" cy="27" r="2.8" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
                  <circle cx="104" cy="27" r="1.2" fill="#0f172a" />

                  <circle cx="117" cy="27" r="4.8" fill="#0f172a" />
                  <circle cx="117" cy="27" r="2.8" fill="#e2e8f0" stroke="#64748b" strokeWidth="0.8" />
                  <circle cx="117" cy="27" r="1.2" fill="#0f172a" />
                </g>
              </svg>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-950/95 text-white text-[11px] font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover/bus2:opacity-100 transition-opacity duration-200 pointer-events-none border border-emerald-500/40 backdrop-blur-md">
                <span className="text-emerald-400">🚌 Zingbus Luxury Lounge</span> • Delhi ➔ Manali • Mercedes Multi-Axle
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
