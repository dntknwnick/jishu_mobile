import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { store } from './src/store';
import { loadPersistedAuthState } from './src/store/middleware/persistenceMiddleware';
import { initializeAuth } from './src/store/slices/authSlice';

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load persisted auth state on app startup
    const initializeApp = async () => {
      try {
        const persistedAuth = await loadPersistedAuthState();
        if (persistedAuth) {
          store.dispatch(initializeAuth(persistedAuth));
          console.log('✅ Persisted auth state loaded');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return null; // Can add a splash screen component here
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
          </NavigationContainer>
        </AuthProvider>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
