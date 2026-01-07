import React, { useRef } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '../../store';
import { Product } from '../../types';

interface LiquidGlassProductCardProps {
  product: Product;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const LiquidGlassProductCard: React.FC<LiquidGlassProductCardProps> = ({
  product,
  onPress,
  size = 'medium',
}) => {
  const { isLiquidGlassEnabled } = useThemeStore();
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: -2, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
    ]).start();
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { card: styles.smallCard, image: styles.smallImage };
      case 'large':
        return { card: styles.largeCard, image: styles.largeImage };
      default:
        return { card: styles.mediumCard, image: styles.mediumImage };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.card, sizeStyles.card, { transform: [{ scale }, { translateY }] }]}>
        {isLiquidGlassEnabled && (
          <BlurView
            intensity={20}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
        )}

        <View style={styles.cardContent}>
          <View style={[styles.imageContainer, sizeStyles.image]}>
            {product.images.length > 0 ? (
              <Image
                source={{ uri: product.images[0] }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📦</Text>
              </View>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {product.title}
            </Text>
            <Text style={styles.seller} numberOfLines={1}>
              {product.sellerName}
            </Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.glassBorder} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    margin: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  smallCard: {
    width: 160,
    height: 220,
  },
  mediumCard: {
    width: 180,
    height: 260,
  },
  largeCard: {
    width: 220,
    height: 320,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  smallImage: {
    height: 120,
  },
  mediumImage: {
    height: 150,
  },
  largeImage: {
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  seller: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  glassBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    pointerEvents: 'none',
  },
});
