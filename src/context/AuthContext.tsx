import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import type { User } from '../services/apiEndpoints';
import { login as reduxLogin, register as reduxRegister, logout as reduxLogout, loginWithGoogle as reduxLoginWithGoogle } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, otp: string) => Promise<void>;
  register: (data: { email: string; name: string; phone: string; otp: string }) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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
  loginWithGoogle: async () => {},
  updateUser: () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  const [localError, setLocalError] = useState<string | null>(null);

  const login = async (email: string, otp: string) => {
    try {
      setLocalError(null);
      console.log('🔐 Attempting login with email:', email);

      await dispatch(reduxLogin({ email, otp })).unwrap();
      console.log('✅ Login successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      console.error('❌ Login error:', errorMessage);
      setLocalError(errorMessage);
      throw err;
    }
  };

  const register = async (data: { email: string; name: string; phone: string; otp: string }) => {
    try {
      setLocalError(null);
      console.log('📝 Attempting registration with email:', data.email);

      await dispatch(reduxRegister({
        email: data.email,
        name: data.name,
        mobile_no: data.phone,
        otp: data.otp,
      })).unwrap();

      console.log('✅ Registration successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      console.error('❌ Registration error:', errorMessage);
      setLocalError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await dispatch(reduxLogout()).unwrap();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Still clear local data even if API call fails
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'jishu_user']);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLocalError(null);
      console.log('🔐 Attempting Google login...');
      await dispatch(reduxLoginWithGoogle()).unwrap();
      console.log('✅ Google login successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google login failed. Please try again.';
      console.error('❌ Google login error:', errorMessage);
      setLocalError(errorMessage);
      throw err;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      AsyncStorage.setItem('jishu_user', JSON.stringify(updatedUser));
    }
  };

  const clearError = () => {
    setLocalError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error: error || localError,
        login,
        register,
        logout,
        loginWithGoogle,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
