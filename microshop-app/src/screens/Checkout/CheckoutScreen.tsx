import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore, useInventoryStore } from '../../store';
import { checkoutApi } from '../../api';
import { Inventory, RootStackParamList, CheckoutFormData, Address } from '../../types';

type CheckoutRouteProp = RouteProp<RootStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<CheckoutRouteProp>();
  const { theme } = useThemeStore();
  const { updateInventory, myInventories } = useInventoryStore();
  const { inventoryId, quantity = 1 } = route.params;

  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
    },
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false,
  });

  const [showApplePay, setShowApplePay] = useState(false);
  const [showGooglePay, setShowGooglePay] = useState(false);

  useEffect(() => {
    loadInventory();
    checkPaymentMethods();
  }, [inventoryId]);

  const loadInventory = () => {
    setIsLoading(true);
    setError(null);

    // Find inventory by ID from store
    const item = myInventories.find((inv: Inventory) => inv.id === inventoryId);
    
    if (item) {
      setInventory(item);
    } else {
      setError('Product not found');
    }

    setIsLoading(false);
  };

  const checkPaymentMethods = async () => {
    // Check if Apple Pay is available (iOS)
    setShowApplePay(Platform.OS === 'ios');
    // Check if Google Pay is available (Android)
    setShowGooglePay(Platform.OS === 'android');
  };

  const updateFormData = (field: keyof CheckoutFormData, value: string | boolean | Address) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!formData.firstName || !formData.lastName) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!formData.address.street || !formData.address.city || 
        !formData.address.state || !formData.address.postalCode) {
      Alert.alert('Error', 'Please complete your shipping address');
      return false;
    }
    // Note: Credit card validation is optional for demo purposes
    return true;
  };

  const handleStripePayment = async () => {
    if (!validateForm() || !inventory) return;

    setIsProcessing(true);

    try {
      // Create Stripe checkout session with customer info
      const response = await checkoutApi.createCheckoutSession({
        inventoryId: inventory.id,
        quantity,
      });

      if (response.success && response.data) {
        // In a real app, you would open the Stripe checkout URL
        // For now, we'll simulate a successful payment
        await simulatePayment();
      } else {
        Alert.alert('Error', response.error || 'Failed to create checkout session');
      }
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    }

    setIsProcessing(false);
  };

  const handleApplePay = async () => {
    if (!validateForm() || !inventory) return;

    setIsProcessing(true);
    
    try {
      // Apple Pay integration would go here
      // For now, simulate the payment
      await simulatePayment();
    } catch (error) {
      Alert.alert('Error', 'Apple Pay failed. Please try again.');
    }

    setIsProcessing(false);
  };

  const handleGooglePay = async () => {
    if (!validateForm() || !inventory) return;

    setIsProcessing(true);
    
    try {
      // Google Pay integration would go here
      // For now, simulate the payment
      await simulatePayment();
    } catch (error) {
      Alert.alert('Error', 'Google Pay failed. Please try again.');
    }

    setIsProcessing(false);
  };

  const simulatePayment = async () => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a simple order ID
    const orderId = 'ORD' + Date.now();
    
    // Update inventory status to sold_out using the store
    try {
      updateInventory(inventoryId, {
        status: 'sold_out',
        quantityAvailable: Math.max(0, inventory!.quantityAvailable - quantity),
      });
      
      // Navigate to success page
      navigation.navigate('CheckoutSuccess', { orderId });
    } catch (error) {
      console.error('Failed to update inventory:', error);
      Alert.alert('Error', 'Payment was successful but failed to update inventory. Please contact support.');
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading checkout...
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
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Checkout</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            Checkout Error
          </Text>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            {error || 'This product is no longer available.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalPrice = inventory.priceCents * quantity + (inventory.shippingCostCents || 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Order Summary */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Order Summary</Text>
          <View style={styles.orderItem}>
            {/* Product Image */}
            <View style={[styles.itemImageContainer, { backgroundColor: theme.colors.border }]}>
              {inventory.images && inventory.images.length > 0 ? (
                <Image source={{ uri: inventory.images[0] }} style={styles.itemImage} />
              ) : (
                <Ionicons name="image-outline" size={24} color={theme.colors.textSecondary} />
              )}
            </View>
            
            {/* Product Info */}
            <View style={styles.itemInfo}>
              <Text style={[styles.itemTitle, { color: theme.colors.text }]}>{inventory.title}</Text>
              <Text style={[styles.itemMeta, { color: theme.colors.textSecondary }]}>
                Quantity: {quantity}
              </Text>
            </View>
            
            {/* Price */}
            <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
              ${formatPrice(inventory.priceCents * quantity)}
            </Text>
          </View>
          {inventory.shippingCostCents && inventory.shippingCostCents > 0 && (
            <View style={styles.orderItem}>
              <Text style={[styles.itemMeta, { color: theme.colors.textSecondary }]}>Shipping</Text>
              <Text style={[styles.itemPrice, { color: theme.colors.text }]}>
                ${formatPrice(inventory.shippingCostCents)}
              </Text>
            </View>
          )}
          <View style={[styles.totalRow, { borderTopColor: theme.colors.border }]}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
            <Text style={[styles.totalPrice, { color: theme.colors.primary }]}>
              ${formatPrice(totalPrice)}
            </Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Information</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="Email address"
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="First name"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.firstName}
              onChangeText={(value) => updateFormData('firstName', value)}
            />
            <TextInput
              style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Last name"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.lastName}
              onChangeText={(value) => updateFormData('lastName', value)}
            />
          </View>
        </View>

        {/* Shipping Address */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Shipping Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="Street address"
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.address.street}
            onChangeText={(value) => updateAddress('street', value)}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="City"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.address.city}
              onChangeText={(value) => updateAddress('city', value)}
            />
            <TextInput
              style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="State"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.address.state}
              onChangeText={(value) => updateAddress('state', value)}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="ZIP code"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.address.postalCode}
              onChangeText={(value) => updateAddress('postalCode', value)}
            />
            <TextInput
              style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Country"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.address.country}
              onChangeText={(value) => updateAddress('country', value)}
            />
          </View>
        </View>

        {/* Payment Methods */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment Method</Text>
        
          {/* Credit Card */}
          <View style={styles.cardSection}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Credit Card</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="Card number"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.cardNumber}
              onChangeText={(value) => updateFormData('cardNumber', value)}
              keyboardType="numeric"
              maxLength={16}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="MM/YY"
                placeholderTextColor={theme.colors.textSecondary}
                value={`${formData.expiryMonth}/${formData.expiryYear}`}
                onChangeText={(value) => {
                  const [month, year] = value.split('/');
                  updateFormData('expiryMonth', month || '');
                  updateFormData('expiryYear', year || '');
                }}
                keyboardType="numeric"
                maxLength={5}
              />
              <TextInput
                style={[styles.input, styles.cvvInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="CVV"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.cvv}
                onChangeText={(value) => updateFormData('cvv', value)}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            style={[styles.payButton, styles.stripeButton, { backgroundColor: theme.colors.primary, marginBottom: 16 }]}
            onPress={handleStripePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <>
                <Ionicons name="card-outline" size={20} color={theme.colors.background} />
                <Text style={[styles.payButtonText, { color: theme.colors.background }]}>
                  Pay ${formatPrice(totalPrice)}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          {/* Price */}
          <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
            ${formatPrice(inventory.priceCents * quantity)}
          </Text>
        </View>
        {inventory.shippingCostCents && inventory.shippingCostCents > 0 && (
          <View style={styles.orderItem}>
            <Text style={[styles.itemMeta, { color: theme.colors.textSecondary }]}>Shipping</Text>
            <Text style={[styles.itemPrice, { color: theme.colors.text }]}>
              ${formatPrice(inventory.shippingCostCents)}
            </Text>
          </View>
        )}
        <View style={[styles.totalRow, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
          <Text style={[styles.totalPrice, { color: theme.colors.primary }]}>
            ${formatPrice(totalPrice)}
          </Text>
        </View>

      {/* Contact Information */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Information</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
          placeholder="Email address"
          placeholderTextColor={theme.colors.textSecondary}
          value={formData.email}
          onChangeText={(value) => updateFormData('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="First name"
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.firstName}
            onChangeText={(value) => updateFormData('firstName', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="Last name"
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.lastName}
            onChangeText={(value) => updateFormData('lastName', value)}
          />
        </View>
      </View>

      {/* Shipping Address */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Shipping Address</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
          placeholder="Street address"
          placeholderTextColor={theme.colors.textSecondary}
          value={formData.address.street}
          onChangeText={(value) => updateAddress('street', value)}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="City"
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.address.city}
            onChangeText={(value) => updateAddress('city', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="State"
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.address.state}
            onChangeText={(value) => updateAddress('state', value)}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="ZIP code"
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.address.postalCode}
            onChangeText={(value) => updateAddress('postalCode', value)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="Country"
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.address.country}
            onChangeText={(value) => updateAddress('country', value)}
          />
        </View>
      </View>

      {/* Payment Methods */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment Method</Text>
        
        {/* Credit Card */}
        <View style={styles.cardSection}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Credit Card</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="Card number"
            placeholderTextColor={theme.colors.textSecondary}
            value={formData.cardNumber}
            onChangeText={(value) => updateFormData('cardNumber', value)}
            keyboardType="numeric"
            maxLength={16}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="MM/YY"
              placeholderTextColor={theme.colors.textSecondary}
              value={`${formData.expiryMonth}/${formData.expiryYear}`}
              onChangeText={(value) => {
                const [month, year] = value.split('/');
                updateFormData('expiryMonth', month || '');
                updateFormData('expiryYear', year || '');
              }}
              keyboardType="numeric"
              maxLength={5}
            />
            <TextInput
              style={[styles.input, styles.cvvInput, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="CVV"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.cvv}
              onChangeText={(value) => updateFormData('cvv', value)}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.payButton, styles.stripeButton, { backgroundColor: theme.colors.primary, marginBottom: 16 }]}
          onPress={handleStripePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={theme.colors.background} />
          ) : (
            <>
              <Ionicons name="card-outline" size={20} color={theme.colors.background} />
              <Text style={[styles.payButtonText, { color: theme.colors.background }]}>
                Pay ${formatPrice(totalPrice)}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Apple Pay */}
        {showApplePay && (
          <TouchableOpacity
            style={[styles.payButton, styles.applePayButton]}
            onPress={handleApplePay}
            disabled={isProcessing}
          >
            <Ionicons name="logo-apple" size={20} color="#000" />
            <Text style={styles.payButtonText}>Pay with Apple Pay</Text>
            {isProcessing && <ActivityIndicator color="#000" />}
          </TouchableOpacity>
        )}

        {/* Google Pay */}
        {showGooglePay && (
          <TouchableOpacity
            style={[styles.payButton, styles.googlePayButton]}
            onPress={handleGooglePay}
            disabled={isProcessing}
          >
            <Ionicons name="logo-google" size={20} color="#000" />
            <Text style={styles.payButtonText}>Pay with Google Pay</Text>
            {isProcessing && <ActivityIndicator color="#000" />}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
  scrollContent: { padding: 20, paddingBottom: 150 },

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

  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },

  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '500' },
  itemMeta: { fontSize: 14, marginTop: 4 },
  itemPrice: { fontSize: 16, fontWeight: '600' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 8,
  },
  totalLabel: { fontSize: 18, fontWeight: '600' },
  totalPrice: { fontSize: 20, fontWeight: '700' },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  cvvInput: {
    flex: 0.8,
  },

  cardSection: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },

  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  applePayButton: {
    backgroundColor: '#000',
  },
  googlePayButton: {
    backgroundColor: '#000',
  },
  stripeButton: {
    marginTop: 8,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
