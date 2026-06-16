-- ============================================================
-- SheDrive Morocco — Production Schema for Supabase
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- DROP EXISTING TABLES & TYPES (to allow clean re-creation)
-- ============================================================

DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS driver_locations CASCADE;
DROP TABLE IF EXISTS sos_alerts CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS rides CASCADE;
DROP TABLE IF EXISTS emergency_contacts CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop enums if you want a completely clean slate (optional, usually fine to keep if using IF NOT EXISTS approach, but let's be safe if they changed)
-- Note: Dropping types can be tricky if they are used by other tables not listed above, but CASCADE handles it.
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS gender CASCADE;
DROP TYPE IF EXISTS driver_status CASCADE;
DROP TYPE IF EXISTS ride_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('passenger', 'driver', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending', 'banned');
CREATE TYPE gender AS ENUM ('female', 'male', 'other');
CREATE TYPE driver_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'suspended');
CREATE TYPE ride_status AS ENUM (
  'searching', 'bidding', 'accepted', 'driver_arriving',
  'in_progress', 'completed', 'cancelled', 'disputed'
);
CREATE TYPE payment_method AS ENUM ('wallet', 'cash', 'card', 'cmi', 'payzone');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit', 'refund', 'withdrawal', 'bonus');
CREATE TYPE verification_status AS ENUM ('not_submitted', 'pending', 'verified', 'rejected');

-- ============================================================
-- PROFILES
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  avatar_url TEXT,
  gender gender DEFAULT 'female',
  role user_role NOT NULL DEFAULT 'passenger',
  status user_status NOT NULL DEFAULT 'active',
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  preferred_language VARCHAR(5) DEFAULT 'fr',
  total_rides INT DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 5.00
);

-- ============================================================
-- DRIVERS
-- ============================================================

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status driver_status DEFAULT 'pending',
  is_online BOOLEAN DEFAULT FALSE,
  is_in_ride BOOLEAN DEFAULT FALSE,
  current_lat DECIMAL(10,7),
  current_lng DECIMAL(10,7),
  last_location_update TIMESTAMPTZ,
  license_number VARCHAR(30),
  license_front_url TEXT,
  license_back_url TEXT,
  license_expiry DATE,
  cin_front_url TEXT,
  cin_back_url TEXT,
  selfie_url TEXT,
  total_trips INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 5.00,
  acceptance_rate DECIMAL(5,2) DEFAULT 100.00,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- ============================================================
-- VEHICLES
-- ============================================================

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  make VARCHAR(50) NOT NULL DEFAULT '',
  model VARCHAR(50) NOT NULL DEFAULT '',
  year INT NOT NULL DEFAULT 2020,
  color VARCHAR(30) NOT NULL DEFAULT '',
  plate_number VARCHAR(20) NOT NULL DEFAULT '',
  category VARCHAR(20) DEFAULT 'economy',
  registration_url TEXT,
  insurance_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  seats INT DEFAULT 4
);

-- ============================================================
-- EMERGENCY CONTACTS
-- ============================================================

CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  relationship VARCHAR(50),
  is_primary BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- RIDES (flat lat/lng for API compatibility)
-- ============================================================

CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  passenger_id UUID NOT NULL REFERENCES profiles(id),
  driver_id UUID REFERENCES drivers(id),
  status ride_status DEFAULT 'searching',
  -- Pickup
  from_address TEXT NOT NULL DEFAULT '',
  from_lat DECIMAL(10,7) NOT NULL DEFAULT 0,
  from_lng DECIMAL(10,7) NOT NULL DEFAULT 0,
  -- Dropoff
  to_address TEXT NOT NULL DEFAULT '',
  to_lat DECIMAL(10,7) NOT NULL DEFAULT 0,
  to_lng DECIMAL(10,7) NOT NULL DEFAULT 0,
  -- Pricing
  passenger_offered_price DECIMAL(8,2) NOT NULL DEFAULT 0,
  final_price DECIMAL(8,2),
  currency VARCHAR(3) DEFAULT 'MAD',
  payment_method payment_method DEFAULT 'cash',
  -- Route
  estimated_distance_km DECIMAL(8,2),
  estimated_duration_minutes INT,
  route_polyline TEXT,
  -- Timing
  driver_accepted_at TIMESTAMPTZ,
  ride_started_at TIMESTAMPTZ,
  ride_completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  -- Safety
  sos_triggered BOOLEAN DEFAULT FALSE,
  -- Ratings
  passenger_rated BOOLEAN DEFAULT FALSE,
  driver_rated BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- ============================================================
-- WALLETS
-- ============================================================

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  balance DECIMAL(10,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'MAD',
  is_frozen BOOLEAN DEFAULT FALSE,
  total_earned DECIMAL(10,2) DEFAULT 0.00,
  total_withdrawn DECIMAL(10,2) DEFAULT 0.00,
  CONSTRAINT balance_non_negative CHECK (balance >= 0)
);

-- ============================================================
-- TRANSACTIONS
-- ============================================================

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  ride_id UUID REFERENCES rides(id),
  type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'MAD',
  balance_before DECIMAL(10,2),
  balance_after DECIMAL(10,2),
  description TEXT,
  reference VARCHAR(100),
  status VARCHAR(20) DEFAULT 'completed'
);

-- ============================================================
-- RATINGS
-- ============================================================

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ride_id UUID NOT NULL REFERENCES rides(id),
  rater_id UUID NOT NULL REFERENCES profiles(id),
  rated_id UUID NOT NULL REFERENCES profiles(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ
);

-- ============================================================
-- SOS ALERTS
-- ============================================================

CREATE TABLE sos_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id),
  ride_id UUID REFERENCES rides(id),
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  status VARCHAR(20) DEFAULT 'active',
  resolved_at TIMESTAMPTZ,
  notes TEXT
);

-- ============================================================
-- DRIVER LOCATIONS (realtime)
-- ============================================================

CREATE TABLE driver_locations (
  driver_id UUID PRIMARY KEY REFERENCES drivers(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  heading DECIMAL(5,2),
  speed DECIMAL(6,2)
);

-- ============================================================
-- MESSAGES (in-ride chat)
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  content TEXT,
  message_type VARCHAR(20) DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_rides_passenger ON rides(passenger_id);
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_created ON rides(created_at DESC);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can view and update own profile
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Rides: passengers see own rides, drivers see assigned rides
CREATE POLICY "Passengers see own rides" ON rides FOR SELECT USING (auth.uid() = passenger_id);
CREATE POLICY "Drivers see assigned rides" ON rides FOR SELECT USING (
  driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
);
CREATE POLICY "Passengers create rides" ON rides FOR INSERT WITH CHECK (auth.uid() = passenger_id);
CREATE POLICY "Users update own rides" ON rides FOR UPDATE USING (
  auth.uid() = passenger_id OR driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
);

-- Wallets: own wallet only
CREATE POLICY "Users see own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own wallet" ON wallets FOR UPDATE USING (auth.uid() = user_id);

-- Transactions: own wallet transactions only
CREATE POLICY "Users see own transactions" ON transactions FOR SELECT USING (
  wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid())
);
CREATE POLICY "Users insert own transactions" ON transactions FOR INSERT WITH CHECK (
  wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid())
);

-- Emergency contacts: own only
CREATE POLICY "Users manage own contacts" ON emergency_contacts FOR ALL USING (auth.uid() = user_id);

-- Notifications: own only
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Drivers: own record + public visibility for passengers
CREATE POLICY "Drivers see own record" ON drivers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Drivers update own record" ON drivers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Passengers can see approved drivers" ON drivers FOR SELECT USING (status = 'approved');

-- Vehicles: driver's own vehicles
CREATE POLICY "Drivers manage own vehicles" ON vehicles FOR ALL USING (
  driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
);

-- SOS: own alerts
CREATE POLICY "Users manage own SOS" ON sos_alerts FOR ALL USING (auth.uid() = user_id);

-- Messages: ride participants
CREATE POLICY "Ride participants see messages" ON messages FOR SELECT USING (
  ride_id IN (
    SELECT r.id FROM rides r
    LEFT JOIN drivers d ON r.driver_id = d.id
    WHERE r.passenger_id = auth.uid() OR d.user_id = auth.uid()
  )
);
CREATE POLICY "Ride participants send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_drivers_updated ON drivers;
CREATE TRIGGER trg_drivers_updated BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_rides_updated ON rides;
CREATE TRIGGER trg_rides_updated BEFORE UPDATE ON rides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_wallets_updated ON wallets;
CREATE TRIGGER trg_wallets_updated BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create wallet on new profile
CREATE OR REPLACE FUNCTION create_wallet_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_create_wallet ON profiles;
CREATE TRIGGER trg_create_wallet
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_wallet_for_new_user();

-- ============================================================
-- STORAGE BUCKETS (run separately if needed)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('driver-documents', 'driver-documents', false);
