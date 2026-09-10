'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Plane,
  Building2,
  Bus,
  FileCheck2,
  ShieldCheck,
  Palmtree,
  Sparkles,
  Calendar,
  Clock,
  Printer,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  Download,
  CreditCard,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import { UnifiedBooking, SavedTraveler } from '@/lib/types';
import ETicketModal from '@/components/ETicketModal';
import AuthModal from '@/components/AuthModal';

function DashboardContent() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, savedTravelers, addSavedTraveler, removeSavedTraveler } = useAuth();
  const { formatPrice } = useCart();

  const [activeTab, setActiveTab] = useState<'bookings' | 'travelers' | 'profile' | 'inquiries'>(
    (searchParams.get('tab') as any) || 'bookings'
  );

  const [bookings, setBookings] = useState<UnifiedBooking[]>([]);
  const [stats, setStats] = useState<any>({
    total_bookings: 4,
    upcoming_trips: 3,
    active_visas: 1,
    privilege_points: 2450,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // E-Ticket Modal
  const [selectedBookingForTicket, setSelectedBookingForTicket] = useState<UnifiedBooking | null>(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // New Traveler Form Modal
  const [showAddTraveler, setShowAddTraveler] = useState(false);
  const [newTraveler, setNewTraveler] = useState({
    title: 'Mr',
    first_name: '',
    last_name: '',
    date_of_birth: '1992-05-14',
    passport_number: '',
    passport_expiry: '2032-05-14',
    nationality: 'United States',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [bkList, stData] = await Promise.all([
        api.getMyBookings(),
        api.getDashboardStats().catch(() => ({ total_bookings: 4, upcoming_trips: 3, active_visas: 1, privilege_points: 2450 })),
      ]);
      setBookings(bkList);
      setStats(stData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const handleCreateTraveler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraveler.first_name || !newTraveler.last_name) return;
    try {
      await addSavedTraveler(newTraveler);
      setShowAddTraveler(false);
      setNewTraveler({
        title: 'Mr',
        first_name: '',
        last_name: '',
        date_of_birth: '1992-05-14',
        passport_number: '',
        passport_expiry: '2032-05-14',
        nationality: 'United States',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Building2;
      case 'bus': return Bus;
      case 'visa': return FileCheck2;
      case 'insurance': return ShieldCheck;
      case 'holiday': return Palmtree;
      case 'umrah': return Sparkles;
      default: return Calendar;
    }
  };

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Greeting Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#0F2942] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-cyan-500/30">
              {user ? (user.first_name?.[0] || user.username[0].toUpperCase()) : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {user ? `${user.first_name || user.username} ${user.last_name || ''}` : 'Alex Morgan'}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Platinum Privileged
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {user?.email || 'alex.morgan@example.com'} • Member ID: #ORB-882194
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Sign In to Sync Bookings
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Bookings</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.total_bookings}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Across all 12 modules</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Upcoming Trips</span>
            <span className="text-2xl font-black text-cyan-600 mt-1 block">{stats.upcoming_trips}</span>
            <span className="text-[10px] text-slate-400 font-medium">Ready for departure</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Visas</span>
            <span className="text-2xl font-black text-indigo-600 mt-1 block">{stats.active_visas}</span>
            <span className="text-[10px] text-slate-400 font-medium">UAE 30D eVisa</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Reward Points</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">{stats.privilege_points}</span>
            <span className="text-[10px] text-amber-700 font-medium">Worth $245 off future travel</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-2xl bg-white p-1.5 border border-slate-200 shadow-xs max-w-xl">
          {[
            { id: 'bookings', label: 'My Bookings & E-Tickets', icon: Calendar },
            { id: 'travelers', label: 'Saved Travelers', icon: User },
            { id: 'profile', label: 'Preferences', icon: Sparkles },
            { id: 'inquiries', label: 'Support & Inquiries', icon: PhoneCall },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: MY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            
            {/* Status Filter */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-1.5">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'confirmed', label: 'Upcoming' },
                  { id: 'completed', label: 'Completed' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id as any)}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition ${
                      statusFilter === s.id
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400">{filteredBookings.length} booking(s) displayed</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-200"></div>
                ))}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No bookings found in this category</h3>
                <p className="text-xs text-slate-500">Explore flight sales or holiday tours to start your next adventure.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((bk) => {
                  const Icon = getModuleIcon(bk.booking_type);
                  return (
                    <div
                      key={bk.id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                              {bk.booking_type}
                            </span>
                            <h3 className="text-base font-bold text-slate-900 mt-0.5">{bk.title}</h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {bk.booking_reference}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                            bk.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {bk.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{bk.summary}</p>

                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4 text-slate-500">
                          <span>Traveler: <strong className="text-slate-800">{bk.contact_name}</strong></span>
                          <span>Total: <strong className="text-cyan-700">{formatPrice(bk.final_amount)}</strong></span>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => {
                              setSelectedBookingForTicket(bk);
                              setIsTicketOpen(true);
                            }}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Digital E-Ticket / Voucher</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: SAVED TRAVELERS */}
        {activeTab === 'travelers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Saved Co-Travelers & Family Members</h3>
                <p className="text-xs text-slate-500">Quickly autofill passenger passports and dates of birth during checkout.</p>
              </div>
              <button
                onClick={() => setShowAddTraveler(true)}
                className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Traveler</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedTravelers.map((tr) => (
                <div
                  key={tr.id || tr.first_name}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {tr.first_name[0]}
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <h4 className="font-bold text-slate-900">{tr.title} {tr.first_name} {tr.last_name}</h4>
                      <p className="text-slate-500">Nationality: {tr.nationality}</p>
                      <p className="text-slate-500">Passport: <span className="font-mono font-bold text-slate-700">{tr.passport_number || 'N/A'}</span></p>
                      <p className="text-slate-400 text-[10px]">DOB: {tr.date_of_birth}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeSavedTraveler(tr.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Traveler Modal */}
            {showAddTraveler && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
                  <h3 className="text-base font-bold text-slate-900">Add New Co-Traveler</h3>
                  
                  <form onSubmit={handleCreateTraveler} className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Title</label>
                        <select
                          value={newTraveler.title}
                          onChange={(e) => setNewTraveler({ ...newTraveler, title: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs"
                        >
                          <option value="Mr">Mr</option>
                          <option value="Ms">Ms</option>
                          <option value="Mrs">Mrs</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">First Name</label>
                        <input
                          type="text"
                          required
                          value={newTraveler.first_name}
                          onChange={(e) => setNewTraveler({ ...newTraveler, first_name: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Last Name</label>
                        <input
                          type="text"
                          required
                          value={newTraveler.last_name}
                          onChange={(e) => setNewTraveler({ ...newTraveler, last_name: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Passport Number</label>
                        <input
                          type="text"
                          value={newTraveler.passport_number}
                          onChange={(e) => setNewTraveler({ ...newTraveler, passport_number: e.target.value.toUpperCase() })}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Nationality</label>
                        <input
                          type="text"
                          value={newTraveler.nationality}
                          onChange={(e) => setNewTraveler({ ...newTraveler, nationality: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddTraveler(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-cyan-600 text-white font-bold text-xs px-5 py-2 rounded-xl"
                      >
                        Save Traveler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: PREFERENCES */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl space-y-6">
            <h3 className="text-base font-bold text-slate-900">Personal Privileges & Travel Preferences</h3>
            
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Meal Preference</label>
                  <select className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-semibold">
                    <option>Halal Certified Meal (MOML)</option>
                    <option>Vegetarian / Vegan (VGML)</option>
                    <option>Gluten Intolerant (GFML)</option>
                    <option>Standard Gourmet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Seating Preference</label>
                  <select className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-semibold">
                    <option>Window Seat (Panoramic)</option>
                    <option>Aisle Seat (Direct Access)</option>
                    <option>Extra Legroom Exit Row</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 block">Orbinex VIP Platinum Status</span>
                  <span className="text-[11px] text-amber-700">Complimentary 24/7 airport lounge access on international sectors</span>
                </div>
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUPPORT */}
        {activeTab === 'inquiries' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl space-y-6">
            <h3 className="text-base font-bold text-slate-900">24/7 Dedicated Concierge Support</h3>
            <p className="text-xs text-slate-500">Reach your assigned travel officer via priority WhatsApp or phone line.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Direct Hotline</span>
                <span className="font-black text-slate-900 text-sm">+1 (800) 555-0199</span>
                <p className="text-slate-500 text-[11px]">Toll-free 24/7 English & Arabic</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <span className="text-emerald-800 block text-[10px] uppercase font-bold">Priority WhatsApp</span>
                <span className="font-black text-emerald-900 text-sm">+971 50 123 4567</span>
                <p className="text-emerald-700 text-[11px]">Avg response under 2 minutes</p>
              </div>
            </div>
          </div>
        )}

      </div>

      <ETicketModal
        booking={selectedBookingForTicket}
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500">Loading Customer Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
