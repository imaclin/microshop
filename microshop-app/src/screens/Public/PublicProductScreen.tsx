import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore } from '../../store';
import { inventoryApi, checkoutApi } from '../../api';
import { Inventory, RootStackParamList } from '../../types';

type PublicProductRouteProp = RouteProp<RootStackParamList, 'PublicProduct'>;

export const PublicProductScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<PublicProductRouteProp>();
  const { theme } = useThemeStore();
  const { slug } = route.params;

  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, [slug]);

  const loadInventory = async () => {
    setIsLoading(true);
    setError(null);

    const response = await inventoryApi.getInventoryBySlug(slug);

    if (response.success && response.data) {
      setInventory(response.data.inventory);
    } else {
      setError(response.error || 'Product not found');
    }

    setIsLoading(false);
  };

  const handleCheckout = async () => {
    if (!inventory) return;

    if (inventory.status !== 'active') {
      Alert.alert('Unavailable', 'This product is no longer available for purchase.');
      return;
    }

    if (quantity > inventory.quantityAvailable) {
      Alert.alert('Error', `Only ${inventory.quantityAvailable} items available.`);
      return;
    }

    setIsCheckingOut(true);

    const response = await checkoutApi.createCheckoutSession({
      inventoryId: inventory.id,
      quantity,
    });

    if (response.success && response.data) {
      const canOpen = await Linking.canOpenURL(response.data.session.url);
      if (canOpen) {
        await Linking.openURL(response.data.session.url);
      } else {
        Alert.alert('Error', 'Cannot open checkout page');
      }
    } else {
      Alert.alert('Error', response.error || 'Failed to create checkout session');
    }

    setIsCheckingOut(false);
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const incrementQuantity = () => {
    if (inventory && quantity < inventory.quantityAvailable) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading product...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !inventory) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Product</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            Product Not Found
          </Text>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            {error || 'This product may have been removed or is no longer available.'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={loadInventory}
          >
            <Text style={[styles.retryButtonText, { color: theme.colors.background }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalPrice = inventory.priceCents * quantity + (inventory.shippingCostCents || 0);
  const isAvailable = inventory.status === 'active' && inventory.quantityAvailable > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {inventory.title}
        </Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Product Image Placeholder */}
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {inventory.images && inventory.images.length > 0 ? (
            <Image source={{ uri: inventory.images[0] }} style={styles.productImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={48} color={theme.colors.textSecondary} />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {inventory.title}
            </Text>
            {!isAvailable && (
              <View style={[styles.statusBadge, { backgroundColor: theme.colors.error + '20' }]}>
                <Text style={[styles.statusText, { color: theme.colors.error }]}>
                  {inventory.status === 'sold_out' ? 'Sold Out' : 'Unavailable'}
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.price, { color: theme.colors.primary }]}>
            ${formatPrice(inventory.priceCents)}
          </Text>

          {inventory.description && (
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {inventory.description}
            </Text>
          )}

          {/* Product Details */}
          <View style={styles.detailsGrid}>
            {inventory.category && (
              <View style={styles.detailItem}>
                <Ionicons name="pricetag-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: theme.colors.text }]}>
                  {inventory.category}
                </Text>
              </View>
            )}
            {inventory.condition && (
              <View style={styles.detailItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: theme.colors.text }]}>
                  {inventory.condition}
                </Text>
              </View>
            )}
            <View style={styles.detailItem}>
              <Ionicons name="cube-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.detailText, { color: theme.colors.text }]}>
                {inventory.quantityAvailable} available
              </Text>
            </View>
            {inventory.shippingCostCents !== undefined && (
              <View style={styles.detailItem}>
                <Ionicons name="car-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: theme.colors.text }]}>
                  {inventory.shippingCostCents === 0 ? 'Free shipping' : `$${formatPrice(inventory.shippingCostCents)} shipping`}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quantity Selector */}
        {isAvailable && (
          <View style={[styles.quantityCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.quantityLabel, { color: theme.colors.text }]}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                onPress={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={quantity <= 1 ? theme.colors.textSecondary : theme.colors.text} />
              </TouchableOpacity>
              <Text style={[styles.quantityValue, { color: theme.colors.text }]}>{quantity}</Text>
              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                onPress={incrementQuantity}
                disabled={quantity >= inventory.quantityAvailable}
              >
                <Ionicons name="add" size={20} color={quantity >= inventory.quantityAvailable ? theme.colors.textSecondary : theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Order Summary */}
        {isAvailable && (
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Subtotal ({quantity} item{quantity > 1 ? 's' : ''})
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                ${formatPrice(inventory.priceCents * quantity)}
              </Text>
            </View>
            {inventory.shippingCostCents !== undefined && inventory.shippingCostCents > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Shipping</Text>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  ${formatPrice(inventory.shippingCostCents)}
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: theme.colors.border }]}>
              <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                ${formatPrice(totalPrice)}
              </Text>
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <Text style={[styles.disclaimer, { color: theme.colors.textSecondary }]}>
          Payments are processed securely by Stripe. The seller is the merchant of record for this transaction.
        </Text>
      </ScrollView>

      {/* Buy Button */}
      {isAvailable && (
        <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
          <TouchableOpacity
            style={[styles.buyButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <>
                <Ionicons name="card-outline" size={20} color={theme.colors.background} />
                <Text style={[styles.buyButtonText, { color: theme.colors.background }]}>
                  Buy Now - ${formatPrice(totalPrice)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center', marginHorizontal: 16 },
  headerSpacer: { width: 24 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: { fontSize: 16 },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  errorTitle: { fontSize: 20, fontWeight: '600' },
  errorText: { fontSize: 14, textAlign: 'center' },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: { fontSize: 14, fontWeight: '600' },

  imageContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    aspectRatio: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  title: { fontSize: 24, fontWeight: '700', flex: 1 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  price: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
  detailsGrid: { gap: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 14 },

  quantityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  quantityLabel: { fontSize: 16, fontWeight: '500' },
  quantityControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: { fontSize: 18, fontWeight: '600', minWidth: 30, textAlign: 'center' },

  summaryCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '500' },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: { fontSize: 16, fontWeight: '600' },
  totalValue: { fontSize: 20, fontWeight: '700' },

  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buyButtonText: { fontSize: 18, fontWeight: '600' },
});
