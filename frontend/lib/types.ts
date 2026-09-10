export type BookingType = 
  | 'flight' 
  | 'hotel' 
  | 'bus' 
  | 'visa' 
  | 'insurance' 
  | 'holiday' 
  | 'umrah' 
  | 'medical_tourism' 
  | 'europamundo' 
  | 'utility' 
  | 'mixed';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'AED' | 'INR' | 'SAR';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar?: string;
  passport_number?: string;
  passport_expiry?: string;
  nationality?: string;
  preferred_currency: CurrencyCode;
}

export interface SavedTraveler {
  id?: number;
  title: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  traveler_type?: 'adult' | 'child' | 'infant';
  passport_number?: string;
  passport_expiry?: string;
  passport_country?: string;
  nationality?: string;
  email?: string;
  phone_number?: string;
  frequent_flyer_number?: string;
}

export interface FlightSchedule {
  id: number;
  flight_number: string;
  airline: {
    name: string;
    iata_code: string;
    logo_url?: string;
  };
  origin: {
    name: string;
    city: string;
    country: string;
    iata_code: string;
  };
  destination: {
    name: string;
    city: string;
    country: string;
    iata_code: string;
  };
  departure_time: string;
  arrival_time: string;
  duration: string;
  stops: number;
  stop_details?: string;
  price_economy: number;
  price_premium: number;
  price_business: number;
  price_first: number;
  baggage_checkin: string;
  baggage_cabin: string;
  refundable: boolean;
  aircraft_type: string;
  seats?: FlightSeat[];
}

export interface FlightSeat {
  id: number;
  seat_number: string;
  seat_class: 'economy' | 'extra_legroom' | 'business';
  extra_price: number;
  is_available: boolean;
  is_window: boolean;
  is_aisle: boolean;
}

export interface HotelAmenity {
  id: number;
  name: string;
  icon_name: string;
}

export interface HotelRoom {
  id: number;
  room_name: string;
  description?: string;
  bed_type: string;
  max_guests: number;
  room_size_sqm: number;
  price_per_night: number;
  image_url?: string;
  features_json?: string[];
}

export interface Hotel {
  id: number;
  name: string;
  city: string;
  country: string;
  address: string;
  star_rating: number;
  guest_rating: number;
  reviews_count: number;
  price_per_night_start: number;
  main_image: string;
  images_gallery: string[];
  description: string;
  free_cancellation: boolean;
  breakfast_included: boolean;
  amenities: HotelAmenity[];
  rooms?: HotelRoom[];
  featured: boolean;
}

export interface BusTrip {
  id: number;
  operator: {
    name: string;
    rating: number;
    total_reviews: number;
  };
  bus_type: string;
  bus_name: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  fare_seater: number;
  fare_sleeper: number;
  boarding_points: { time: string; location: string }[];
  dropping_points: { time: string; location: string }[];
  amenities: string[];
  total_seats?: number;
  available_seats_count?: number;
  seats?: BusSeat[];
}

export interface BusSeat {
  id: number;
  seat_number: string;
  deck: 'lower' | 'upper';
  seat_type: 'seater' | 'sleeper';
  price: number;
  is_available: boolean;
  is_ladies_only: boolean;
}

export interface VisaType {
  id: number;
  title: string;
  validity_duration: string;
  stay_duration: string;
  entry_type: string;
  government_fee: number;
  service_fee: number;
  total_fee: number;
  express_available: boolean;
}

export interface VisaCountry {
  id: number;
  country_name: string;
  country_code: string;
  flag_emoji: string;
  processing_time_days: string;
  starting_price: number;
  image_url: string;
  description: string;
  requirements_checklist: string[];
  visa_types: VisaType[];
  is_popular: boolean;
}

export interface InsurancePlan {
  id: number;
  provider: {
    name: string;
    claim_settlement_ratio: string;
    emergency_assistance_phone: string;
  };
  plan_name: string;
  region: 'worldwide' | 'worldwide_ex_us' | 'schengen' | 'asia';
  medical_coverage_amount: string;
  trip_cancellation_amount: string;
  baggage_loss_amount: string;
  flight_delay_amount: string;
  price_per_day: number;
  flat_price: number;
  benefits_list: string[];
  is_bestseller: boolean;
}

export interface HolidayPackage {
  id: number;
  destination: {
    name: string;
    region: string;
    image_url: string;
    tagline: string;
  };
  title: string;
  duration_days: number;
  duration_nights: number;
  price_per_person: number;
  original_price: number;
  main_image: string;
  gallery_images: string[];
  overview: string;
  inclusions: string[];
  exclusions: string[];
  hotel_rating: number;
  meals_included: string;
  is_trending: boolean;
  itinerary_days?: {
    day_number: number;
    title: string;
    description: string;
    meals_today: string;
    activities: string[];
  }[];
}

export interface UmrahPackage {
  id: number;
  title: string;
  tier: string;
  duration_days: number;
  makkah_nights: number;
  madinah_nights: number;
  price_quad: number;
  price_triple: number;
  price_double: number;
  makkah_hotel: {
    name: string;
    star_rating: number;
    distance_from_haram: string;
  };
  madinah_hotel: {
    name: string;
    star_rating: number;
    distance_from_haram: string;
  };
  main_image: string;
  overview: string;
  inclusions: string[];
  exclusions: string[];
  itinerary_summary: string[];
  featured: boolean;
}

export interface MedicalPackage {
  id: number;
  hospital: {
    name: string;
    city: string;
    country: string;
    accreditations: string[];
    image_url: string;
  };
  specialty: {
    id: number;
    name: string;
    icon_name: string;
  };
  treatment_name: string;
  estimated_cost_usd: number;
  us_benchmark_cost_usd: number;
  hospital_stay_days: number;
  total_stay_days: number;
  success_rate: string;
  inclusions: string[];
  overview: string;
}

export interface EuropamundoTour {
  id: number;
  tour_code: string;
  title: string;
  countries_covered: string[];
  cities_visited: string;
  duration_days: number;
  duration_nights: number;
  price_usd: number;
  price_eur: number;
  bus_type: string;
  hotel_category: string;
  audio_languages: string[];
  main_image: string;
  inclusions: string[];
  featured: boolean;
}

export interface EsimPackage {
  id: number;
  country_or_region: string;
  country_code: string;
  data_allowance: string;
  validity_days: number;
  price_usd: number;
}

export interface ForexRate {
  id: number;
  currency_code: string;
  currency_name: string;
  flag_emoji: string;
  buy_rate_usd: number;
  sell_rate_usd: number;
}

export interface AirportLounge {
  id: number;
  airport_code: string;
  airport_name: string;
  terminal: string;
  lounge_name: string;
  price_usd: number;
  amenities: string[];
  image_url?: string;
}

export interface CouponCode {
  id: number;
  code: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_booking_amount: number;
  applicable_module: string;
  badge_text: string;
}

export interface CartItem {
  id: string;
  booking_type: BookingType;
  title: string;
  subtitle: string;
  amount: number;
  original_amount?: number;
  image?: string;
  travel_date?: string;
  return_date?: string;
  details: Record<string, any>;
  passengers?: SavedTraveler[];
}

export interface UnifiedBooking {
  id: number;
  booking_reference: string;
  booking_type: BookingType;
  title: string;
  summary: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  currency: string;
  coupon_code?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'failed';
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  travel_date?: string;
  return_date?: string;
  details_json: Record<string, any>;
  created_at: string;
}
