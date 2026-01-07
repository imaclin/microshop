import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '../../store';

interface LiquidGlassInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const LiquidGlassInput: React.FC<LiquidGlassInputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const { isLiquidGlassEnabled, theme } = useThemeStore();
  const [isFocused, setIsFocused] = useState(false);
  const borderOpacity = useRef(new Animated.Value(0.2)).current;

  const borderColor = borderOpacity.interpolate({
    inputRange: [0.2, 0.8],
    outputRange: ['rgba(0, 122, 255, 0.2)', 'rgba(0, 122, 255, 0.8)'],
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.spring(borderOpacity, { toValue: 0.8, useNativeDriver: false }).start();
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.spring(borderOpacity, { toValue: 0.2, useNativeDriver: false }).start();
    props.onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        {isLiquidGlassEnabled && (
          <BlurView
            intensity={10}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View style={styles.inputContent}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <TextInput
            style={[
              styles.input,
              leftIcon ? styles.inputWithLeftIcon : undefined,
              rightIcon ? styles.inputWithRightIcon : undefined,
            ]}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            selectionColor={theme.colors.primary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  iconLeft: {
    paddingLeft: 16,
  },
  iconRight: {
    paddingRight: 16,
  },
  error: {
    fontSize: 12,
    color: '#FF453A',
    marginTop: 4,
  },
});
