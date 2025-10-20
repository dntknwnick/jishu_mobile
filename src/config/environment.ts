// Environment Configuration for React Native Frontend
// Centralized configuration for API URLs and environment settings

import { Platform } from 'react-native';

interface EnvironmentConfig {
  API_BASE_URL: string;
  NODE_ENV: string;
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;
  BYPASS_PURCHASE_VALIDATION: boolean;
  LOCAL_DEV_MODE: boolean;
  DEV_MODE: boolean;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

// Get API URL based on platform
// For Android Emulator: http://10.0.2.2:5000
// For iOS Simulator: http://localhost:5000
// For Physical Device: http://192.168.x.x:5000 (replace with your machine IP)
const getApiUrl = (): string => {
  // Platform-specific API URLs
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000'; // Android emulator - special alias for localhost
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:5000'; // iOS simulator
  }

  return 'http://localhost:5000'; // Default fallback
};

export const config: EnvironmentConfig = {
  // API Configuration - Platform specific
  API_BASE_URL: getApiUrl(),

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: '',
  GOOGLE_CLIENT_SECRET: '',

  // Environment
  NODE_ENV: 'development',

  // Environment checks
  IS_PRODUCTION: false,
  IS_DEVELOPMENT: true,

  // Purchase flow configuration
  BYPASS_PURCHASE_VALIDATION: true,
  LOCAL_DEV_MODE: true,
  DEV_MODE: true,
};

// Export individual values for convenience
export const {
  API_BASE_URL,
  NODE_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  BYPASS_PURCHASE_VALIDATION,
  LOCAL_DEV_MODE,
  DEV_MODE,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = config;

// Debug logging in development
if (IS_DEVELOPMENT) {
  console.log('🔧 Environment Configuration:', {
    API_BASE_URL,
    NODE_ENV,
    IS_PRODUCTION,
    IS_DEVELOPMENT,
    BYPASS_PURCHASE_VALIDATION,
    LOCAL_DEV_MODE,
    DEV_MODE,
  });
}

export default config;

