// src/components/SwipeableNotification.js
import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  PanResponder 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SwipeableNotification = ({ notif, onPress, onMarkAsRead, onDelete }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [swiping, setSwiping] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderGrant: () => {
        setSwiping(true);
      },
      onPanResponderMove: (_, gestureState) => {
        // Chỉ cho phép vuốt sang trái
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        } else if (revealed) {
          // Nếu đang mở thì cho phép vuốt sang phải để đóng
          translateX.setValue(Math.max(gestureState.dx - 100, -100));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setSwiping(false);
        
        // Nếu vuốt quá 50px thì mở nút xóa
        if (gestureState.dx < -50 && !revealed) {
          Animated.spring(translateX, {
            toValue: -100,
            useNativeDriver: true,
            friction: 8,
          }).start();
          setRevealed(true);
        } 
        // Nếu vuốt sang phải khi đang mở thì đóng lại
        else if (gestureState.dx > 20 && revealed) {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
          setRevealed(false);
        }
        // Không đủ xa thì quay lại vị trí cũ
        else {
          Animated.spring(translateX, {
            toValue: revealed ? -100 : 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const handleDelete = () => {
    Animated.timing(translateX, {
      toValue: -400,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDelete(notif.id);
    });
  };

  const handleNotificationPress = () => {
    if (!swiping && onPress) {
      onPress(notif);
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'match_request':
        return '#ff5c8d';
      case 'match_accepted':
        return '#4CAF50';
      case 'prediction':
        return '#ff7bbf';
      case 'love':
        return '#ff5c8d';
      case 'work':
        return '#b36dff';
      default:
        return '#888';
    }
  };

  return (
    <View style={styles.notificationWrapper}>
      {/* Delete Button Background */}
      <View style={styles.deleteBackground}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <MaterialIcons name="delete" size={24} color="#fff" />
          <Text style={styles.deleteText}>Xóa</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable Content */}
      <Animated.View
        style={[
          styles.swipeableContent,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <LinearGradient
          colors={notif.read ? ['#2a2a2a', '#1a1a1a'] : ['#ff7bbf', '#b36dff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <TouchableOpacity
            style={styles.notification}
            onPress={handleNotificationPress}
            activeOpacity={0.9}
            disabled={swiping}
          >
            <View style={styles.notificationContent}>
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: notif.read ? '#333' : getIconColor(notif.type) }
                ]}
              >
                <MaterialIcons
                  name={notif.icon}
                  size={24}
                  color="#fff"
                />
              </View>

              {/* Content */}
              <View style={styles.textContent}>
                <Text style={styles.notificationTitle}>
                  {notif.title}
                </Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notif.message}
                </Text>
                <Text style={styles.notificationTime}>
                  {notif.time}
                </Text>
              </View>

              {/* Unread indicator */}
              {!notif.read && (
                <View style={styles.unreadDot} />
              )}
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationWrapper: {
    marginBottom: 16,
    shadowColor: '#ff7acb',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  swipeableContent: {
    width: '100%',
  },
  gradientBorder: {
    borderRadius: 12,
    padding: 2,
  },
  notification: {
    borderRadius: 10,
    backgroundColor: '#0a0a0a',
    overflow: 'hidden',
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
    marginBottom: 10,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff5c8d',
    marginTop: 4,
  },
});

export default SwipeableNotification;