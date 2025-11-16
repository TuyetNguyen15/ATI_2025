import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// 🏠 Screens
import HomeScreen from '../screens/home/MainHome';
import PredictionScreen from '../screens/home/PredictionScreen';
import ProfileScreen from '../screens/my_profile/ProfileScreen';

// ⚙️ Tạo các màn hình tạm
function DummyScreen({ title }) {
  return (
    <View style={styles.screen}>
      <Text style={{ color: '#fff', fontSize: 18 }}>{title}</Text>
    </View>
  );
}

const NotificationScreen = () => <DummyScreen title="🔔 Thông báo" />;
const ChatScreen = () => <DummyScreen title="💬 Trò chuyện" />;
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

/* 🏠 Stack riêng cho tab Home */
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Prediction"
        component={PredictionScreen}
        options={{
          title: '',
          headerStyle: { backgroundColor: '#101020' },
          headerTintColor: '#fff',
          headerBackTitleVisible: false,
        }}
      />
    </HomeStack.Navigator>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* Trang chủ  */}
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home-outline"
              size={26}
              color={focused ? '#ffb6d9' : '#ccc'}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'Home',
                params: {
                  screen: 'HomeMain',
                 
                },
              })
            );
          },
        })}
      />


      {/* 🔔 Thông báo */}
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'notifications' : 'notifications-outline'}
              size={26}
              color={focused ? '#ffb6d9' : '#ccc'}
            />
          ),
        }}
      />

      {/* ❤️ Nút giữa */}
      <Tab.Screen
        name="Match"
        component={ChatScreen}
        options={{
          tabBarIcon: () => (
            <TouchableOpacity activeOpacity={0.7} style={styles.centerButton}>
              <LinearGradient
                colors={['#ff7bbf', '#b36dff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heartGradient}
              >
                <Ionicons name="heart" size={38} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ),
        }}
      />

      {/* 💬 Chat */}
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={26}
              color={focused ? '#ffb6d9' : '#ccc'}
            />
          ),
        }}
      />

      {/* 👤 Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={26}
              color={focused ? '#ffb6d9' : '#ccc'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderTopWidth: 0,
    elevation: 15,
    shadowColor: '#ffb6d9',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -2 },
    backdropFilter: Platform.OS === 'ios' ? 'blur(20px)' : undefined,
  },
  centerButton: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartGradient: {
    width: 55,
    height: 55,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff7acb',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: '#1a0126',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
