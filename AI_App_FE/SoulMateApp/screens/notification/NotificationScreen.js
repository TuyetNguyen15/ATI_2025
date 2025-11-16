// src/components/NotificationsScreen.js
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  PanResponder,
  RefreshControl 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRefresh } from '../../hook/useRefresh';
import SwipeableNotification from './components/SwipeableNotification';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'prediction',
      title: 'Dự đoán hàng ngày đã sẵn sàng',
      message: 'Xem ngay dự đoán chiêm tinh cho hôm nay của bạn',
      time: '2 giờ trước',
      read: false,
      icon: 'stars'
    },
    {
      id: '2',
      type: 'love',
      title: 'Chỉ số tình duyên cao sdfasdf',
      message: 'Hôm nay là ngày tốt để gặp gỡ người mới',
      time: '5 giờ trước',
      read: false,
      icon: 'favorite'
    },
    {
      id: '3',
      type: 'work',
      title: 'Cơ hội nghề nghiệp',
      message: 'Năng lượng làm việc của bạn đang ở mức cao nhất',
      time: '1 ngày trước',
      read: true,
      icon: 'work'
    },
    {
      id: '4',
      type: 'system',
      title: 'Cập nhật hệ thống',
      message: 'Phiên bản mới với nhiều tính năng thú vị',
      time: '2 ngày trước',
      read: true,
      icon: 'info'
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

  // Pull-to-refresh để load lại thông báo
  const loadNotifications = async () => {
    // TODO: Gọi API để load thông báo mới từ Firebase/Backend
    // Ví dụ:
    // const newNotifications = await fetchNotifications(userId);
    // setNotifications(newNotifications);
    
    // Giả lập delay API call
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