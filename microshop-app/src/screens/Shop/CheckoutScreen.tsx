import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ShopStackParamList, Product, Address } from '../../types';
import {
  LiquidGlassButton,
  LiquidGlassCard,
  LiquidGlassInput,
} from '../../components/LiquidGlass';
import { useCartStore } from '../../store';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'Checkout'>;
type RouteProps = RouteProp<ShopStackParamList, 'Checkout'>;

const MOCK_PRODUCT: Product = {
  id: '1',
  title: 'Vintage Camera',
  description: 'Beautiful vintage film camera',
  price: 149.99,
  images: ['https://picsum.photos/400/400?random=1'],
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

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { shippingAddress, setShippingAddress } = useCartStore();

  const [product] = useState<Product>(MOCK_PRODUCT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'pickup'>('shipping');
  const [address, setAddress] = useState<Address>({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  const subtotal = product.price;
  const shipping = deliveryMethod === 'shipping' ? (product.shippingPrice || 0) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePayment = async () => {
    if (deliveryMethod === 'shipping') {
      if (!address.name || !address.line1 || !address.city || !address.postalCode) {
        Alert.alert('Missing Information', 'Please fill in all required shipping fields.');
        return;
      }
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'Order Placed! 🎉',
        'Your order has been successfully placed. You will receive a confirmation email shortly.',
        [
          {
            text: 'OK',
            onPress: () => navigation.popToTop(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Payment Failed', 'Please try again or use a different payment method.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LiquidGlassCard style={styles.productCard} interactive={false}>
            <View style={styles.productRow}>
              <Image
                source={{ uri: product.images[0] }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productSeller}>{product.sellerName}</Text>
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
              </View>
            </View>
          </LiquidGlassCard>

          <LiquidGlassCard style={styles.deliveryCard} interactive={false}>
            <Text style={styles.sectionTitle}>Delivery Method</Text>
            <TouchableOpacity
              style={[
                styles.deliveryOption,
                deliveryMethod === 'shipping' && styles.deliveryOptionActive,
              ]}
              onPress={() => setDeliveryMethod('shipping')}
            >
              <Ionicons
                name={deliveryMethod === 'shipping' ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={deliveryMethod === 'shipping' ? '#0A84FF' : 'rgba(255,255,255,0.5)'}
              />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryLabel}>Standard Shipping</Text>
                <Text style={styles.deliveryDesc}>5-7 business days</Text>
              </View>
              <Text style={styles.deliveryPrice}>
                ${product.shippingPrice?.toFixed(2)}
              </Text>
            </TouchableOpacity>

            {product.localPickup && (
              <TouchableOpacity
                style={[
                  styles.deliveryOption,
                  deliveryMethod === 'pickup' && styles.deliveryOptionActive,
                ]}
                onPress={() => setDeliveryMethod('pickup')}
              >
                <Ionicons
                  name={deliveryMethod === 'pickup' ? 'radio-button-on' : 'radio-button-off'}
                  size={24}
                  color={deliveryMethod === 'pickup' ? '#0A84FF' : 'rgba(255,255,255,0.5)'}
                />
                <View style={styles.deliveryInfo}>
                  <Text style={styles.deliveryLabel}>Local Pickup</Text>
                  <Text style={styles.deliveryDesc}>Arrange with seller</Text>
                </View>
                <Text style={styles.deliveryPrice}>Free</Text>
              </TouchableOpacity>
            )}
          </LiquidGlassCard>

          {deliveryMethod === 'shipping' && (
            <LiquidGlassCard style={styles.addressCard} interactive={false}>
              <Text style={styles.sectionTitle}>Shipping Address</Text>
              <LiquidGlassInput
                placeholder="Full Name"
                value={address.name}
                onChangeText={(name) => setAddress({ ...address, name })}
              />
              <LiquidGlassInput
                placeholder="Street Address"
                value={address.line1}
                onChangeText={(line1) => setAddress({ ...address, line1 })}
              />
              <LiquidGlassInput
                placeholder="Apt, Suite, etc. (optional)"
                value={address.line2 || ''}
                onChangeText={(line2) => setAddress({ ...address, line2 })}
              />
              <View style={styles.addressRow}>
                <LiquidGlassInput
                  placeholder="City"
                  value={address.city}
                  onChangeText={(city) => setAddress({ ...address, city })}
                  containerStyle={styles.cityInput}
                />
                <LiquidGlassInput
                  placeholder="State"
                  value={address.state}
                  onChangeText={(state) => setAddress({ ...address, state })}
                  containerStyle={styles.stateInput}
                />
              </View>
              <LiquidGlassInput
                placeholder="ZIP Code"
                value={address.postalCode}
                onChangeText={(postalCode) => setAddress({ ...address, postalCode })}
                keyboardType="number-pad"
              />
            </LiquidGlassCard>
          )}

          <LiquidGlassCard style={styles.paymentCard} interactive={false}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity style={styles.paymentOption}>
              <Ionicons name="card-outline" size={24} color="#ffffff" />
              <Text style={styles.paymentLabel}>Credit / Debit Card</Text>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentOption}>
              <Ionicons name="logo-apple" size={24} color="#ffffff" />
              <Text style={styles.paymentLabel}>Apple Pay</Text>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          </LiquidGlassCard>

          <LiquidGlassCard style={styles.summaryCard} interactive={false}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </LiquidGlassCard>
        </ScrollView>

        <View style={styles.footer}>
          <LiquidGlassButton
            title={`Pay $${total.toFixed(2)}`}
            onPress={handlePayment}
            variant="primary"
            size="large"
            loading={isProcessing}
            style={styles.payButton}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  productCard: {
    marginBottom: 16,
  },
  productRow: {
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  productSeller: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  deliveryCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  deliveryOptionActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(10, 132, 255, 0.3)',
  },
  deliveryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  deliveryDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  deliveryPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  addressCard: {
    marginBottom: 16,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cityInput: {
    flex: 2,
  },
  stateInput: {
    flex: 1,
  },
  paymentCard: {
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  paymentLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#ffffff',
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  summaryValue: {
    fontSize: 14,
    color: '#ffffff',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
  },
  payButton: {
    width: '100%',
  },
});
