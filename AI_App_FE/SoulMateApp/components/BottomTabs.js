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
import { CommonActions, useNavigation, getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Screens
import HomeScreen from '../screens/home/MainHome';
import PredictionScreen from '../screens/home/PredictionScreen';
import ProfileScreen from '../screens/my_profile/ProfileScreen';


import NotificationScreen from '../screens/notification/NotificationScreen';
import LoveMatchSelectScreen from '../screens/match/LoveMatchSelectScreen'

// Chat Screens
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatRoomScreen from '../screens/chat/ChatRoomScreen';
import ConnectionActionsScreen from '../screens/conversation/ConnectionActionsScreen';
import IceBreakerScreen from '../screens/conversation/IceBreakerScreen';

// Màn giả
function DummyScreen({ title }) {
  return (
    <View style={styles.screen}>
      <Text style={{ color: '#fff', fontSize: 18 }}>{title}</Text>
    </View>
  );
}

// Tab + Stack
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ChatStack = createStackNavigator();

// Chat stack
function ChatStackScreen() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChatList" component={ChatListScreen} />
      {/* <ChatStack.Screen name="ChatDetail" component={ChatScreen} /> */}
      <ChatStack.Screen name="ConnectionActions" component={ConnectionActionsScreen} />
      <ChatStack.Screen name="IceBreaker" component={IceBreakerScreen} />
    </ChatStack.Navigator>
  );
}

/* Home stack */
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
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
// match screen
const MatchStack = createStackNavigator();

function MatchStackScreen() {
  return (
    <MatchStack.Navigator screenOptions={{ headerShown: false }}>
      <MatchStack.Screen name="LoveMatchSelectScreen" component={LoveMatchSelectScreen} />
    </MatchStack.Navigator>
  );
}
function MatchTabButton(props) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
      style={styles.centerButton}
      onPress={() =>
        navigation.navigate("Match", {
          screen: "LoveMatchSelectScreen"
        })
      }
    >
      <LinearGradient
        colors={['#ff7bbf', '#b36dff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heartGradient}
      >
        <Ionicons name="heart" size={38} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );
}





/* Stack riêng cho tab Chat */
function ChatNavigator() {
  return (
    <ChatStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 22,
        },
      }}
    >
      <ChatStack.Screen 
        name="ChatList" 
        component={ChatListScreen}
        options={{
          title: 'Trò chuyện',
          headerLeft: null,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 24,
          },
        }}
      />
      <ChatStack.Screen 
        name="ChatRoom" 
        component={ChatRoomScreen}
        options={({ route }) => ({
          title: route.params?.chatName || 'Chat',
          headerBackTitleVisible: false,
        })}
      />
    </ChatStack.Navigator>
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
      {/* HOME */}
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

      {/* Thông báo */}
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

      {/* CENTER HEART - Match */}
      <Tab.Screen
        name="Match"
        component={MatchStackScreen}
        options={{
          tabBarButton: (props) => <MatchTabButton {...props} />,
        }}
      />

      {/* CHAT */}
      <Tab.Screen
        name="Chat"
        component={ChatNavigator}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={26}
              color={focused ? '#ffb6d9' : '#ccc'}
            />
          ),
          // Ẩn tab bar khi vào ChatRoom
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'ChatList';
            if (routeName === 'ChatRoom') {
              return { display: 'none' }; // Ẩn bottom tab
            }
            return styles.tabBar; // Hiện bottom tab
          })(route),
        })}
      />

      {/* PROFILE */}
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
  },
  screen: {
    flex: 1,
    backgroundColor: '#1a0126',
    justifyContent: 'center',
    alignItems: 'center',
  },
});