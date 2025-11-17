import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function UserPersonalInfo({ userData, onMatchPress }) {
  const { relationshipStatus, age, gender, height, weight, job } = userData || {};
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const isSingle = relationshipStatus?.toLowerCase() === 'độc thân';

  const handleMatchPress = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
    setMessage('');
  };

  const handleSend = () => {
    if (onMatchPress) {
      onMatchPress(message);
    }
    setShowPopup(false);
    setMessage('');
  };

  const renderInfoCard = (item, isFullWidth = false) => (
    <View style={[styles.infoCard, isFullWidth && styles.fullWidth]} key={item.label}>
      <View style={styles.iconWrapper}>
        <MaterialIcons name={item.icon} size={20} color="#ff7bbf" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.value} numberOfLines={1}>{item.value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.container}>
        {/* Trạng thái - Full width */}
        <View style={styles.statusRow}>
          {renderInfoCard({ 
            icon: 'favorite', 
            label: 'Trạng thái', 
            value: relationshipStatus || 'Chưa cập nhật' 
          }, true)}
        </View>

        {/* Grid 2 cột */}
        <View style={styles.infoGrid}>
          {renderInfoCard({ icon: 'cake', label: 'Tuổi', value: age || 'Chưa cập nhật' })}
          {renderInfoCard({ icon: 'wc', label: 'Giới tính', value: gender || 'Chưa cập nhật' })}
          {renderInfoCard({ icon: 'straighten', label: 'Chiều cao', value: height != null ? `${height} m` : 'Chưa cập nhật' })}
          {renderInfoCard({ icon: 'fitness-center', label: 'Cân nặng', value: weight != null ? `${weight} kg` : 'Chưa cập nhật' })}
        </View>

        {/* Công việc - Full width */}
        <View style={styles.jobRow}>
          {renderInfoCard({ 
            icon: 'work', 
            label: 'Công việc', 
            value: job || 'Chưa cập nhật' 
          }, true)}
        </View>
      </View>

      {/* Nút Ghép đôi - Bên ngoài container */}
      {isSingle && (
        <TouchableOpacity 
          activeOpacity={0.85} 
          onPress={handleMatchPress}
          style={styles.matchButtonWrapper}
        >
          <LinearGradient
            colors={['#ff6b9d', '#c44dff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.matchButton}
          >
            <MaterialIcons name="favorite" size={20} color="#fff" />
            <Text style={styles.matchButtonText}>Ghép đôi</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Popup Modal */}
      <Modal
        visible={showPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
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
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSend}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#ff6b9d', '#c44dff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendButton}
                >
                  <Text style={styles.sendButtonText}>Gửi</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 123, 191, 0.2)',
  },
  statusRow: {
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  jobRow: {
    marginTop: 0,
  },
  infoCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  fullWidth: {
    width: '100%',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 123, 191, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
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