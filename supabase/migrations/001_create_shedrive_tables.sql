-- SheDrive Morocco Database Schema
-- Create all necessary tables for the ride-sharing platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geolocation (optional but recommended)
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Profiles table — user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('passenger', 'driver', 'admin')) NOT NULL DEFAULT 'passenger',
  gender TEXT CHECK (gender = 'female') NOT NULL DEFAULT 'female',
  status TEXT CHECK (status IN ('active', 'pending', 'suspended', 'banned')) DEFAULT 'active',
  city TEXT,
  preferred_language TEXT CHECK (preferred_language IN ('fr', 'ar', 'en')) DEFAULT 'fr',
  rating NUMERIC(3,2) DEFAULT 5.00,
  total_rides INTEGER DEFAULT 0,
  phone_verified BOOLEAN DEFAULT FALSE,
  identity_verified BOOLEAN DEFAULT FALSE
);

-- Drivers table — driver-specific information
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_year INTEGER NOT NULL,
  vehicle_color TEXT NOT NULL,
  vehicle_plate TEXT NOT NULL UNIQUE,
  vehicle_type TEXT CHECK (vehicle_type IN ('economy', 'comfort', 'premium')) NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  license_expiry DATE NOT NULL,
  insurance_expiry DATE NOT NULL,
  inspection_expiry DATE NOT NULL,
  approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected', 'suspended')) DEFAULT 'pending',
  is_online BOOLEAN DEFAULT FALSE,
  current_lat NUMERIC(10, 8),
  current_lng NUMERIC(11, 8),
  total_earnings NUMERIC(10, 2) DEFAULT 0,
  acceptance_rate NUMERIC(3, 2) DEFAULT 100,
  completion_rate NUMERIC(3, 2) DEFAULT 100,
  documents_verified BOOLEAN DEFAULT FALSE,
  background_check_passed BOOLEAN DEFAULT FALSE
);

-- Rides table — ride requests and bookings
CREATE TABLE IF NOT EXISTS public.rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  passenger_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('searching', 'accepted', 'driver_arrived', 'in_progress', 'completed', 'cancelled')) DEFAULT 'searching',
  from_address TEXT NOT NULL,
  from_lat NUMERIC(10, 8) NOT NULL,
  from_lng NUMERIC(11, 8) NOT NULL,
  to_address TEXT NOT NULL,
  to_lat NUMERIC(10, 8) NOT NULL,
  to_lng NUMERIC(11, 8) NOT NULL,
  distance_km NUMERIC(6, 2),
  duration_minutes INTEGER,
  passenger_price NUMERIC(8, 2) NOT NULL,
  final_price NUMERIC(8, 2),
  payment_method TEXT CHECK (payment_method IN ('cash', 'wallet', 'card')) NOT NULL,
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'refunded')) DEFAULT 'pending',
  passenger_rating NUMERIC(2, 1),
  driver_rating NUMERIC(2, 1),
  sos_triggered BOOLEAN DEFAULT FALSE,
  cancelled_by TEXT CHECK (cancelled_by IN ('passenger', 'driver', 'system')),
  cancellation_reason TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Wallets table — user digital wallets
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  balance NUMERIC(10, 2) DEFAULT 0,
  currency TEXT CHECK (currency = 'MAD') DEFAULT 'MAD',
  is_active BOOLEAN DEFAULT TRUE
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  type TEXT CHECK (type IN ('credit', 'debit')) NOT NULL,
  amount NUMERIC(8, 2) NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT,
  reference_type TEXT CHECK (reference_type IN ('ride', 'topup', 'refund', 'withdrawal')),
  payment_method TEXT,
  status TEXT CHECK (status IN ('completed', 'pending', 'failed')) DEFAULT 'pending'
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  notify_on_sos BOOLEAN DEFAULT TRUE,
  notify_on_trip_start BOOLEAN DEFAULT FALSE
);

-- SOS alerts table
CREATE TABLE IF NOT EXISTS public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ride_id UUID REFERENCES public.rides(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lat NUMERIC(10, 8),
  lng NUMERIC(11, 8),
  status TEXT CHECK (status IN ('active', 'resolved', 'false_alarm')) DEFAULT 'active',
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id),
  notes TEXT
);

-- Coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
  discount_value NUMERIC(6, 2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  min_ride_price NUMERIC(8, 2),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS profiles_phone_idx ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS drivers_user_id_idx ON public.drivers(user_id);
CREATE INDEX IF NOT EXISTS drivers_approval_status_idx ON public.drivers(approval_status);
CREATE INDEX IF NOT EXISTS rides_passenger_id_idx ON public.rides(passenger_id);
CREATE INDEX IF NOT EXISTS rides_driver_id_idx ON public.rides(driver_id);
CREATE INDEX IF NOT EXISTS rides_status_idx ON public.rides(status);
CREATE INDEX IF NOT EXISTS rides_created_at_idx ON public.rides(created_at);
CREATE INDEX IF NOT EXISTS wallets_user_id_idx ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS sos_alerts_user_id_idx ON public.sos_alerts(user_id);
CREATE INDEX IF NOT EXISTS sos_alerts_status_idx ON public.sos_alerts(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can insert a profile on signup" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for Drivers
CREATE POLICY "Drivers can view their own driver record" ON public.drivers
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Drivers can update their own driver record" ON public.drivers
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Rides
CREATE POLICY "Users can view their own rides" ON public.rides
  FOR SELECT USING (auth.uid() = passenger_id OR auth.uid() = driver_id);
CREATE POLICY "Passengers can create rides" ON public.rides
  FOR INSERT WITH CHECK (auth.uid() = passenger_id);
CREATE POLICY "Drivers can accept rides" ON public.rides
  FOR UPDATE USING (auth.uid() = driver_id);

-- RLS Policies for Wallets
CREATE POLICY "Users can view their own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own wallet" ON public.wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Wallet Transactions
CREATE POLICY "Users can view their wallet transactions" ON public.wallet_transactions
  FOR SELECT USING (
    wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid())
  );

-- RLS Policies for Emergency Contacts
CREATE POLICY "Users can manage their emergency contacts" ON public.emergency_contacts
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for SOS Alerts
CREATE POLICY "Users can view SOS alerts they triggered" ON public.sos_alerts
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for Coupons (public read)
CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT USING (is_active = TRUE);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER drivers_updated_at BEFORE UPDATE ON public.drivers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER rides_updated_at BEFORE UPDATE ON public.rides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER wallets_updated_at BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
