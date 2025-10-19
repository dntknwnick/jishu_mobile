import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// API Configuration & Constants
// ============================================================================

const API_BASE_URL = 'http://localhost:5000'; // Change for production

// API Error class for consistent error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================================
// Request Manager for Token Refresh & Deduplication
// ============================================================================

class RequestManager {
  private refreshPromise: Promise<string | null> | null = null;
  private requestQueue: Array<() => Promise<any>> = [];
  private isRefreshing = false;

  async refreshToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const result = await this.refreshPromise;

      // Process queued requests
      if (result) {
        const queuedRequests = [...this.requestQueue];
        this.requestQueue = [];

        // Execute all queued requests
        await Promise.all(queuedRequests.map(request => request()));
      }

      return result;
    } finally {
      this.refreshPromise = null;
      this.isRefreshing = false;
    }
  }

  private async performTokenRefresh(): Promise<string | null> {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await axios.post(`${API_BASE_URL}/refresh-token`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      if (response.data?.success && response.data?.data?.access_token) {
        const newAccessToken = response.data.data.access_token;
        await AsyncStorage.setItem('access_token', newAccessToken);

        if (response.data.data?.refresh_token) {
          await AsyncStorage.setItem('refresh_token', response.data.data.refresh_token);
        }

        return newAccessToken;
      }
    } catch (error) {
      console.error('❌ Failed to refresh token:', error);
      // Clear tokens on refresh failure
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'jishu_user']);
    }

    return null;
  }

  queueRequest(requestFn: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  isTokenRefreshing(): boolean {
    return this.isRefreshing;
  }
}

const requestManager = new RequestManager();

// ============================================================================
// Axios Instance Setup
// ============================================================================

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await requestManager.refreshToken();

        if (newToken) {
          console.log('✅ Token refreshed successfully');
          // Retry request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          console.log('❌ Token refresh failed');
          // Clear tokens and reject
          await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'jishu_user']);
          return Promise.reject(new ApiError(401, 'Session expired. Please login again.'));
        }
      } catch (refreshError) {
        console.error('❌ Token refresh error:', refreshError);
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'jishu_user']);
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.data) {
      const data = error.response.data as any;
      throw new ApiError(
        error.response.status,
        data.message || data.error || 'API request failed',
        data
      );
    }

    throw new ApiError(0, 'Network error or server unavailable');
  }
);

export default api;
