import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://192.168.23.106:5000';

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

      const response = await axios.post(`${API_URL}/natal-analysis`, requestData);

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

  const formatAnalysis = (text) => {
    // Tách các phần dựa trên số thứ tự hoặc tiêu đề in đậm
    const sections = text.split(/\n\n+/);
    
    return sections.map((section, index) => {
      // Kiểm tra nếu là tiêu đề (có số thứ tự hoặc **text**)
      const isBoldTitle = section.match(/^\*\*(.*?)\*\*/);
      const isNumberedTitle = section.match(/^(\d+\.|###)\s*\*?\*?(.*?)\*?\*?:?/);
      
      if (isBoldTitle) {
        const title = isBoldTitle[1];
        const content = section.replace(/^\*\*(.*?)\*\*:?\s*/, '');
        return (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionContent}>{content.trim()}</Text>
          </View>
        );
      } else if (isNumberedTitle) {
        const title = isNumberedTitle[2];
        const content = section.replace(/^(\d+\.|###)\s*\*?\*?(.*?)\*?\*?:?\s*/, '');
        return (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionContent}>{content.trim()}</Text>
          </View>
        );
      } else {
        return (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionContent}>{section.trim()}</Text>
          </View>
        );
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7acb" />
        <Text style={styles.loadingText}>
          {cached ? 'Đang tải phân tích...' : 'AI đang phân tích bản đồ sao của bạn...'}
        </Text>
        <Text style={styles.loadingSubtext}>
          Quá trình này có thể mất vài giây
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Phân tích bản đồ sao</Text>
        
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchAnalysis}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Badge cache */}
      {cached && (
        <View style={styles.cacheBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
          <Text style={styles.cacheBadgeText}>Đã lưu</Text>
        </View>
      )}

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#1a1a1a', '#0a0a0a']}
          style={styles.contentCard}
        >
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{profile.name}</Text>
            <View style={styles.signInfo}>
              <Text style={styles.signText}>☀️ {profile.sun}</Text>
              <Text style={styles.signDivider}>•</Text>
              <Text style={styles.signText}>🌙 {profile.moon}</Text>
              <Text style={styles.signDivider}>•</Text>
              <Text style={styles.signText}>⬆️ {profile.ascendant}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.analysisContainer}>
            {formatAnalysis(analysis)}
          </View>
        </LinearGradient>

        <View style={styles.footer}>
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
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 32,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: '#999',
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
    paddingBottom: 16,
    backgroundColor: '#000',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cacheBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#1a3a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  cacheBadgeText: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  contentCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  signInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signText: {
    fontSize: 14,
    color: '#999',
  },
  signDivider: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  analysisContainer: {
    gap: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff7acb',
    marginBottom: 8,
    lineHeight: 24,
  },
  sectionContent: {
    fontSize: 15,
    color: '#ddd',
    lineHeight: 24,
    textAlign: 'justify',
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});