'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Printer,
  Download,
  Plane,
  Building2,
  Bus,
  FileCheck2,
  ShieldCheck,
  Palmtree,
  Sparkles,
  QrCode,
  CheckCircle2
} from 'lucide-react';
import { UnifiedBooking } from '@/lib/types';

interface ETicketModalProps {
  booking: UnifiedBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ETicketModal({ booking, isOpen, onClose }: ETicketModalProps) {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const details = booking.details_json || {};

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 relative print:m-0 print:p-0 print:border-none print:shadow-none"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
      >
        
        {/* Top Controls */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <motion.span
              className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800"
              style={{ animation: 'pulse-slow 3s ease-in-out infinite' }}
            >
              Official Digital Travel Document
            </motion.span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition text-slate-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body (E-Ticket / Voucher) */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900">ORBINEX<span className="text-cyan-600">GLOBAL</span></span>
                <span className="text-xs text-slate-400 font-semibold">TRAVEL</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">IATA & Global Concierge Accredited Agency</p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                CONFIRMED & PAID
              </span>
              <p className="text-xs font-mono font-bold text-slate-700 mt-1">Ref: {booking.booking_reference}</p>
            </div>
          </div>

          {/* Document Title & Type */}
          <div className="bg-gradient-to-r from-slate-50 to-cyan-50/50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/80 px-2 py-0.5 rounded">
                  {booking.booking_type.toUpperCase()} CONFIRMATION
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">{booking.title}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{booking.summary}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Content based on Booking Type */}
          {booking.booking_type === 'flight' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Flight Number</span>
                <span className="font-bold text-slate-900 text-sm">{details.flight_number || 'EK-201'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Cabin Class</span>
                <span className="font-bold text-slate-900 text-sm capitalize">{details.cabin_class || 'Business'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Departure</span>
                <span className="font-bold text-slate-900 text-sm">{details.departure_time || '07:45 AM'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Arrival</span>
                <span className="font-bold text-slate-900 text-sm">{details.arrival_time || '12:15 PM'}</span>
              </div>
            </div>
          )}

          {booking.booking_type === 'hotel' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Hotel Name</span>
                <span className="font-bold text-slate-900">{details.hotel_name || 'Luxury Hotel'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Check-in / Check-out</span>
                <span className="font-bold text-slate-900">{details.check_in} to {details.check_out}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Room Type</span>
                <span className="font-bold text-slate-900">{details.room_name || 'Deluxe Room'}</span>
              </div>
            </div>
          )}

          {/* Primary Traveler & Contact Info */}
          <div className="border-t border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Lead Guest / Traveler</span>
              <span className="font-bold text-slate-900">{booking.contact_name}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Contact Email</span>
              <span className="font-medium text-slate-700">{booking.contact_email}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Amount Paid</span>
              <span className="font-black text-cyan-700 text-sm">{booking.currency} ${booking.final_amount}</span>
            </div>
          </div>

          {/* Barcode & Security QR Section */}
          <div className="border-t-2 border-dashed border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-900 rounded-xl p-1 flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.booking_reference}`}
                  alt="Security QR Code"
                  className="w-full h-full rounded"
                />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-900">Scan at Airport / Hotel Desk</p>
                <p className="text-[10px] text-slate-400 font-mono">HASH: SHA256-ORB-{booking.booking_reference}</p>
                <p className="text-[10px] text-slate-400">Issued by Orbinex Global Dispatcher</p>
              </div>
            </div>

            {/* Mock Flight Barcode */}
            <div className="flex flex-col items-center">
              <div className="font-mono text-xl tracking-[0.3em] font-black text-slate-800 scale-y-150 select-none">
                ||| | |||| || ||| |||| | ||
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1">{booking.booking_reference}</span>
            </div>
          </div>

        </div>

      </motion.div>
    </motion.div>
  );
}
