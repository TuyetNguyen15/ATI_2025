// 📄 App.js (Đã được dọn dẹp và gộp code)
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


import OnboardingScreen from './onboardingScreen/OnboardingScreen';

// Màn hình Đăng nhập/Đăng ký (từ một nhánh)
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen1 from './screens/auth/Register1';
import RegisterScreen2 from './screens/auth/Register2';

// Màn hình chính
import BottomTabs from './components/BottomTabs';
import UpdateAvatar from './screens/avatar/UpdateAvatar';
import EditProfile from './screens/edit_profile/EditProfile';
import NatalChartAnalysis from './screens/astrology_analysis/NatalChartAnalysis';
import UserProfileScreen from './screens/user_profile/UserProfileScreen';
import LoveMatchSelectScreen from './screens/match/LoveMatchSelectScreen';

// CONNECTION
import ConnectionActionsScreen from './screens/conversation/ConnectionActionsScreen';
import IceBreakerScreen from './screens/conversation/IceBreakerScreen';




SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

/**
 * Component này chứa tất cả logic chính của app.
 * Nó chỉ được render sau khi Redux <Provider> đã bọc ở ngoài.
 */
function AppContent() {
  const dispatch = useDispatch();
  const [appIsReady, setAppIsReady] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true);

  // 1. Logic cho Splash Screen (tải font, assets...)
  React.useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAppIsReady(true);
    }
    prepare();
  }, []);

  // 2. Logic kiểm tra Đăng nhập
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Auth: User detected → Loading Firestore profile...');
        try {
          await loadUserProfile(user.uid, dispatch);

          console.log('Auth: Profile loaded globally');
        } catch (err) {
          console.error('Auth: Failed to load profile:', err);
        }
      } else {
        console.log('Auth: No user signed in.');
      }
      // Dù có user hay không, cũng đánh dấu là đã kiểm tra xong
      setIsInitializing(false);
    });

    return unsubscribe; // Dọn dẹp listener khi component unmount
  }, [dispatch]);

  // Hàm để ẩn Splash Screen khi View đã sẵn sàng
  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
      console.log('Splash: Hidden.');
    }
  }, [appIsReady]);

  // --- CÁC TRẠNG THÁI RENDER ---

  // 1. Nếu Splash chưa sẵn sàng, trả về null (Splash native vẫn đang hiển thị)
  if (!appIsReady) {
    return null;
  }

  // 2. Nếu Splash đã xong, nhưng Auth chưa kiểm tra xong, hiển thị loading
  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#ff77a9" />
      </View>
    );
  }

  // 3. Nếu cả 2 đều xong, hiển thị ứng dụng
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{ headerShown: false }}
        >
          {/* Gộp TẤT CẢ các màn hình từ cả 2 nhánh */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen1" component={RegisterScreen1} />
          <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} />
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

/**
 * Component App chính, chỉ dùng để bọc Redux Provider
 */
export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}