import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function UserPersonalInfo({ userData, onMatchPress }) {
  const { relationshipStatus, age, gender, height, weight, job } = userData || {};

  const isSingle = relationshipStatus?.toLowerCase() === 'độc thân' || relationshipStatus?.toLowerCase() === 'single';

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
            icon: 'school', 
            label: 'Công việc', 
            value: job || 'Chưa cập nhật' 
          }, true)}
        </View>
      </View>

      {/* Nút Ghép đôi - Bên ngoài container */}
      {isSingle && (
        <TouchableOpacity 
          activeOpacity={0.85} 
          onPress={onMatchPress}
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
});