# Deploy SheDrive Morocco Now

Follow these steps exactly to deploy SheDrive Morocco to production with Vercel and Supabase.

## Step 1: Create Supabase Project (5 mins)

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Click "New Project"
4. Fill in:
   - Name: `shedrive-morocco`
   - Database Password: Generate a strong password (save it!)
   - Region: **Europe (Frankfurt)** (closest to Morocco)
5. Click "Create new project" and wait for initialization (5-10 mins)

## Step 2: Set Up Database Schema (2 mins)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_create_shedrive_tables.sql`
4. Paste it into the SQL editor
5. Click **Run**
6. Wait for completion (should see "completed successfully")
7. Verify: Go to **Table Editor** on the left, should see 8 tables:
   - profiles
   - drivers
   - rides
   - wallets
   - wallet_transactions
   - emergency_contacts
   - sos_alerts
   - coupons

## Step 3: Get Your Supabase Keys (1 min)

1. In Supabase, go to **Settings** (gear icon) > **API**
2. Copy and save these three keys:
   - `Project URL` (looks like: `https://xxxx.supabase.co`)
   - `anon public` key (starts with `eyJ...`)
   - `service_role` key (starts with `eyJ...`, very long)
3. Keep these safe - you'll use them next

## Step 4: Configure Supabase Auth (2 mins)

1. Go to **Authentication** > **Providers** > **Phone**
2. Enable Phone provider
3. Configure SMS provider:
   - Option A: Twilio (recommended for global)
   - Option B: Africa's Talking (cheaper for MENA)
   - For now, you can skip SMS config - it won't affect development
4. Go to **Authentication** > **URL Configuration**
5. Set:
   - Site URL: `https://shedrive.ma` (or your domain)
   - Redirect URLs: Add these (we'll update after deployment):
     - `http://localhost:3000/auth/callback`
     - `https://your-vercel-domain.vercel.app/auth/callback`

## Step 5: Deploy to Vercel (5 mins)

### Option A: Via GitHub (Recommended)

1. Make sure your code is pushed to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Sign in or create account
4. Click **New Project**
5. Click **Import Git Repository**
6. Select your GitHub repo (medalijh/SHEDRIVE)
7. Click **Import**
8. Vercel auto-detects Next.js - click **Deploy**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally (one time only)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
cd /path/to/shedrive
vercel --prod
```

## Step 6: Add Environment Variables to Vercel (3 mins)

1. In Vercel dashboard, click your SheDrive project
2. Go to **Settings** > **Environment Variables**
3. Add these variables (from Step 3):

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ... (the long one)
NEXT_PUBLIC_APP_URL = https://shedrive-xxxxxx.vercel.app (your vercel domain)
```

4. For each variable:
   - Paste the value
   - Select Environments: Production + Preview + Development
   - Click **Save**

5. Click **Redeploy** to apply changes

## Step 7: Verify Deployment (2 mins)

1. Copy your Vercel domain from the dashboard (looks like: `https://shedrive-xxxxx.vercel.app`)
2. Open it in browser - should see SheDrive Morocco homepage
3. Test health check:
   ```
   https://shedrive-xxxxx.vercel.app/api/health
   ```
   Should return:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "timestamp": "2025-01-...",
     "region": "cdg1"
   }
   ```

## Step 8: Update Supabase Auth Redirect URLs (1 min)

1. Back in Supabase, go to **Authentication** > **URL Configuration**
2. Update **Redirect URLs** with your actual Vercel domain:
   - `https://shedrive-xxxxx.vercel.app/auth/callback`
   - `https://shedrive-xxxxx.vercel.app/auth/login`
3. Save

## Step 9: Set Up Custom Domain (Optional, 5 mins)

If you own `shedrive.ma` or similar:

1. In Vercel, go to **Settings** > **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `shedrive.ma`)
4. Follow instructions to add DNS records at your registrar
5. Update Supabase redirect URLs with new domain

## Step 10: Enable HTTPS & Security (Auto)

Vercel automatically:
- Enables HTTPS
- Generates SSL certificate
- Sets security headers
- Enables caching

No action needed!

## Step 11: Test Authentication (3 mins)

1. Open your deployed app
2. Go to `/auth/register`
3. Enter a phone number: `+212 612345678`
4. SMS will be sent (if SMS provider configured)
5. For testing without SMS:
   - Use Supabase dashboard to create test users
   - Then test login flow

## Step 12: Create Test Users (Optional, 2 mins)

In Supabase SQL Editor, run:

```sql
-- Create test passenger
INSERT INTO public.profiles (id, full_name, phone, role, gender, status, city, preferred_language, phone_verified)
VALUES (
  gen_random_uuid(),
  'Fatima Test',
  '+212612345678',
  'passenger',
  'female',
  'active',
  'Casablanca',
  'fr',
  true
);

-- Create test driver
INSERT INTO public.profiles (id, full_name, phone, role, gender, status, city, preferred_language, phone_verified)
VALUES (
  gen_random_uuid(),
  'Khadija Test',
  '+212623456789',
  'driver',
  'female',
  'active',
  'Casablanca',
  'fr',
  true
);
```

## Step 13: Monitor & Maintain

### Weekly
- Check Vercel logs: Dashboard > Deployments
- Check Supabase health: Supabase dashboard

### Monthly
- Update dependencies: `npm update`
- Review security logs
- Check database size (free tier: 500MB limit)

### Database Backup
1. Supabase > Settings > Backups
2. Enable automatic backups
3. Backups run daily

## Success Criteria

Your deployment is successful when:

- [ ] App loads on your Vercel domain
- [ ] `/api/health` returns `{ status: "ok" }`
- [ ] Database tables visible in Supabase
- [ ] Authentication flow starts (registration page loads)
- [ ] No errors in Vercel logs
- [ ] No errors in Supabase logs

## Troubleshooting

### "Supabase connection failed"
- Check environment variables in Vercel (Step 6)
- Verify keys are correct (Step 3)
- Redeploy after updating env vars

### "SMS not sending"
- Supabase SMS not configured (that's OK for MVP)
- Skip SMS provider setup, use test users instead

### "Page is blank"
- Check Vercel build logs
- Check browser console for errors (F12)
- Verify all env vars are set

### "Database error"
- Check table names in SQL (they are snake_case)
- Verify RLS policies in Supabase
- Check user permissions in database

## Production Checklist

- [ ] Supabase project created
- [ ] Database schema migrated
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Health check endpoint working
- [ ] Auth flow tested
- [ ] Custom domain configured (optional)
- [ ] Database backups enabled
- [ ] Monitoring enabled

## Next Steps

1. **Add Payment Gateway** (optional)
   - CMI for Morocco
   - Stripe for international

2. **Configure SMS Provider** (optional)
   - Twilio or Africa's Talking
   - Set up in Supabase Authentication

3. **Set Up Monitoring** (optional)
   - Sentry for error tracking
   - PostHog for analytics

4. **Scale Database** (when needed)
   - Upgrade Supabase tier
   - Add replication

## Support

If you encounter issues:

1. Check Vercel logs: Dashboard > Deployments
2. Check Supabase logs: SQL Editor > Logs
3. Check browser console: F12 > Console tab
4. Open GitHub issue with error details

## Estimated Total Time: 30 minutes

- Step 1: 5 mins
- Step 2: 2 mins
- Step 3: 1 min
- Step 4: 2 mins
- Step 5: 5 mins
- Step 6: 3 mins
- Step 7: 2 mins
- Step 8: 1 min
- Step 9: 5 mins (optional)
- Step 10: Auto
- Steps 11-13: 5 mins

Your SheDrive Morocco is now production-ready!

Made for Moroccan women. Sécurité, Élégance, Autonomie.

---
Version: 1.0.0
Last Updated: January 2025
