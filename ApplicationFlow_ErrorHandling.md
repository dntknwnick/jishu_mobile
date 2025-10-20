# Jishu Frontend - Error Handling & Troubleshooting Guide

---

## Error Handling Architecture

### Global Error Handler
```typescript
// services/api.ts - performApiRequest function
try {
  const response = await fetch(url, config);
  
  if (response.status === 401 && getRefreshToken()) {
    // Token refresh logic
  }
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.message, response.status);
  }
  
  return response.json();
} catch (error) {
  // Error handling
}
```

### Redux Error Handling
```typescript
// In async thunks
.addCase(fetchCourses.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload as string;
})
```

### Component Error Handling
```typescript
try {
  await dispatch(login({ email, otp })).unwrap();
  toast.success('Login successful!');
} catch (error) {
  toast.error(error as string);
}
```

---

## Common Error Scenarios & Solutions

### 1. Authentication Errors

#### Error: "Invalid email or OTP"
**Cause**: User entered wrong OTP or email doesn't exist
**Flow**:
1. User enters email and OTP
2. API validates OTP against stored OTP
3. If mismatch: Returns 400 Bad Request
4. Component catches error and shows toast

**Solution**:
- Check email is correct
- Verify OTP from email
- Request new OTP if expired

**Code Location**: `AuthScreen.tsx` - `handleOtpLogin()`

#### Error: "Token has expired"
**Cause**: Access token expired (1 hour)
**Flow**:
1. API request made with expired token
2. Backend returns 401 Unauthorized
3. Frontend detects 401 and calls refresh endpoint
4. If refresh succeeds: Retry request with new token
5. If refresh fails: Redirect to login

**Solution**:
- Automatic refresh handled by `requestManager.refreshToken()`
- If refresh fails, user must login again
- Check localStorage for valid refresh token

**Code Location**: `services/api.ts` - `performApiRequest()`

#### Error: "Refresh token has expired"
**Cause**: Refresh token expired (30 days)
**Flow**:
1. Access token expired
2. Attempt to refresh with refresh token
3. Backend validates refresh token expiry
4. If expired: Returns 401
5. Frontend clears tokens and redirects to login

**Solution**:
- User must login again
- Refresh tokens are rotated on each refresh
- Check database for valid refresh token

**Code Location**: `app.py` - `/api/auth/refresh` endpoint

#### Error: "User not found"
**Cause**: User ID in JWT doesn't exist in database
**Flow**:
1. JWT token is valid but user was deleted
2. Backend queries user by ID
3. User not found: Returns 404
4. Frontend shows error

**Solution**:
- Contact admin to restore account
- Clear tokens and login with different account

---

### 2. Course & Subject Errors

#### Error: "Failed to fetch courses"
**Cause**: Network error or backend unavailable
**Flow**:
1. Component dispatches `fetchCourses()`
2. API request fails (network error or 500)
3. Async thunk catches error and rejects
4. Redux state updated with error message
5. Component displays error card with retry button

**Solution**:
- Check backend is running on `http://localhost:5000`
- Check network connectivity
- Click "Retry" button to try again

**Code Location**: `CourseSelection.tsx` - `useEffect` with `fetchCourses()`

#### Error: "Course not found"
**Cause**: Course ID doesn't exist
**Flow**:
1. User navigates to `/subjects/:courseId`
2. Component fetches subjects for course
3. Backend returns 404 if course doesn't exist
4. Component shows error message

**Solution**:
- Go back to course selection
- Select a valid course

---

### 3. Purchase Errors

#### Error: "Your cart is empty"
**Cause**: User navigated to `/purchase` without items in cart
**Flow**:
1. Component mounts
2. Checks `purchase.currentCart.items.length`
3. If empty: Shows error and redirects to `/courses`

**Solution**:
- Add items to cart from course/subject selection
- Navigate to purchase after adding items

**Code Location**: `MockTestPurchase.tsx` - `useEffect` cart validation

#### Error: "Purchase failed"
**Cause**: Backend error during purchase processing
**Flow**:
1. User clicks "Confirm Purchase"
2. API: `POST /api/purchases`
3. Backend validates purchase data
4. If validation fails: Returns 400 with error message
5. Component shows error toast

**Solution**:
- Check cart items are valid
- Verify course and subject IDs exist
- Try again or contact support

**Code Location**: `MockTestPurchase.tsx` - `handlePurchaseConfirmation()`

#### Error: "Insufficient permissions"
**Cause**: User doesn't have permission to purchase
**Flow**:
1. API validates user has active account
2. If user is blocked/inactive: Returns 403
3. Component shows permission error

**Solution**:
- Contact admin to activate account
- Check account status in profile

---

### 4. Test Taking Errors

#### Error: "Failed to load test instructions"
**Cause**: Backend error or invalid test card ID
**Flow**:
1. User clicks "Start Test"
2. API: `POST /api/user/test-cards/{id}/instructions`
3. If test card doesn't exist: Returns 404
4. Component shows error and redirects to test cards

**Solution**:
- Refresh test cards list
- Try starting a different test
- Contact support if issue persists

**Code Location**: `TestCardDashboard.tsx` - `handleStartTest()`

#### Error: "Generation failed"
**Cause**: MCQ generation service error
**Flow**:
1. TestInstructionsPage polls generation status
2. Backend returns `has_error: true`
3. Component displays error message
4. User can retry or go back

**Solution**:
- Check Ollama service is running
- Check ChromaDB is initialized
- Retry test generation
- Contact support if persistent

**Code Location**: `TestInstructionsPage.tsx` - Polling logic

#### Error: "Failed to submit test"
**Cause**: Network error or backend error
**Flow**:
1. User clicks "Submit Test"
2. API: `POST /api/user/test-cards/{id}/submit`
3. If error: Shows error toast
4. User can retry submission

**Solution**:
- Check network connectivity
- Verify test session is still valid
- Try submitting again

**Code Location**: `MCQTestScreen.tsx` - `handleSubmitTest()`

#### Error: "No remaining attempts"
**Cause**: User has used all attempts for test card
**Flow**:
1. User clicks "Start Test"
2. Backend checks `remaining_attempts > 0`
3. If 0: Returns 403 Forbidden
4. Component shows error message

**Solution**:
- Purchase more test cards
- Select a different test
- Contact admin for more attempts

---

### 5. Community Errors

#### Error: "Failed to create post"
**Cause**: Network error or validation error
**Flow**:
1. User submits post form
2. API: `POST /api/community/posts`
3. If validation fails: Returns 400
4. Component shows error toast

**Solution**:
- Check title and content are not empty
- Verify image file is valid (if uploading)
- Try again

**Code Location**: `CommunityBlog.tsx` - `handleCreatePost()`

#### Error: "Failed to like post"
**Cause**: Post doesn't exist or network error
**Flow**:
1. User clicks like button
2. API: `POST /api/community/posts/{id}/like`
3. If post not found: Returns 404
4. Component shows error toast

**Solution**:
- Refresh posts list
- Try liking a different post

---

### 6. AI Chatbot Errors

#### Error: "You have reached your daily token limit"
**Cause**: User has used all daily tokens
**Flow**:
1. User sends message
2. Component checks `remaining_tokens > 0`
3. If 0: Shows alert message
4. User cannot send more messages

**Solution**:
- Purchase a course/subject to get more tokens
- Wait until next day for daily limit reset
- Check if user has unlimited tokens

**Code Location**: `AIChatbot.tsx` - `handleSend()`

#### Error: "Failed to get AI response"
**Cause**: Backend error or Ollama service down
**Flow**:
1. User sends message
2. API: `POST /api/ai/chat`
3. If backend error: Returns 500
4. Component shows error toast

**Solution**:
- Check Ollama service is running
- Check backend is running
- Try sending message again

**Code Location**: `AIChatbot.tsx` - `handleSend()` API call

---

### 7. Admin Errors

#### Error: "You don't have permission to access this"
**Cause**: User is not admin
**Flow**:
1. User navigates to `/admin`
2. App.tsx checks `isAdmin` flag
3. If false: Redirects to `/auth`
4. Backend also validates with `@admin_required` decorator

**Solution**:
- Only admin users can access admin pages
- Contact admin to grant admin privileges

**Code Location**: `App.tsx` - Route protection

#### Error: "Failed to load admin stats"
**Cause**: Backend error or permission denied
**Flow**:
1. AdminDashboard mounts
2. Dispatches `fetchStats()`
3. API: `GET /api/admin/stats`
4. If error: Redux state updated with error
5. Component shows error card

**Solution**:
- Check user is admin
- Check backend is running
- Click "Try Again" button

**Code Location**: `AdminDashboard.tsx` - `useEffect` with `fetchStats()`

---

## Error Recovery Strategies

### 1. Automatic Retry
```typescript
// Token refresh automatically retries failed request
if (response.status === 401 && getRefreshToken()) {
  const newToken = await requestManager.refreshToken();
  if (newToken) {
    // Retry original request
    return performApiRequest(endpoint, options);
  }
}
```

### 2. User-Initiated Retry
```typescript
// Retry button in error state
<Button onClick={() => dispatch(fetchCourses())}>
  Try Again
</Button>
```

### 3. Fallback UI
```typescript
// Show cached data if available
if (error && cachedData) {
  return <Component data={cachedData} />;
}
```

### 4. Graceful Degradation
```typescript
// Show partial data if some requests fail
const courses = coursesData || [];
const subjects = subjectsData || [];
return <Component courses={courses} subjects={subjects} />;
```

---

## Debugging Tips

### 1. Check Browser Console
- Open DevTools (F12)
- Check Console tab for errors
- Look for network errors in Network tab

### 2. Check Redux DevTools
- Install Redux DevTools extension
- View state changes over time
- Replay actions to debug

### 3. Check Network Requests
- Open Network tab in DevTools
- Check API requests and responses
- Verify request headers include Authorization token

### 4. Check localStorage
- Open Application tab in DevTools
- Check localStorage for tokens
- Verify `access_token` and `refresh_token` exist

### 5. Check Backend Logs
- Run backend with `python run.py`
- Check console output for errors
- Look for database connection errors

### 6. Common Issues Checklist
- [ ] Backend running on `http://localhost:5000`?
- [ ] Frontend running on `http://localhost:3000`?
- [ ] Database connected?
- [ ] Ollama service running?
- [ ] ChromaDB initialized?
- [ ] Valid JWT tokens in localStorage?
- [ ] CORS enabled on backend?

---

## Error Messages Reference

| Message | Cause | Solution |
|---------|-------|----------|
| "Invalid email or OTP" | Wrong OTP | Request new OTP |
| "Token has expired" | Access token expired | Automatic refresh |
| "Refresh token has expired" | Refresh token expired | Login again |
| "User not found" | User deleted | Contact admin |
| "Failed to fetch courses" | Network/backend error | Check backend, retry |
| "Your cart is empty" | No items in cart | Add items to cart |
| "Purchase failed" | Backend error | Check data, retry |
| "No remaining attempts" | All attempts used | Purchase more tests |
| "Token limit reached" | Daily limit exceeded | Purchase course |
| "You don't have permission" | Not admin | Contact admin |
| "Generation failed" | Ollama error | Check Ollama service |
| "Failed to submit test" | Network error | Check connection, retry |

---

## Best Practices for Error Handling

1. **Always show user-friendly error messages**
   - Don't show raw error codes
   - Explain what went wrong and how to fix it

2. **Provide recovery options**
   - Retry buttons for transient errors
   - Navigation options for permanent errors

3. **Log errors for debugging**
   - Use console.error() in development
   - Send to error tracking service in production

4. **Handle edge cases**
   - Empty states
   - Loading states
   - Error states
   - Success states

5. **Validate input before sending**
   - Check required fields
   - Validate email format
   - Validate phone number format

6. **Use appropriate HTTP status codes**
   - 400: Bad request (validation error)
   - 401: Unauthorized (token expired)
   - 403: Forbidden (permission denied)
   - 404: Not found (resource doesn't exist)
   - 500: Server error (backend error)

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0

