# Jishu React Native App - Quick Start Guide 🚀

## Prerequisites

- Node.js >= 20
- Android Studio (for Android) or Xcode (for iOS)
- Android Emulator or iOS Simulator running
- Backend API running on `http://localhost:5000`

## Installation Status

✅ All dependencies installed
✅ All screens updated with API integration
✅ All services configured
✅ Ready to run!

## Quick Start (3 Steps)

### Step 1: Start Metro Bundler
```bash
cd e:\jishu_backend\jishu_backend\jishu_mobile\Jishu
npm start
```

### Step 2: Run on Android (in new terminal)
```bash
npm run android
```

Or for iOS:
```bash
npm run ios
```

### Step 3: Test the App
- Login with OTP
- Browse courses
- View tests
- Check community posts
- View profile

## What's Implemented

### ✅ Authentication
- OTP request and verification
- Login/Register flow
- Token refresh on 401
- Logout functionality

### ✅ Courses
- List all courses
- Search courses
- Display course details (price, tokens, subjects)

### ✅ Tests
- View test cards
- Start tests
- Track attempts and scores
- View completed tests

### ✅ Community
- View posts with pagination
- Like/unlike posts
- View post details
- Infinite scroll

### ✅ Profile
- View user stats
- View academics
- Logout

### ✅ Chatbot
- Ask questions
- Get AI responses
- Quick question suggestions

## API Configuration

**Base URL**: `http://localhost:5000`

All endpoints are configured in:
- `src/services/apiEndpoints.ts` - API functions
- `src/services/api.ts` - Axios instance with interceptors

## Troubleshooting

### Module not found errors
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### AsyncStorage errors
- Ensure `@react-native-async-storage/async-storage` is installed
- Check that AsyncStorage is imported correctly

### API connection errors
- Verify backend is running on `http://localhost:5000`
- Check network connectivity
- Review console logs for specific errors

### Token refresh issues
- Check that refresh token is stored in AsyncStorage
- Verify API returns both access_token and refresh_token
- Check interceptors in `src/services/api.ts`

## File Structure

```
src/
├── services/
│   ├── api.ts                 # Axios instance with interceptors
│   └── apiEndpoints.ts        # API endpoint functions
├── context/
│   └── AuthContext.tsx        # Authentication state management
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── OTPScreen.tsx
│   ├── HomeScreen.tsx
│   ├── CoursesScreen.tsx
│   ├── TestsScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── CommunityScreen.tsx
│   └── ChatbotScreen.tsx
└── navigation/
    └── AppNavigator.tsx       # Navigation configuration
```

## Testing Checklist

- [ ] App starts without errors
- [ ] Login screen loads
- [ ] OTP request works
- [ ] Login with OTP works
- [ ] Home screen shows stats
- [ ] Courses load and display
- [ ] Search filtering works
- [ ] Tests load and display
- [ ] Profile shows user data
- [ ] Community posts load
- [ ] Like/unlike works
- [ ] Chatbot responds to queries
- [ ] Logout works
- [ ] Error messages display properly
- [ ] Loading states show correctly

## Common Issues & Solutions

### Issue: "Unable to resolve module"
**Solution**: Run `npm install` and `npm start -- --reset-cache`

### Issue: "Cannot find AsyncStorage"
**Solution**: Ensure `@react-native-async-storage/async-storage` is installed

### Issue: "API connection refused"
**Solution**: Verify backend is running on `http://localhost:5000`

### Issue: "Token refresh loop"
**Solution**: Check that refresh token is valid and API returns new tokens

### Issue: "Blank screen on startup"
**Solution**: Check console logs, verify AuthContext is properly initialized

## Performance Tips

1. Use React DevTools to profile components
2. Check console for warnings and errors
3. Monitor network requests in DevTools
4. Use `console.log` with emoji prefixes for debugging
5. Check AsyncStorage for token persistence

## Next Steps

1. Test all screens thoroughly
2. Verify API responses match expected format
3. Test error scenarios (network down, invalid tokens, etc.)
4. Add image upload functionality
5. Implement offline support with caching
6. Add push notifications
7. Performance optimization
8. Deploy to production

## Documentation

- `IMPLEMENTATION_COMPLETE.md` - Complete implementation overview
- `API_INTEGRATION_SUMMARY.md` - API integration details
- `DEPENDENCIES_INSTALLED.md` - Dependency information
- `REACT_NATIVE_API_INTEGRATION_FIXES.md` - Detailed fixes applied

## Support

For issues or questions:
1. Check the documentation files
2. Review console logs
3. Verify backend API is running
4. Check network connectivity
5. Review the code comments

## Status: ✅ READY TO RUN

The app is fully configured and ready to be tested on emulator/device!

Happy coding! 🎉

