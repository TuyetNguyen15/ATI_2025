// src/screens/MatchRequestDetailScreen.js
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

const MatchRequestDetailScreen = ({ route, navigation }) => {
  const {
    requestId,
    senderId,
    senderName,
    senderAvatar,
    message,
    senderAge,
    senderJob
  } = route.params;

  const [responding, setResponding] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [requestStatus, setRequestStatus] = useState('pending'); // ✅ Track status từ backend
  const [loading, setLoading] = useState(true);

  // ✅ Load request status từ backend khi component mount
  useEffect(() => {
    checkRequestStatus();
  }, []);

  // ✅ Hàm kiểm tra status của request
  const checkRequestStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:5000/match-request/${requestId}`);
      const data = await response.json();
      
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Giả sử API trả về { status: 'pending' | 'accepted' | 'rejected' }
      setRequestStatus(data.status);
      
      // Nếu đã xử lý rồi thì disable buttons
      if (data.status !== 'pending') {
         setHasResponded(true);
      }
      
    } catch (error) {
      console.error('Error checking request status:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin lời mời. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đồng ý ghép đôi
  const handleAccept = async () => {
    if (hasResponded || requestStatus !== 'pending') return;
    
    setResponding(true);
    setHasResponded(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/accept-match-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId, 
          receiverId: 'CURRENT_USER_ID' // Lấy từ auth
        })
      });

      // Navigate back
      navigation.goBack();
      
      // Show alert
      setTimeout(() => {
        Alert.alert(
          'Thành công!',
          'Bạn đã chấp nhận ghép đôi!'
        );
      }, 300);
      
    } catch (error) {
      setHasResponded(false);
      Alert.alert('Lỗi', 'Không thể chấp nhận lời mời. Vui lòng thử lại.');
      console.error('Accept match error:', error);
    } finally {
      setResponding(false);
    }
  };

  // Xử lý từ chối ghép đôi
  const handleReject = async () => {
    if (hasResponded || requestStatus !== 'pending') return;
    
    Alert.alert(
      'Xác nhận từ chối',
      'Bạn có chắc muốn từ chối lời mời ghép đôi này?',
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
              // TODO: Gọi API để từ chối lời mời ghép đôi
              const response = await fetch('http://127.0.0.1:5000/reject-match-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  requestId, 
                  receiverId: 'CURRENT_USER_ID' 
                })
              });

              // Navigate back
              navigation.goBack();
              
              // Show alert
              setTimeout(() => {
                Alert.alert('Đã từ chối', 'Bạn đã từ chối lời mời ghép đôi.');
              }, 300);
              
            } catch (error) {
              setHasResponded(false);
              Alert.alert('Lỗi', 'Không thể từ chối lời mời. Vui lòng thử lại.');
              console.error('Reject match error:', error);
            } finally {
              setResponding(false);
            }
          }
        }
      ]
    );
  };

  // ✅ Hiển thị loading khi đang check status
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#b36dff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  // ✅ Hiển thị thông báo nếu đã xử lý
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
        {/* ✅ Status banner */}
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

      {/* ✅ Buttons - Chỉ hiển thị khi status là pending */}
      {requestStatus === 'pending' && (
        <View style={styles.fixedButton}>
          <View style={styles.buttonContainer}>
            {/* Nút từ chối */}
            <TouchableOpacity
              style={[
                styles.rejectButtonWrapper,
                hasResponded && styles.disabledButton
              ]}
              onPress={handleReject}
              disabled={responding || hasResponded}
              activeOpacity={0.8}
            >
              <View style={styles.rejectButton}>
                <MaterialIcons name="close" size={24} color="#ff3b30" />
                <Text style={styles.rejectButtonText}>Từ chối</Text>
              </View>
            </TouchableOpacity>

            {/* Nút chấp nhận */}
            <TouchableOpacity
              style={[
                styles.acceptButtonWrapper,
                hasResponded && styles.disabledButton
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
  // ✅ Status banner styles
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