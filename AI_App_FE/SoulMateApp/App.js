// 📄 App.js
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch } from 'react-redux';
import { store } from './app/store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { loadUserProfile } from './services/profileLoader';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen1 from './screens/auth/Register1';
import RegisterScreen2 from './screens/auth/Register2';
import { Provider } from 'react-redux';
import { store } from './app/store';
import * as SplashScreen from 'expo-splash-screen';

// IMPORT CÁC MÀN HÌNH
import OnboardingScreen from './onboardingScreen/OnboardingScreen';
import LoginScreen from './registerscreen/LoginScreen';
import RegisterScreen1 from './registerscreen/screen1';
import RegisterScreen2 from './registerscreen/screen2';
import BottomTabs from './components/BottomTabs';
import UpdateAvatar from './screens/avatar/UpdateAvatar';
import EditProfile from './screens/edit_profile/EditProfile';
import NatalChartAnalysis from './screens/astrology_analysis/NatalChartAnalysis';

import { getApps } from 'firebase/app';
import app from './firebaseConfig';

// ❌ KHÔNG IMPORT firebase/app Ở ĐÂY NỮA
// import { getApps } from 'firebase/app';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

function AppNavigator() {
  const dispatch = useDispatch();
  const [initializing, setInitializing] = React.useState(true);

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  // ✅ CHỈ CÒN LOGIC SPLASH SCREEN
  React.useEffect(() => {
    const apps = getApps();
    if (apps.length > 0) console.log('Firebase initialized:', apps[0].name);
    async function prepare() {
      try {
        // Load fonts, assets...
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User detected → Loading Firestore profile...');
        try {
          await loadUserProfile(user.uid);
          console.log('Profile loaded globally');
        } catch (err) {
          console.error('Failed to load profile:', err);
        }
      } else {
        console.log('No user signed in');
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, [dispatch]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#ff77a9" />
      </View>
    );
  }

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen1" component={RegisterScreen1} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateAvatar" component={UpdateAvatar} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name="NatalChartAnalysis" component={NatalChartAnalysis} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen1" component={RegisterScreen1} />
            <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} />
            <Stack.Screen name="Main" component={BottomTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </View>
  );
}