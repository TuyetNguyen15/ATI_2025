import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function AppCircleButton({
  icon = '',
  size = 24,
  color = '#fff',
  backgroundColor = '#000',
  onPress,
  style,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor, width: size * 2, height: size * 2, borderRadius: size }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
