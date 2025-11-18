// 📄 App.js — Bản chuẩn nhất (2025)

import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch } from 'react-redux';
import { store } from './app/store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebaseConfig';
import { loadUserProfile } from './services/profileLoader';
import * as SplashScreen from 'expo-splash-screen';

// AUTH
import OnboardingScreen from './onboardingScreen/OnboardingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen1 from './screens/auth/Register1';
import RegisterScreen2 from './screens/auth/Register2';

// MAIN
import BottomTabs from './components/BottomTabs';
import UpdateAvatar from './screens/avatar/UpdateAvatar';
import EditProfile from './screens/edit_profile/EditProfile';
import NatalChartAnalysis from './screens/astrology_analysis/NatalChartAnalysis';
import LoveMatchSelectScreen from './screens/match/LoveMatchSelectScreen';

// CONNECTION
import ConnectionActionsScreen from './screens/conversation/ConnectionActionsScreen';
import IceBreakerScreen from './screens/conversation/IceBreakerScreen';

// ⭐ PROFILE (THÊM MỚI)
import UserProfileScreen from './screens/user_profile/UserProfileScreen';


SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

function AppContent() {
  const dispatch = useDispatch();
  const [appIsReady, setAppIsReady] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true);

  React.useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAppIsReady(true);
    }
    prepare();
  }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await loadUserProfile(user.uid);
        } catch (err) {
          console.error('Auth: Failed to load profile:', err);
        }
      }
      setIsInitializing(false);
    });

    return unsubscribe;
  }, [dispatch]);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) return null;

  if (isInitializing) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}>
        <ActivityIndicator size="large" color="#ff77a9" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{ headerShown: false }}
        >

          {/* AUTH */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen1" component={RegisterScreen1} />
          <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} />

          {/* MAIN APP */}
          <Stack.Screen name="Main" component={BottomTabs} />
          <Stack.Screen name="UpdateAvatar" component={UpdateAvatar} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="NatalChartAnalysis" component={NatalChartAnalysis} />
          <Stack.Screen name="LoveMatchSelectScreen" component={LoveMatchSelectScreen} />

          {/* CONNECTION */}
          <Stack.Screen name="ConnectionActionsScreen" component={ConnectionActionsScreen} />
          <Stack.Screen name="IceBreakerScreen" component={IceBreakerScreen} />

          {/* ⭐ PROFILE */}
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
          

        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
