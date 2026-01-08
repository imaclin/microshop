import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore } from '../../store';
import { RootStackParamList } from '../../types';

type CheckoutSuccessRouteProp = RouteProp<RootStackParamList, 'CheckoutSuccess'>;

export const CheckoutSuccessScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<CheckoutSuccessRouteProp>();
  const { theme } = useThemeStore();
  const { orderId } = route.params;

  const handleContinueShopping = () => {
    navigation.navigate('PublicProduct', { slug: '' }); // Go back to public profile
  };

  const handleViewOrders = () => {
    navigation.navigate('Main'); // Go to main app to view orders
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: theme.colors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
          </View>
          <Text style={[styles.successTitle, { color: theme.colors.text }]}>
            Order Confirmed!
          </Text>
          <Text style={[styles.successMessage, { color: theme.colors.textSecondary }]}>
            Your order has been successfully placed and will be processed shortly.
          </Text>
        </View>

        {/* Order Details */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Order Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Order Number:</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>#{orderId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Status:</Text>
            <View style={[styles.statusBadge, { backgroundColor: theme.colors.success + '20' }]}>
              <Text style={[styles.statusText, { color: theme.colors.success }]}>Processing</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Payment:</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>Paid Successfully</Text>
          </View>
        </View>

        {/* Next Steps */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>What's Next?</Text>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="mail-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Confirmation Email</Text>
              <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                You'll receive a detailed confirmation email with your order information.
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="cube-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Order Processing</Text>
              <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                The seller will process your order and ship it within 1-2 business days.
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="car-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Tracking Information</Text>
              <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                You'll receive tracking details once your order has been shipped.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={handleContinueShopping}
          >
            <Text style={[styles.buttonText, { color: theme.colors.text }]}>Continue Shopping</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleViewOrders}
          >
            <Text style={[styles.buttonText, { color: theme.colors.background }]}>View My Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Support Info */}
        <View style={styles.supportContainer}>
          <Text style={[styles.supportText, { color: theme.colors.textSecondary }]}>
            Need help? Contact our support team for any questions about your order.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    // Primary button style handled by theme
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  supportContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  supportText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
