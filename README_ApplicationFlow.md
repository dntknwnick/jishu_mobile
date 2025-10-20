# Jishu Frontend Application Flow - Complete Documentation

This directory contains comprehensive documentation of the Jishu React frontend application, covering every user flow, API integration, state management, and error handling scenario.

---

## 📚 Documentation Files

### 1. **ApplicationFlow.md** (Main Document)
**The primary reference for understanding the entire application**

Contains:
- Authentication flows (OTP, Google OAuth)
- Course & subject selection
- Purchase flow
- Test taking flow
- Community & blog features
- AI chatbot integration
- User profile management
- Admin dashboard
- Redux state management overview
- Protected routes & authentication
- Error handling & user feedback
- Key dependencies

**Start here** if you're new to the application.

---

### 2. **ApplicationFlow_DetailedAPIs.md** (API Reference)
**Complete API endpoint documentation with request/response examples**

Contains:
- All authentication endpoints with examples
- Course & subject endpoints
- Purchase endpoints
- Test card endpoints
- Community endpoints
- AI chatbot endpoints
- User profile endpoints
- Admin endpoints
- HTTP status codes reference
- Request/response headers

**Use this** when implementing API calls or debugging API issues.

---

### 3. **ApplicationFlow_ComponentArchitecture.md** (Architecture)
**Component hierarchy, state flow, and data flow diagrams**

Contains:
- Complete component hierarchy tree
- Redux state flow diagrams
- Data flow from purchase to test taking
- Component communication patterns
- API request flow with token refresh
- Error handling flow
- Loading state management
- Theme management
- Performance optimizations

**Use this** to understand component structure and state management.

---

### 4. **ApplicationFlow_ErrorHandling.md** (Troubleshooting)
**Error scenarios, solutions, and debugging guide**

Contains:
- Error handling architecture
- Common error scenarios with solutions
- Authentication errors
- Course & subject errors
- Purchase errors
- Test taking errors
- Community errors
- AI chatbot errors
- Admin errors
- Error recovery strategies
- Debugging tips
- Error messages reference
- Best practices

**Use this** when debugging issues or implementing error handling.

---

## 🎯 Quick Navigation Guide

### I want to understand...

**How authentication works**
→ ApplicationFlow.md → Authentication Flows section
→ ApplicationFlow_DetailedAPIs.md → Authentication Endpoints

**How to take a test**
→ ApplicationFlow.md → Test Taking Flow section
→ ApplicationFlow_ComponentArchitecture.md → Data Flow: Purchase to Test Taking

**How to make an API call**
→ ApplicationFlow_DetailedAPIs.md → Complete API Endpoint Reference

**How Redux state is managed**
→ ApplicationFlow.md → State Management (Redux) section
→ ApplicationFlow_ComponentArchitecture.md → Redux State Flow Diagram

**How components communicate**
→ ApplicationFlow_ComponentArchitecture.md → Component Communication Patterns

**How to debug an error**
→ ApplicationFlow_ErrorHandling.md → Common Error Scenarios & Solutions
→ ApplicationFlow_ErrorHandling.md → Debugging Tips

**How the purchase flow works**
→ ApplicationFlow.md → Purchase Flow section
→ ApplicationFlow_ComponentArchitecture.md → Data Flow: Purchase to Test Taking

**How the admin dashboard works**
→ ApplicationFlow.md → Admin Dashboard section
→ ApplicationFlow_DetailedAPIs.md → Admin Endpoints

**How the AI chatbot works**
→ ApplicationFlow.md → AI Chatbot section
→ ApplicationFlow_DetailedAPIs.md → AI Chatbot Endpoints

**How protected routes work**
→ ApplicationFlow.md → Protected Routes & Authentication section
→ ApplicationFlow_ComponentArchitecture.md → API Request Flow with Token Refresh

---

## 🔑 Key Concepts

### Authentication
- **OTP-based**: Email + OTP for registration and login
- **Google OAuth**: One-click login with Google
- **JWT Tokens**: Access token (1 hour) + Refresh token (30 days)
- **Token Refresh**: Automatic refresh on 401 response

### State Management
- **Redux Toolkit**: Centralized state management
- **Async Thunks**: For API calls
- **Selectors**: For accessing state
- **Actions**: For state updates

### API Integration
- **Base URL**: `http://localhost:5000`
- **Authentication**: Bearer token in Authorization header
- **Error Handling**: Automatic token refresh, error toasts
- **Request Queue**: Queues requests during token refresh

### Component Architecture
- **Protected Routes**: Require authentication
- **Admin Routes**: Require admin role
- **Public Routes**: Landing page, auth page
- **Shared Components**: Header, UI components

### Error Handling
- **Toast Notifications**: For user feedback
- **Error Cards**: For page-level errors
- **Retry Buttons**: For transient errors
- **Automatic Refresh**: For token expiry

---

## 🚀 Common Tasks

### Adding a New Feature
1. Create component in `src/components/`
2. Add Redux slice if needed in `src/store/slices/`
3. Add API endpoints in `src/services/api.ts`
4. Add route in `App.tsx`
5. Document in ApplicationFlow.md

### Making an API Call
1. Add endpoint to `src/services/api.ts`
2. Create async thunk in Redux slice
3. Dispatch thunk from component
4. Handle loading/error states
5. Update UI with response data

### Debugging an Issue
1. Check browser console for errors
2. Check Redux DevTools for state changes
3. Check Network tab for API requests
4. Check localStorage for tokens
5. Check backend logs
6. Refer to ApplicationFlow_ErrorHandling.md

### Adding Error Handling
1. Wrap API call in try-catch
2. Dispatch error action to Redux
3. Show error toast to user
4. Provide retry option
5. Log error for debugging

---

## 📊 Application Statistics

- **Total Routes**: 20+
- **Total Components**: 25+
- **Total Redux Slices**: 7
- **Total API Endpoints**: 50+
- **Authentication Methods**: 2 (OTP, Google OAuth)
- **Protected Routes**: 15+
- **Admin Routes**: 5+

---

## 🔗 Related Documentation

- **Backend API**: See `API_ENDPOINTS_COMPLETE.md` in backend
- **Database Schema**: See `jishu_schema.txt` in backend
- **Setup Guide**: See `SETUP.md` in frontend
- **Troubleshooting**: See `TROUBLESHOOTING.md` in frontend

---

## 💡 Tips for Developers

1. **Always check Redux state first** before making API calls
2. **Use Redux DevTools** to debug state changes
3. **Check Network tab** to verify API requests
4. **Use error boundaries** for component error handling
5. **Test error scenarios** during development
6. **Document new flows** in ApplicationFlow.md
7. **Keep API endpoints updated** in ApplicationFlow_DetailedAPIs.md
8. **Test on both light and dark themes**
9. **Test on mobile and desktop**
10. **Check accessibility** for all components

---

## 🐛 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| "Token has expired" | Automatic refresh, if fails → login again |
| "Failed to fetch courses" | Check backend running, check network |
| "Cart is empty" | Add items to cart before checkout |
| "Generation failed" | Check Ollama service running |
| "You don't have permission" | Check admin status, contact admin |
| "No remaining attempts" | Purchase more test cards |
| "Token limit reached" | Purchase course for more tokens |

---

## 📞 Support

For issues or questions:
1. Check the relevant documentation file
2. Check ApplicationFlow_ErrorHandling.md for common issues
3. Check browser console and Redux DevTools
4. Check backend logs
5. Contact development team

---

## 📝 Document Maintenance

These documents should be updated when:
- New features are added
- API endpoints change
- Redux structure changes
- Component hierarchy changes
- Error scenarios change
- Dependencies change

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Maintained By**: Development Team

---

## 📖 How to Use This Documentation

1. **For New Developers**: Start with ApplicationFlow.md for overview
2. **For API Integration**: Use ApplicationFlow_DetailedAPIs.md
3. **For Architecture Understanding**: Use ApplicationFlow_ComponentArchitecture.md
4. **For Debugging**: Use ApplicationFlow_ErrorHandling.md
5. **For Quick Reference**: Use this README

---

## ✅ Documentation Checklist

- [x] Authentication flows documented
- [x] Course selection flow documented
- [x] Purchase flow documented
- [x] Test taking flow documented
- [x] Community features documented
- [x] AI chatbot documented
- [x] User profile documented
- [x] Admin dashboard documented
- [x] Redux state management documented
- [x] Protected routes documented
- [x] All API endpoints documented
- [x] Error handling documented
- [x] Component architecture documented
- [x] State flow diagrams included
- [x] Debugging guide included
- [x] Common issues documented
- [x] Best practices included

---

**Happy Coding! 🚀**

