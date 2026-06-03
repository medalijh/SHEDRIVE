# 🚀 SheDrive Morocco — Deployment Guide

> Step-by-step guide to deploy on **Vercel** + **Supabase** in production.

---

## ✅ Pre-Deployment Checklist

### 1. Supabase Setup

#### A — Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `shedrive-morocco`
3. Password: generate a strong password
4. Region: **EU West (Frankfurt)** — closest to Morocco
5. Click **Create new project**

#### B — Run Database Schema
1. In Supabase → **SQL Editor** → New query
2. Copy & paste the contents of `database/schema.sql`
3. Click **Run** ✅

#### C — Configure Auth Settings
1. Supabase → **Authentication → Settings**
2. Enable **Phone (OTP)** provider
3. Set `Site URL` to `https://shedrive.ma`
4. Add `https://shedrive.ma` to **Redirect URLs**
5. Set **JWT Expiry** to `86400` (24h)

#### D — Get Your Keys
- `NEXT_PUBLIC_SUPABASE_URL` → Settings → API → URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Settings → API → anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` → Settings → API → service_role key (SECRET!)

#### E — Enable Row Level Security
All tables have RLS enabled in the schema. Verify in:
Supabase → **Table Editor** → each table → 🔒 RLS Enabled

---

### 2. Vercel Deployment

#### A — Connect Repository
1. [vercel.com](https://vercel.com) → New Project
2. Import your GitHub/GitLab repository
3. Framework: **Next.js** (auto-detected)

#### B — Set Environment Variables
In Vercel → Settings → Environment Variables, add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=https://shedrive.ma
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_EMAIL=mailto:admin@shedrive.ma
JWT_SECRET=your-32-char-minimum-secret
```

#### C — Generate VAPID Keys (for Push Notifications)
```bash
npx web-push generate-vapid-keys
```

#### D — Deploy
```bash
git push origin main
# Vercel auto-deploys on push ✅
```

#### E — Configure Custom Domain
1. Vercel → Domains → Add `shedrive.ma`
2. Add `www.shedrive.ma` as redirect
3. Update DNS at your registrar:
   - `A` record → Vercel IP (shown in dashboard)
   - `CNAME www` → `cname.vercel-dns.com`

---

### 3. PWA Validation

After deployment, verify PWA is working:

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run PWA audit
lighthouse https://shedrive.ma --only-categories=pwa --output=html
```

**Expected Lighthouse PWA Score: 100/100** ✅

#### PWA Checklist
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] `manifest.json` served with correct Content-Type
- [ ] Service worker registered and active
- [ ] Offline page working (`/offline`)
- [ ] Install prompt appearing on mobile
- [ ] Add to Home Screen working on iOS & Android
- [ ] Push notifications working

#### Test on Real Devices
- **iPhone**: Safari → Share → Add to Home Screen
- **Android**: Chrome → Install App banner
- **Samsung**: Samsung Internet → "Add to Home Screen"

---

### 4. Supabase Realtime (for Live Tracking)

Enable Realtime on the `rides` table:
```sql
-- In Supabase SQL Editor
ALTER PUBLICATION supabase_realtime ADD TABLE rides;
ALTER PUBLICATION supabase_realtime ADD TABLE drivers;
```

Then in Supabase → **Database → Replication**, enable `rides` and `drivers`.

---

### 5. Google Maps Integration

1. [console.cloud.google.com](https://console.cloud.google.com)
2. Enable: **Maps JavaScript API**, **Places API**, **Directions API**, **Geocoding API**
3. Create API key → Restrict to your domain: `*.shedrive.ma`
4. Add to Vercel env: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...`

---

### 6. SMS (OTP) Provider

**Recommended for Morocco: Twilio**
1. [twilio.com](https://twilio.com) → Get a phone number
2. Add to Vercel:
   ```env
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=+12345678901
   ```

**Alternative: Africa's Talking** (cheaper for MENA)
```env
SMS_PROVIDER=africas_talking
AT_API_KEY=...
AT_USERNAME=...
```

---

### 7. Moroccan Payment Gateway (CMI)

1. Apply for CMI merchant account at [cmi.co.ma](https://cmi.co.ma)
2. Get sandbox credentials, test with card: `4111 1111 1111 1111`
3. Add to Vercel:
   ```env
   CMI_MERCHANT_ID=...
   CMI_SECRET_KEY=...
   CMI_STORE_KEY=...
   ```

---

### 8. Post-Deployment Verification

```bash
# 1. Check all routes respond correctly
curl -I https://shedrive.ma
curl -I https://shedrive.ma/manifest.json
curl -I https://shedrive.ma/sw.js
curl -I https://shedrive.ma/api/admin/stats

# 2. Verify security headers
curl -I https://shedrive.ma | grep -E "(X-Frame|CSP|X-Content)"

# 3. Test offline page
# Open DevTools → Network → Offline → Reload
```

---

### 9. Monitoring

- **Vercel Analytics**: Enabled automatically on Vercel Pro
- **Supabase Logs**: Dashboard → Logs → API, Auth, DB
- **Error Tracking**: Add Sentry (`npm install @sentry/nextjs`)
- **Uptime**: Set up [UptimeRobot](https://uptimerobot.com) for `https://shedrive.ma`

---

## 🔒 Security Production Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` — server-side only, never in client code
- [ ] RLS enabled on ALL tables
- [ ] HTTPS enforced (Vercel default)
- [ ] CSP headers active (see `next.config.ts`)
- [ ] VAPID keys rotated from defaults
- [ ] Admin routes protected by middleware
- [ ] `.env.local` in `.gitignore` ✅
- [ ] Rate limiting on API routes
- [ ] Phone OTP for auth (no passwords sent in plaintext)

---

## 📊 Recommended Vercel Plan

| Feature | Hobby | Pro |
|---------|-------|-----|
| Price | Free | $20/mo |
| Custom domains | ✅ | ✅ |
| Analytics | ❌ | ✅ |
| Password protection | ❌ | ✅ |
| Team members | ❌ | ✅ |
| SLA | ❌ | 99.99% |

→ **Recommend Vercel Pro** for production 🌟

---

## 📱 App Store Distribution (Optional)

### PWABuilder (Free)
1. Go to [pwabuilder.com](https://pwabuilder.com)
2. Enter `https://shedrive.ma`
3. Generate Android (APK) and iOS (via Safari workaround)
4. Submit to Google Play Store

### Capacitor (Native Wrapper)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init SheDrive com.shedrive.morocco
npx cap add android
npx cap add ios
npm run build && npx cap sync
```

---

**SheDrive Morocco is production-ready. 🌹🇲🇦**
