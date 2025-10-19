import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, User, ApiError } from '../services/apiEndpoints';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, otp: string) => Promise<void>;
  register: (data: { email: string; name: string; phone: string; otp: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const userData = await AsyncStorage.getItem('jishu_user');

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          await AsyncStorage.removeItem('jishu_user');
        }
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, otp: string) => {
    try {
      setError(null);
      console.log('🔐 Attempting login with email:', email);

      const response = await authApi.login(email, otp);

      if (response.success && response.data) {
        const { access_token, refresh_token, user: userData } = response.data;

        // Save tokens
        await AsyncStorage.setItem('access_token', access_token);
        await AsyncStorage.setItem('refresh_token', refresh_token);
        await AsyncStorage.setItem('jishu_user', JSON.stringify(userData));

        setUser(userData);
        console.log('✅ Login successful');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : error instanceof Error
        ? error.message
        : 'Login failed. Please try again.';

      console.error('❌ Login error:', errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  const register = async (data: { email: string; name: string; phone: string; otp: string }) => {
    try {
      setError(null);
      console.log('📝 Attempting registration with email:', data.email);

      const response = await authApi.register({
        email: data.email,
        name: data.name,
        mobile_no: data.phone,
        otp: data.otp,
      });

      if (response.success && response.data) {
        const { access_token, refresh_token, user: userData } = response.data;

        // Save tokens
        await AsyncStorage.setItem('access_token', access_token);
        await AsyncStorage.setItem('refresh_token', refresh_token);
        await AsyncStorage.setItem('jishu_user', JSON.stringify(userData));

        setUser(userData);
        console.log('✅ Registration successful');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : error instanceof Error
        ? error.message
        : 'Registration failed. Please try again.';

      console.error('❌ Registration error:', errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');

      // Call logout API
      try {
        await authApi.logout();
      } catch (apiError) {
        console.warn('⚠️ Logout API call failed, clearing local data anyway:', apiError);
      }

      // Clear local storage
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'jishu_user']);
      setUser(null);
      setError(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still clear local data even if API call fails
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'jishu_user']);
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      AsyncStorage.setItem('jishu_user', JSON.stringify(updatedUser));
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
