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
  }): Promise<ApiResponse<{ access_token: string; refresh_token: string; user: User }>> => {
    try {
      const response = await api.post('/api/auth/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login with OTP
  login: async (email: string, otp: string): Promise<ApiResponse<{ access_token: string; refresh_token: string; user: User }>> => {
    try {
      const response = await api.post('/api/auth/login', { email, otp });
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
};

// ============================================================================
// Courses API
// ============================================================================

export const coursesApi = {
  // Get all courses
  getAll: async (): Promise<ApiResponse<{ courses: Course[] }>> => {
    try {
      const response = await api.get('/api/courses');
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
  // Get subjects for a course
  getByCourse: async (courseId: number): Promise<ApiResponse<{ subjects: Subject[] }>> => {
    try {
      const response = await api.get(`/api/subjects?course_id=${courseId}`);
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
  }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/chatbot/query', data);
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
  // Get posts
  getPosts: async (page = 1, perPage = 10): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/api/community/posts?page=${page}&per_page=${perPage}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create post
  createPost: async (data: { title: string; content: string; tags: string[] }): Promise<ApiResponse> => {
    try {
      const response = await api.post('/api/community/posts', data);
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

export default {
  auth: authApi,
  courses: coursesApi,
  subjects: subjectsApi,
  profile: profileApi,
  purchase: purchaseApi,
  test: testApi,
  mcq: mcqApi,
  chatbot: chatbotApi,
  community: communityApi,
};

