// Types for SheDrive Morocco
// Central type definitions

export type UserRole = "passenger" | "driver" | "admin";
export type UserStatus = "active" | "suspended" | "pending" | "banned";
export type Gender = "female" | "male" | "other";
export type DriverStatus = "pending" | "under_review" | "approved" | "rejected" | "suspended";
export type RideStatus =
  | "searching"
  | "bidding"
  | "accepted"
  | "driver_arriving"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed";
export type PaymentMethod = "wallet" | "cash" | "card" | "cmi" | "payzone";
export type TransactionType = "credit" | "debit" | "refund" | "withdrawal" | "bonus";
export type VerificationStatus = "not_submitted" | "pending" | "verified" | "rejected";
export type Language = "ar" | "fr" | "en";

export type MoroccanCity =
  | "casablanca"
  | "rabat"
  | "marrakech"
  | "fes"
  | "agadir"
  | "tanger"
  | "meknes"
  | "oujda"
  | "tetouan"
  | "sale"
  | "mohammedia"
  | "el_jadida"
  | "beni_mellal"
  | "nador"
  | "khouribga"
  | "kenitra"
  | "safi"
  | "taza";

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  display_name?: string;
  phone: string;
  email?: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender: Gender;
  role: UserRole;
  status: UserStatus;
  phone_verified: boolean;
  email_verified: boolean;
  identity_verified: VerificationStatus;
  preferred_language: Language;
  preferred_city?: MoroccanCity;
  last_login_at?: string;
  total_rides: number;
  average_rating: number;
  referral_code: string;
}

export interface Driver {
  id: string;
  user_id: string;
  status: DriverStatus;
  is_online: boolean;
  is_in_ride: boolean;
  current_city?: MoroccanCity;
  total_trips: number;
  total_earnings: number;
  average_rating: number;
  acceptance_rate: number;
  completion_rate: number;
  license_status: VerificationStatus;
  background_check_status: VerificationStatus;
  profile?: Profile;
  vehicle?: Vehicle;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plate_number: string;
  category: "economy" | "comfort" | "luxury" | "van";
  seats: number;
  verification_status: VerificationStatus;
  is_active: boolean;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Ride {
  id: string;
  created_at: string;
  passenger_id: string;
  driver_id?: string;
  vehicle_id?: string;
  status: RideStatus;
  pickup_location: GeoPoint;
  pickup_address: string;
  pickup_city: MoroccanCity;
  dropoff_location: GeoPoint;
  dropoff_address: string;
  dropoff_city: MoroccanCity;
  passenger_offered_price: number;
  final_price?: number;
  currency: string;
  payment_method: PaymentMethod;
  estimated_distance_km?: number;
  estimated_duration_minutes?: number;
  share_token: string;
  sos_triggered: boolean;
  notes?: string;
  promo_code?: string;
  passenger?: Profile;
  driver?: Driver;
  bids?: RideBid[];
}

export interface RideBid {
  id: string;
  ride_id: string;
  driver_id: string;
  bid_amount: number;
  message?: string;
  estimated_arrival_minutes?: number;
  status: "pending" | "accepted" | "rejected" | "expired";
  driver?: Driver;
}

export interface Message {
  id: string;
  ride_id: string;
  sender_id: string;
  created_at: string;
  content?: string;
  voice_url?: string;
  message_type: "text" | "voice" | "system";
  is_read: boolean;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  is_frozen: boolean;
  total_earned: number;
  total_withdrawn: number;
  pending_withdrawal: number;
}

export interface Transaction {
  id: string;
  created_at: string;
  wallet_id: string;
  ride_id?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_gateway?: string;
}

export interface Rating {
  id: string;
  ride_id: string;
  rater_id: string;
  rated_id: string;
  rating: number;
  comment?: string;
  punctuality?: number;
  cleanliness?: number;
  safety?: number;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship?: string;
  is_primary: boolean;
}

export interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  type: string;
  title: string;
  title_ar?: string;
  title_fr?: string;
  body: string;
  body_ar?: string;
  body_fr?: string;
  data?: Record<string, unknown>;
  is_read: boolean;
}

export interface CityConfig {
  city: MoroccanCity;
  name_ar: string;
  name_fr: string;
  name_en: string;
  center_lat: number;
  center_lng: number;
  is_active: boolean;
  base_fare: number;
  per_km_rate: number;
  min_fare: number;
}

// Admin analytics types
export interface AdminStats {
  total_users: number;
  total_drivers: number;
  total_rides: number;
  total_revenue: number;
  active_rides: number;
  pending_drivers: number;
  rides_today: number;
  revenue_today: number;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
