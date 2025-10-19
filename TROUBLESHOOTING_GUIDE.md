# Troubleshooting Guide - Jishu Mobile App

## Common Issues & Solutions

### 1. Blank Screen on App Launch

**Symptoms:** App starts but shows only blank/white screen

**Causes & Solutions:**

#### A. Missing Component Imports
```
Error: Undefined is not a function (evaluating 'Ionicons')
```
**Solution:** Ensure all screens import Ionicons:
```typescript
import Ionicons from 'react-native-vector-icons/Ionicons';
```

#### B. Navigation Not Initialized
**Solution:** Verify `AppNavigator.tsx` is properly wired:
```typescript
// App.tsx should render:
<NavigationContainer>
  <AppNavigator />
</NavigationContainer>
```

#### C. AuthContext Not Initialized
**Solution:** Ensure `AuthProvider` wraps navigation:
```typescript
<AuthProvider>
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
</AuthProvider>
```

---

### 2. "Cannot find module" Errors

**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
npm start -- --reset-cache
```

---

### 3. API Connection Errors

**Error:** `Network Error: Failed to connect to localhost:5000`

**Solutions:**

1. **Verify Flask backend is running:**
   ```bash
   # On your backend machine
   python app.py  # or your Flask startup command
   ```

2. **Check API base URL:**
   - Location: `src/services/api.ts` (Line 8)
   - For Android emulator: Use `10.0.2.2` instead of `localhost`
   - For physical device: Use your machine's IP address

3. **Update API URL for emulator:**
   ```typescript
   // src/services/api.ts
   const API_BASE_URL = 'http://10.0.2.2:5000'; // Android emulator
   // or
   const API_BASE_URL = 'http://192.168.x.x:5000'; // Physical device
   ```

---

### 4. AsyncStorage Errors

**Error:** `Cannot find AsyncStorage`

**Solution:**
```bash
npm install @react-native-async-storage/async-storage
```

---

### 5. Navigation Stack Issues

**Error:** `Cannot navigate to undefined screen`

**Solution:** Verify screen names match in navigation:
```typescript
// AuthNavigator.tsx
<Stack.Screen name="Welcome" component={WelcomeScreen} />
<Stack.Screen name="Login" component={LoginScreen} />

// Navigation calls must use exact names:
navigation.navigate('Welcome')  // ✅ Correct
navigation.navigate('welcome')  // ❌ Wrong (case-sensitive)
```

---

### 6. Token Refresh Not Working

**Error:** Stuck on login after token expires

**Solution:** Verify token refresh endpoint:
```typescript
// src/services/api.ts (Line 63)
const response = await axios.post(`${API_BASE_URL}/refresh-token`, {}, {
  headers: {
    'Authorization': `Bearer ${refreshToken}`
  }
});
```

Ensure Flask backend has `/refresh-token` endpoint.

---

### 7. Loading Screen Stuck

**Error:** App shows loading spinner indefinitely

**Causes:**
- AsyncStorage not initialized
- Auth check hanging
- API call timeout

**Solution:**
```typescript
// App.tsx - Add timeout
const checkAuth = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    console.log('Token exists:', !!token);
  } catch (error) {
    console.error('Error checking auth:', error);
  } finally {
    setIsReady(true);  // Always set to true
  }
};
```

---

### 8. Screen Not Rendering

**Error:** Screen component shows blank

**Solutions:**

1. **Check component returns valid JSX:**
   ```typescript
   // ❌ Wrong - returns null
   if (isLoading) return null;
   
   // ✅ Correct - returns UI
   if (isLoading) {
     return <ActivityIndicator />;
   }
   ```

2. **Verify component is exported:**
   ```typescript
   export default HomeScreen;  // Must have this
   ```

3. **Check for infinite loops:**
   ```typescript
   // ❌ Wrong - infinite loop
   useEffect(() => {
     fetchData();  // No dependency array
   });
   
   // ✅ Correct
   useEffect(() => {
     fetchData();
   }, []);  // Empty array = run once
   ```

---

### 9. Debugging Tips

**Enable Console Logging:**
```bash
# Android
adb logcat | grep ReactNativeJS

# iOS
xcrun simctl spawn booted log stream --predicate 'eventMessage contains[cd] "ReactNativeJS"'
```

**Use React Native Debugger:**
```bash
# Install
npm install -g react-native-debugger

# Run
react-native-debugger
```

**Check Network Requests:**
- Open React Native Debugger
- Go to Network tab
- Monitor API calls

---

### 10. Performance Issues

**Slow app startup:**
1. Check for heavy computations in useEffect
2. Optimize API calls (use Promise.all)
3. Lazy load screens if needed

**Memory leaks:**
1. Clean up subscriptions in useEffect cleanup
2. Cancel API requests on unmount
3. Remove event listeners

---

## Quick Checklist

- [ ] All imports are correct
- [ ] All components are exported
- [ ] Navigation names match exactly
- [ ] AsyncStorage is initialized
- [ ] API base URL is correct
- [ ] Flask backend is running
- [ ] No infinite loops in useEffect
- [ ] All screens return valid JSX
- [ ] Error boundaries are in place
- [ ] Loading states are handled

---

## Getting Help

1. **Check console logs:** `npm start` shows detailed errors
2. **Review error messages:** They usually point to the exact issue
3. **Check network tab:** Verify API calls are being made
4. **Test individual screens:** Temporarily set as root to isolate issues
5. **Review git history:** See what changed recently

---

## Contact & Support

For issues not covered here:
1. Check the main README.md
2. Review BLANK_SCREEN_DIAGNOSIS_AND_FIXES.md
3. Check API_INTEGRATION_SUMMARY.md

