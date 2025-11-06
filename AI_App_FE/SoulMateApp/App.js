// 📄 App.js
import * as React from 'react';
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
import BottomTabs from './components/BottomTabs';
import UpdateAvatar from './screens/avatar/UpdateAvatar';
import EditProfile from './screens/edit_profile/EditProfile';
import { getApps } from 'firebase/app';
import app from './firebaseConfig';

const Stack = createStackNavigator();

function AppNavigator() {
  const dispatch = useDispatch();
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    const apps = getApps();
    if (apps.length > 0) console.log('Firebase initialized:', apps[0].name);
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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen1" component={RegisterScreen1} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateAvatar" component={UpdateAvatar} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
