import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface FloatingTabBarProps {
  children: React.ReactNode;
}

export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({ children }) => {
  if (Platform.OS !== 'web') {
    return <View>{children}</View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.floatingContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    alignItems: 'center',
  },
  floatingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    minWidth: 300,
    maxWidth: 600,
  },
});
