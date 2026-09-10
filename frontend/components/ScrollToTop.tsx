'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollTop > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (docHeight > 0) {
        const progress = (scrollTop / docHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Circle radius and circumference for SVG progress ring
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-7 right-7 z-40 transition-all duration-300 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-950 text-amber-400 hover:text-amber-300 border border-amber-400/40 hover:border-amber-400 shadow-2xl shadow-slate-950/40 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
      >
        {/* SVG Circular Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
          viewBox="0 0 52 52"
        >
          {/* Background Track */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            className="stroke-slate-700/50"
            strokeWidth="2.5"
            fill="transparent"
          />
          {/* Dynamic Progress Indicator */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            className="stroke-amber-400"
            strokeWidth="2.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 150ms ease-out',
            }}
          />
        </svg>

        {/* Center Arrow Icon */}
        <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />

        {/* Hover Tooltip */}
        <span className="absolute bottom-full mb-2 px-2.5 py-1 text-xs font-medium text-white bg-slate-900/95 border border-slate-700/80 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Back to Top ({Math.round(scrollProgress)}%)
        </span>
      </button>
    </div>
  );
}
