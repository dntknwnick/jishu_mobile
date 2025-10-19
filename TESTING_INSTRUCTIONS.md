# Testing Instructions - Jishu Mobile App

## Pre-Testing Checklist

- [ ] Node.js v20+ installed
- [ ] React Native CLI installed
- [ ] Android emulator running OR iOS simulator ready
- [ ] Flask backend running on `http://localhost:5000`
- [ ] All fixes applied (3 files modified)
- [ ] Dependencies installed (`npm install`)

---

## Step 1: Start Metro Bundler

```bash
cd e:\jishu_mobile\jishu_mobile
npm start
```

**Expected Output:**
```
Metro Bundler ready.
To reload the app press 'r'
To open developer menu press 'd'
```

---

## Step 2: Run on Android

### Option A: Android Emulator
```bash
npm run android
```

### Option B: Physical Device
```bash
# Connect device via USB
adb devices  # Verify device is listed
npm run android
```

**Expected:** App installs and launches

---

## Step 3: Verify App Boot

### ✅ Expected Behavior

1. **Splash/Loading Screen** (2-3 seconds)
   - Shows loading spinner
   - Checks for existing auth token

2. **Welcome Screen** (Should appear)
   - Jishu logo with school icon
   - "Ace Your Exams with Confidence" tagline
   - 4 feature bullets
   - "Get Started" button (white)
   - "I Already Have an Account" button (outlined)

### ❌ If Blank Screen Appears

1. Check console for errors:
   ```bash
   # In Metro terminal, look for red errors
   # Or check Android logcat:
   adb logcat | grep ReactNativeJS
   ```

2. Common errors:
   - `Ionicons is not defined` → Imports not fixed
   - `Cannot find module` → Dependencies missing
   - `Network error` → Backend not running

---

## Step 4: Test Navigation Flow

### Test 1: Welcome → Login
1. Tap "I Already Have an Account"
2. **Expected:** LoginScreen appears with email input

### Test 2: Welcome → Register
1. Go back to Welcome (tap back button)
2. Tap "Get Started"
3. **Expected:** RegisterScreen appears with name, email, phone inputs

### Test 3: Login Flow
1. On LoginScreen, enter email: `test@example.com`
2. Tap "Send OTP"
3. **Expected:** 
   - Loading state shows "Sending OTP..."
   - Success alert appears
   - Navigate to OTPScreen

### Test 4: OTP Entry
1. On OTPScreen, enter 6-digit code
2. Tap "Verify OTP"
3. **Expected:**
   - Loading state shows "Verifying..."
   - If valid: Navigate to HomeScreen
   - If invalid: Error alert, clear inputs

---

## Step 5: Test Main App Screens

### HomeScreen (Dashboard)
- [ ] Displays user greeting
- [ ] Shows 4 stat cards (Tests, Score, Hours, Accuracy)
- [ ] Quick action buttons visible (Start Test, Courses, Community, AI)
- [ ] Recent tests section visible
- [ ] Study streak card visible

### CoursesScreen
- [ ] Search bar visible
- [ ] Course list loads
- [ ] Can search/filter courses
- [ ] Course details show (name, subjects, price)

### TestsScreen
- [ ] Two tabs: "Available Tests" and "Completed"
- [ ] Test cards display with status
- [ ] Can tap "Start Test" button
- [ ] Completed tests show score

### CommunityScreen
- [ ] "Share Your Experience" button visible
- [ ] Community posts load
- [ ] Can like/unlike posts
- [ ] Can view comments

### ChatbotScreen
- [ ] AI Assistant header visible
- [ ] Quick question buttons visible
- [ ] Can type and send messages
- [ ] Bot responds with messages

### ProfileScreen
- [ ] User avatar/placeholder visible
- [ ] User name and email display
- [ ] Stats grid shows (Tests, Score, Hours, Accuracy)
- [ ] Menu items visible (Edit, Courses, Bookmarks, Settings, Logout)
- [ ] Achievements section visible

---

## Step 6: Test Error Handling

### Test Network Error
1. Disconnect WiFi/Mobile data
2. Try to load any screen
3. **Expected:** Error message displays with retry button

### Test API Timeout
1. Stop Flask backend
2. Try to load courses/tests
3. **Expected:** Timeout error with retry option

### Test Invalid OTP
1. Enter wrong OTP code
2. Tap verify
3. **Expected:** Error alert, inputs cleared

---

## Step 7: Test Logout

1. Go to ProfileScreen
2. Tap "Logout"
3. Confirm logout
4. **Expected:** Return to WelcomeScreen

---

## Step 8: Monitor Console Logs

### Expected Success Logs
```
✅ Token exists: false
✅ App initialized
✅ Welcome screen loaded
📧 Requesting OTP for: test@example.com
✅ OTP sent successfully
🔐 Attempting login with email: test@example.com
✅ Login successful
📊 Fetching dashboard data...
✅ Dashboard data fetched
```

### Error Logs to Watch For
```
❌ Ionicons is not defined
❌ Cannot find module
❌ Network error
❌ API request failed
```

---

## Step 9: Performance Check

- [ ] App boots in < 5 seconds
- [ ] Screens transition smoothly
- [ ] No lag when scrolling
- [ ] API calls complete in < 3 seconds
- [ ] No memory leaks (check RAM usage)

---

## Step 10: Final Verification

- [ ] ✅ App boots without blank screen
- [ ] ✅ Welcome screen displays
- [ ] ✅ Navigation works
- [ ] ✅ All screens render
- [ ] ✅ API calls work
- [ ] ✅ Error handling works
- [ ] ✅ Logout works

---

## Debugging Commands

### Clear Cache
```bash
npm start -- --reset-cache
```

### View Android Logs
```bash
adb logcat | grep ReactNativeJS
```

### View iOS Logs
```bash
xcrun simctl spawn booted log stream --predicate 'eventMessage contains[cd] "ReactNativeJS"'
```

### Rebuild App
```bash
npm run android -- --no-packager
```

---

## Success Criteria

✅ **App boots successfully**
✅ **Welcome screen displays**
✅ **Navigation works smoothly**
✅ **All screens render correctly**
✅ **API calls succeed**
✅ **Error messages display**
✅ **No console errors**

---

## Next Steps After Testing

1. **If all tests pass:**
   - Deploy to production
   - Test on real devices
   - Monitor user feedback

2. **If issues found:**
   - Check TROUBLESHOOTING_GUIDE.md
   - Review console logs
   - Check API responses
   - Verify backend is running

---

## Support

For issues:
1. Check BLANK_SCREEN_DIAGNOSIS_AND_FIXES.md
2. Check TROUBLESHOOTING_GUIDE.md
3. Review console logs
4. Check network requests

