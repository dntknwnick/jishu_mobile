# Jishu Frontend Application Flow Documentation

**Base URL**: `http://localhost:5000`

---

## Table of Contents
1. [Authentication Flows](#authentication-flows)
2. [Course & Subject Selection](#course--subject-selection)
3. [Purchase Flow](#purchase-flow)
4. [Test Taking Flow](#test-taking-flow)
5. [Community & Blog](#community--blog)
6. [AI Chatbot](#ai-chatbot)
7. [User Profile Management](#user-profile-management)
8. [Admin Dashboard](#admin-dashboard)
9. [State Management (Redux)](#state-management-redux)
10. [Protected Routes & Authentication](#protected-routes--authentication)

---

## Authentication Flows

### Flow 1: User Registration with Email + OTP

**Trigger**: User clicks "Register" tab on AuthScreen (`/auth`)

**Step 1: Request OTP**
- **UI**: AuthScreen component displays email input field
- **User Action**: Enters email and clicks "Send OTP"
- **API Call**: `POST /api/auth/otp/request`
  - **Request**: `{ "email": "user@example.com" }`
  - **Response**: `{ "success": true, "data": { "email": "...", "otp_sent": true, "action": "registration" } }`
- **Redux**: No state update yet; loading state managed locally
- **UI Update**: Shows OTP input field, displays success toast

**Step 2: Enter Registration Details**
- **UI**: User enters name, mobile, and OTP
- **User Action**: Clicks "Register"
- **API Call**: `POST /api/auth/register`
  - **Request**: `{ "email": "user@example.com", "otp": "123456", "name": "John", "mobile_no": "9876543210", "password": "" }`
  - **Response**: `{ "access_token": "jwt_token", "refresh_token": "refresh_jwt", "user": { "id": 1, "name": "John", "email": "user@example.com", "is_admin": false } }`
- **Redux**: Dispatches `register` async thunk
  - Updates `auth.user` with user data
  - Updates `auth.token` with access token
  - Sets `auth.isAuthenticated = true`
- **Storage**: Saves tokens to localStorage (`access_token`, `refresh_token`, `jishu_user`)
- **Navigation**: Redirects to `/courses` (or `/admin` if admin user)

**Error Handling**:
- Invalid email format → Toast error
- OTP expired → User can resend OTP
- Registration failed → Display error message under form

---

### Flow 2: User Login with Email + OTP

**Trigger**: User clicks "Login" tab on AuthScreen (`/auth`)

**Step 1: Request OTP**
- **UI**: AuthScreen displays email input
- **User Action**: Enters email, clicks "Send OTP"
- **API Call**: `POST /api/auth/otp/request`
  - **Request**: `{ "email": "user@example.com" }`
  - **Response**: `{ "success": true, "data": { "email": "...", "otp_sent": true, "action": "login", "user_exists": true } }`
- **UI Update**: Shows OTP input field

**Step 2: Submit OTP**
- **UI**: User enters OTP and clicks "Login"
- **API Call**: `POST /api/auth/login`
  - **Request**: `{ "email": "user@example.com", "otp": "123456" }`
  - **Response**: `{ "access_token": "jwt_token", "refresh_token": "refresh_jwt", "user": { ... } }`
- **Redux**: Dispatches `login` async thunk
  - Updates auth state with user and tokens
  - Sets `isAuthenticated = true`
- **Storage**: Saves tokens and user to localStorage
- **Navigation**: Redirects to `/courses` or `/admin`

---

### Flow 3: Google OAuth Login

**Trigger**: User clicks "Sign in with Google" button on AuthScreen

**Step 1: Initiate Google OAuth**
- **UI**: AuthScreen component
- **User Action**: Clicks "Sign in with Google"
- **API Call**: `GET /auth/google`
  - **Response**: `{ "success": true, "data": { "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?..." } }`
- **Action**: Redirects to Google OAuth URL

**Step 2: Google Callback**
- **Route**: `/auth/google/callback`
- **Component**: GoogleOAuthCallback
- **Process**: 
  - Extracts authorization code from URL
  - Sends code to backend
  - Backend exchanges code for Google tokens
  - Backend creates/updates user in database
  - Returns JWT tokens and user data
- **API Call**: Backend handles: `POST /auth/google/callback`
  - **Response**: `{ "access_token": "jwt", "refresh_token": "refresh_jwt", "user": { ... } }`
- **Redux**: Updates auth state with user and tokens
- **Navigation**: Redirects to `/courses` or `/admin`

---

## Course & Subject Selection

### Flow: Browse and Select Courses

**Trigger**: User navigates to `/courses` after login

**Step 1: Load Courses**
- **Component**: CourseSelection
- **On Mount**: Dispatches `fetchCourses()` async thunk
- **API Call**: `GET /api/courses`
  - **Response**: `{ "courses": [ { "id": 1, "course_name": "NEET", "description": "...", "test_count": 50 }, ... ] }`
- **Redux**: 
  - `courses.courses` updated with fetched courses
  - `courses.isLoading` set to false
- **UI**: Displays course cards with icons, test counts, and descriptions

**Step 2: Select Course**
- **User Action**: Clicks on a course card
- **Navigation**: Routes to `/subjects/:courseId`
- **Component**: SubjectSelection loads

**Step 3: Load Subjects**
- **Component**: SubjectSelection
- **On Mount**: Dispatches `fetchSubjects(courseId)` async thunk
- **API Call**: `GET /api/subjects?course_id={courseId}`
  - **Response**: `{ "subjects": [ { "id": 1, "subject_name": "Physics", "amount": 299, "offer_amount": 199, "total_mock": 50 }, ... ] }`
- **Redux**: 
  - `subjects.subjects` updated
  - `subjects.bundles` updated if bundles exist
- **UI**: Displays subject cards with pricing and mock test counts

**Step 4: Add to Cart**
- **User Action**: Clicks "Add to Cart" on subject/bundle
- **Redux**: Dispatches `addToCart` action
  - Adds item to `purchase.currentCart.items`
  - Updates `purchase.currentCart.courseId` and `courseName`
  - Calculates bundle discount if applicable
- **Navigation**: User can continue shopping or proceed to checkout

---

## Purchase Flow

### Flow: Checkout and Purchase

**Trigger**: User clicks "Proceed to Checkout" or navigates to `/purchase`

**Step 1: Verify Cart**
- **Component**: MockTestPurchase
- **On Mount**: Checks if cart has items
  - If empty: Redirects to `/courses` with error toast
  - If has items: Displays checkout page

**Step 2: Display Purchase Summary**
- **UI**: Shows:
  - Cart items with prices
  - Subtotal calculation
  - Bundle discount (if applicable)
  - Tax calculation (18%)
  - Final total
- **Data Source**: `purchase.currentCart` from Redux

**Step 3: Process Purchase**
- **User Action**: Clicks "Confirm Purchase"
- **API Call**: `POST /api/purchases`
  - **Request**: 
    ```json
    {
      "course_id": 1,
      "purchase_type": "single_subject" | "multiple_subjects" | "full_bundle",
      "subject_ids": [1, 2, 3],
      "cost": 500
    }
    ```
  - **Response**: 
    ```json
    {
      "purchase_id": 123,
      "purchase_type": "single_subject",
      "subjects_included": [1],
      "test_cards_created": 10,
      "total_test_cards": 10,
      "chatbot_tokens_unlimited": true,
      "message": "Purchase successful"
    }
    ```
- **Redux**: 
  - Dispatches `processPurchase` action
  - Clears cart: `purchase.currentCart = { items: [], ... }`
  - Adds purchase to `purchase.purchases`
- **UI**: Shows success message with test cards created count
- **Navigation**: Redirects to `/test-cards` to view purchased test cards

**Error Handling**:
- Network error → Display error toast, allow retry
- Invalid cart → Redirect to courses
- Purchase failed → Show error message

---

## Test Taking Flow

### Flow: Start Test and Take MCQs

**Trigger**: User clicks "Start Test" on test card in TestCardDashboard (`/test-cards`)

**Step 1: Get Test Instructions**
- **Component**: TestCardDashboard
- **User Action**: Clicks "Start Test" button on a test card
- **API Call**: `POST /api/user/test-cards/{mockTestId}/instructions`
  - **Response**: `{ "generation_session_id": "session_123", "session_id": 456, "message": "Test instructions ready" }`
- **Redux**: Sets loading state for specific test card
- **Navigation**: Routes to `/test-instructions` with state:
  ```javascript
  {
    mockTestId: 123,
    generationSessionId: "session_123",
    testNumber: 1,
    subjectName: "Physics"
  }
  ```

**Step 2: Poll Generation Progress**
- **Component**: TestInstructionsPage
- **On Mount**: Starts polling `GET /api/user/test-cards/generation-status?generation_session_id={sessionId}`
  - **Response**: 
    ```json
    {
      "success": true,
      "progress": 50,
      "questions_generated": 5,
      "total_questions": 10,
      "is_complete": false,
      "has_error": false,
      "can_use_partial": true
    }
    ```
- **UI**: Displays progress bar, shows "Generating questions..."
- **Polling**: Every 1 second until complete or error
- **Conditions**:
  - If `is_complete = true`: Show "Ready to start" button
  - If `can_use_partial = true` and `progress >= 10`: Allow starting with partial questions
  - If `has_error = true`: Show error message

**Step 3: Start Test**
- **User Action**: Clicks "Start Test" button on instructions page
- **API Call**: `POST /api/user/test-cards/{mockTestId}/start`
  - **Response**: 
    ```json
    {
      "session_id": 456,
      "mock_test_id": 123,
      "attempt_number": 1,
      "remaining_attempts": 2,
      "questions_generated": true
    }
    ```
- **Redux**: Dispatches `startTest` action
  - Sets `tests.currentTest.id = sessionId`
  - Initializes `tests.currentTest.answers = {}`
  - Initializes `tests.currentTest.flagged = []`
  - Sets `tests.currentTest.isActive = true`
- **Navigation**: Routes to `/test` with state containing session info

**Step 4: Take MCQ Test**
- **Component**: MCQTestScreen
- **On Mount**: 
  - Fetches questions from session (if not already loaded)
  - Starts timer countdown
  - Displays first question
- **UI Elements**:
  - Question display area
  - 4 option buttons (A, B, C, D)
  - Question palette (grid of question numbers)
  - Timer display
  - Flag button for each question
  - Navigation buttons (Previous, Next, Submit)

**Step 5: Answer Questions**
- **User Action**: Clicks an option button
- **Redux**: Dispatches `answerQuestion` action
  - Updates `tests.currentTest.answers[questionId] = selectedOption`
  - Question palette updates to show answered questions in green
- **UI**: Selected option highlighted

**Step 6: Flag Question**
- **User Action**: Clicks flag icon
- **Redux**: Dispatches `toggleFlag` action
  - Adds/removes question ID from `tests.currentTest.flagged`
  - Question palette shows flag indicator

**Step 7: Submit Test**
- **User Action**: Clicks "Submit Test" button
- **Confirmation**: Shows dialog asking to confirm submission
- **API Call**: `POST /api/user/test-cards/{mockTestId}/submit`
  - **Request**: 
    ```json
    {
      "session_id": 456,
      "answers": { "1": "A", "2": "B", ... },
      "time_taken": 1800
    }
    ```
  - **Response**: 
    ```json
    {
      "score": 85,
      "percentage": 85,
      "correct_answers": 17,
      "wrong_answers": 3,
      "unanswered": 0,
      "detailed_results": [ ... ]
    }
    ```
- **Redux**: 
  - Dispatches `submitTest` action
  - Adds result to `tests.testHistory`
  - Resets `tests.currentTest`
- **Navigation**: Routes to `/results` with test results

---

## Community & Blog

### Flow: View and Create Blog Posts

**Trigger**: User navigates to `/community`

**Step 1: Load Posts**
- **Component**: CommunityBlog
- **On Mount**: Dispatches `fetchPosts()` async thunk
- **API Call**: `GET /api/community/posts`
  - **Response**: `{ "posts": [ { "id": 1, "title": "...", "content": "...", "author": { ... }, "likes_count": 10, "comments": [...] }, ... ] }`
- **Redux**: 
  - `community.posts` updated with fetched posts
  - `community.isLoading = false`
- **UI**: Displays posts in feed format with author info, likes, comments

**Step 2: Like Post**
- **User Action**: Clicks heart icon on post
- **API Call**: `POST /api/community/posts/{postId}/like`
  - **Response**: `{ "liked": true, "likes_count": 11 }`
- **Redux**: Dispatches `likePost` action
  - Updates post's `likes_count` and `liked` status
- **UI**: Heart icon fills, count updates

**Step 3: Add Comment**
- **User Action**: Clicks comment icon, enters text, clicks send
- **API Call**: `POST /api/community/posts/{postId}/comments`
  - **Request**: `{ "content": "Great post!" }`
  - **Response**: `{ "id": 1, "content": "...", "author": { ... }, "created_at": "..." }`
- **Redux**: Dispatches `addComment` action
  - Adds comment to post's comments array
- **UI**: Comment appears in comments section

**Step 4: Create Post**
- **User Action**: Clicks "Create Post" button
- **UI**: Opens dialog with title, content, tags, image upload fields
- **User Action**: Fills form and clicks "Post"
- **API Call**: `POST /api/community/posts`
  - **Request**: FormData with title, content, tags, image
  - **Response**: `{ "post": { "id": 2, "title": "...", ... } }`
- **Redux**: Dispatches `createPost` action
  - Adds new post to beginning of `community.posts`
- **UI**: Dialog closes, new post appears at top of feed

---

## AI Chatbot

### Flow: Chat with AI Assistant

**Trigger**: User navigates to `/chatbot`

**Step 1: Load Chatbot**
- **Component**: AIChatbot
- **On Mount**: 
  - Fetches token status: `GET /api/ai/token-status`
  - Displays initial greeting message
  - Shows token usage info

**Step 2: Send Message**
- **User Action**: Types message and clicks send
- **Validation**: 
  - Checks if message is not empty
  - Checks if user has remaining tokens (if not unlimited)
- **UI**: Adds user message to chat, shows typing indicator
- **API Call**: `POST /api/ai/chat`
  - **Request**: 
    ```json
    {
      "message": "Explain Newton's Laws",
      "session_id": "session_1234567890"
    }
    ```
  - **Response**: 
    ```json
    {
      "success": true,
      "data": {
        "response": "Newton's Laws of Motion are...",
        "token_info": {
          "tokens_used_today": 5,
          "daily_limit": 50,
          "remaining_tokens": 45,
          "is_unlimited": false
        }
      }
    }
    ```
- **UI**: Displays AI response, updates token counter
- **Error Handling**: 
  - Token limit reached → Show message to purchase course
  - API error → Show error toast

**Step 3: Multi-Subject Support**
- **Feature**: User can ask questions about different subjects in same conversation
- **Backend**: Queries multiple vector store collections (physics, chemistry, biology, etc.)
- **Response**: Combines relevant information from all subjects

---

## User Profile Management

### Flow: View and Update Profile

**Trigger**: User navigates to `/profile`

**Step 1: Load Profile**
- **Component**: UserProfile
- **On Mount**: Loads user data from Redux auth state
- **Display Sections**:
  - Personal Info (name, email, phone, DOB, location)
  - Statistics (tests taken, average score, rank, study streak)
  - Academics (school, target exam, target score)
  - Purchase History (courses purchased, dates, amounts)

**Step 2: Edit Profile**
- **User Action**: Clicks "Edit" button
- **UI**: Enables form fields for editing
- **User Action**: Updates fields and clicks "Save"
- **API Call**: `PATCH /api/user/profile`
  - **Request**: `{ "name": "John Doe", "email": "john@example.com" }`
  - **Response**: `{ "user": { ... } }`
- **Redux**: Dispatches `updateProfile` action
  - Updates `auth.user` with new data
- **Storage**: Updates localStorage `jishu_user`
- **UI**: Shows success toast, disables edit mode

---

## Admin Dashboard

### Flow: Admin Management

**Trigger**: Admin user navigates to `/admin`

**Step 1: Load Admin Dashboard**
- **Component**: AdminDashboard
- **On Mount**: 
  - Dispatches `fetchUsers()` async thunk
  - Dispatches `fetchStats()` async thunk
- **API Calls**:
  - `GET /api/admin/users` → Fetches all users
  - `GET /api/admin/stats` → Fetches system statistics
- **Redux**: 
  - `admin.users` updated
  - `admin.stats` updated with totalUsers, totalCourses, totalRevenue, etc.
- **UI**: Displays:
  - Key metrics cards (users, tests, revenue)
  - Charts (user growth, revenue trends)
  - Recent users and posts
  - System status

**Step 2: Manage Courses**
- **Route**: `/admin/courses`
- **Component**: ManageCourses
- **Features**:
  - View all courses
  - Create new course: `POST /api/admin/courses`
  - Edit course: `PUT /api/admin/courses/{id}`
  - Delete course: `DELETE /api/admin/courses/{id}`

**Step 3: Manage Users**
- **Route**: `/admin/users`
- **Component**: ManageUsers
- **Features**:
  - View all users
  - Deactivate user: `PUT /api/admin/users/{id}/deactivate`
  - View user details and purchase history

---

## State Management (Redux)

### Redux Store Structure

```
store/
├── auth/
│   ├── user: User | null
│   ├── isAuthenticated: boolean
│   ├── token: string | null
│   ├── isLoading: boolean
│   └── error: string | null
├── courses/
│   ├── courses: Course[]
│   ├── selectedCourse: Course | null
│   ├── isLoading: boolean
│   └── error: string | null
├── subjects/
│   ├── subjects: Subject[]
│   ├── bundles: Subject[]
│   ├── selectedSubjects: number[]
│   ├── isLoading: boolean
│   └── error: string | null
├── purchase/
│   ├── purchases: Purchase[]
│   ├── currentCart: { items, courseId, courseName, isBundle, bundleDiscount }
│   ├── isLoading: boolean
│   └── error: string | null
├── tests/
│   ├── questions: Question[]
│   ├── currentTest: { id, questions, answers, flagged, timeLeft, isActive }
│   ├── testHistory: any[]
│   ├── isLoading: boolean
│   └── error: string | null
├── community/
│   ├── posts: BlogPost[]
│   ├── isLoading: boolean
│   └── error: string | null
└── admin/
    ├── courses: Course[]
    ├── subjects: Subject[]
    ├── users: User[]
    ├── stats: { totalUsers, totalCourses, totalRevenue, ... }
    ├── systemStatus: { apiStatus, databaseStatus, ... }
    ├── isLoading: boolean
    └── error: string | null
```

### Key Redux Actions

**Auth Slice**:
- `requestOtp(email)` - Request OTP for registration/login
- `register(data)` - Register new user
- `login(data)` - Login user
- `logout()` - Logout user
- `getProfile()` - Fetch user profile
- `updateProfile(data)` - Update user profile
- `setCredentials(user, token)` - Manually set credentials
- `clearCredentials()` - Clear all auth data

**Courses Slice**:
- `fetchCourses()` - Fetch all courses
- `selectCourse(course)` - Select a course

**Subjects Slice**:
- `fetchSubjects(courseId)` - Fetch subjects for course
- `toggleSubjectSelection(subjectId)` - Toggle subject selection
- `clearSelectedSubjects()` - Clear all selections

**Purchase Slice**:
- `addToCart(item)` - Add item to cart
- `removeFromCart(itemId)` - Remove item from cart
- `processPurchase(data)` - Process purchase
- `clearCart()` - Clear cart

**Tests Slice**:
- `fetchQuestions()` - Fetch questions
- `startTest(data)` - Start a test
- `answerQuestion(data)` - Record answer
- `toggleFlag(questionId)` - Flag/unflag question
- `submitTest(data)` - Submit test

**Community Slice**:
- `fetchPosts()` - Fetch all posts
- `createPost(data)` - Create new post
- `likePost(postId)` - Like a post
- `addComment(data)` - Add comment to post
- `deletePost(postId)` - Delete post

---

## Protected Routes & Authentication

### Route Protection Mechanism

**App.tsx** implements route protection using React Router:

```typescript
<Route
  path="/courses"
  element={isAuthenticated ? <CourseSelection /> : <Navigate to="/auth" />}
/>
```

**Protected Routes**:
- `/courses` - Requires authentication
- `/subjects/:courseId` - Requires authentication
- `/purchase` - Requires authentication
- `/test/:testId` - Requires authentication
- `/results` - Requires authentication
- `/test-cards` - Requires authentication
- `/community` - Requires authentication
- `/chatbot` - Requires authentication
- `/profile` - Requires authentication
- `/admin/*` - Requires authentication + admin role

**Public Routes**:
- `/` - Landing page
- `/auth` - Authentication page
- `/auth/google/callback` - Google OAuth callback

### JWT Token Management

**Token Storage**:
- `access_token` - Stored in localStorage, expires in 1 hour
- `refresh_token` - Stored in localStorage, expires in 30 days
- `jishu_user` - User object stored in localStorage

**Token Refresh Flow**:
1. API request made with `Authorization: Bearer {access_token}`
2. If response is 401 (Unauthorized):
   - Check if refresh token exists
   - Call `POST /api/auth/refresh` with refresh token
   - Backend validates refresh token and returns new access token
   - Retry original request with new token
3. If refresh fails:
   - Clear all tokens and user data
   - Redirect to `/auth`

**Token Refresh Queue System**:
- When token refresh is in progress, subsequent API requests are queued
- After refresh completes, all queued requests are executed with new token
- Prevents multiple simultaneous refresh attempts

### Admin Role Check

**In App.tsx**:
```typescript
const isAdmin = user?.is_admin === true;

<Route
  path="/admin"
  element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/auth" />}
/>
```

**Backend Validation**:
- Admin endpoints protected with `@admin_required` decorator
- Checks JWT token and verifies `is_admin` flag in user record
- Returns 403 Forbidden if user is not admin

---

## Error Handling & User Feedback

### Error Display Methods

1. **Toast Notifications** (Sonner library):
   - Success: `toast.success("Message")`
   - Error: `toast.error("Error message")`
   - Info: `toast.info("Info message")`

2. **Form Validation Errors**:
   - Displayed below form fields
   - Cleared when user starts typing

3. **Page-level Errors**:
   - Error cards with retry buttons
   - Shown when data loading fails

4. **Loading States**:
   - Spinner icons during API calls
   - Disabled buttons during processing
   - Progress bars for long operations

### Common Error Scenarios

- **Network Error**: "Failed to connect. Please check your internet."
- **Invalid Credentials**: "Invalid email or OTP"
- **Token Expired**: Automatic refresh, if fails → redirect to login
- **Insufficient Permissions**: "You don't have permission to access this"
- **Resource Not Found**: "The requested resource was not found"
- **Server Error**: "Something went wrong. Please try again later."

---

## Key Dependencies & Libraries

### Frontend Libraries
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client (via custom API service)
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **Recharts** - Charts and graphs
- **React Hook Form** - Form handling

### Third-party Services
- **Google OAuth 2.0** - Social authentication
- **Ollama** - Local AI model for MCQ generation
- **ChromaDB** - Vector database for RAG
- **CLIP** - Multimodal embeddings

### Configuration
- **API_BASE_URL**: `http://localhost:5000` (from environment)
- **JWT Expiry**: 1 hour (access), 30 days (refresh)
- **Token Refresh**: Automatic on 401 response
- **CORS**: Enabled for localhost:3000

---

## Development Notes

### Local Development Setup
1. Backend runs on `http://localhost:5000`
2. Frontend runs on `http://localhost:3000` (Vite dev server)
3. Tokens stored in browser localStorage
4. Redux DevTools available in development

### Testing Credentials
- Email: `test@example.com`
- OTP: Any 6-digit code (in dev mode)
- Admin: Create user with `is_admin = true` in database

### Common Issues & Solutions
- **CORS errors**: Ensure backend CORS is configured for frontend URL
- **Token refresh loop**: Check refresh token expiry in database
- **Questions not generating**: Verify Ollama service is running
- **Vector store errors**: Check ChromaDB initialization

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0

