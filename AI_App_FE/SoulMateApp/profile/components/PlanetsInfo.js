import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function PlanetsInfo() {
  const {
    sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto,
    ascendant, descendant, mc, ic
  } = useSelector((state) => state.profile);

  const colors = {
    Sun: '#ffb74d',
    Moon: '#90caf9',
    Mercury: '#ffa726',
    Venus: '#ec407a',
    Mars: '#ef5350',
    Jupiter: '#66bb6a',
    Saturn: '#78909c',
    Uranus: '#4fc3f7',
    Neptune: '#29b6f6',
    Pluto: '#613469ff',
    Ascendant: '#ffa000',
    Descendant: '#ab47bc',
    MC: '#00bfa5',
    IC: '#43a047',
  };

  const planetRows = [
    { id: 'sun', icon: 'wb-sunny', label: 'Mặt Trời', value: sun, color: colors.Sun },
    { id: 'moon', icon: 'nightlight-round', label: 'Mặt Trăng', value: moon, color: colors.Moon },
    { id: 'mercury', icon: 'bolt', label: 'Sao Thủy', value: mercury, color: colors.Mercury },
    { id: 'venus', icon: 'favorite', label: 'Sao Kim', value: venus, color: colors.Venus },
    { id: 'mars', icon: 'whatshot', label: 'Sao Hỏa', value: mars, color: colors.Mars },
    { id: 'jupiter', icon: 'brightness-high', label: 'Sao Mộc', value: jupiter, color: colors.Jupiter },
    { id: 'saturn', icon: 'grain', label: 'Sao Thổ', value: saturn, color: colors.Saturn },
    { id: 'uranus', icon: 'flash-on', label: 'Sao Thiên Vương', value: uranus, color: colors.Uranus },
    { id: 'neptune', icon: 'waves', label: 'Sao Hải Vương', value: neptune, color: colors.Neptune },
    { id: 'pluto', icon: 'contrast', label: 'Sao Diêm Vương', value: pluto, color: colors.Pluto },
    { id: 'ascendant', icon: 'north-east', label: 'Cung Mọc', value: ascendant, color: colors.Ascendant },
    { id: 'descendant', icon: 'south-west', label: 'Cung Lặn', value: descendant, color: colors.Descendant },
    { id: 'mc', icon: 'arrow-upward', label: 'Thiên đỉnh', value: mc, color: colors.MC },
    { id: 'ic', icon: 'arrow-downward', label: 'Thiên để', value: ic, color: colors.IC },
  ];

  return (
    <View style={styles.container}>
      {planetRows.map((planet, index) => (
        <View key={planet.id} style={styles.row}>
          <MaterialIcons name={planet.icon} size={26} color={planet.color} style={styles.icon} />
          <Text style={styles.label}>{planet.label}:</Text>
          <Text style={styles.value}>{planet.value || ''}</Text>
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
    width: 26,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    width: 160, // Width cố định để thẳng hàng
  },
  value: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
});