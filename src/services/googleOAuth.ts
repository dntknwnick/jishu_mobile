import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/environment';

// Note: For production, use @react-native-google-signin/google-signin
// This is a simplified implementation for development

interface GoogleOAuthResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
}

/**
 * Google OAuth Service for React Native
 * Handles Google Sign-In flow and token management
 *
 * Note: This is a simplified implementation for development.
 * For production, integrate with @react-native-google-signin/google-signin
 */
export const googleOAuthService = {
  /**
   * Initiate Google OAuth login flow
   *
   * For development: This will show a mock login dialog
   * For production: Integrate with native Google Sign-In SDK
   */
  login: async (): Promise<GoogleOAuthResponse | null> => {
    try {
      console.log('🔐 Starting Google OAuth login flow...');
      console.log('📱 Note: Using mock Google OAuth for development');
      console.log('📱 For production, integrate @react-native-google-signin/google-signin');

      // For development, we'll use a mock implementation
      // In production, use the native Google Sign-In library
      const mockGoogleToken = 'mock_google_token_' + Date.now();
      const mockUserInfo = {
        id: 'mock_user_' + Date.now(),
        email: 'user@example.com',
        name: 'Mock User',
        picture: 'https://via.placeholder.com/150',
      };

      console.log('✅ Mock Google OAuth successful');
      console.log('🔑 Mock Access Token received');

      // Exchange Google token for app token
      const appTokenResponse = await googleOAuthService.exchangeTokenWithBackend(
        mockGoogleToken,
        mockUserInfo
      );

      if (!appTokenResponse) {
        throw new Error('Failed to exchange token with backend');
      }

      // Save tokens to AsyncStorage
      await AsyncStorage.setItem('access_token', appTokenResponse.access_token);
      if (appTokenResponse.refresh_token) {
        await AsyncStorage.setItem('refresh_token', appTokenResponse.refresh_token);
      }
      await AsyncStorage.setItem('jishu_user', JSON.stringify(appTokenResponse.user));

      console.log('✅ Google OAuth login completed successfully');
      return appTokenResponse;
    } catch (error) {
      console.error('❌ Google OAuth login error:', error);
      throw error;
    }
  },

  /**
   * Get user info from Google using access token
   */
  getUserInfo: async (accessToken: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const userInfo = await response.json();
      console.log('👤 User info retrieved:', userInfo.email);

      return {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };
    } catch (error) {
      console.error('❌ Error getting user info:', error);
      return null;
    }
  },

  /**
   * Exchange Google token for app token with backend
   */
  exchangeTokenWithBackend: async (googleToken: string, userInfo: any) => {
    try {
      console.log('🔄 Exchanging Google token with backend...');

      const response = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          google_token: googleToken,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to exchange token with backend');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Token exchange failed');
      }

      console.log('✅ Token exchanged successfully');

      return {
        access_token: data.data.access_token,
        refresh_token: data.data.refresh_token,
        user: data.data.user,
      };
    } catch (error) {
      console.error('❌ Error exchanging token:', error);
      throw error;
    }
  },

  /**
   * Logout and clear tokens
   */
  logout: async () => {
    try {
      console.log('🚪 Logging out from Google OAuth...');
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'jishu_user']);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  },

  /**
   * Get redirect URL for OAuth
   */
  getRedirectUrl: () => redirectUrl,
};

export default googleOAuthService;

