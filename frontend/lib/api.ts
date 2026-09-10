import {
  FlightSchedule,
  Hotel,
  BusTrip,
  VisaCountry,
  InsurancePlan,
  HolidayPackage,
  UmrahPackage,
  MedicalPackage,
  EuropamundoTour,
  EsimPackage,
  ForexRate,
  AirportLounge,
  CouponCode,
  UnifiedBooking,
  SavedTraveler,
  UserProfile
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('orbinex_access_token');
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network request failed' }));
      throw new Error(errorData.error || errorData.detail || errorData.message || 'API request failed');
    }

    return response.json();
  }

  // Auth
  async login(username: string, password: string):Promise<{ access: string; refresh: string; user: UserProfile }> {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(data: { username: string; email: string; password: string; first_name?: string; last_name?: string; phone_number?: string }) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<UserProfile> {
    return this.request('/auth/profile/');
  }

  async getSavedTravelers(): Promise<SavedTraveler[]> {
    const res = await this.request<any>('/auth/travelers/');
    return Array.isArray(res) ? res : res.results || [];
  }

  async createSavedTraveler(data: Partial<SavedTraveler>): Promise<SavedTraveler> {
    return this.request('/auth/travelers/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSavedTraveler(id: number): Promise<void> {
    return this.request(`/auth/travelers/${id}/`, {
      method: 'DELETE',
    });
  }

  // Helper: strip undefined/null/NaN values before building query string
  private cleanParams(params?: Record<string, any>): string {
    if (!params) return '';
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'undefined' && !Number.isNaN(v)) {
        clean[k] = String(v);
      }
    }
    return new URLSearchParams(clean).toString();
  }

  // Flights
  async searchFlights(params?: { origin?: string; destination?: string; stops?: number; airline?: string; max_price?: number }): Promise<FlightSchedule[]> {
    const query = this.cleanParams(params as any);
    const res = await this.request<any>(`/flights/search/?${query}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  async getAirports(q?: string) {
    const res = await this.request<any>(`/flights/airports/?q=${q || ''}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  // Hotels
  async searchHotels(params?: { city?: string; star_rating?: number; max_price?: number; free_cancellation?: boolean; breakfast_included?: boolean }): Promise<Hotel[]> {
    const query = this.cleanParams(params as any);
    const res = await this.request<any>(`/hotels/search/?${query}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  async getHotelDetail(id: number): Promise<Hotel> {
    return this.request(`/hotels/${id}/`);
  }

  // Buses
  async searchBuses(params?: { origin?: string; destination?: string; bus_type?: string }): Promise<BusTrip[]> {
    const query = this.cleanParams(params as any);
    const res = await this.request<any>(`/buses/search/?${query}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  async getBusSuggestions(q: string): Promise<any[]> {
    const res = await this.request<any>(`/buses/suggestions/?q=${encodeURIComponent(q || '')}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  // Visa
  async getVisaCountries(q?: string): Promise<VisaCountry[]> {
    const res = await this.request<any>(`/visa/countries/?q=${q || ''}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  async trackVisa(ref: string) {
    return this.request(`/visa/track/${ref}/`);
  }

  async submitVisaApplication(data: any) {
    return this.request('/visa/apply/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Insurance
  async getInsurancePlans(region?: string): Promise<InsurancePlan[]> {
    const res = await this.request<any>(`/insurance/plans/?region=${region || ''}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  // Holidays
  async getHolidayPackages(params?: { destination?: string; max_price?: number; trending?: boolean }): Promise<HolidayPackage[]> {
    const query = new URLSearchParams(params as any).toString();
    const res = await this.request<any>(`/holidays/packages/?${query}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  async getHolidayPackageDetail(id: number): Promise<HolidayPackage> {
    return this.request(`/holidays/packages/${id}/`);
  }

  // Umrah
  async getUmrahPackages(tier?: string): Promise<UmrahPackage[]> {
    const res = await this.request<any>(`/umrah/packages/?tier=${tier || ''}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  // Medical Tourism
  async getMedicalHospitals(country?: string) {
    const res = await this.request<any>(`/medical/hospitals/?country=${country || ''}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  async getMedicalPackages(): Promise<MedicalPackage[]> {
    const res = await this.request<any>('/medical/packages/');
    return Array.isArray(res) ? res : res.results || [];
  }

  async submitMedicalEnquiry(data: any) {
    return this.request('/medical/enquire/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Europamundo
  async getEuropamundoTours(): Promise<EuropamundoTour[]> {
    const res = await this.request<any>('/europamundo/tours/');
    return Array.isArray(res) ? res : res.results || [];
  }

  // Utilities
  async getForexRates(): Promise<ForexRate[]> {
    const res = await this.request<any>('/utilities/forex/');
    return Array.isArray(res) ? res : res.results || [];
  }

  async getEsimPackages(country?: string): Promise<EsimPackage[]> {
    const res = await this.request<any>(`/utilities/esim/?country=${country || ''}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  async getAirportLounges(airport?: string): Promise<AirportLounge[]> {
    const res = await this.request<any>(`/utilities/lounges/?airport=${airport || ''}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  // Offers
  async getOffers(category?: string) {
    const res = await this.request<any>(`/offers/?category=${category || ''}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  async validateCoupon(code: string, amount: number, module?: string) {
    return this.request<{ valid: boolean; code?: string; discount_amount: number; new_total: number; message: string }>('/offers/validate/', {
      method: 'POST',
      body: JSON.stringify({ code, amount, module: module || 'all' }),
    });
  }

  // Newsletter
  async subscribeNewsletter(email: string) {
    return this.request('/newsletter/subscribe/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Unified Bookings & Checkout
  async unifiedCheckout(data: {
    items: any[];
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    currency?: string;
    coupon_code?: string;
    discount_amount?: number;
    payment_method?: string;
  }) {
    return this.request<{ message: string; transaction_id: string; bookings: UnifiedBooking[]; primary_reference: string }>('/bookings/checkout/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyBookings(type?: string, status?: string, timeframe?: string): Promise<UnifiedBooking[]> {
    const query = new URLSearchParams({ type: type || '', status: status || '', timeframe: timeframe || '' }).toString();
    const res = await this.request<any>(`/bookings/my-bookings/?${query}`);
    return Array.isArray(res) ? res : res.results || [];
  }

  async getDashboardStats() {
    return this.request<{
      total_bookings: number;
      upcoming_trips: number;
      completed_trips: number;
      active_visas: number;
      reward_points: number;
      membership_tier: string;
    }>('/bookings/stats/');
  }

  async getBookingDetail(reference: string): Promise<UnifiedBooking> {
    return this.request(`/bookings/${reference}/`);
  }
}

export const api = new ApiClient();
