import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // ⚠️ Expo version
import ProfileScreen from '../profile/ProfileScreen';

// ⚙️ Tạo các màn hình tạm
function DummyScreen({ title }) {
  return (
    <View style={styles.screen}>
      <Text style={{ color: '#fff', fontSize: 18 }}>{title}</Text>
    </View>
  );
}
const HomeScreen = () => <DummyScreen title="🏠 Home Screen" />;
const NotificationScreen = () => <DummyScreen title="🔔 Notification Screen" />;
const ChatScreen = () => <DummyScreen title="💬 Chat Screen" />;

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home-outline"
              size={26}
              color={focused ? '#fff' : '#ccc'}
            />
          ),
        }}
      />

      {/* 🔔 Notification Tab */}
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'notifications' : 'notifications-outline'} // đổi icon khi được chọn
              size={26}
              color={focused ? '#fff' : '#ccc'}
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
                colors={['#b14eff', '#ff4ef0']}
                style={styles.heartGradient}
              >
                <Ionicons name="heart" size={28} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={26}
              color={focused ? '#fff' : '#ccc'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={26}
              color={focused ? '#fff' : '#ccc'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#000',
    borderTopWidth: 0,
    height: 70,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 10,
  },
  centerButton: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6ff2',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
