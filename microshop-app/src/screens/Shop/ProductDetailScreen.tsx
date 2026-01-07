import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ShopStackParamList, Product } from '../../types';
import { LiquidGlassButton, LiquidGlassCard } from '../../components/LiquidGlass';
import { useThemeStore, useCartStore } from '../../store';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'ProductDetail'>;
type RouteProps = RouteProp<ShopStackParamList, 'ProductDetail'>;

const { width, height } = Dimensions.get('window');

const MOCK_PRODUCT: Product = {
  id: '1',
  title: 'Vintage Camera',
  description:
    'Beautiful vintage film camera in excellent working condition. This classic camera is perfect for photography enthusiasts or collectors. Comes with original leather case and manual. The camera has been professionally serviced and is ready to shoot.',
  price: 149.99,
  images: [
    'https://picsum.photos/800/800?random=1',
    'https://picsum.photos/800/800?random=2',
    'https://picsum.photos/800/800?random=3',
  ],
  category: 'Electronics',
  sellerId: '1',
  sellerName: 'John Doe',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
  condition: 'good',
  shippingPrice: 9.99,
  localPickup: true,
};

export const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { isLiquidGlassEnabled } = useThemeStore();
  const { addItem } = useCartStore();

  const [product] = useState<Product>(MOCK_PRODUCT);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBuyNow = () => {
    navigation.navigate('Checkout', { productId: product.id });
  };

  const handleAddToCart = () => {
    addItem(product);
    Alert.alert('Added to Cart', `${product.title} has been added to your cart.`);
  };

  const handleMessage = () => {
    Alert.alert('Coming Soon', 'Messaging feature will be available soon!');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
              <Ionicons name="share-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#FF453A' : '#ffffff'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageCarousel}>
            <Image
              source={{ uri: product.images[selectedImageIndex] }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            <View style={styles.imageDots}>
              {product.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dot,
                    selectedImageIndex === index && styles.dotActive,
                  ]}
                  onPress={() => setSelectedImageIndex(index)}
                />
              ))}
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{product.title}</Text>
              <View style={styles.conditionBadge}>
                <Text style={styles.conditionText}>{product.condition}</Text>
              </View>
            </View>

            <Text style={styles.price}>${product.price.toFixed(2)}</Text>

            <LiquidGlassCard style={styles.sellerCard} interactive={false}>
              <View style={styles.sellerRow}>
                <View style={styles.sellerAvatar}>
                  <Text style={styles.sellerInitial}>
                    {product.sellerName.charAt(0)}
                  </Text>
                </View>
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>{product.sellerName}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>4.8 (123 reviews)</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.messageButton}
                  onPress={handleMessage}
                >
                  <Ionicons name="chatbubble-outline" size={20} color="#0A84FF" />
                </TouchableOpacity>
              </View>
            </LiquidGlassCard>

            <LiquidGlassCard style={styles.descriptionCard} interactive={false}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </LiquidGlassCard>

            <LiquidGlassCard style={styles.shippingCard} interactive={false}>
              <Text style={styles.sectionTitle}>Shipping & Delivery</Text>
              <View style={styles.shippingOption}>
                <Ionicons name="cube-outline" size={20} color="#ffffff" />
                <View style={styles.shippingInfo}>
                  <Text style={styles.shippingLabel}>Standard Shipping</Text>
                  <Text style={styles.shippingPrice}>
                    ${product.shippingPrice?.toFixed(2)}
                  </Text>
                </View>
              </View>
              {product.localPickup && (
                <View style={styles.shippingOption}>
                  <Ionicons name="location-outline" size={20} color="#ffffff" />
                  <View style={styles.shippingInfo}>
                    <Text style={styles.shippingLabel}>Local Pickup</Text>
                    <Text style={styles.shippingPrice}>Free</Text>
                  </View>
                </View>
              )}
            </LiquidGlassCard>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {isLiquidGlassEnabled && (
            <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFillObject} />
          )}
          <View style={styles.footerContent}>
            <LiquidGlassButton
              title="Add to Cart"
              onPress={handleAddToCart}
              variant="secondary"
              size="large"
              style={styles.cartButton}
              icon={<Ionicons name="cart-outline" size={20} color="#ffffff" />}
            />
            <LiquidGlassButton
              title="Buy Now"
              onPress={handleBuyNow}
              variant="primary"
              size="large"
              style={styles.buyButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageCarousel: {
    width: width,
    height: width,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    backgroundColor: '#ffffff',
    width: 24,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  conditionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(48, 209, 88, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(48, 209, 88, 0.3)',
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#30D158',
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  sellerCard: {
    marginBottom: 16,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sellerInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(10, 132, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  shippingCard: {
    marginBottom: 16,
  },
  shippingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  shippingInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  shippingLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  shippingPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(28, 28, 30, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  footerContent: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  cartButton: {
    flex: 1,
  },
  buyButton: {
    flex: 1,
  },
});
