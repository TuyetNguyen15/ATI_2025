import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function AppButton({
  icon = '',
  size = 24,
  color = '#fff',
  backgroundColor = '#000',
  borderColor = 'transparent',
  borderWidth = 0,
  borderRadius = size,
  buttonTitle = '',
  fontSize = 16,
  onPress,
  style,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          width: size * 2 + (buttonTitle ? 80 : 0), 
          height: size * 2,
          borderRadius,
          borderColor,
          borderWidth,
          flexDirection: 'row',
          paddingHorizontal: 10,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons name={icon} size={size} color={color} />
      {buttonTitle ? (
        <Text style={[styles.title, { color, marginLeft: 6, fontSize }]}>{buttonTitle}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  title: {
    fontWeight: '600',
  },
});
