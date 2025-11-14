import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function AspectsInfo() {
  const {
    conjunctionAspect,
    oppositionAspect,
    trineAspect,
    squareAspect,
    sextileAspect,
  } = useSelector((state) => state.profile);

  const aspectConfig = {
    conjunction: {
      icon: 'link',
      label: 'Góc hợp (Conjunction)',
      color: '#ffb74d',
      data: conjunctionAspect,
    },
    opposition: {
      icon: 'compare-arrows',
      label: 'Đối đỉnh (Opposition)',
      color: '#ef5350',
      data: oppositionAspect,
    },
    trine: {
      icon: 'change-history',
      label: 'Tam hợp (Trine)',
      color: '#66bb6a',
      data: trineAspect,
    },
    square: {
      icon: 'crop-square',
      label: 'Góc vuông (Square)',
      color: '#42a5f5',
      data: squareAspect,
    },
    sextile: {
      icon: 'star',
      label: 'Lục hợp (Sextile)',
      color: '#ab47bc',
      data: sextileAspect,
    },
  };

  // Parse aspect string thành array
  const parseAspects = (aspectString) => {
    if (!aspectString || aspectString.trim() === '') return [];
    return aspectString.split(',').map(item => item.trim()).filter(item => item);
  };

  const renderAspectSection = (key, config) => {
    const aspects = parseAspects(config.data);
    
    if (aspects.length === 0) {
      return null;
    }

    return (
      <View key={key} style={styles.section}>
        {/* Header */}
        <View style={styles.sectionHeader}>
          <MaterialIcons name={config.icon} size={24} color={config.color} />
          <Text style={[styles.sectionTitle, { color: config.color }]}>
            {config.label}
          </Text>
          <View style={[styles.badge, { backgroundColor: config.color }]}>
            <Text style={styles.badgeText}>{aspects.length}</Text>
          </View>
        </View>

        {/* Aspect list */}
        <View style={styles.aspectList}>
          {aspects.map((aspect, index) => (
            <View key={index} style={styles.aspectItem}>
              <View style={[styles.dot, { backgroundColor: config.color }]} />
              <Text style={styles.aspectText}>{aspect}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Check if there's any data
  const hasData = Object.values(aspectConfig).some(
    config => parseAspects(config.data).length > 0
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {hasData ? (
        <>
          {Object.entries(aspectConfig).map(([key, config]) =>
            renderAspectSection(key, config)
          )}
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <MaterialIcons name="info-outline" size={48} color="#666" />
          <Text style={styles.noDataText}>Chưa có dữ liệu góc cạnh</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 22,
    paddingHorizontal: 32,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 10,
    flex: 1,
  },
  badge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  aspectList: {
    gap: 8,
  },
  aspectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  aspectText: {
    fontSize: 16,
    color: '#e0e0e0',
    fontWeight: '500',
    flex: 1,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
});