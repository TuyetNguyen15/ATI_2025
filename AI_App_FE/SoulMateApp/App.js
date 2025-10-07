// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './registerscreen/LoginScreen';
import RegisterScreen1 from './registerscreen/screen1';
import RegisterScreen2 from './registerscreen/screen2';
import BottomTabs from './components/BottomTabs';
import { getApps } from 'firebase/app';
import app from './firebaseConfig';

const Stack = createStackNavigator();

export default function App() {
  React.useEffect(() => {
    const apps = getApps();
    if (apps.length > 0) console.log('🔥 Firebase initialized:', apps[0].name);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen1" component={RegisterScreen1} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
