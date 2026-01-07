import React, { useRef } from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '../../store';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  interactive?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  style,
  intensity = 15,
  tint = 'dark',
  interactive = true,
}) => {
  const { isLiquidGlassEnabled, liquidGlass } = useThemeStore();
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!interactive) return;
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }),
      Animated.spring(opacity, { toValue: 0.9, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    if (!interactive) return;
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  if (!isLiquidGlassEnabled) {
    return (
      <View style={[styles.fallbackCard, style]}>
        {children}
      </View>
    );
  }

  return (
    <Animated.View
      style={[styles.glassCard, { transform: [{ scale }], opacity }, style]}
      onTouchStart={interactive ? handlePressIn : undefined}
      onTouchEnd={interactive ? handlePressOut : undefined}
    >
      <BlurView
        intensity={intensity}
        tint={tint}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.glassBorder}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  glassBorder: {
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
  },
  fallbackCard: {
    borderRadius: 20,
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});
