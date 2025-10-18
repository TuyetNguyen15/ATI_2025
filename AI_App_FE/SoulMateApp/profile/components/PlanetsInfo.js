import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function PlanetsInfo() {
  const { sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune } = useSelector(
    (state) => state.profile
  );

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
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hành tinh</Text>

      {planetRows.map((planet, index) => (
        <View key={planet.id} style={styles.row}>
          <MaterialIcons name={planet.icon} size={26} color={planet.color} style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>{planet.label}: </Text>
            <Text style={styles.value}>{planet.value || ''}</Text>
          </View>
          {index === planetRows.length - 1 && <View style={styles.bottomLine} />}
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
    textAlign: 'left',
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
