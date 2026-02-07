import React from 'react';
import { View, StyleSheet, ViewStyle} from 'react-native';
import { ReactNode } from 'react';
interface CardProps {
  children: ReactNode;
  style?: ViewStyle; // Allows you to override or add styles
}

const Card = ({ children, style }: CardProps) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 2,
    width : "80%",
    maxWidth : 500,
    // --- Android Elevation ---
    elevation: 5,

    // --- iOS Shadow ---
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Card;