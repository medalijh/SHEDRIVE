// Auto-generated Supabase Database types for SheDrive Morocco
// Run `npx supabase gen types typescript --local` to regenerate after schema changes

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          phone: string;
          email: string | null;
          avatar_url: string | null;
          role: "passenger" | "driver" | "admin";
          gender: "female";
          status: "active" | "pending" | "suspended" | "banned";
          city: string | null;
          preferred_language: "fr" | "ar" | "en";
          rating: number;
          total_rides: number;
          phone_verified: boolean;
          identity_verified: boolean;
        };
        Insert: {
          id: string;
          full_name: string;
          phone: string;
          email?: string | null;
          avatar_url?: string | null;
          role: "passenger" | "driver" | "admin";
          gender?: "female";
          status?: "active" | "pending" | "suspended" | "banned";
          city?: string | null;
          preferred_language?: "fr" | "ar" | "en";
        };
        Update: {
          full_name?: string;
          phone?: string;
          email?: string | null;
          avatar_url?: string | null;
          status?: "active" | "pending" | "suspended" | "banned";
          city?: string | null;
          preferred_language?: "fr" | "ar" | "en";
          rating?: number;
          total_rides?: number;
          phone_verified?: boolean;
          identity_verified?: boolean;
        };
      };
      drivers: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          vehicle_make: string;
          vehicle_model: string;
          vehicle_year: number;
          vehicle_color: string;
          vehicle_plate: string;
          vehicle_type: "economy" | "comfort" | "premium";
          license_number: string;
          license_expiry: string;
          insurance_expiry: string;
          inspection_expiry: string;
          approval_status: "pending" | "approved" | "rejected" | "suspended";
          is_online: boolean;
          current_lat: number | null;
          current_lng: number | null;
          total_earnings: number;
          acceptance_rate: number;
          completion_rate: number;
          documents_verified: boolean;
          background_check_passed: boolean;
        };
        Insert: {
          user_id: string;
          vehicle_make: string;
          vehicle_model: string;
          vehicle_year: number;
          vehicle_color: string;
          vehicle_plate: string;
          vehicle_type: "economy" | "comfort" | "premium";
          license_number: string;
          license_expiry: string;
          insurance_expiry: string;
          inspection_expiry: string;
        };
        Update: {
          approval_status?: "pending" | "approved" | "rejected" | "suspended";
          is_online?: boolean;
          current_lat?: number | null;
          current_lng?: number | null;
          documents_verified?: boolean;
          background_check_passed?: boolean;
        };
      };
      rides: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          passenger_id: string;
          driver_id: string | null;
          status: "searching" | "accepted" | "driver_arrived" | "in_progress" | "completed" | "cancelled";
          from_address: string;
          from_lat: number;
          from_lng: number;
          to_address: string;
          to_lat: number;
          to_lng: number;
          distance_km: number | null;
          duration_minutes: number | null;
          passenger_price: number;
          final_price: number | null;
          payment_method: "cash" | "wallet" | "card";
          payment_status: "pending" | "completed" | "refunded";
          passenger_rating: number | null;
          driver_rating: number | null;
          sos_triggered: boolean;
          cancelled_by: "passenger" | "driver" | "system" | null;
          cancellation_reason: string | null;
          started_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          passenger_id: string;
          from_address: string;
          from_lat: number;
          from_lng: number;
          to_address: string;
          to_lat: number;
          to_lng: number;
          passenger_price: number;
          payment_method: "cash" | "wallet" | "card";
        };
        Update: {
          driver_id?: string | null;
          status?: "searching" | "accepted" | "driver_arrived" | "in_progress" | "completed" | "cancelled";
          final_price?: number | null;
          distance_km?: number | null;
          duration_minutes?: number | null;
          passenger_rating?: number | null;
          driver_rating?: number | null;
          sos_triggered?: boolean;
          cancelled_by?: "passenger" | "driver" | "system" | null;
          started_at?: string | null;
          completed_at?: string | null;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          balance: number;
          currency: "MAD";
          is_active: boolean;
        };
        Insert: {
          user_id: string;
          balance?: number;
        };
        Update: {
          balance?: number;
          is_active?: boolean;
        };
      };
      wallet_transactions: {
        Row: {
          id: string;
          wallet_id: string;
          created_at: string;
          type: "credit" | "debit";
          amount: number;
          description: string;
          reference_id: string | null;
          reference_type: "ride" | "topup" | "refund" | "withdrawal" | null;
          payment_method: string | null;
          status: "completed" | "pending" | "failed";
        };
        Insert: {
          wallet_id: string;
          type: "credit" | "debit";
          amount: number;
          description: string;
          reference_id?: string | null;
          reference_type?: "ride" | "topup" | "refund" | "withdrawal" | null;
          payment_method?: string | null;
        };
        Update: {
          status?: "completed" | "pending" | "failed";
        };
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          name: string;
          phone: string;
          relationship: string;
          is_primary: boolean;
          notify_on_sos: boolean;
          notify_on_trip_start: boolean;
        };
        Insert: {
          user_id: string;
          name: string;
          phone: string;
          relationship: string;
          is_primary?: boolean;
          notify_on_sos?: boolean;
          notify_on_trip_start?: boolean;
        };
        Update: {
          name?: string;
          phone?: string;
          relationship?: string;
          is_primary?: boolean;
          notify_on_sos?: boolean;
          notify_on_trip_start?: boolean;
        };
      };
      sos_alerts: {
        Row: {
          id: string;
          created_at: string;
          ride_id: string | null;
          user_id: string;
          lat: number | null;
          lng: number | null;
          status: "active" | "resolved" | "false_alarm";
          resolved_at: string | null;
          resolved_by: string | null;
          notes: string | null;
        };
        Insert: {
          ride_id?: string | null;
          user_id: string;
          lat?: number | null;
          lng?: number | null;
        };
        Update: {
          status?: "active" | "resolved" | "false_alarm";
          resolved_at?: string | null;
          resolved_by?: string | null;
          notes?: string | null;
        };
      };
      coupons: {
        Row: {
          id: string;
          created_at: string;
          code: string;
          discount_type: "percentage" | "fixed";
          discount_value: number;
          max_uses: number | null;
          current_uses: number;
          min_ride_price: number | null;
          expires_at: string | null;
          is_active: boolean;
        };
        Insert: {
          code: string;
          discount_type: "percentage" | "fixed";
          discount_value: number;
          max_uses?: number | null;
          min_ride_price?: number | null;
          expires_at?: string | null;
        };
        Update: {
          is_active?: boolean;
          current_uses?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "passenger" | "driver" | "admin";
      ride_status: "searching" | "accepted" | "driver_arrived" | "in_progress" | "completed" | "cancelled";
      approval_status: "pending" | "approved" | "rejected" | "suspended";
    };
  };
};
