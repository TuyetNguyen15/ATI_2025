import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './app/store';

import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen1 from './screens/auth/Register1';
import RegisterScreen2 from './screens/auth/Register2';
import BottomTabs from './components/BottomTabs';
import PredictionScreen from './screens/home/PredictionScreen';
import { getApps } from 'firebase/app';
import app from './firebaseConfig';

const Stack = createStackNavigator();

export default function App() {
  React.useEffect(() => {
    const apps = getApps();
    if (apps.length > 0) console.log('Firebase initialized:', apps[0].name);
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterScreen1" component={RegisterScreen1} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterScreen2" component={RegisterScreen2} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>

  );
}
