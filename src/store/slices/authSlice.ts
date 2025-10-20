import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi, User, ApiError } from '../../services/api';
import googleOAuthService from '../../services/googleOAuth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
  refreshToken: null,
};

// Async thunks for API calls
export const requestOtp = createAsyncThunk(
  'auth/requestOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authApi.requestOtp(email);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to request OTP');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    data: {
      email: string;
      otp: string;
      password?: string;
      name: string;
      mobile_no: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.register(data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    data: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.login(data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Logout failed');
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      return response.data?.user;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to get profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(data);
      return response.data?.user;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update profile');
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const response = await googleOAuthService.login();
      if (!response) {
        return rejectWithValue('Google login cancelled');
      }
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Google login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
    initializeAuth: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string } | null>) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Request OTP
      .addCase(requestOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Still clear credentials on logout error
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCredentials, clearCredentials, initializeAuth } = authSlice.actions;

// Export async thunks
export { loginWithGoogle };

export default authSlice.reducer;

