import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface WebContainerProps {
  children: React.ReactNode;
  style?: any;
}

export const WebContainer: React.FC<WebContainerProps> = ({ children, style }) => {
  if (Platform.OS !== 'web') {
    return <View style={style}>{children}</View>;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  content: {
    width: '100%',
    maxWidth: 800,
    minHeight: '100%',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'web' ? 100 : 16,
  },
});
