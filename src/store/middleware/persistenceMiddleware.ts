import { Middleware } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../index';

/**
 * Middleware to persist auth state to AsyncStorage
 * Saves auth state whenever it changes
 */
export const persistenceMiddleware: Middleware<{}, RootState> = (store) => (next) => async (action) => {
  const result = next(action);

  // Get the updated state after the action
  const state = store.getState();

  // Persist auth state
  if (state.auth.token && state.auth.user) {
    try {
      await AsyncStorage.setItem('access_token', state.auth.token);
      if (state.auth.refreshToken) {
        await AsyncStorage.setItem('refresh_token', state.auth.refreshToken);
      }
      await AsyncStorage.setItem('jishu_user', JSON.stringify(state.auth.user));
    } catch (error) {
      console.error('Failed to persist auth state:', error);
    }
  }

  // Clear auth state from storage if logged out
  if (!state.auth.isAuthenticated && !state.auth.token) {
    try {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'jishu_user']);
    } catch (error) {
      console.error('Failed to clear auth state:', error);
    }
  }

  return result;
};

/**
 * Load persisted auth state from AsyncStorage
 */
export const loadPersistedAuthState = async () => {
  try {
    const [token, refreshToken, userStr] = await AsyncStorage.multiGet([
      'access_token',
      'refresh_token',
      'jishu_user'
    ]);

    if (token[1] && userStr[1]) {
      try {
        const user = JSON.parse(userStr[1]);
        return {
          token: token[1],
          refreshToken: refreshToken[1] || null,
          user
        };
      } catch (error) {
        console.error('Failed to parse persisted user data:', error);
        // Clear invalid data
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'jishu_user']);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to load persisted auth state:', error);
    return null;
  }
};

