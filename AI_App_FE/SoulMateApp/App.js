import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './app/store';
import * as SplashScreen from 'expo-splash-screen';

// IMPORT CÁC MÀN HÌNH
import OnboardingScreen from './onboardingScreen/OnboardingScreen';
import LoginScreen from './registerscreen/LoginScreen';
import RegisterScreen1 from './registerscreen/screen1';
import RegisterScreen2 from './registerscreen/screen2';
import BottomTabs from './components/BottomTabs';

// ❌ KHÔNG IMPORT firebase/app Ở ĐÂY NỮA
// import { getApps } from 'firebase/app';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  // ✅ CHỈ CÒN LOGIC SPLASH SCREEN
  React.useEffect(() => {
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

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
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