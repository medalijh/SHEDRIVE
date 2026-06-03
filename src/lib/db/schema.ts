import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  date,
  integer,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified'),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- App tables ---

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  fullName: text('fullName').notNull(),
  phone: text('phone').notNull().unique(),
  email: text('email'),
  role: text('role').notNull().default('passenger'),
  city: text('city'),
  preferredLanguage: text('preferredLanguage').default('fr'),
  gender: text('gender').default('female'),
  status: text('status').default('active'),
  phoneVerified: boolean('phoneVerified').default(false),
  identityVerified: boolean('identityVerified').default(false),
  rating: numeric('rating', { precision: 3, scale: 2 }).default('5.0'),
  totalRides: integer('totalRides').default(0),
  totalEarnings: numeric('totalEarnings', { precision: 10, scale: 2 }).default(
    '0'
  ),
  photoUrl: text('photoUrl'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const drivers = pgTable('drivers', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  licenseNumber: text('licenseNumber').notNull().unique(),
  licenseExpiry: date('licenseExpiry'),
  licenseVerified: boolean('licenseVerified').default(false),
  insuranceNumber: text('insuranceNumber'),
  insuranceExpiry: date('insuranceExpiry'),
  approvalStatus: text('approvalStatus').default('pending'),
  vehicleType: text('vehicleType'),
  vehicleModel: text('vehicleModel'),
  vehicleColor: text('vehicleColor'),
  licensePlate: text('licensePlate').unique(),
  currentLat: numeric('currentLat', { precision: 10, scale: 8 }),
  currentLng: numeric('currentLng', { precision: 10, scale: 8 }),
  lastLocationUpdate: timestamp('lastLocationUpdate'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const rides = pgTable('rides', {
  id: text('id').primaryKey(),
  passengerId: text('passengerId').notNull(),
  driverId: text('driverId'),
  fromAddress: text('fromAddress').notNull(),
  fromLat: numeric('fromLat', { precision: 10, scale: 8 }).notNull(),
  fromLng: numeric('fromLng', { precision: 10, scale: 8 }).notNull(),
  toAddress: text('toAddress').notNull(),
  toLat: numeric('toLat', { precision: 10, scale: 8 }).notNull(),
  toLng: numeric('toLng', { precision: 10, scale: 8 }).notNull(),
  passengerPrice: numeric('passengerPrice', { precision: 10, scale: 2 }),
  driverEarning: numeric('driverEarning', { precision: 10, scale: 2 }),
  paymentMethod: text('paymentMethod').default('wallet'),
  paymentStatus: text('paymentStatus').default('pending'),
  status: text('status').default('searching'),
  sosTriggered: boolean('sosTriggered').default(false),
  startTime: timestamp('startTime'),
  endTime: timestamp('endTime'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const wallets = pgTable('wallets', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  balance: numeric('balance', { precision: 10, scale: 2 }).default('0'),
  totalSpent: numeric('totalSpent', { precision: 10, scale: 2 }).default('0'),
  totalRecharged: numeric('totalRecharged', { precision: 10, scale: 2 }).default(
    '0'
  ),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const walletTransactions = pgTable('wallet_transactions', {
  id: text('id').primaryKey(),
  walletId: text('walletId').notNull(),
  type: text('type').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  referenceId: text('referenceId'),
  referenceType: text('referenceType'),
  paymentMethod: text('paymentMethod'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const sosAlerts = pgTable('sos_alerts', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  rideId: text('rideId'),
  lat: numeric('lat', { precision: 10, scale: 8 }),
  lng: numeric('lng', { precision: 10, scale: 8 }),
  status: text('status').default('active'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const ratings = pgTable('ratings', {
  id: text('id').primaryKey(),
  rideId: text('rideId').notNull(),
  fromUserId: text('fromUserId').notNull(),
  toUserId: text('toUserId').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
