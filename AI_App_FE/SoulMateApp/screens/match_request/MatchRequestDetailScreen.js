// src/screens/MatchRequestDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert
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

  // Xử lý đồng ý ghép đôi
  const handleAccept = async () => {
    setResponding(true);

    try {
      // TODO: Gọi API để chấp nhận lời mời ghép đôi
      // await acceptMatchRequest(requestId, senderId);
      
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert(
        'Thành công!',
        'Bạn đã chấp nhận ghép đôi. Hãy bắt đầu trò chuyện!',
        [
          {
            text: 'Trò chuyện ngay',
            onPress: () => {
              // Điều hướng đến màn hình chat
              navigation.navigate('Chat', {
                matchId: `match_${requestId}`,
                partnerId: senderId,
                partnerName: senderName
              });
            }
          },
          {
            text: 'Để sau',
            onPress: () => navigation.goBack(),
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chấp nhận lời mời. Vui lòng thử lại.');
      console.error('Accept match error:', error);
    } finally {
      setResponding(false);
    }
  };

  // Xử lý từ chối ghép đôi
  const handleReject = async () => {
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

            try {
              // TODO: Gọi API để từ chối lời mời ghép đôi
              // await rejectMatchRequest(requestId, senderId);
              
              // Giả lập API call
              await new Promise(resolve => setTimeout(resolve, 1000));

              Alert.alert('Đã từ chối', 'Bạn đã từ chối lời mời ghép đôi.', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
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

              {/* Info */}
              <Text style={styles.name}>{senderName}</Text>
              
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialIcons name="cake" size={18} color="#ff7bbf" />
                  <Text style={styles.infoText}>{senderAge} tuổi</Text>
                </View>
                <View style={styles.infoDivider} />
                <View style={styles.infoItem}>
                  <MaterialIcons name="work" size={18} color="#b36dff" />
                  <Text style={styles.infoText}>{senderJob}</Text>
                </View>
              </View>
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

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* Nút từ chối */}
          <TouchableOpacity
            style={styles.rejectButtonWrapper}
            onPress={handleReject}
            disabled={responding}
            activeOpacity={0.8}
          >
            <View style={styles.rejectButton}>
              <MaterialIcons name="close" size={24} color="#ff3b30" />
              <Text style={styles.rejectButtonText}>Từ chối</Text>
            </View>
          </TouchableOpacity>

          {/* Nút chấp nhận */}
          <TouchableOpacity
            style={styles.acceptButtonWrapper}
            onPress={handleAccept}
            disabled={responding}
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

        {/* Footer note */}
        <Text style={styles.footerNote}>
          Khi đồng ý ghép đôi, cả hai bên sẽ có thể bắt đầu trò chuyện với nhau
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#aaa',
  },
  infoDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#333',
  },
  messageSection: {
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
  footerNote: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});

export default MatchRequestDetailScreen;