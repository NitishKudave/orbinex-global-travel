'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  User,
  Sparkles,
  ArrowRight,
  Printer,
  ShoppingBag,
  Clock,
  Plane,
  Building2,
  Bus,
  FileCheck2,
  Check
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { UnifiedBooking } from '@/lib/types';
import ETicketModal from '@/components/ETicketModal';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, savedTravelers } = useAuth();
  const {
    items,
    totalGross,
    discountAmount,
    totalNet,
    couponCode,
    clearCart,
    formatPrice,
    currency,
  } = useCart();

  // Contact Info
  const [contactName, setContactName] = useState(user?.first_name ? `${user.first_name} ${user.last_name}` : 'Alex Morgan');
  const [contactEmail, setContactEmail] = useState(user?.email || 'alex.morgan@example.com');
  const [contactPhone, setContactPhone] = useState(user?.phone_number || '+1 (555) 234-5678');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'apple_pay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<UnifiedBooking | null>(null);
  const [isETicketOpen, setIsETicketOpen] = useState(false);

  const autofillTraveler = (traveler: any) => {
    setContactName(`${traveler.first_name} ${traveler.last_name}`);
    if (traveler.email) setContactEmail(traveler.email);
    if (traveler.phone_number) setContactPhone(traveler.phone_number);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        items: items.map((it) => ({
          booking_type: it.booking_type,
          title: it.title,
          amount: it.amount,
          travel_date: it.travel_date || null,
          return_date: it.return_date || null,
          details: it.details || {},
        })),
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        currency,
        coupon_code: couponCode,
        discount_amount: discountAmount,
        payment_method: paymentMethod,
      };

      const res = await api.unifiedCheckout(payload);
      
      // Fire confetti celebration
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00A8FF', '#10B981', '#F59E0B', '#6366F1'],
      });

      const firstBk = res.bookings?.[0] || {
        booking_reference: res.primary_reference || `ORB-${Date.now().toString().slice(-6)}`,
        booking_type: items[0]?.booking_type || 'mixed',
        title: items[0]?.title || 'Unified Travel Booking',
        summary: `Multi-service checkout (${items.length} items)`,
        total_amount: totalGross,
        discount_amount: discountAmount,
        final_amount: totalNet,
        currency,
        status: 'confirmed',
        payment_status: 'paid',
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        details_json: items[0]?.details || {},
        created_at: new Date().toISOString(),
      };

      setConfirmedBooking(firstBk as any);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Payment simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 animate-fade-in">
            
            <div className="w-18 h-18 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Verified & Transaction Confirmed
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Booking Reference: {confirmedBooking.booking_reference}
              </h2>
              <p className="text-xs text-slate-500">
                A confirmation email & SMS with digital E-Tickets have been dispatched to <strong>{confirmedBooking.contact_email}</strong>
              </p>
            </div>

            {/* Booking Snapshot */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400 font-medium">Order Title</span>
                <span className="font-bold text-slate-900">{confirmedBooking.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400 font-medium">Primary Traveler</span>
                <span className="font-bold text-slate-900">{confirmedBooking.contact_name}</span>
              </div>
              <div className="flex justify-between pt-1 font-black text-slate-900 text-sm">
                <span>Total Amount Paid</span>
                <span className="text-cyan-700">{formatPrice(confirmedBooking.final_amount)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsETicketOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>View & Print E-Ticket</span>
              </button>

              <Link
                href="/dashboard?tab=bookings"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-cyan-600/20"
              >
                <span>Go to Customer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

        <ETicketModal
          booking={confirmedBooking}
          isOpen={isETicketOpen}
          onClose={() => setIsETicketOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Unified Payment & Checkout</h1>
            <p className="text-xs text-slate-500">Encrypted 256-bit SSL transaction for all mixed travel bookings.</p>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Lead Traveler & Payment Method */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Saved Traveler Autofill Banner */}
            {savedTravelers.length > 0 && (
              <div className="bg-cyan-50/70 p-4 rounded-3xl border border-cyan-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-900">
                  <Sparkles className="w-4 h-4 text-cyan-600" />
                  <span>1-Click Saved Traveler Autofill:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {savedTravelers.map((tr) => (
                    <button
                      key={tr.id || tr.first_name}
                      type="button"
                      onClick={() => autofillTraveler(tr)}
                      className="bg-white hover:bg-cyan-100/60 border border-cyan-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{tr.first_name} {tr.last_name} ({tr.passport_number || 'USA Pass'})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Contact Details */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Lead Contact Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Gateway Selection */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Payment Gateway</h3>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'apple_pay', label: 'Apple Pay / GPay', icon: ShieldCheck },
                  { id: 'upi', label: 'UPI / Net Banking', icon: Sparkles },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-2xl border transition text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === m.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${paymentMethod === m.id ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-[11px] font-bold">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Test Sandbox Card Active</span>
                    <span className="font-mono font-bold text-emerald-600">Auto-Authorized</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">CVC / CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-800">Scan QR via Google Pay / PhonePe / Paytm</p>
                  <div className="w-32 h-32 bg-white rounded-xl border border-slate-200 p-1 mx-auto flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=orbinex@bank"
                      alt="UPI QR Code"
                      className="w-full h-full rounded"
                    />
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">Booking Summary</h3>

            <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1">
              {items.map((it) => (
                <div key={it.id} className="pt-2 first:pt-0">
                  <div className="flex justify-between text-xs font-bold text-slate-900">
                    <span className="line-clamp-1">{it.title}</span>
                    <span>{formatPrice(it.amount)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 capitalize">{it.booking_type}</span>
                </div>
              ))}
            </div>

            {couponCode && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                <span className="font-bold">Coupon {couponCode}</span>
                <span className="font-bold">-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">{formatPrice(totalGross)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-3 flex justify-between text-lg font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-cyan-700">{formatPrice(totalNet)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-black text-xs py-4 rounded-xl shadow-lg shadow-cyan-600/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Authorizing Payment...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay {formatPrice(totalNet)} & Confirm Order</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe 256-Bit SSL Encrypted Payment</span>
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}
