import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function UserPersonalInfo({ 
  userData, 
  currentUserId,
  onMatchPress,
  onBreakup,
  apiUrl = 'http://192.168.100.203:5000'
}) {
  const { relationshipStatus, age, gender, height, weight, job } = userData || {};
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [showBreakupPopup, setShowBreakupPopup] = useState(false);
  const [message, setMessage] = useState('');
  const [matchStatus, setMatchStatus] = useState('none'); // none, pending, matched
  const [loading, setLoading] = useState(false);

  const targetUserId = userData?.uid;
  const isSingle = relationshipStatus?.toLowerCase().trim() === 'độc thân';

  // Kiểm tra trạng thái match khi component mount
  useEffect(() => {
    if (currentUserId && targetUserId && currentUserId !== targetUserId) {
      checkMatchStatus();
    }
  }, [currentUserId, targetUserId]);

  const checkMatchStatus = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/check-match-status?userId=${currentUserId}&targetId=${targetUserId}`
      );
      const data = await response.json();
      
      if (data.success) {
        setMatchStatus(data.status);
      }
    } catch (error) {
      console.error('Check match status error:', error);
    }
  };

  const handleMatchPress = () => {
    if (matchStatus === 'pending') {
      return; // Không làm gì nếu đang pending
    }
    if (matchStatus === 'matched') {
      setShowBreakupPopup(true);
    } else {
      setShowMatchPopup(true);
    }
  };

  const handleCancelMatch = () => {
    setShowMatchPopup(false);
    setMessage('');
  };

  const handleSendMatch = async () => {
    if (!message.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập lời nhắn');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/send-match-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: targetUserId,
          message: message.trim(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert('Thành công', 'Đã gửi lời mời ghép đôi');
        setMatchStatus('pending');
        setShowMatchPopup(false);
        setMessage('');
        if (onMatchPress) {
          onMatchPress(message);
        }
      } else {
        Alert.alert('Lỗi', data.error || 'Không thể gửi lời mời');
      }
    } catch (error) {
      console.error('Send match error:', error);
      Alert.alert('Lỗi', 'Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleBreakup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/breakup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert('Đã chia tay', `Mối quan hệ đã kết thúc sau ${data.duration}`);
        setMatchStatus('none');
        setShowBreakupPopup(false);
        if (onBreakup) {
          onBreakup();
        }
      } else {
        Alert.alert('Lỗi', data.error || 'Không thể chia tay');
      }
    } catch (error) {
      console.error('Breakup error:', error);
      Alert.alert('Lỗi', 'Không thể kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const renderInfoCard = (item) => (
    <View style={[styles.infoRow, item.halfWidth && styles.halfWidth]} key={item.label}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={item.icon} size={22} color="#ff7bbf" />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{item.label}</Text>
        <Text style={styles.infoValue}>{item.value}</Text>
      </View>
    </View>
  );

  const personalInfoItems = [
    { icon: 'favorite', label: 'Trạng thái', value: relationshipStatus || 'Chưa cập nhật', fullWidth: true },
    { icon: 'cake', label: 'Tuổi', value: age || 'Chưa cập nhật', halfWidth: true },
    { icon: 'wc', label: 'Giới tính', value: gender || 'Chưa cập nhật', halfWidth: true },
    { icon: 'straighten', label: 'Chiều cao', value: height != null ? `${height} m` : 'Chưa cập nhật', halfWidth: true },
    { icon: 'fitness-center', label: 'Cân nặng', value: weight != null ? `${weight} kg` : 'Chưa cập nhật', halfWidth: true },
    { icon: 'work', label: 'Công việc', value: job || 'Chưa cập nhật', fullWidth: true },
  ];

  const renderInfo = (items) => {
    const rows = [];
    let i = 0;
    
    while (i < items.length) {
      const currentItem = items[i];
      
      if (currentItem.fullWidth) {
        // Full width item
        rows.push(
          <View key={i} style={styles.rowContainer}>
            {renderInfoCard(currentItem)}
          </View>
        );
        i++;
      } else if (currentItem.halfWidth && i + 1 < items.length && items[i + 1].halfWidth) {
        // Two half width items in a row
        rows.push(
          <View key={i} style={styles.rowContainer}>
            {renderInfoCard(currentItem)}
            {renderInfoCard(items[i + 1])}
          </View>
        );
        i += 2;
      } else {
        // Single half width item (fallback)
        rows.push(
          <View key={i} style={styles.rowContainer}>
            {renderInfoCard(currentItem)}
          </View>
        );
        i++;
      }
    }
    
    return rows;
  };

  const renderActionButton = () => {
    // Nếu là profile của chính mình, không hiển thị nút
    if (currentUserId === targetUserId) {
      return null;
    }

    // Nếu không phải độc thân, không hiển thị nút
    if (!isSingle) {
      return null;
    }

    let buttonText = 'Ghép đôi';
    let buttonIcon = 'favorite';
    let buttonDisabled = false;
    let buttonColors = ['#ff6b9d', '#c44dff'];

    if (matchStatus === 'pending') {
      buttonText = 'Đang chờ phản hồi...';
      buttonIcon = 'schedule';
      buttonDisabled = true;
      buttonColors = ['#666', '#999'];
    } else if (matchStatus === 'matched') {
      buttonText = 'Chia tay';
      buttonIcon = 'heart-broken';
      buttonColors = ['#ff4444', '#cc0000'];
    }

    return (
      <TouchableOpacity 
        activeOpacity={buttonDisabled ? 1 : 0.85}
        onPress={handleMatchPress}
        disabled={buttonDisabled}
        style={styles.matchButtonWrapper}
      >
        <LinearGradient
          colors={buttonColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.matchButton, buttonDisabled && styles.disabledButton]}
        >
          <MaterialIcons name={buttonIcon} size={20} color="#fff" />
          <Text style={styles.matchButtonText}>{buttonText}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.container}>
        {renderInfo(personalInfoItems)}
      </View>

      {/* Nút hành động */}
      {renderActionButton()}

      {/* Popup Ghép đôi */}
      <Modal
        visible={showMatchPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelMatch}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="favorite" size={28} color="#ff6b9d" />
              <Text style={styles.modalTitle}>Gửi lời nhắn ghép đôi</Text>
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Nhập lời nhắn của bạn..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={handleCancelMatch}
                activeOpacity={0.7}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSendMatch}
                activeOpacity={0.7}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#ff6b9d', '#c44dff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendButton}
                >
                  <Text style={styles.sendButtonText}>
                    {loading ? 'Đang gửi...' : 'Gửi'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Popup Chia tay */}
      <Modal
        visible={showBreakupPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBreakupPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="heart-broken" size={28} color="#ff4444" />
              <Text style={styles.modalTitle}>Xác nhận chia tay</Text>
            </View>

            <Text style={styles.breakupMessage}>
              Bạn có chắc chắn muốn kết thúc mối quan hệ này không?{'\n\n'}
              Hành động này không thể hoàn tác.
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setShowBreakupPopup(false)}
                activeOpacity={0.7}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleBreakup}
                activeOpacity={0.7}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#ff4444', '#cc0000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendButton}
                >
                  <Text style={styles.sendButtonText}>
                    {loading ? 'Đang xử lý...' : 'Chắc chắn'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    backgroundColor: '#000',
    borderRadius: 14,
    padding: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ff7acb',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  infoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#0a0a0a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  halfWidth: {
    flex: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 123, 191, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: '#999',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  matchButtonWrapper: {
    marginTop: 20,
  },
  matchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
    shadowColor: '#ff6b9d',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  matchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#1a1a1a',
    borderRadius: 40,
    padding: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 15,
    minHeight: 220,
    borderWidth: 1,
    borderColor: 'rgba(255, 123, 191, 0.2)',
    marginBottom: 20,
  },
  breakupMessage: {
    fontSize: 15,
    color: '#ccc',
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 123, 191, 0.3)',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  sendButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});