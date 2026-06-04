# SheDrive Morocco - Quick Start Guide

## Live App
**URL:** https://shedrive.vercel.app

---

## Test Accounts

### Passenger
```
Email: fatima.passenger@shedrive.ma
Password: TestPass123!
```

### Driver
```
Email: amira.driver@shedrive.ma
Password: TestPass123!
```

---

## What to Test

### 1. Registration & Login (5 minutes)
1. Go to https://shedrive.vercel.app/auth/register
2. Fill in the form:
   - Name: Your name
   - Email: test@example.com
   - Phone: +212 612 345 678
   - City: Casablanca
   - Password: TestPass123!
3. Click register
4. Go to login page: https://shedrive.vercel.app/auth/login
5. Sign in with your new account

### 2. Passenger Dashboard (5 minutes)
1. Log in as a passenger
2. Go to `/passenger/dashboard`
3. You should see:
   - Your location via GPS (if permitted)
   - Available nearby drivers (real-time updates)
   - Ride request button
   - Notification panel
4. Click "Réserver un trajet" to create a ride
5. Watch drivers update in real-time

### 3. Driver Dashboard (5 minutes)
1. Log in as a driver
2. Go to `/driver/dashboard`
3. Click "Allez en ligne" to go online
4. You should see:
   - Driver status (online)
   - Available nearby rides (real-time updates)
   - Your earnings
   - Your completed rides count
5. Click "Accepter ce trajet" to accept a ride
6. Click "Terminer le trajet" to complete it

### 4. Real-Time Tracking (5 minutes)
1. Open driver dashboard in one window
2. Open passenger dashboard in another
3. Create a ride as passenger
4. Accept the ride as driver
5. Watch live updates:
   - Driver location appears on passenger's map
   - Ride status changes in real-time
   - Notifications appear when driver accepts

### 5. Map Visualization (3 minutes)
1. Create an active ride
2. Go to `/passenger/tracking`
3. You should see:
   - Green marker: Your pickup location
   - Red marker: Your destination
   - Blue marker: Driver location (when accepted)
   - Dashed line: Route between points

### 6. Mobile Testing (3 minutes)
1. Open the app on mobile: https://shedrive.vercel.app
2. Verify:
   - App is fully responsive
   - Bottom navigation works
   - Buttons are touch-friendly
   - No horizontal scroll
3. Try "Install app" if available

### 7. Design & Styling (2 minutes)
1. Check the color scheme:
   - White background
   - Dusty pink primary buttons
   - Royal purple secondary buttons
   - Baby rose accents
   - Silver text elements
2. Verify:
   - No emojis (Lucide icons instead)
   - Moroccan arch patterns in background
   - Professional, girly, creative aesthetic

---

## Real-Time Features Checklist

- [ ] Driver search updates every 3 seconds
- [ ] Ride status updates every 2 seconds
- [ ] Notifications appear in real-time
- [ ] GPS location updates continuously
- [ ] Map shows live driver position
- [ ] Available rides count changes automatically
- [ ] Earnings update when ride completes

---

## Browser Requirements

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

### Required Permissions
- Geolocation (for GPS tracking)

---

## What's Working

✓ All 33 pages accessible
✓ Authentication (login + register)
✓ Real-time ride tracking
✓ Real-time driver updates
✓ Live notifications
✓ GPS geolocation
✓ Map visualization
✓ Driver proximity search
✓ Responsive design
✓ PWA installation
✓ Multi-language support (FR/AR/EN)

---

## What's Not Yet Implemented

- Actual database persistence (in-memory for demo)
- Payment processing
- SMS/Email notifications
- Real Mapbox integration (canvas-based mock)
- User profile pictures
- Driver license verification
- Rating system (UI ready, backend needs database)

---

## To Run Locally

```bash
# Clone the repo
git clone https://github.com/medalijh/SHEDRIVE.git
cd SHEDRIVE

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## API Endpoints (Ready to Test)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Rides
- `GET /api/rides?userId=...` - Get user's rides
- `POST /api/rides` - Create new ride
- `PUT /api/rides` - Update ride status

### Drivers
- `GET /api/drivers?lat=...&lng=...` - Find nearby drivers
- `POST /api/drivers` - Update driver location

### Notifications
- `GET /api/notifications?userId=...` - Get notifications
- `POST /api/notifications` - Send notification
- `PUT /api/notifications` - Mark as read

---

## Colors Reference

```
Primary (Dusty Pink):    #D97AB8
Secondary (Royal Purple): #8A5FBF
Accent (Baby Rose):      #FF88C8
Neutral (Silver):        #9A9AAD
Background:              #FFFFFF
```

---

## Support

For issues or questions:
1. Check the GitHub repository
2. Review the COMPLETE_REDESIGN.md for technical details
3. Check API error messages in browser console

---

## Design System

**Typography:**
- Display: Cormorant Garamond (serif)
- Body: Inter (sans-serif)
- Arabic: Noto Sans Arabic (sans-serif)

**Components:**
- All buttons use consistent gradient styles
- All cards have consistent shadows
- All inputs have consistent validation states
- All modals have consistent animations

**Icons:**
- All from Lucide React
- 24px default size
- Color-coded by function

---

## Enjoy Testing SheDrive Morocco!

Sécurité, Élégance, Autonomie. 🇲🇦
