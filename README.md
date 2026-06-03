# 🌹 SheDrive Morocco

**Women-only ride-hailing PWA — Luxury · Safe · 🇲🇦 Moroccan**

> A world-class Progressive Web App providing safe, premium, women-exclusive ride-hailing across Morocco. Built with Next.js 14, TypeScript, TailwindCSS, Supabase, and Framer Motion.

---

## ✨ Features

### For Passengers 🌸
- 🗺️ Live map with real-time driver tracking
- 💰 InDrive-style price negotiation
- 🛡️ SOS emergency button (always visible)
- 💬 In-app encrypted chat with drivers
- 📍 Trip sharing with family contacts
- 💳 Wallet with MAD top-up (CMI / PayZone / Card)
- 📋 Full ride history with receipts
- 🌍 Arabic / French / English support

### For Drivers 🚗
- 🟢 Online/Offline toggle
- 📲 Real-time ride request with 30s countdown
- 💰 Earnings dashboard (daily/weekly/monthly)
- 📊 Acceptance rate & completion stats
- 📄 Document management & verification status
- 🏦 Bank withdrawal or cash payout

### Admin Panel 👩‍💼
- 📊 Real-time analytics dashboard
- 👥 User management & suspension
- ✅ Driver approval workflow
- 🆘 SOS alert monitoring
- 🗺️ Live rides table
- 📈 Revenue charts by city

---

## 🏗️ Tech Stack

| Layer        | Technology                               |
|--------------|------------------------------------------|
| Framework    | Next.js 14 (App Router)                  |
| Language     | TypeScript 5                             |
| Styling      | TailwindCSS v4 + Custom CSS Design System |
| Animation    | Framer Motion                            |
| Database     | Supabase (PostgreSQL + RLS)              |
| Auth         | Supabase Auth + OTP via SMS             |
| State        | Zustand                                  |
| Maps         | Google Maps API (planned)               |
| Payments     | CMI Maroc · Stripe                      |
| PWA          | Web App Manifest + Service Worker       |
| i18n         | next-intl (ar / fr / en)               |
| Forms        | React Hook Form + Zod                  |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm
- Supabase account
- Google Maps API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/shedrive-morocco.git
cd shedrive-morocco

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Google Maps credentials

# Initialize the database
# Run database/schema.sql in your Supabase SQL editor

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
shedrive-morocco/
├── database/
│   └── schema.sql          # Full PostgreSQL schema with RLS policies
├── public/
│   ├── manifest.json        # PWA manifest
│   └── icons/               # App icons
├── src/
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── layout.tsx       # Root layout + SEO
│   │   ├── globals.css      # Complete design system
│   │   │
│   │   ├── auth/login/      # Auth & registration
│   │   │
│   │   ├── passenger/       # Passenger app
│   │   │   ├── dashboard/   # Live map + quick book
│   │   │   ├── book/        # 4-step booking flow
│   │   │   ├── tracking/    # Live ride tracking
│   │   │   ├── wallet/      # Wallet & transactions
│   │   │   ├── history/     # Ride history
│   │   │   └── settings/    # Profile & safety
│   │   │
│   │   ├── driver/          # Driver app
│   │   │   ├── dashboard/   # Online toggle + requests
│   │   │   ├── earnings/    # Earnings dashboard
│   │   │   └── settings/    # Driver profile
│   │   │
│   │   ├── admin/           # Admin panel
│   │   │   ├── page.tsx     # Overview dashboard
│   │   │   ├── drivers/     # Driver approval
│   │   │   └── users/       # User management
│   │   │
│   │   ├── about/           # About Us
│   │   ├── safety/          # Safety features
│   │   ├── how-it-works/    # How it works
│   │   ├── contact/         # Contact form
│   │   ├── privacy/         # Privacy policy
│   │   ├── terms/           # Terms of service
│   │   │
│   │   └── api/             # Next.js API routes
│   │       ├── rides/       # Ride CRUD
│   │       ├── auth/        # Register + OTP
│   │       └── admin/       # Admin actions
│   │
│   ├── lib/supabase/        # Supabase client (browser + server)
│   ├── middleware.ts         # Auth middleware + route protection
│   └── types/               # TypeScript definitions
└── next.config.ts           # Next.js + security headers
```

---

## 🔒 Security

- ✅ OWASP Top 10 compliance
- ✅ Row Level Security (RLS) on all Supabase tables
- ✅ AES-256 encryption at rest
- ✅ TLS 1.3 in transit
- ✅ 2FA authentication
- ✅ Phone OTP verification (Moroccan numbers)
- ✅ Masked phone calls between users
- ✅ SOS emergency system with GPS
- ✅ Strict Content-Security-Policy headers
- ✅ Moroccan law 09-08 & GDPR compliant

---

## 🌍 Moroccan Cities Supported

Casablanca · Rabat · Marrakech · Fès · Agadir · Tanger · Meknès · Oujda · Kénitra · Tétouan · Salé · Mohammedia · El Jadida · Beni Mellal · Nador · Laâyoune · Dakhla · Essaouira

---

## 🎨 Design System

- **Colors**: Rose Gold · Deep Emerald · Ivory White · Moroccan Gold
- **Typography**: Cormorant Garamond (display) · Inter (body) · Noto Sans Arabic (RTL)
- **Patterns**: Traditional Zellige tile SVG backgrounds
- **Motion**: Smooth micro-animations + glassmorphism

---

## 🤝 Contributing

This project is private. Contact the SheDrive team at [contact@shedrive.ma](mailto:contact@shedrive.ma).

---

## 📜 License

© 2025 SheDrive Morocco SAS. All rights reserved.

**Exclusively built for Moroccan women. 🇲🇦🌹**
