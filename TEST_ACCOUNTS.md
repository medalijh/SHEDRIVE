# SheDrive Morocco — Test Accounts Quick Reference

## 🚗 Passenger Test Accounts

| Name | Phone | Email | Password | Status | Wallet | Rating |
|------|-------|-------|----------|--------|--------|--------|
| Fatima Zahra | +212 612345678 | fatima.zahra@example.ma | `SecurePass123!` | ✅ Verified | 150 MAD | 4.8/5 (47 rides) |
| Amina Bennani | +212 623456789 | amina.bennani@example.ma | `Welcome2024!` | ✅ New | 0 MAD | No rides |
| Khadija Morocco | +212 634567890 | khadija@example.ma | `KhadijaPass123!` | ✅ Verified | 75 MAD | 4.9/5 (142 rides) |

## 👩‍🚗 Driver Test Accounts

| Name | Phone | Email | Password | Status | Rating | Acceptance |
|------|-------|-------|----------|--------|--------|------------|
| Khadija M. | +212 612111111 | khadija.driver@example.ma | `DriverPass123!` | ✅ Verified | 4.9/5 | 92% |
| Hind Alami | +212 623111111 | hind.driver@example.ma | `HindPass456!` | ✅ Verified | 4.7/5 | 87% |
| Fatima El-Khatib | +212 634111111 | fatima.driver@example.ma | `FatimaPass789!` | ✅ Verified | 4.5/5 | 78% |

## 🔐 Admin Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@shedrive.ma | `AdminMaster2024!` |
| Support Admin | support@shedrive.ma | `Support2024!` |

## Quick Testing Tips

### Test Passenger Booking
1. Login with **Fatima Zahra**
2. View available drivers on dashboard
3. Click "Trouver une conductrice"
4. Select a ride
5. Confirm booking

### Test Driver Features
1. Login with **Khadija M.**
2. Click "En ligne — Touchez pour commencer" button
3. Accept incoming ride request
4. View ride details
5. Navigate to destination

### Test Mobile Experience
1. Open DevTools (F12)
2. Set viewport to **335 × 655** (iPhone SE)
3. Test both passenger and driver flows
4. Verify all buttons are accessible
5. Check responsive images and text

### Test Emergency SOS
1. Login as any passenger
2. Scroll to bottom on mobile
3. Click red **SOS** button
4. Verify 3-second countdown appears
5. Confirm or cancel

## Common Test Flows

### Flow 1: New Passenger Registration
- Account: Amina Bennani
- Steps: Register → Add payment → Book first ride → Use coupon

### Flow 2: Active Driver Workflow
- Account: Khadija M.
- Steps: Go online → Accept requests → Complete rides → Check earnings

### Flow 3: Established Passenger
- Account: Fatima Zahra
- Steps: Login → View history → Book recurring route → Rate driver

### Flow 4: Safety Features
- Account: Any
- Steps: SOS button → Emergency contacts → GPS sharing → Real-time tracking

## App Sections to Test

| Section | URL | Key Features |
|---------|-----|--------------|
| Homepage | `/` | Hero, Features, CTA |
| Login | `/auth/login` | Form validation, SMS auth |
| Passenger Dashboard | `/passenger/dashboard` | Map, wallet, ride history |
| Driver Dashboard | `/driver/dashboard` | Earnings, ride requests, stats |
| Book Ride | `/passenger/book` | Search, filters, pricing |
| Safety | `/safety` | SOS, emergency contacts |
| About | `/about` | Company info, testimonials |

## Mobile Viewport Sizes for Testing

```
iPhone SE:      335 × 655  ← PRIMARY TEST SIZE
iPhone 12:      390 × 844
iPhone 14 Pro:  430 × 932
Samsung Galaxy: 360 × 720
Tablet Min:     600 × 800
```

## Expected Mobile Experience

✅ **Responsive** - Layouts adapt to 335px width  
✅ **Functional** - All buttons and forms work  
✅ **Readable** - Text sizes >= 12px  
✅ **Accessible** - Touch targets >= 36px  
✅ **Fast** - No excessive page weight  
✅ **Beautiful** - Design maintains brand quality  

## Troubleshooting

### Issue: Content cut off on mobile
- Solution: Check viewport is actually 335×655
- Use Chrome's built-in device emulator

### Issue: Login not working
- Solution: Verify exact credentials (copy-paste to avoid typos)
- Check "Se connecter" button is fully visible

### Issue: Map not loading
- Solution: Wait 1-2 seconds for render
- Check browser console for errors (F12)

### Issue: SOS button hidden
- Solution: Scroll to bottom of page
- It's a fixed button at `bottom: 90px`

---

**Ready to test!** 🎉  
All accounts and pages are fully functional on mobile.  
Use these credentials to explore the app.
