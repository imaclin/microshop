import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '../../store';

interface LiquidGlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'glass' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const { isLiquidGlassEnabled, theme } = useThemeStore();
  const scale = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (disabled || loading) return;

    Animated.sequence([
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.timing(shimmer, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(shimmer, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          button: styles.primary,
          text: styles.primaryText,
        };
      case 'secondary':
        return {
          button: styles.secondary,
          text: styles.secondaryText,
        };
      case 'danger':
        return {
          button: styles.danger,
          text: styles.dangerText,
        };
      case 'glass':
      default:
        return {
          button: styles.glass,
          text: styles.glassText,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { button: styles.small, text: styles.smallText };
      case 'large':
        return { button: styles.large, text: styles.largeText };
      case 'medium':
      default:
        return { button: styles.medium, text: styles.mediumText };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          styles.button,
          variantStyles.button,
          sizeStyles.button,
          disabled && styles.disabled,
          { transform: [{ scale }] },
          style,
        ]}
      >
        {isLiquidGlassEnabled && (
          <BlurView
            intensity={20}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
        )}

        <Animated.View
          style={[StyleSheet.absoluteFillObject, styles.shimmer, { opacity: shimmer }]}
        />

        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.text,
                variantStyles.text,
                sizeStyles.text,
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
  },
  primary: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  danger: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 52,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    position: 'relative',
    zIndex: 1,
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#ffffff',
  },
  glassText: {
    color: '#ffffff',
  },
  dangerText: {
    color: '#ffffff',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  shimmer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
