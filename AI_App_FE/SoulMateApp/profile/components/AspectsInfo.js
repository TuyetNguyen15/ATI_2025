import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

  const aspectColors = {
    conjunctionAspect: '#ffb74d', // cam
    oppositionAspect: '#ef5350',  // do
    trineAspect: '#66bb6a',       // xanh la
    squareAspect: '#42a5f5',      // xanh duong
    sextileAspect: '#ab47bc',     // tim
  };

  const aspectRows = [
    { id: 'conjunctionAspect', icon: 'link', label: 'Góc hợp', value: conjunctionAspect, color: aspectColors.conjunctionAspect },
    { id: 'oppositionAspect', icon: 'compare-arrows', label: 'Đối đỉnh', value: oppositionAspect, color: aspectColors.oppositionAspect },
    { id: 'trineAspect', icon: 'change-history', label: 'Tam Hợp', value: trineAspect, color: aspectColors.trineAspect },
    { id: 'squareAspect', icon: 'crop-square', label: 'Góc vuông', value: squareAspect, color: aspectColors.squareAspect },
    { id: 'sextileAspect', icon: 'star', label: 'Lục hợp', value: sextileAspect, color: aspectColors.sextileAspect },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Các Góc Chiếu</Text>
      {aspectRows.map((aspect, index) => (
        <View key={aspect.id} style={styles.row}>
          <MaterialIcons name={aspect.icon} size={26} color={aspect.color} style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>{aspect.label}: </Text>
            <Text style={styles.value}>{aspect.value || ''}</Text>
          </View>
          {index === aspectRows.length - 1 && <View style={styles.bottomLine} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 22,
    paddingHorizontal: 32,
    marginTop: 16,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    position: 'relative',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginTop: 2,
  },
  bottomLine: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#fff',
  },
});
