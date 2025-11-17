import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

export default function PlanetsInfo() {
  const {
    sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto,
    ascendant, descendant, mc, ic
  } = useSelector((state) => state.profile);

  const planetData = [
  { id: 'sun', label: 'Mặt Trời', value: sun, colors: ['#ffb74d', '#ff6f00'], image: require('../../../assets/planets/sun.png') },
  { id: 'moon', label: 'Mặt Trăng', value: moon, colors: ['#90caf9', '#42a5f5'], image: require('../../../assets/planets/moon.jpg') },
  { id: 'mercury', label: 'Sao Thủy', value: mercury, colors: ['#ffa726', '#f57c00'], image: require('../../../assets/planets/mercury.jpg') },
  { id: 'venus', label: 'Sao Kim', value: venus, colors: ['#ec407a', '#c2185b'], image: require('../../../assets/planets/venus.png') },
  { id: 'mars', label: 'Sao Hỏa', value: mars, colors: ['#ef5350', '#c62828'], image: require('../../../assets/planets/mars.jpg') },
  { id: 'jupiter', label: 'Sao Mộc', value: jupiter, colors: ['#66bb6a', '#2e7d32'], image: require('../../../assets/planets/jupiter.jpg') },
  { id: 'saturn', label: 'Sao Thổ', value: saturn, colors: ['#78909c', '#455a64'], image: require('../../../assets/planets/saturn.jpg') },
  { id: 'uranus', label: 'Sao Thiên Vương', value: uranus, colors: ['#4fc3f7', '#0288d1'], image: require('../../../assets/planets/uranus.png') },
  { id: 'neptune', label: 'Sao Hải Vương', value: neptune, colors: ['#29b6f6', '#0277bd'], image: require('../../../assets/planets/neptune.jpg') },
  { id: 'pluto', label: 'Sao Diêm Vương', value: pluto, colors: ['#b388ff', '#7c4dff'], image: require('../../../assets/planets/pluto.jpg') },
  
  // Các cung giữ nguyên icon
  { id: 'ascendant', icon: 'north-east', label: 'Cung Mọc', value: ascendant, colors: ['#ffa000', '#ff6f00'] },
  { id: 'descendant', icon: 'south-west', label: 'Cung Lặn', value: descendant, colors: ['#ab47bc', '#8e24aa'] },
  { id: 'mc', icon: 'arrow-upward', label: 'Thiên Đỉnh', value: mc, colors: ['#00bfa5', '#00897b'] },
  { id: 'ic', icon: 'arrow-downward', label: 'Thiên Để', value: ic, colors: ['#43a047', '#2e7d32'] },
];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {planetData.map((planet) => (
          <View key={planet.id} style={styles.planetCard}>
            {planet.image ? (
  <LinearGradient
    colors={planet.colors}
    style={styles.gradientCircle}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.innerCircle}>
      <Image
        source={planet.image}
        style={styles.planetImage}
      />
    </View>
  </LinearGradient>
) : (
  <LinearGradient
    colors={planet.colors}
    style={styles.gradientCircle}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.innerCircle}>
      <MaterialIcons name={planet.icon} size={32} color="#fff" />
    </View>
  </LinearGradient>
)}
            <Text style={styles.planetLabel}>{planet.label}</Text>
            <Text style={[styles.planetValue, { color: planet.colors[0] }]}>
              {planet.value || '—'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
  },
  planetCard: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 10,
  },
  gradientCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  innerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planetImage: {
  width: 72,   
  height: 72,
  borderRadius: 32, 
  resizeMode: 'cover',
},
  planetLabel: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  planetValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
});