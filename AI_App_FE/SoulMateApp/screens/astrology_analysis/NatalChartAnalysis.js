import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API } from "../../config/api";


export default function NatalChartAnalysis({ navigation }) {
  const profile = useSelector((state) => state.profile);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);

      // Chuẩn bị data gửi lên server
      const requestData = {
        uid: profile.uid,
        name: profile.name,
        sun: profile.sun,
        moon: profile.moon,
        mercury: profile.mercury,
        venus: profile.venus,
        mars: profile.mars,
        jupiter: profile.jupiter,
        saturn: profile.saturn,
        uranus: profile.uranus,
        neptune: profile.neptune,
        pluto: profile.pluto,
        ascendant: profile.ascendant,
        descendant: profile.descendant,
        mc: profile.mc,
        ic: profile.ic,
        house1: profile.house1,
        house2: profile.house2,
        house3: profile.house3,
        house4: profile.house4,
        house5: profile.house5,
        house6: profile.house6,
        house7: profile.house7,
        house8: profile.house8,
        house9: profile.house9,
        house10: profile.house10,
        house11: profile.house11,
        house12: profile.house12,
        conjunctionAspect: profile.conjunctionAspect,
        oppositionAspect: profile.oppositionAspect,
        trineAspect: profile.trineAspect,
        squareAspect: profile.squareAspect,
        sextileAspect: profile.sextileAspect,
        fireRatio: profile.fireRatio,
        earthRatio: profile.earthRatio,
        airRatio: profile.airRatio,
        waterRatio: profile.waterRatio,
      };

      const response = await axios.post(API.natalAnalysis, requestData);

      if (response.data) {
        setAnalysis(response.data.analysis);
        setCached(response.data.cached || false);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
      Alert.alert(
        'Lỗi',
        'Không thể tải phân tích. Vui lòng thử lại sau.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const getSectionIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('tổng quan') || lowerTitle.includes('tính cách')) {
      return { name: 'person-outline', color: '#ff7bbf' };
    } else if (lowerTitle.includes('cảm xúc') || lowerTitle.includes('nội tâm')) {
      return { name: 'heart-outline', color: '#f472b6' };
    } else if (lowerTitle.includes('sự nghiệp') || lowerTitle.includes('mục tiêu')) {
      return { name: 'briefcase-outline', color: '#c084fc' };
    } else if (lowerTitle.includes('tình yêu') || lowerTitle.includes('quan hệ')) {
      return { name: 'heart-circle-outline', color: '#fb7185' };
    } else if (lowerTitle.includes('thế mạnh') || lowerTitle.includes('thách thức')) {
      return { name: 'trophy-outline', color: '#fbbf24' };
    } else if (lowerTitle.includes('cân bằng') || lowerTitle.includes('nguyên tố')) {
      return { name: 'planet-outline', color: '#60a5fa' };
    } else if (lowerTitle.includes('lời khuyên') || lowerTitle.includes('phát triển')) {
      return { name: 'bulb-outline', color: '#34d399' };
    } else if (lowerTitle.includes('ghép cặp') || lowerTitle.includes('đối tượng')) {
      return { name: 'people-outline', color: '#f97316' };
    }
    return { name: 'star-outline', color: '#ff7bbf' };
  };

  const formatAnalysis = (text) => {
    // Loại bỏ TẤT CẢ dấu *
    let cleanedText = text.replace(/\*/g, '');
    
    // Tách các phần dựa trên số thứ tự
    const sections = cleanedText.split(/\n\n+/);
    
    return sections.map((section, index) => {
      // Chỉ kiểm tra tiêu đề có số thứ tự 
      const isNumberedTitle = section.match(/^(\d+\.)\s*(.+?)(:)?$/m);
      
      if (isNumberedTitle) {
        const title = isNumberedTitle[2].trim();
        // Lấy nội dung sau dòng tiêu đề
        const contentMatch = section.match(/^(\d+\.)\s*(.+?)(:)?\n\n?([\s\S]*)/);
        const content = contentMatch ? contentMatch[4].trim() : '';
        const icon = getSectionIcon(title);
        
        return (
          <View key={index} style={styles.section}>
            <LinearGradient
              colors={['rgba(255, 123, 191, 0.15)', 'rgba(179, 109, 255, 0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.titleContainer}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={icon.name} size={22} color={icon.color} />
              </View>
              <Text style={[styles.sectionTitle, { color: icon.color }]}>{title}</Text>
            </LinearGradient>
            {content && <Text style={styles.sectionContent}>{content}</Text>}
          </View>
        );
      } else if (section.trim() && !section.match(/^\d+\./)) {
        // Chỉ hiển thị content nếu không phải là dòng tiêu đề
        return (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionContent}>{section.trim()}</Text>
          </View>
        );
      }
      return null;
    }).filter(Boolean);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#ff7bbf', '#b36dff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>
            {cached ? 'Đang tải phân tích...' : 'AI đang phân tích bản đồ sao của bạn...'}
          </Text>
          <Text style={styles.loadingSubtext}>
            Quá trình này có thể mất vài giây
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#ff7bbf', '#b36dff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Phân tích bản đồ sao</Text>
        
        <View style={styles.placeholder} />
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={styles.userInfoCard}>
          <Text style={styles.userName}>{profile.name}</Text>
          <View style={styles.signInfo}>
            <View style={styles.signItem}>
              <Text style={styles.signEmoji}>☀️</Text>
              <Text style={styles.signText}>{profile.sun}</Text>
            </View>
            <View style={styles.signDivider} />
            <View style={styles.signItem}>
              <Text style={styles.signEmoji}>🌙</Text>
              <Text style={styles.signText}>{profile.moon}</Text>
            </View>
            <View style={styles.signDivider} />
            <View style={styles.signItem}>
              <Text style={styles.signEmoji}>⬆️</Text>
              <Text style={styles.signText}>{profile.ascendant}</Text>
            </View>
          </View>
          
          {/* Badge cache */}
          {cached && (
            <View style={styles.cacheBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#4ade80" />
              <Text style={styles.cacheBadgeText}>Đã lưu</Text>
            </View>
          )}
        </View>

        {/* Analysis Content */}
        <View style={styles.analysisContainer}>
          {formatAnalysis(analysis)}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons name="sparkles" size={16} color="#ff7bbf" />
          <Text style={styles.footerText}>
            Phân tích được tạo bởi AI dựa trên thông tin chiêm tinh học
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  userInfoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    shadowColor: '#ff7bbf',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  signInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signEmoji: {
    fontSize: 16,
  },
  signText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ddd',
  },
  signDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
    marginHorizontal: 12,
  },
  cacheBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
  },
  cacheBadgeText: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  analysisContainer: {
    gap: 16,
  },
  section: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#ff7bbf',
    shadowColor: '#ff7bbf',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 123, 191, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    flex: 1,
    letterSpacing: 0.3,
  },
  sectionContent: {
    fontSize: 15,
    color: '#ddd',
    lineHeight: 26,
    paddingLeft: 0,
    letterSpacing: 0.2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingTop: 24,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    gap: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});