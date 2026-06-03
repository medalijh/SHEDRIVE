-- ============================================================
-- SheDrive Morocco — Complete Database Schema
-- PostgreSQL / Supabase
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For GPS/location

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
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE notification_type AS ENUM (
  'ride_request', 'ride_accepted', 'driver_arriving', 'ride_started',
  'ride_completed', 'payment', 'sos', 'system', 'promo'
);
CREATE TYPE verification_status AS ENUM ('not_submitted', 'pending', 'verified', 'rejected');
CREATE TYPE city AS ENUM (
  'casablanca', 'rabat', 'marrakech', 'fes', 'agadir',
  'tanger', 'meknes', 'oujda', 'tetouan', 'sale',
  'mohammedia', 'el_jadida', 'beni_mellal', 'nador',
  'khouribga', 'kenitra', 'safi', 'taza'
);

-- ============================================================
-- PROFILES (all users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Identity
  full_name VARCHAR(100) NOT NULL,
  display_name VARCHAR(50),
  phone VARCHAR(20) UNIQUE NOT NULL,          -- +212XXXXXXXXX format
  email VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  date_of_birth DATE,
  gender gender NOT NULL DEFAULT 'female',    -- Women-only platform
  
  -- Role & Status
  role user_role NOT NULL DEFAULT 'passenger',
  status user_status NOT NULL DEFAULT 'pending',
  
  -- Verification
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  identity_verified verification_status DEFAULT 'not_submitted',
  
  -- Preferences
  preferred_language VARCHAR(5) DEFAULT 'fr', -- 'ar', 'fr', 'en'
  preferred_city city,
  
  -- Security
  last_login_at TIMESTAMPTZ,
  device_fingerprint TEXT,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  
  -- Metadata
  referral_code VARCHAR(20) UNIQUE DEFAULT UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)),
  referred_by UUID REFERENCES profiles(id),
  total_rides INT DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 5.00,
  
  CONSTRAINT phone_format CHECK (phone ~ '^\+212[0-9]{9}$')
);

-- ============================================================
-- IDENTITY VERIFICATION
-- ============================================================

CREATE TABLE identity_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- CIN (Carte Nationale d'Identité)
  cin_number VARCHAR(20),
  cin_front_url TEXT,
  cin_back_url TEXT,
  cin_status verification_status DEFAULT 'not_submitted',
  
  -- Selfie
  selfie_url TEXT,
  selfie_status verification_status DEFAULT 'not_submitted',
  
  -- Review
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  notes TEXT
);

-- ============================================================
-- DRIVERS
-- ============================================================

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status
  status driver_status DEFAULT 'pending',
  is_online BOOLEAN DEFAULT FALSE,
  is_in_ride BOOLEAN DEFAULT FALSE,
  
  -- Location (PostGIS)
  current_location GEOGRAPHY(POINT, 4326),
  last_location_update TIMESTAMPTZ,
  current_city city,
  
  -- Driving License
  license_number VARCHAR(30),
  license_front_url TEXT,
  license_back_url TEXT,
  license_expiry DATE,
  license_status verification_status DEFAULT 'not_submitted',
  
  -- Background check
  background_check_status verification_status DEFAULT 'not_submitted',
  background_check_url TEXT,
  
  -- Stats
  total_trips INT DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 5.00,
  acceptance_rate DECIMAL(5,2) DEFAULT 100.00,
  completion_rate DECIMAL(5,2) DEFAULT 100.00,
  
  -- Approval
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
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Vehicle Info
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  color VARCHAR(30) NOT NULL,
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  category VARCHAR(20) DEFAULT 'economy', -- economy, comfort, luxury, van
  
  -- Documents
  registration_url TEXT,
  insurance_url TEXT,
  inspection_url TEXT,
  
  -- Status
  verification_status verification_status DEFAULT 'not_submitted',
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Capacity
  seats INT DEFAULT 4,
  
  CONSTRAINT valid_year CHECK (year >= 2010 AND year <= EXTRACT(YEAR FROM NOW()) + 1)
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
  is_primary BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT phone_format CHECK (phone ~ '^\+212[0-9]{9}$')
);

-- ============================================================
-- RIDES
-- ============================================================

CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Parties
  passenger_id UUID NOT NULL REFERENCES profiles(id),
  driver_id UUID REFERENCES drivers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  
  -- Status
  status ride_status DEFAULT 'searching',
  
  -- Locations (PostGIS)
  pickup_location GEOGRAPHY(POINT, 4326) NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_city city NOT NULL,
  
  dropoff_location GEOGRAPHY(POINT, 4326) NOT NULL,
  dropoff_address TEXT NOT NULL,
  dropoff_city city NOT NULL,
  
  -- Stops (intermediate)
  stops JSONB DEFAULT '[]',
  
  -- Pricing (InDrive-style negotiation)
  passenger_offered_price DECIMAL(8,2) NOT NULL,
  final_price DECIMAL(8,2),
  currency VARCHAR(3) DEFAULT 'MAD',
  payment_method payment_method DEFAULT 'cash',
  
  -- Route
  estimated_distance_km DECIMAL(8,2),
  estimated_duration_minutes INT,
  actual_distance_km DECIMAL(8,2),
  actual_duration_minutes INT,
  route_polyline TEXT, -- Encoded polyline
  
  -- Timing
  scheduled_at TIMESTAMPTZ,        -- For scheduled rides
  driver_accepted_at TIMESTAMPTZ,
  driver_arrived_at TIMESTAMPTZ,
  ride_started_at TIMESTAMPTZ,
  ride_completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  cancelled_by UUID REFERENCES profiles(id),
  
  -- Safety
  share_token VARCHAR(32) UNIQUE DEFAULT ENCODE(GEN_RANDOM_BYTES(16), 'hex'),
  sos_triggered BOOLEAN DEFAULT FALSE,
  sos_triggered_at TIMESTAMPTZ,
  
  -- Ratings
  passenger_rated BOOLEAN DEFAULT FALSE,
  driver_rated BOOLEAN DEFAULT FALSE,
  
  -- Notes
  notes TEXT,
  promo_code VARCHAR(20)
);

-- ============================================================
-- RIDE BIDS (InDrive-style negotiation)
-- ============================================================

CREATE TABLE ride_bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  bid_amount DECIMAL(8,2) NOT NULL,
  message TEXT,
  estimated_arrival_minutes INT,
  
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, expired
  responded_at TIMESTAMPTZ,
  
  CONSTRAINT bid_amount_positive CHECK (bid_amount > 0)
);

-- ============================================================
-- MESSAGES (In-app chat)
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  content TEXT,
  voice_url TEXT,       -- For voice messages
  message_type VARCHAR(20) DEFAULT 'text', -- text, voice, system
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Encryption metadata
  encrypted BOOLEAN DEFAULT TRUE
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
  
  -- For drivers
  total_earned DECIMAL(10,2) DEFAULT 0.00,
  total_withdrawn DECIMAL(10,2) DEFAULT 0.00,
  pending_withdrawal DECIMAL(10,2) DEFAULT 0.00,
  
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
  reference VARCHAR(100) UNIQUE,   -- External payment reference
  
  payment_gateway VARCHAR(50),     -- stripe, cmi, payzone, cash
  gateway_transaction_id TEXT,
  
  status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed, refunded
  
  metadata JSONB DEFAULT '{}'
);

-- ============================================================
-- RATINGS & REVIEWS
-- ============================================================

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  ride_id UUID UNIQUE NOT NULL REFERENCES rides(id),
  rater_id UUID NOT NULL REFERENCES profiles(id),
  rated_id UUID NOT NULL REFERENCES profiles(id),
  
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- Specific criteria
  punctuality INT CHECK (punctuality >= 1 AND punctuality <= 5),
  cleanliness INT CHECK (cleanliness >= 1 AND cleanliness <= 5),
  safety INT CHECK (safety >= 1 AND safety <= 5),
  
  is_visible BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- COUPONS & PROMOTIONS
-- ============================================================

CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  code VARCHAR(30) UNIQUE NOT NULL,
  description TEXT,
  
  discount_type VARCHAR(20) NOT NULL, -- percentage, fixed
  discount_value DECIMAL(8,2) NOT NULL,
  min_ride_amount DECIMAL(8,2) DEFAULT 0,
  max_discount DECIMAL(8,2),
  
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  
  max_uses INT,
  current_uses INT DEFAULT 0,
  
  is_active BOOLEAN DEFAULT TRUE,
  cities city[],       -- NULL means all cities
  
  created_by UUID REFERENCES profiles(id)
);

CREATE TABLE coupon_uses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  ride_id UUID REFERENCES rides(id),
  used_at TIMESTAMPTZ DEFAULT NOW(),
  discount_applied DECIMAL(8,2),
  
  UNIQUE(coupon_id, user_id)
);

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  user_id UUID NOT NULL REFERENCES profiles(id),
  ride_id UUID REFERENCES rides(id),
  
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50),   -- ride_issue, payment, account, safety, other
  priority VARCHAR(20) DEFAULT 'medium',
  
  status ticket_status DEFAULT 'open',
  assigned_to UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  resolution TEXT,
  
  attachments TEXT[] DEFAULT '{}'
);

CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE -- Admin-only notes
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  
  title VARCHAR(200) NOT NULL,
  title_ar VARCHAR(200),
  title_fr VARCHAR(200),
  
  body TEXT NOT NULL,
  body_ar TEXT,
  body_fr TEXT,
  
  data JSONB DEFAULT '{}',   -- Extra payload (ride_id, etc.)
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  sent_push BOOLEAN DEFAULT FALSE,
  push_sent_at TIMESTAMPTZ
);

-- ============================================================
-- SOS ALERTS
-- ============================================================

CREATE TABLE sos_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  user_id UUID NOT NULL REFERENCES profiles(id),
  ride_id UUID REFERENCES rides(id),
  
  location GEOGRAPHY(POINT, 4326),
  address TEXT,
  
  message TEXT DEFAULT 'SOS Emergency Alert',
  
  -- Notifications sent
  contacts_notified TEXT[],   -- Phone numbers
  admin_notified BOOLEAN DEFAULT FALSE,
  police_notified BOOLEAN DEFAULT FALSE,
  
  status VARCHAR(20) DEFAULT 'active', -- active, resolved
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id),
  
  notes TEXT
);

-- ============================================================
-- AUDIT LOGS (Security)
-- ============================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  user_id UUID REFERENCES profiles(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  
  changes JSONB,
  metadata JSONB DEFAULT '{}'
);

-- ============================================================
-- DRIVER LOCATIONS (Realtime tracking)
-- ============================================================

CREATE TABLE driver_locations (
  driver_id UUID PRIMARY KEY REFERENCES drivers(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  heading DECIMAL(5,2),   -- Compass bearing 0-360
  speed DECIMAL(6,2),     -- km/h
  accuracy DECIMAL(8,2),  -- meters
  
  city city
);

-- ============================================================
-- RIDE LOCATIONS (Trip GPS trail)
-- ============================================================

CREATE TABLE ride_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  heading DECIMAL(5,2),
  speed DECIMAL(6,2)
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Profiles
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);

-- Rides
CREATE INDEX idx_rides_passenger ON rides(passenger_id);
CREATE INDEX idx_rides_driver ON rides(driver_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_pickup_city ON rides(pickup_city);
CREATE INDEX idx_rides_created_at ON rides(created_at DESC);

-- Ride Bids
CREATE INDEX idx_bids_ride ON ride_bids(ride_id);
CREATE INDEX idx_bids_driver ON ride_bids(driver_id);
CREATE INDEX idx_bids_status ON ride_bids(status);

-- Messages
CREATE INDEX idx_messages_ride ON messages(ride_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;

-- Transactions
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- Driver locations (spatial)
CREATE INDEX idx_driver_locations_geo ON driver_locations USING GIST(location);

-- Ride locations
CREATE INDEX idx_ride_locations_ride ON ride_locations(ride_id);

-- Audit logs
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see and edit their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Rides: passengers see their rides, drivers see assigned rides
CREATE POLICY "Passengers see own rides"
  ON rides FOR SELECT USING (auth.uid() = passenger_id);
CREATE POLICY "Drivers see assigned rides"
  ON rides FOR SELECT USING (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
  );

-- Wallets: own wallet only
CREATE POLICY "Users see own wallet"
  ON wallets FOR SELECT USING (auth.uid() = user_id);

-- Emergency contacts: own only
CREATE POLICY "Users manage own emergency contacts"
  ON emergency_contacts FOR ALL USING (auth.uid() = user_id);

-- Notifications: own only
CREATE POLICY "Users see own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Messages: ride participants only
CREATE POLICY "Ride participants can see messages"
  ON messages FOR SELECT USING (
    ride_id IN (
      SELECT r.id FROM rides r
      LEFT JOIN drivers d ON r.driver_id = d.id
      WHERE r.passenger_id = auth.uid() OR d.user_id = auth.uid()
    )
  );

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_drivers_updated BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_rides_updated BEFORE UPDATE ON rides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_wallets_updated BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create wallet on profile creation
CREATE OR REPLACE FUNCTION create_wallet_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_create_wallet
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_wallet_for_new_user();

-- Update driver average rating
CREATE OR REPLACE FUNCTION update_driver_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE drivers
  SET average_rating = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM ratings r
    JOIN rides ri ON r.ride_id = ri.id
    WHERE ri.driver_id = drivers.id
  )
  WHERE user_id = NEW.rated_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_driver_rating
  AFTER INSERT ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_driver_rating();

-- ============================================================
-- SEED DATA — Moroccan Cities Config
-- ============================================================

CREATE TABLE city_configs (
  city city PRIMARY KEY,
  name_ar VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  center_lat DECIMAL(10,7) NOT NULL,
  center_lng DECIMAL(10,7) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  base_fare DECIMAL(8,2) DEFAULT 10.00,
  per_km_rate DECIMAL(8,2) DEFAULT 3.50,
  min_fare DECIMAL(8,2) DEFAULT 15.00
);

INSERT INTO city_configs VALUES
  ('casablanca',  'الدار البيضاء',   'Casablanca',   'Casablanca',  33.5731104, -7.5898434, TRUE, 12, 4.00, 20),
  ('rabat',       'الرباط',          'Rabat',         'Rabat',       33.9715904, -6.8498129, TRUE, 10, 3.50, 15),
  ('marrakech',   'مراكش',           'Marrakech',     'Marrakech',   31.6294723, -7.9810845, TRUE, 10, 3.50, 15),
  ('fes',         'فاس',             'Fès',           'Fez',         34.0337481, -5.0133481, TRUE, 10, 3.50, 15),
  ('agadir',      'أكادير',          'Agadir',        'Agadir',      30.4208342, -9.5981072, TRUE, 10, 3.50, 15),
  ('tanger',      'طنجة',            'Tanger',        'Tangier',     35.7594913, -5.8339216, TRUE, 10, 3.50, 15),
  ('meknes',      'مكناس',           'Meknès',        'Meknes',      33.8935002, -5.5473423, TRUE, 8,  3.00, 12),
  ('oujda',       'وجدة',            'Oujda',         'Oujda',       34.6869768, -1.9113791, TRUE, 8,  3.00, 12),
  ('tetouan',     'تطوان',           'Tétouan',       'Tetouan',     35.5783893, -5.3680997, TRUE, 8,  3.00, 12),
  ('sale',        'سلا',             'Salé',          'Sale',        34.0433748, -6.8085053, TRUE, 8,  3.00, 12),
  ('mohammedia',  'المحمدية',        'Mohammedia',    'Mohammedia',  33.6900388, -7.3825614, TRUE, 8,  3.00, 12),
  ('el_jadida',   'الجديدة',         'El Jadida',     'El Jadida',   33.2316358, -8.5103902, TRUE, 8,  3.00, 12),
  ('beni_mellal', 'بني ملال',        'Béni Mellal',   'Beni Mellal', 32.3372981, -6.3498129, TRUE, 8,  3.00, 12),
  ('nador',       'الناظور',         'Nador',         'Nador',       35.1679547, -2.9287016, TRUE, 8,  3.00, 12),
  ('khouribga',   'خريبكة',          'Khouribga',     'Khouribga',   32.8831281, -6.9063477, TRUE, 7,  2.80, 10),
  ('kenitra',     'القنيطرة',        'Kénitra',       'Kenitra',     34.2610470, -6.5790368, TRUE, 8,  3.00, 12),
  ('safi',        'آسفي',            'Safi',          'Safi',        32.2994254, -9.2375125, TRUE, 8,  3.00, 12),
  ('taza',        'تازة',            'Taza',          'Taza',        34.2100000, -4.0100000, TRUE, 7,  2.80, 10);
