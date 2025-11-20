import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../config/firebaseConfig';
import { BASE_URL } from '../../config/api';

const API_BASE_URL = BASE_URL;

const MatchRequestDetailScreen = ({ route, navigation }) => {
  const {
    requestId,
    senderId,
    senderName,
    senderAvatar,
    message,
    senderAge,
    senderJob,
    onAccept, // Callback từ NotificationScreen
    onReject  //Callback từ NotificationScreen
  } = route.params;

  const [responding, setResponding] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [requestStatus, setRequestStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Lấy current user ID khi component mount
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      setCurrentUserId(userId);
      console.log('✅ Current User ID:', userId);
    } else {
      console.error('❌ No authenticated user found');
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      navigation.goBack();
    }
  }, []);

  // Load request status từ backend khi có userId
  useEffect(() => {
    if (currentUserId && requestId) {
      checkRequestStatus();
    }
  }, [currentUserId, requestId]);

  // Hàm kiểm tra status của request - FIX URL
  const checkRequestStatus = async () => {
    try {
      setLoading(true);
      
      //FIX: Đổi URL thành /check-match-request/
      const response = await fetch(`${API_BASE_URL}/check-match-request/${requestId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('✅ Request status:', data);
      
      if (data.success) {
        setRequestStatus(data.status);
        
        // Nếu đã xử lý rồi thì disable buttons
        if (data.status !== 'pending') {
          setHasResponded(true);
        }
      } else {
        throw new Error(data.error || 'Không thể tải thông tin lời mời');
      }
      
    } catch (error) {
      console.error('❌ Error checking request status:', error);
      Alert.alert(
        'Lỗi', 
        'Không thể tải thông tin lời mời. Vui lòng thử lại.',
        [
          { text: 'Thử lại', onPress: checkRequestStatus },
          { text: 'Quay lại', onPress: () => navigation.goBack() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đồng ý ghép đôi - FIX userId
  const handleAccept = async () => {
    if (hasResponded || requestStatus !== 'pending') return;
    
    if (!currentUserId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }
    
    setResponding(true);
    setHasResponded(true);

    try {
      console.log('📤 Accepting match request:', { requestId, receiverId: currentUserId });
      
      const response = await fetch(`${API_BASE_URL}/accept-match-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId, 
          receiverId: currentUserId // Dùng real user ID
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Match accepted successfully:', data);
        
        // Navigate back
        navigation.goBack();
        
        // Show success alert
        setTimeout(() => {
          Alert.alert(
            '🎉 Thành công!',
            `Bạn đã chấp nhận ghép đôi với ${senderName}!`,
            [{ text: 'OK' }]
          );
        }, 300);
      } else {
        throw new Error(data.error || 'Không thể chấp nhận lời mời');
      }
      
    } catch (error) {
      console.error('❌ Accept match error:', error);
      setHasResponded(false);
      Alert.alert(
        'Lỗi', 
        error.message || 'Không thể chấp nhận lời mời. Vui lòng thử lại.'
      );
    } finally {
      setResponding(false);
    }
  };

  // Xử lý từ chối ghép đôi - FIX userId
  const handleReject = async () => {
    if (hasResponded || requestStatus !== 'pending') return;
    
    if (!currentUserId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }
    
    Alert.alert(
      'Xác nhận từ chối',
      `Bạn có chắc muốn từ chối lời mời ghép đôi từ ${senderName}?`,
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Từ chối',
          style: 'destructive',
          onPress: async () => {
            setResponding(true);
            setHasResponded(true);

            try {
              console.log('📤 Rejecting match request:', { requestId, receiverId: currentUserId });
              
              const response = await fetch(`${API_BASE_URL}/reject-match-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  requestId, 
                  receiverId: currentUserId // Dùng real user ID
                })
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              
              if (data.success) {
                console.log('✅ Match rejected successfully');
                
                // Navigate back
                navigation.goBack();
                
                // Show alert
                setTimeout(() => {
                  Alert.alert(
                    'Đã từ chối',
                    'Bạn đã từ chối lời mời ghép đôi.',
                    [{ text: 'OK' }]
                  );
                }, 300);
              } else {
                throw new Error(data.error || 'Không thể từ chối lời mời');
              }
              
            } catch (error) {
              console.error('❌ Reject match error:', error);
              setHasResponded(false);
              Alert.alert(
                'Lỗi',
                error.message || 'Không thể từ chối lời mời. Vui lòng thử lại.'
              );
            } finally {
              setResponding(false);
            }
          }
        }
      ]
    );
  };

  // Hiển thị loading khi đang check status hoặc chưa có userId
  if (loading || !currentUserId) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#b36dff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  // Hiển thị thông báo nếu đã xử lý
  const showStatusMessage = () => {
    if (requestStatus === 'accepted') {
      return (
        <View style={styles.statusBanner}>
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.statusText}>Đã chấp nhận lời mời này</Text>
        </View>
      );
    }
    if (requestStatus === 'rejected') {
      return (
        <View style={[styles.statusBanner, styles.rejectedBanner]}>
          <MaterialIcons name="cancel" size={24} color="#ff3b30" />
          <Text style={styles.statusText}>Đã từ chối lời mời này</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Header với nút back */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lời mời ghép đôi</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status banner */}
        {showStatusMessage()}

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#ff7bbf', '#b36dff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.profileContent}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                {senderAvatar ? (
                  <Image source={{ uri: senderAvatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <MaterialIcons name="person" size={60} color="#666" />
                  </View>
                )}
              </View>

              {/* Name */}
              <Text style={styles.name}>{senderName || 'Người dùng'}</Text>
              
              {/* Thông tin thêm */}
              {(senderAge || senderJob) && (
                <View style={styles.infoRow}>
                  {senderAge && (
                    <Text style={styles.infoText}>{senderAge} tuổi</Text>
                  )}
                  {senderAge && senderJob && (
                    <Text style={styles.infoDivider}>•</Text>
                  )}
                  {senderJob && (
                    <Text style={styles.infoText}>{senderJob}</Text>
                  )}
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        {/* Message Section */}
        <View style={styles.messageSection}>
          <View style={styles.messageSectionHeader}>
            <MaterialIcons name="message" size={20} color="#ff7bbf" />
            <Text style={styles.messageSectionTitle}>Lời nhắn</Text>
          </View>
          
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              {message || 'Không có lời nhắn'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Chỉ hiển thị khi status là pending */}
      {requestStatus === 'pending' && (
        <View style={styles.fixedButton}>
          <View style={styles.buttonContainer}>
            {/* Nút từ chối */}
            <TouchableOpacity
              style={[
                styles.rejectButtonWrapper,
                (responding || hasResponded) && styles.disabledButton
              ]}
              onPress={handleReject}
              disabled={responding || hasResponded}
              activeOpacity={0.8}
            >
              <View style={styles.rejectButton}>
                <MaterialIcons name="close" size={24} color="#ff3b30" />
                <Text style={styles.rejectButtonText}>
                  {responding ? 'Đang xử lý...' : 'Từ chối'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Nút chấp nhận */}
            <TouchableOpacity
              style={[
                styles.acceptButtonWrapper,
                (responding || hasResponded) && styles.disabledButton
              ]}
              onPress={handleAccept}
              disabled={responding || hasResponded}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ff6b9d', '#c44dff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.acceptButton}
              >
                <MaterialIcons name="favorite" size={24} color="#fff" />
                <Text style={styles.acceptButtonText}>
                  {responding ? 'Đang xử lý...' : 'Đồng ý'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  rejectedBanner: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  statusText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },
  profileCard: {
    marginBottom: 24,
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 2,
  },
  profileContent: {
    backgroundColor: '#0a0a0a',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 15,
    color: '#999',
  },
  infoDivider: {
    fontSize: 15,
    color: '#999',
    marginHorizontal: 8,
  },
  messageSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  messageSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  messageSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  messageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 123, 191, 0.2)',
  },
  messageText: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 22,
  },
  fixedButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButtonWrapper: {
    flex: 1,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderWidth: 1,
    borderColor: '#ff3b30',
    gap: 8,
  },
  rejectButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff3b30',
  },
  acceptButtonWrapper: {
    flex: 1,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#ff6b9d',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default MatchRequestDetailScreen;