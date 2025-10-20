# Jishu Frontend - Component Architecture & State Flow

---

## Component Hierarchy

```
App.tsx (Root)
├── Router Setup
├── Protected Routes
└── Components:
    ├── LandingPage (Public)
    ├── AuthScreen (Public)
    │   ├── Login Tab
    │   │   ├── Email Input
    │   │   ├── OTP Input
    │   │   └── Login Button
    │   └── Register Tab
    │       ├── Email Input
    │       ├── OTP Input
    │       ├── Name Input
    │       ├── Mobile Input
    │       └── Register Button
    ├── GoogleOAuthCallback (Public)
    │
    ├── CourseSelection (Protected)
    │   ├── Header
    │   ├── Welcome Section
    │   └── Course Cards Grid
    │       └── Course Card
    │           ├── Icon
    │           ├── Title
    │           ├── Description
    │           ├── Test Count
    │           └── Select Button
    │
    ├── SubjectSelection (Protected)
    │   ├── Header
    │   ├── Course Info
    │   └── Subject/Bundle Cards Grid
    │       └── Subject Card
    │           ├── Title
    │           ├── Price
    │           ├── Mock Count
    │           ├── Checkbox
    │           └── Add to Cart Button
    │
    ├── MockTestPurchase (Protected)
    │   ├── Header
    │   ├── Cart Summary
    │   │   ├── Items List
    │   │   ├── Subtotal
    │   │   ├── Discount
    │   │   ├── Tax
    │   │   └── Total
    │   └── Confirm Purchase Button
    │
    ├── TestCardDashboard (Protected)
    │   ├── Header
    │   ├── Tabs (By Subject)
    │   └── Test Cards Grid
    │       └── Test Card
    │           ├── Test Number
    │           ├── Status Badge
    │           ├── Score Display
    │           ├── Attempts Info
    │           └── Start/Re-attempt Button
    │
    ├── TestInstructionsPage (Protected)
    │   ├── Header
    │   ├── Progress Bar
    │   ├── Generation Status
    │   └── Start Test Button
    │
    ├── MCQTestScreen (Protected)
    │   ├── Header
    │   ├── Timer Display
    │   ├── Main Content
    │   │   ├── Question Display
    │   │   ├── Options (A, B, C, D)
    │   │   ├── Flag Button
    │   │   └── Navigation Buttons
    │   └── Question Palette
    │       └── Question Number Grid
    │
    ├── TestResultDashboard (Protected)
    │   ├── Header
    │   ├── Score Summary
    │   ├── Performance Charts
    │   ├── Detailed Results Table
    │   └── Re-attempt Button
    │
    ├── CommunityBlog (Protected)
    │   ├── Header
    │   ├── Create Post Button
    │   └── Posts Feed
    │       └── Post Card
    │           ├── Author Info
    │           ├── Title & Content
    │           ├── Like Button
    │           ├── Comment Button
    │           ├── Comments Section
    │           └── Comment Input
    │
    ├── PostDetails (Protected)
    │   ├── Header
    │   ├── Full Post Content
    │   ├── Comments Section
    │   └── Comment Input
    │
    ├── AIChatbot (Protected)
    │   ├── Header
    │   ├── Token Status Display
    │   ├── Quick Questions
    │   ├── Chat Messages
    │   │   ├── User Message
    │   │   └── AI Response
    │   └── Message Input
    │
    ├── UserProfile (Protected)
    │   ├── Header
    │   ├── Profile Card
    │   │   ├── Avatar
    │   │   ├── Name & Email
    │   │   └── Edit Button
    │   ├── Stats Section
    │   ├── Academics Section
    │   ├── Purchase History
    │   └── Achievements
    │
    ├── AccountManagement (Protected)
    │   ├── Header
    │   ├── Account Settings
    │   ├── Theme Toggle
    │   └── Logout Button
    │
    ├── AdminDashboard (Protected - Admin Only)
    │   ├── Header
    │   ├── Key Metrics Cards
    │   ├── Charts
    │   │   ├── User Growth Chart
    │   │   ├── Revenue Chart
    │   │   └── Test Distribution
    │   ├── Recent Users Table
    │   └── Recent Posts Table
    │
    ├── ManageCourses (Protected - Admin Only)
    │   ├── Header
    │   ├── Create Course Button
    │   └── Courses Table
    │       └── Course Row
    │           ├── Name
    │           ├── Description
    │           ├── Price
    │           ├── Edit Button
    │           └── Delete Button
    │
    ├── ManageUsers (Protected - Admin Only)
    │   ├── Header
    │   └── Users Table
    │       └── User Row
    │           ├── Name
    │           ├── Email
    │           ├── Status
    │           ├── Join Date
    │           └── Deactivate Button
    │
    ├── ManagePosts (Protected - Admin Only)
    │   ├── Header
    │   └── Posts Table
    │       └── Post Row
    │           ├── Title
    │           ├── Author
    │           ├── Status
    │           ├── Publish Button
    │           └── Delete Button
    │
    └── Header (Shared)
        ├── Logo
        ├── Navigation Menu
        ├── User Menu
        ├── Theme Toggle
        └── Logout Button
```

---

## Redux State Flow Diagram

```
User Action (e.g., Click Login Button)
    ↓
Component Event Handler
    ↓
Dispatch Redux Action/Thunk
    ↓
Async Thunk (if applicable)
    ├─→ API Request (fetch)
    ├─→ Handle Response
    └─→ Dispatch Fulfilled/Rejected Action
    ↓
Reducer Updates State
    ↓
Component Selector (useAppSelector)
    ↓
Component Re-renders with New State
    ↓
UI Updates
```

### Example: Login Flow State Updates

```
Initial State:
{
  auth: {
    user: null,
    isAuthenticated: false,
    token: null,
    isLoading: false,
    error: null
  }
}

User clicks "Login" → Dispatches login({ email, otp })
    ↓
login.pending triggered:
{
  auth: {
    ...
    isLoading: true,
    error: null
  }
}

API returns success:
    ↓
login.fulfilled triggered:
{
  auth: {
    user: { id: 1, name: "John", email: "john@example.com", is_admin: false },
    isAuthenticated: true,
    token: "eyJhbGciOiJIUzI1NiIs...",
    isLoading: false,
    error: null
  }
}

Component re-renders with new state
    ↓
Navigation to /courses
```

---

## Data Flow: Purchase to Test Taking

```
1. COURSE SELECTION
   ├─ User selects course
   ├─ Dispatches fetchCourses()
   ├─ API: GET /api/courses
   └─ Redux: courses.courses = [...]

2. SUBJECT SELECTION
   ├─ User selects subjects
   ├─ Dispatches fetchSubjects(courseId)
   ├─ API: GET /api/subjects?course_id={id}
   ├─ Redux: subjects.subjects = [...]
   └─ User toggles subject selection
       └─ Redux: subjects.selectedSubjects = [1, 2, 3]

3. ADD TO CART
   ├─ User clicks "Add to Cart"
   ├─ Redux: purchase.currentCart.items = [...]
   ├─ Redux: purchase.currentCart.courseId = 1
   └─ Redux: purchase.currentCart.bundleDiscount = 100

4. CHECKOUT
   ├─ User navigates to /purchase
   ├─ Component reads purchase.currentCart
   ├─ Displays summary with calculated totals
   └─ User clicks "Confirm Purchase"

5. PROCESS PURCHASE
   ├─ API: POST /api/purchases
   ├─ Request: { course_id, purchase_type, subject_ids, cost }
   ├─ Response: { purchase_id, test_cards_created, ... }
   ├─ Redux: purchase.currentCart = { items: [], ... }
   ├─ Redux: purchase.purchases.push(newPurchase)
   └─ Navigation to /test-cards

6. VIEW TEST CARDS
   ├─ Component: TestCardDashboard
   ├─ On Mount: Dispatches getTestCards()
   ├─ API: GET /api/user/test-cards
   ├─ Response: { test_cards_by_subject: [...] }
   └─ Redux: Stores test cards in local state

7. START TEST
   ├─ User clicks "Start Test" on card
   ├─ API: POST /api/user/test-cards/{id}/instructions
   ├─ Response: { generation_session_id, session_id }
   ├─ Navigation to /test-instructions
   └─ Polling starts: GET /api/user/test-cards/generation-status

8. POLL GENERATION
   ├─ Every 1 second: Check generation progress
   ├─ Response: { progress, is_complete, questions_generated }
   ├─ UI: Update progress bar
   └─ When complete: Enable "Start Test" button

9. TAKE TEST
   ├─ User clicks "Start Test" on instructions
   ├─ API: POST /api/user/test-cards/{id}/start
   ├─ Response: { session_id, questions_generated }
   ├─ Navigation to /test
   ├─ Redux: tests.currentTest.id = session_id
   ├─ Redux: tests.currentTest.isActive = true
   └─ Component: MCQTestScreen loads

10. ANSWER QUESTIONS
    ├─ User selects option
    ├─ Redux: tests.currentTest.answers[questionId] = "A"
    ├─ UI: Option highlighted, question palette updates
    └─ User can flag question
        └─ Redux: tests.currentTest.flagged.push(questionId)

11. SUBMIT TEST
    ├─ User clicks "Submit Test"
    ├─ Confirmation dialog shown
    ├─ API: POST /api/user/test-cards/{id}/submit
    ├─ Request: { session_id, answers, time_taken }
    ├─ Response: { score, percentage, detailed_results }
    ├─ Redux: tests.testHistory.push(result)
    ├─ Redux: tests.currentTest = { reset }
    └─ Navigation to /results

12. VIEW RESULTS
    ├─ Component: TestResultDashboard
    ├─ Displays score, percentage, breakdown
    ├─ Shows detailed results table
    └─ Option to re-attempt test
```

---

## Component Communication Patterns

### 1. Parent to Child (Props)
```typescript
// Parent
<CourseCard course={course} onSelect={handleSelect} />

// Child
interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
}
```

### 2. Child to Parent (Callbacks)
```typescript
// Parent
const handleAddToCart = (item) => {
  dispatch(addToCart(item));
};

// Child
<Button onClick={() => onAddToCart(subject)}>Add to Cart</Button>
```

### 3. Global State (Redux)
```typescript
// Component A
dispatch(setSelectedCourse(course));

// Component B
const selectedCourse = useAppSelector(state => state.courses.selectedCourse);
```

### 4. Local State (useState)
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
```

---

## API Request Flow with Token Refresh

```
Component makes API call
    ↓
apiRequest() function called
    ↓
Get access token from localStorage
    ↓
Add Authorization header: Bearer {token}
    ↓
Fetch request sent
    ↓
Response received
    ├─ Status 200-299: Return data
    ├─ Status 401: Token expired
    │   ├─ Check if refresh token exists
    │   ├─ Call requestManager.refreshToken()
    │   │   ├─ POST /api/auth/refresh
    │   │   ├─ Get new access token
    │   │   ├─ Save to localStorage
    │   │   └─ Process queued requests
    │   ├─ Retry original request with new token
    │   └─ Return data
    └─ Status 400-500: Return error
    ↓
Component receives data/error
    ↓
Update Redux state or local state
    ↓
Component re-renders
```

---

## Error Handling Flow

```
API Request
    ↓
Response received
    ├─ Success (200-299)
    │   └─ Return data
    └─ Error (400-500)
        ├─ Parse error message
        ├─ Check error type
        │   ├─ 401: Token expired
        │   │   └─ Attempt refresh
        │   ├─ 403: Insufficient permissions
        │   │   └─ Show permission error
        │   ├─ 404: Resource not found
        │   │   └─ Show not found error
        │   └─ 500: Server error
        │       └─ Show server error
        ├─ Dispatch error action to Redux
        ├─ Show toast notification
        └─ Return error to component
```

---

## Loading State Management

### Pattern 1: Global Loading (Redux)
```typescript
const { isLoading } = useAppSelector(state => state.courses);

if (isLoading) {
  return <Spinner />;
}
```

### Pattern 2: Per-Item Loading
```typescript
const [startingTestId, setStartingTestId] = useState<number | null>(null);

const handleStartTest = async (testId) => {
  setStartingTestId(testId);
  try {
    // API call
  } finally {
    setStartingTestId(null);
  }
};

// In render
<Button disabled={startingTestId === testId}>
  {startingTestId === testId ? <Spinner /> : "Start Test"}
</Button>
```

### Pattern 3: Polling with Loading
```typescript
const [isLoading, setIsLoading] = useState(true);
const [progress, setProgress] = useState(0);

useEffect(() => {
  const interval = setInterval(async () => {
    const response = await api.getProgress();
    setProgress(response.progress);
    
    if (response.is_complete) {
      setIsLoading(false);
      clearInterval(interval);
    }
  }, 1000);
  
  return () => clearInterval(interval);
}, []);
```

---

## Theme Management

### Theme Toggle Flow
```
User clicks theme toggle
    ↓
Component state updates
    ↓
localStorage updated: theme = 'dark' | 'light'
    ↓
CSS classes applied to document root
    ↓
Tailwind dark: prefix applies styles
    ↓
UI re-renders with new colors
```

### Protected Pages Theme Rules
- **Public Pages** (Landing, Auth): Always light theme
- **Authenticated Pages** (Dashboard, Tests): Respects user theme preference
- **Admin Pages**: Respects user theme preference

---

## Performance Optimizations

### 1. Memoization
```typescript
const CourseCard = React.memo(({ course, onSelect }) => {
  return <Card onClick={() => onSelect(course)}>{course.name}</Card>;
});
```

### 2. Lazy Loading
```typescript
const AdminDashboard = lazy(() => import('./AdminDashboard'));

<Suspense fallback={<Spinner />}>
  <AdminDashboard />
</Suspense>
```

### 3. Debouncing
```typescript
const debouncedSearch = useCallback(
  debounce((query) => {
    dispatch(searchCourses(query));
  }, 300),
  [dispatch]
);
```

### 4. Pagination
```typescript
const [page, setPage] = useState(1);
const { posts } = useAppSelector(state => state.community);
const itemsPerPage = 10;
const paginatedPosts = posts.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage
);
```

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0

