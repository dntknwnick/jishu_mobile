// API Endpoints - Matches React Web App Implementation
import { api, ApiError } from './api';

// ============================================================================
// Type Definitions
// ============================================================================

export interface User {
  id: number;
  email_id: string;
  name: string;
  mobile_no?: string;
  status: string;
  color_theme?: string;
  avatar?: string;
  gender?: string;
  date_of_birth?: string;
  city?: string;
  state?: string;
  address?: string;
  created_at?: string;
}

export interface Course {
  id: number;
  course_name: string;
  description: string;
  amount?: number;
  offer_amount?: number;
  max_tokens?: number;
  created_at?: string;
  subjects?: Subject[];
}

export interface Subject {
  id: number;
  subject_name: string;
  exam_category_id?: number;
  amount?: number;
  offer_amount?: number;
  max_tokens?: number;
  total_mock?: number;
  is_bundle?: boolean;
  is_deleted?: boolean;
  created_at?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  user?: User;
  image_url?: string;
  image?: string;
  tags?: string[];
  likes_count: number;
  comments_count: number;
  views?: number;
  is_liked?: boolean;
  recent_comments?: any[];
  timeAgo?: string;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// ============================================================================
// Authentication API
// ============================================================================

export const authApi = {
  // Request OTP for login/registration
  requestOtp: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/auth/otp/request', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register with OTP
  register: async (data: {
    email: string;
    otp: string;
    name: string;
    mobile_no: string;
    password?: string;
  }): Promise<ApiResponse<{ access_token: string; refresh_token: string; user: User }>> => {
    try {
      const response = await api.post('/api/auth/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login with OTP
  login: async (data: { email: string; otp: string }): Promise<ApiResponse<{ access_token: string; refresh_token: string; user: User }>> => {
    try {
      const response = await api.post('/api/auth/login', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get profile
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await api.put('/api/auth/profile/edit', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email: string): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/auth/reset_password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Soft delete account
  softDeleteAccount: async (): Promise<ApiResponse> => {
    try {
      const response = await api.delete('/api/auth/soft_delete');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// Courses API
// ============================================================================

export const coursesApi = {
  // Get all courses with pagination
  getAll: async (page = 1, perPage = 10, search?: string): Promise<ApiResponse<{ courses: Course[] }>> => {
    try {
      let url = `/api/courses?page=${page}&per_page=${perPage}`;
      if (search) url += `&search=${search}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get course by ID
  getById: async (id: number, includeSubjects = true): Promise<ApiResponse<{ course: Course }>> => {
    try {
      const response = await api.get(`/api/courses/${id}?include_subjects=${includeSubjects}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// Subjects API
// ============================================================================

export const subjectsApi = {
  // Get subjects for a course with pagination
  getSubjects: async (courseId: number, page = 1, perPage = 20): Promise<ApiResponse<{ subjects: Subject[] }>> => {
    try {
      const response = await api.get(`/api/subjects?course_id=${courseId}&page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bundles for a course
  getBundles: async (courseId: number): Promise<ApiResponse<{ bundles: Subject[] }>> => {
    try {
      const response = await api.get(`/api/bundles?course_id=${courseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// User Profile API
// ============================================================================

export const profileApi = {
  // Get user profile
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await api.get('/api/user/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await api.patch('/api/user/profile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user stats
  getStats: async (): Promise<ApiResponse<{ stats: any }>> => {
    try {
      const response = await api.get('/api/user/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user academics
  getAcademics: async (): Promise<ApiResponse<{ academics: any }>> => {
    try {
      const response = await api.get('/api/user/academics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user academics
  updateAcademics: async (data: any): Promise<ApiResponse<{ academics: any }>> => {
    try {
      const response = await api.patch('/api/user/academics', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user purchases
  getPurchases: async (): Promise<ApiResponse<{ purchases: any[] }>> => {
    try {
      const response = await api.get('/api/user/purchases');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// Purchase API
// ============================================================================

export const purchaseApi = {
  // Create a new purchase
  createPurchase: async (data: {
    course_id: number;
    purchase_type: 'single_subject' | 'multiple_subjects' | 'full_bundle';
    subject_id?: number;
    subject_ids?: number[];
    cost: number;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/purchases', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user purchases
  getUserPurchases: async (): Promise<ApiResponse<{ purchases: any[] }>> => {
    try {
      const response = await api.get('/api/user/purchases');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// Test & MCQ API
// ============================================================================

export const testApi = {
  // Get test cards
  getTestCards: async (subjectId?: number): Promise<ApiResponse> => {
    try {
      const params = subjectId ? `?subject_id=${subjectId}` : '';
      const response = await api.get(`/api/user/test-cards${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get test instructions
  getTestInstructions: async (mockTestId: number): Promise<ApiResponse> => {
    try {
      const response = await api.post(`/api/user/test-cards/${mockTestId}/instructions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Poll generation status
  getGenerationStatus: async (mockTestId: number): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/api/user/test-cards/${mockTestId}/generation-status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Start test
  startTest: async (mockTestId: number): Promise<ApiResponse> => {
    try {
      const response = await api.post(`/api/user/test-cards/${mockTestId}/start`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get test questions
  getTestQuestions: async (sessionId: number, page = 1, perPage = 10): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/api/user/test-sessions/${sessionId}/questions?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Submit test
  submitTest: async (sessionId: number, answers: any[]): Promise<ApiResponse> => {
    try {
      const response = await api.post(`/api/user/test-sessions/${sessionId}/submit`, { answers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get test analytics
  getAnalytics: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/api/user/test-analytics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// AI Question Generation API
// ============================================================================

export const aiApi = {
  // Generate questions from text
  generateQuestionsFromText: async (data: {
    content: string;
    num_questions: number;
    subject_name: string;
    difficulty: string;
    exam_category_id: number;
    subject_id: number;
    save_to_database: boolean;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/ai/generate-questions-from-text', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generate questions from PDFs
  generateQuestionsFromPdfs: async (data: {
    num_questions: number;
    subject_name: string;
    difficulty: string;
    exam_category_id: number;
    subject_id: number;
    save_to_database: boolean;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/ai/generate-questions-from-pdfs', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // RAG chat with PDFs
  ragChat: async (data: {
    query: string;
    session_id: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/ai/rag/chat', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check RAG system status
  ragStatus: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/api/ai/rag/status');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reload RAG index
  reloadRagIndex: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/ai/rag/reload');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // AI chat
  chat: async (data: {
    message: string;
    context?: string;
    session_id?: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/ai/chat', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get token status
  getTokenStatus: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/api/ai/token-status');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// Questions API
// ============================================================================

export interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: number;
  difficulty?: string;
  subject_id?: number;
  explanation?: string;
}

export const questionsApi = {
  // Get questions with pagination
  getQuestions: async (page = 1, perPage = 20, params?: {
    exam_category_id?: number;
    subject_id?: number;
  }): Promise<ApiResponse<{ questions: Question[] }>> => {
    try {
      let url = `/api/questions?page=${page}&per_page=${perPage}`;
      if (params?.exam_category_id) url += `&exam_category_id=${params.exam_category_id}`;
      if (params?.subject_id) url += `&subject_id=${params.subject_id}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get question by ID
  getById: async (questionId: number): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/api/questions/${questionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create question (Admin)
  create: async (data: {
    exam_category_id: number;
    subject_id: number;
    question: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
    correct_answer: string;
    explanation: string;
    difficulty_level: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/admin/questions', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update question (Admin)
  update: async (questionId: number, data: any): Promise<ApiResponse> => {
    try {
      const response = await api.put(`/api/admin/questions/${questionId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete question (Admin)
  delete: async (questionId: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/api/admin/questions/${questionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bulk delete questions (Admin)
  bulkDelete: async (questionIds: number[]): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/admin/questions/bulk-delete', { question_ids: questionIds });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// MCQ Generation API
// ============================================================================

export const mcqApi = {
  // Generate MCQ
  generate: async (data: {
    subject: string;
    num_questions: number;
    difficulty: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/mcq/generate', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// Chatbot API
// ============================================================================

export const chatbotApi = {
  // Send query to chatbot
  query: async (data: {
    query: string;
    subjects?: string[];
    include_images?: boolean;
    session_id?: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/chatbot/query', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get token status
  getTokenStatus: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/api/chatbot/token-status');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get token statistics
  getTokenStatistics: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/api/chatbot/token-statistics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// Community API
// ============================================================================

export const communityApi = {
  // Get posts with pagination
  getPosts: async (page = 1, perPage = 10, sort = 'recent'): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/api/community/posts?page=${page}&per_page=${perPage}&sort=${sort}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get post by ID
  getPostById: async (postId: number): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/api/community/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create post
  createPost: async (data: { title: string; content: string; tags?: string[] }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/community/posts', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update post
  updatePost: async (postId: number, data: any): Promise<ApiResponse> => {
    try {
      const response = await api.put(`/api/community/posts/${postId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Like post
  likePost: async (postId: number): Promise<ApiResponse> => {
    try {
      const response = await api.post(`/api/community/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Unlike post
  unlikePost: async (postId: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/api/community/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add comment
  addComment: async (postId: number, content: string): Promise<ApiResponse> => {
    try {
      const response = await api.post(`/api/community/posts/${postId}/comment`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get comments
  getComments: async (postId: number, page = 1, perPage = 20): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/api/community/posts/${postId}/comments?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update comment
  updateComment: async (commentId: number, content: string): Promise<ApiResponse> => {
    try {
      const response = await api.put(`/api/community/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete post
  deletePost: async (postId: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/api/community/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (commentId: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/api/community/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// Admin API
// ============================================================================

export const adminApi = {
  // Get all users with pagination
  getUsers: async (page = 1, perPage = 20, search?: string): Promise<ApiResponse<{ users: User[] }>> => {
    try {
      let url = `/api/admin/users?page=${page}&per_page=${perPage}`;
      if (search) url += `&search=${search}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId: number): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response = await api.get(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Deactivate user
  deactivateUser: async (userId: number): Promise<ApiResponse> => {
    try {
      const response = await api.post(`/api/admin/users/${userId}/deactivate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all courses with pagination
  getCourses: async (page = 1, perPage = 20): Promise<ApiResponse<{ courses: Course[] }>> => {
    try {
      const response = await api.get(`/api/admin/courses?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all subjects
  getSubjects: async (page = 1, perPage = 20): Promise<ApiResponse<{ subjects: Subject[] }>> => {
    try {
      const response = await api.get(`/api/admin/subjects?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create subject
  createSubject: async (data: {
    course_id: number;
    subject_name: string;
    amount?: number;
    offer_amount?: number;
    max_tokens?: number;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/admin/subjects', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update subject
  updateSubject: async (subjectId: number, data: any): Promise<ApiResponse> => {
    try {
      const response = await api.put(`/api/admin/subjects/${subjectId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete subject
  deleteSubject: async (subjectId: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/api/admin/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get admin stats
  getStats: async (): Promise<ApiResponse<{ stats: any }>> => {
    try {
      const response = await api.get('/api/admin/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create course
  createCourse: async (data: {
    course_name: string;
    description: string;
    amount?: number;
    offer_amount?: number;
    max_tokens?: number;
  }): Promise<ApiResponse<{ course: Course }>> => {
    try {
      const response = await api.post('/api/admin/courses', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update course
  updateCourse: async (id: number, data: any): Promise<ApiResponse<{ course: Course }>> => {
    try {
      const response = await api.put(`/api/admin/courses/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete course
  deleteCourse: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/api/admin/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get community posts for moderation
  getCommunityPosts: async (page = 1, perPage = 20): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/api/admin/community/posts?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Moderate post (approve/reject)
  moderatePost: async (postId: number, action: 'approve' | 'reject'): Promise<ApiResponse> => {
    try {
      const response = await api.post(`/api/admin/community/posts/${postId}/moderate`, { action });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get community comments for moderation
  getCommunityComments: async (page = 1, perPage = 20): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/api/admin/community/comments?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Moderate comment (approve/reject)
  moderateComment: async (commentId: number, action: 'approve' | 'reject'): Promise<ApiResponse> => {
    try {
      const response = await api.post(`/api/admin/community/comments/${commentId}/moderate`, { action });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default {
  auth: authApi,
  courses: coursesApi,
  subjects: subjectsApi,
  profile: profileApi,
  purchase: purchaseApi,
  test: testApi,
  mcq: mcqApi,
  ai: aiApi,
  chatbot: chatbotApi,
  community: communityApi,
  questions: questionsApi,
  admin: adminApi,
};

