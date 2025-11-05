import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function HousesInfo() {
  const {
    house1, house2, house3, house4, house5, house6,
    house7, house8, house9, house10, house11, house12
  } = useSelector((state) => state.profile);

  const colors = {
    'House 1': '#ce93d8',
    'House 2': '#ffb74d',
    'House 3': '#90caf9',
    'House 4': '#ef5350',
    'House 5': '#ffa726',
    'House 6': '#66bb6a',
    'House 7': '#ec407a',
    'House 8': '#78909c',
    'House 9': '#4fc3f7',
    'House 10': '#29b6f6',
    'House 11': '#8d6e63',
    'House 12': '#aed581',
  };

  const houseRows = [
    { id: 'house1', label: 'Nhà 1', value: house1, color: colors['House 1'] },
    { id: 'house2', label: 'Nhà 2', value: house2, color: colors['House 2'] },
    { id: 'house3', label: 'Nhà 3', value: house3, color: colors['House 3'] },
    { id: 'house4', label: 'Nhà 4', value: house4, color: colors['House 4'] },
    { id: 'house5', label: 'Nhà 5', value: house5, color: colors['House 5'] },
    { id: 'house6', label: 'Nhà 6', value: house6, color: colors['House 6'] },
    { id: 'house7', label: 'Nhà 7', value: house7, color: colors['House 7'] },
    { id: 'house8', label: 'Nhà 8', value: house8, color: colors['House 8'] },
    { id: 'house9', label: 'Nhà 9', value: house9, color: colors['House 9'] },
    { id: 'house10', label: 'Nhà 10', value: house10, color: colors['House 10'] },
    { id: 'house11', label: 'Nhà 11', value: house11, color: colors['House 11'] },
    { id: 'house12', label: 'Nhà 12', value: house12, color: colors['House 12'] },
  ];

  return (
    <View style={styles.container}>
      {houseRows.map((house, index) => (
        <View key={house.id} style={styles.row}>
          <MaterialIcons name="house" size={20} color={house.color} style={styles.icon} />
          <Text style={styles.label}>{house.label}:</Text>
          <Text style={styles.value}>{house.value || ''}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 22,
    paddingHorizontal: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  icon: {
    marginRight: 12,
    width: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    width: 80, // Width cố định để thẳng hàng
  },
  value: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
});