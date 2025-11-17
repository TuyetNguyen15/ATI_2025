// src/components/NotificationsScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRefresh } from '../../hook/useRefresh';
import SwipeableNotification from './components/SwipeableNotification';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'match_request', // Loại thông báo ghép đôi
      title: 'Lời mời ghép đôi từ Nguyễn Văn A',
      message: 'Xin chào! Tôi thấy chúng ta có nhiều điểm chung...',
      time: '2 giờ trước',
      read: false,
      icon: 'favorite',
      navigable: true, // Có thể nhấn để điều hướng
      navigationData: {
        screen: 'MatchRequestDetail',
        params: {
          requestId: 'req_001',
          senderId: 'user_123',
          senderName: 'Nguyễn Văn A',
          senderAvatar: 'https://...',
          message: 'Xin chào! Tôi thấy chúng ta có nhiều điểm chung...',
          senderAge: 25,
          senderJob: 'Kỹ sư phần mềm'
        }
      }
    },
    {
      id: '2',
      type: 'prediction',
      title: 'Dự đoán hàng ngày đã sẵn sàng',
      message: 'Xem ngay dự đoán chiêm tinh cho hôm nay của bạn',
      time: '5 giờ trước',
      read: false,
      icon: 'stars',
      navigable: false // Không điều hướng, chỉ đánh dấu đã đọc
    },
    {
      id: '3',
      type: 'love',
      title: 'Chỉ số tình duyên cao',
      message: 'Hôm nay là ngày tốt để gặp gỡ người mới',
      time: '1 ngày trước',
      read: true,
      icon: 'favorite',
      navigable: false
    },
    {
      id: '4',
      type: 'match_accepted', // Thông báo đã được chấp nhận
      title: 'Nguyễn Thị B đã chấp nhận ghép đôi',
      message: 'Hãy bắt đầu trò chuyện ngay!',
      time: '2 ngày trước',
      read: true,
      icon: 'check-circle',
      navigable: true,
      navigationData: {
        screen: 'Chat',
        params: {
          matchId: 'match_001',
          partnerId: 'user_456',
          partnerName: 'Nguyễn Thị B'
        }
      }
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== id)
    );
  };

  // Xử lý khi nhấn vào thông báo
  const handleNotificationPress = (notif) => {
    // Đánh dấu đã đọc
    markAsRead(notif.id);

    // Nếu thông báo có thể điều hướng
    if (notif.navigable && notif.navigationData) {
      navigation.navigate(notif.navigationData.screen, notif.navigationData.params);
    }
  };

  // Pull-to-refresh để load lại thông báo
  const loadNotifications = async () => {
    // TODO: Gọi API để load thông báo mới từ Firebase/Backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Đã load lại thông báo');
  };

  const { refreshing, onRefresh } = useRefresh(loadNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Mark all as read button */}
      {unreadCount > 0 && (
        <TouchableOpacity
          style={styles.markAllButton}
          onPress={markAllAsRead}
          activeOpacity={0.7}
        >
          <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
        </TouchableOpacity>
      )}

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#b36dff"
            colors={['#b36dff', '#ff7bbf']}
          />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-none" size={80} color="#444" />
            <Text style={styles.emptyText}>Không có thông báo</Text>
          </View>
        ) : (
          notifications.map((notif) => (
            <SwipeableNotification
              key={notif.id}
              notif={notif}
              onPress={() => handleNotificationPress(notif)}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  badge: {
    backgroundColor: '#ff5c8d',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markAllButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  markAllText: {
    color: '#b36dff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
});

export default NotificationsScreen;
