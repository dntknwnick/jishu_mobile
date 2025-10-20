# Jishu Frontend - Detailed API Reference & Advanced Flows

**Base URL**: `http://localhost:5000`

---

## Complete API Endpoint Reference

### Authentication Endpoints

#### 1. Request OTP
```
POST /api/auth/otp/request
Authentication: None

Request:
{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "otp_sent": true,
    "action": "registration" | "login",
    "user_exists": false,
    "message": "OTP sent for registration"
  }
}

Error (400):
{
  "success": false,
  "message": "Invalid email format"
}
```

#### 2. Register User
```
POST /api/auth/register
Authentication: None

Request:
{
  "email": "user@example.com",
  "otp": "123456",
  "name": "John Doe",
  "mobile_no": "9876543210",
  "password": ""
}

Response (201):
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "mobile_no": "9876543210",
    "is_admin": false,
    "is_premium": false,
    "created_at": "2025-10-20T10:00:00Z"
  }
}
```

#### 3. Login User
```
POST /api/auth/login
Authentication: None

Request:
{
  "email": "user@example.com",
  "otp": "123456"
}

Response (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### 4. Refresh Token
```
POST /api/auth/refresh
Authentication: Bearer {refresh_token}

Response (200):
{
  "access_token": "new_jwt_token",
  "refresh_token": "new_refresh_token",
  "user": { ... }
}

Error (401):
{
  "success": false,
  "message": "Refresh token has expired"
}
```

#### 5. Logout
```
POST /api/auth/logout
Authentication: Bearer {access_token}

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 6. Get Profile
```
GET /api/auth/profile
Authentication: Bearer {access_token}

Response (200):
{
  "user": { ... }
}
```

---

### Course & Subject Endpoints

#### 1. Get All Courses
```
GET /api/courses
Authentication: Bearer {access_token}

Response (200):
{
  "courses": [
    {
      "id": 1,
      "course_name": "NEET",
      "description": "National Eligibility cum Entrance Test",
      "amount": 999,
      "offer_amount": 799,
      "max_tokens": 1000,
      "created_at": "2025-01-01T00:00:00Z"
    },
    ...
  ]
}
```

#### 2. Get Subjects by Course
```
GET /api/subjects?course_id={courseId}
Authentication: Bearer {access_token}

Response (200):
{
  "subjects": [
    {
      "id": 1,
      "subject_name": "Physics",
      "course_id": 1,
      "amount": 299,
      "offer_amount": 199,
      "max_tokens": 500,
      "total_mock": 50,
      "is_bundle": false,
      "created_at": "2025-01-01T00:00:00Z"
    },
    ...
  ]
}
```

#### 3. Get Bundles by Course
```
GET /api/bundles?course_id={courseId}
Authentication: Bearer {access_token}

Response (200):
{
  "bundles": [
    {
      "id": 10,
      "subject_name": "NEET Complete Bundle",
      "course_id": 1,
      "amount": 999,
      "offer_amount": 699,
      "max_tokens": 2000,
      "total_mock": 150,
      "is_bundle": true
    },
    ...
  ]
}
```

---

### Purchase Endpoints

#### 1. Create Purchase
```
POST /api/purchases
Authentication: Bearer {access_token}

Request:
{
  "course_id": 1,
  "purchase_type": "single_subject" | "multiple_subjects" | "full_bundle",
  "subject_ids": [1, 2, 3],
  "cost": 500
}

Response (201):
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

#### 2. Get User Purchases
```
GET /api/user/purchases
Authentication: Bearer {access_token}

Response (200):
{
  "purchases": [
    {
      "id": 123,
      "exam_category_id": 1,
      "exam_category_name": "NEET",
      "purchase_type": "single_subject",
      "subjects_included": [1],
      "cost": 199,
      "purchase_date": "2025-10-20T10:00:00Z",
      "status": "active",
      "test_cards_count": 10,
      "chatbot_tokens_unlimited": true
    },
    ...
  ],
  "total_purchases": 3
}
```

---

### Test Card Endpoints

#### 1. Get Test Cards
```
GET /api/user/test-cards
Authentication: Bearer {access_token}

Response (200):
{
  "test_cards_by_subject": [
    {
      "subject_id": 1,
      "subject_name": "Physics",
      "course_name": "NEET",
      "total_cards": 10,
      "available_cards": 8,
      "completed_cards": 2,
      "disabled_cards": 0,
      "cards": [
        {
          "id": 1,
          "purchase_id": 123,
          "test_number": 1,
          "max_attempts": 3,
          "attempts_used": 1,
          "remaining_attempts": 2,
          "questions_generated": true,
          "latest_score": 85,
          "latest_percentage": 85,
          "latest_attempt_date": "2025-10-19T15:30:00Z",
          "status": "available",
          "is_available": true
        },
        ...
      ]
    },
    ...
  ]
}
```

#### 2. Get Test Instructions
```
POST /api/user/test-cards/{mockTestId}/instructions
Authentication: Bearer {access_token}

Response (200):
{
  "generation_session_id": "session_abc123",
  "session_id": 456,
  "message": "Test instructions ready"
}
```

#### 3. Poll Generation Progress
```
GET /api/user/test-cards/generation-status?generation_session_id={sessionId}
Authentication: Bearer {access_token}

Response (200):
{
  "success": true,
  "session_id": "session_abc123",
  "progress": 50,
  "questions_generated": 5,
  "total_questions": 10,
  "is_complete": false,
  "has_error": false,
  "error_message": null,
  "questions": [
    {
      "id": 1,
      "question": "What is the SI unit of force?",
      "options": {
        "A": "Newton",
        "B": "Joule",
        "C": "Watt",
        "D": "Pascal"
      },
      "correct_answer": "Newton",
      "explanation": "The SI unit of force is Newton..."
    },
    ...
  ],
  "can_use_partial": true,
  "timestamp": "2025-10-20T10:05:00Z"
}
```

#### 4. Start Test Card
```
POST /api/user/test-cards/{mockTestId}/start
Authentication: Bearer {access_token}

Response (200):
{
  "session_id": 456,
  "mock_test_id": 123,
  "attempt_number": 1,
  "remaining_attempts": 2,
  "questions_generated": true
}
```

#### 5. Submit Test
```
POST /api/user/test-cards/{mockTestId}/submit
Authentication: Bearer {access_token}

Request:
{
  "session_id": 456,
  "answers": {
    "1": "A",
    "2": "B",
    "3": "C",
    ...
  },
  "time_taken": 1800
}

Response (200):
{
  "score": 85,
  "percentage": 85,
  "correct_answers": 17,
  "wrong_answers": 3,
  "unanswered": 0,
  "detailed_results": [
    {
      "question_id": 1,
      "question": "What is the SI unit of force?",
      "user_answer": "A",
      "correct_answer": "A",
      "is_correct": true,
      "explanation": "..."
    },
    ...
  ]
}
```

---

### Community Endpoints

#### 1. Get All Posts
```
GET /api/community/posts
Authentication: Bearer {access_token}

Response (200):
{
  "posts": [
    {
      "id": 1,
      "title": "Tips for NEET Preparation",
      "content": "Here are some tips...",
      "author": {
        "id": 1,
        "name": "John Doe",
        "avatar": "..."
      },
      "likes_count": 10,
      "comments_count": 5,
      "liked": false,
      "comments": [
        {
          "id": 1,
          "content": "Great tips!",
          "author": { ... },
          "created_at": "2025-10-20T10:00:00Z"
        },
        ...
      ],
      "created_at": "2025-10-20T09:00:00Z"
    },
    ...
  ]
}
```

#### 2. Create Post
```
POST /api/community/posts
Authentication: Bearer {access_token}
Content-Type: multipart/form-data

Request:
{
  "title": "My Study Tips",
  "content": "Here's what worked for me...",
  "tags": ["neet", "physics", "tips"],
  "image": <File>
}

Response (201):
{
  "post": { ... }
}
```

#### 3. Like Post
```
POST /api/community/posts/{postId}/like
Authentication: Bearer {access_token}

Response (200):
{
  "liked": true,
  "likes_count": 11
}
```

#### 4. Add Comment
```
POST /api/community/posts/{postId}/comments
Authentication: Bearer {access_token}

Request:
{
  "content": "Great post!"
}

Response (201):
{
  "id": 1,
  "content": "Great post!",
  "author": { ... },
  "created_at": "2025-10-20T10:00:00Z"
}
```

---

### AI Chatbot Endpoints

#### 1. Send Chat Message
```
POST /api/ai/chat
Authentication: Bearer {access_token}

Request:
{
  "message": "Explain Newton's Laws",
  "session_id": "session_1234567890"
}

Response (200):
{
  "success": true,
  "data": {
    "response": "Newton's Laws of Motion are three fundamental principles...",
    "token_info": {
      "tokens_used_today": 5,
      "daily_limit": 50,
      "remaining_tokens": 45,
      "is_unlimited": false
    }
  }
}
```

#### 2. Get Token Status
```
GET /api/ai/token-status
Authentication: Bearer {access_token}

Response (200):
{
  "success": true,
  "data": {
    "tokens_used_today": 5,
    "daily_limit": 50,
    "remaining_tokens": 45,
    "is_unlimited": false
  }
}
```

---

### User Profile Endpoints

#### 1. Get Profile
```
GET /api/user/profile
Authentication: Bearer {access_token}

Response (200):
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "mobile_no": "9876543210",
    "is_admin": false,
    "is_premium": true,
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

#### 2. Update Profile
```
PATCH /api/user/profile
Authentication: Bearer {access_token}

Request:
{
  "name": "John Doe Updated",
  "email": "newemail@example.com"
}

Response (200):
{
  "user": { ... }
}
```

#### 3. Get User Stats
```
GET /api/user/stats
Authentication: Bearer {access_token}

Response (200):
{
  "stats": {
    "tests_taken": 47,
    "average_score": 82,
    "total_study_time": 1200,
    "rank": 342
  }
}
```

#### 4. Get User Academics
```
GET /api/user/academics
Authentication: Bearer {access_token}

Response (200):
{
  "academics": {
    "school": "ABC Senior Secondary School",
    "target_exam": "NEET 2025",
    "target_score": "650+"
  }
}
```

#### 5. Update Academics
```
PATCH /api/user/academics
Authentication: Bearer {access_token}

Request:
{
  "school": "XYZ School",
  "target_exam": "JEE 2025",
  "target_score": "250+"
}

Response (200):
{
  "academics": { ... }
}
```

---

### Admin Endpoints

#### 1. Get All Users
```
GET /api/admin/users
Authentication: Bearer {access_token} (Admin only)

Response (200):
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "is_admin": false,
      "is_premium": true,
      "created_at": "2025-01-01T00:00:00Z",
      "last_login": "2025-10-20T10:00:00Z"
    },
    ...
  ]
}
```

#### 2. Get Admin Stats
```
GET /api/admin/stats
Authentication: Bearer {access_token} (Admin only)

Response (200):
{
  "stats": {
    "totalUsers": 1000,
    "activeUsers": 750,
    "totalCourses": 5,
    "totalSubjects": 15,
    "totalPosts": 200,
    "publishedPosts": 180,
    "totalPurchases": 5000,
    "totalRevenue": 500000,
    "totalAIQueries": 50000,
    "totalTokensUsed": 100000,
    "averageScore": 75,
    "totalTests": 10000,
    "monthlyRevenue": 50000,
    "recentUsers": [ ... ],
    "recentPosts": [ ... ]
  }
}
```

#### 3. Create Course
```
POST /api/admin/courses
Authentication: Bearer {access_token} (Admin only)

Request:
{
  "course_name": "JEE Advanced",
  "description": "Joint Entrance Examination Advanced",
  "amount": 1299,
  "offer_amount": 999,
  "max_tokens": 1500
}

Response (201):
{
  "course": { ... }
}
```

#### 4. Update Course
```
PUT /api/admin/courses/{id}
Authentication: Bearer {access_token} (Admin only)

Request:
{
  "course_name": "JEE Advanced Updated",
  "description": "...",
  "amount": 1299,
  "offer_amount": 999,
  "max_tokens": 1500,
  "is_deleted": false
}

Response (200):
{
  "course": { ... }
}
```

#### 5. Delete Course
```
DELETE /api/admin/courses/{id}
Authentication: Bearer {access_token} (Admin only)

Response (200):
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Missing/invalid token, token expired |
| 403 | Forbidden | Insufficient permissions (not admin) |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, constraint violation |
| 500 | Server Error | Internal server error |

---

## Request/Response Headers

### Request Headers
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
```

### Response Headers
```
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0

