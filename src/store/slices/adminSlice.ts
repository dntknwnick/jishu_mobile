import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi, Course, Subject, User, ApiError } from '../../services/api';

interface AdminState {
  courses: Course[];
  subjects: Subject[];
  users: User[];
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalCourses: number;
    totalSubjects: number;
    totalPosts: number;
    publishedPosts: number;
    totalPurchases: number;
    totalRevenue: number;
    totalAIQueries: number;
    totalTokensUsed: number;
    averageScore: number;
    recentUsers: Array<{
      id: number;
      name: string;
      email_id: string;
      created_at: string;
    }>;
    recentPosts: Array<{
      id: number;
      title: string;
      author_id: number;
      created_at: string;
    }>;
    totalTests: number;
    monthlyRevenue: number;
    activeTests?: number;
    avgScore?: number;
  };
  systemStatus: {
    apiStatus: string;
    databaseStatus: string;
    serverLoad: number;
    activeSessions: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  courses: [],
  subjects: [],
  users: [],
  stats: {
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    totalSubjects: 0,
    totalPosts: 0,
    publishedPosts: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    totalAIQueries: 0,
    totalTokensUsed: 0,
    averageScore: 0,
    recentUsers: [],
    recentPosts: [],
    totalTests: 0,
    monthlyRevenue: 0,
    activeTests: 0,
    avgScore: 0,
  },
  systemStatus: {
    apiStatus: 'operational',
    databaseStatus: 'healthy',
    serverLoad: 0,
    activeSessions: 0,
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getUsers();
      return response.data?.users || [];
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch users');
    }
  }
);

export const fetchCourses = createAsyncThunk(
  'admin/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getCourses();
      return response.data?.courses || [];
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch courses');
    }
  }
);

export const fetchStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.getStats();
      return response.data?.stats || {};
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch stats');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = { ...state.stats, ...action.payload };
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;

