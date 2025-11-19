import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRefresh } from '../../hook/useRefresh';
import SwipeableNotification from './components/SwipeableNotification';
import { 
  getNotifications, 
  markNotificationRead, 
  deleteNotification,
} from '../../services/notificationService';
import { auth } from '../../config/firebaseConfig';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  // Load notifications khi component mount
  useEffect(() => {
    const currentUserId = auth.currentUser?.uid;
    
    if (currentUserId) {
      console.log('Found userId from Firebase Auth:', currentUserId);
      setUserId(currentUserId);
      loadNotifications(currentUserId);
    } else {
      console.error('No authenticated user found');
      setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      setLoading(false);
    }
  }, []);

  // Hàm load thông báo từ API
  const loadNotifications = async (userIdParam) => {
    try {
      setLoading(true);
      setError(null);
      const currentUserId = userIdParam || userId;
      
      if (!currentUserId) {
        console.error('No userId available');
        setError('Không tìm thấy thông tin người dùng.');
        return;
      }

      const response = await getNotifications(currentUserId);
      
      if (response.success) {
        // Thêm thông tin navigable và navigationData cho mỗi thông báo
        const processedNotifications = response.notifications.map(notif => ({
          ...notif,
          navigable: notif.type === 'match_request' || notif.type === 'match_accepted',
          navigationData: getNavigationData(notif)
        }));
        
        setNotifications(processedNotifications);
      } else {
        setError(response.message || 'Không thể tải thông báo.');
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Không thể tải thông báo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Callback khi accept/reject match request
  const handleMatchRequestResponse = async (action, requestId) => {
    console.log(`Match request ${action}:`, requestId);
    // Reload notifications để cập nhật trạng thái mới
    // Notification sẽ được giữ lại nhưng có thể thay đổi nội dung
    await loadNotifications(userId);
  };

  // Xác định navigationData dựa trên type của notification
  const getNavigationData = (notif) => {
    switch (notif.type) {
      case 'match_request':
        // Kiểm tra xem backend đã lưu navigationData chưa
        if (notif.navigationData && notif.navigationData.params) {
          // Lấy từ navigationData.params 
          return {
            screen: 'MatchRequestDetailScreen',
            params: {
              ...notif.navigationData.params,
              // Truyền thêm callbacks
              onAccept: handleMatchRequestResponse,
              onReject: handleMatchRequestResponse
            }
          };
        }
        
        // Fallback nếu không có navigationData
        return {
          screen: 'MatchRequestDetailScreen',
          params: {
            requestId: notif.requestId,
            senderId: notif.senderId,
            senderName: notif.senderName || notif.title || 'Người dùng',
            senderAvatar: notif.senderAvatar || notif.avatar,
            message: notif.message || notif.body,
            senderAge: notif.senderAge,
            senderJob: notif.senderJob,
            onAccept: handleMatchRequestResponse,
            onReject: handleMatchRequestResponse
          }
        };
        
      case 'match_accepted':
        // Tương tự
        if (notif.navigationData && notif.navigationData.params) {
          return {
            screen: 'Chat',
            params: notif.navigationData.params
          };
        }
        
        return {
          screen: 'Chat',
          params: {
            matchId: notif.matchId,
            partnerId: notif.partnerId,
            partnerName: notif.partnerName
          }
        };
        
      default:
        return null;
    }
  };

  // Đánh dấu một thông báo đã đọc
  const markAsRead = async (id) => {
    try {
      // Cập nhật UI ngay lập tức
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );

      // Gọi API để cập nhật backend
      await markNotificationRead([id]);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert lại UI nếu API call thất bại
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: false } : notif
        )
      );
    }
  };

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      // Cập nhật UI ngay lập tức
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );

      // Gọi API
      await markNotificationRead(unreadIds);
    } catch (error) {
      console.error('Error marking all as read:', error);
      Alert.alert('Lỗi', 'Không thể đánh dấu đã đọc. Vui lòng thử lại.');
      // Reload lại notifications nếu thất bại
      loadNotifications();
    }
  };

  // Xóa thông báo
  const handleDeleteNotification = async (id) => {
    try {
      // Xóa khỏi UI ngay lập tức
      setNotifications(prev =>
        prev.filter(notif => notif.id !== id)
      );

      // Gọi API để xóa từ backend
      await deleteNotification(id);
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Lỗi', 'Không thể xóa thông báo. Vui lòng thử lại.');
      // Reload lại notifications nếu thất bại
      loadNotifications();
    }
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

  // Xử lý khi nhấn nút Thử lại
  const handleRetry = () => {
    setError(null);
    if (userId) {
      loadNotifications(userId);
    } else {
      // Thử lấy lại userId
      const currentUserId = auth.currentUser?.uid;
      if (currentUserId) {
        setUserId(currentUserId);
        loadNotifications(currentUserId);
      }
    }
  };

  // refresh
  const { refreshing, onRefresh } = useRefresh(() => {
    if (userId) {
      return loadNotifications(userId);
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Hiển thị error state
  if (error && !loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialIcons name="error-outline" size={80} color="#ff5c8d" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={handleRetry}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.loginButtonText}>Đăng nhập lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Hiển thị loading khi đang tải lần đầu
  if (loading && notifications.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#b36dff" />
        <Text style={styles.loadingText}>Đang tải thông báo...</Text>
      </View>
    );
  }

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
              onDelete={handleDeleteNotification}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#b36dff',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#b36dff',
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#b36dff',
    fontSize: 16,
    fontWeight: '600',
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