import React, { useState, useCallback } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore, useStripeStore, useAuthStore } from '../../store';
import { stripeApi } from '../../api';
import { SellerStatus } from '../../types';

export const SellerOnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { 
    stripeAccount, 
    setStripeAccount, 
    setLoading, 
    isLoading, 
    error, 
    setError,
    getSellerStatus,
    isSellerEnabled,
  } = useStripeStore();

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isGettingLink, setIsGettingLink] = useState(false);

  const sellerStatus = getSellerStatus();

  useFocusEffect(
    useCallback(() => {
      refreshAccountStatus();
    }, [])
  );

  const refreshAccountStatus = async () => {
    if (!stripeAccount?.stripeAccountId) return;
    
    setLoading(true);
    const response = await stripeApi.getAccountStatus();
    setLoading(false);

    if (response.success && response.data) {
      setStripeAccount(response.data.account);
    }
  };

  const handleCreateAccount = async () => {
    setIsCreatingAccount(true);
    setError(null);

    const response = await stripeApi.createConnectAccount();

    if (response.success && response.data) {
      setStripeAccount(response.data.account);
      handleContinueOnboarding();
    } else {
      setError(response.error || 'Failed to create account');
      Alert.alert('Error', response.error || 'Failed to create seller account');
    }

    setIsCreatingAccount(false);
  };

  const handleContinueOnboarding = async () => {
    setIsGettingLink(true);
    setError(null);

    const refreshUrl = 'microshop://seller/onboarding/refresh';
    const returnUrl = 'microshop://seller/onboarding/return';

    const response = await stripeApi.getAccountLink(refreshUrl, returnUrl);

    if (response.success && response.data) {
      const canOpen = await Linking.canOpenURL(response.data.url);
      if (canOpen) {
        await Linking.openURL(response.data.url);
      } else {
        Alert.alert('Error', 'Cannot open Stripe onboarding page');
      }
    } else {
      setError(response.error || 'Failed to get onboarding link');
      Alert.alert('Error', response.error || 'Failed to get onboarding link');
    }

    setIsGettingLink(false);
  };

  const getStatusBadge = () => {
    switch (sellerStatus) {
      case 'active':
        return {
          color: theme.colors.success,
          icon: 'checkmark-circle' as const,
          text: 'Ready to Sell',
        };
      case 'incomplete':
        return {
          color: theme.colors.warning,
          icon: 'alert-circle' as const,
          text: 'Onboarding Incomplete',
        };
      default:
        return {
          color: theme.colors.textSecondary,
          icon: 'ellipse-outline' as const,
          text: 'Not Started',
        };
    }
  };

  const statusBadge = getStatusBadge();

  const renderRequirements = () => {
    if (!stripeAccount?.requirements) return null;

    const { currentlyDue, pastDue } = stripeAccount.requirements;
    const allDue = [...(pastDue || []), ...(currentlyDue || [])];

    if (allDue.length === 0) return null;

    return (
      <View style={[styles.requirementsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.requirementsTitle, { color: theme.colors.text }]}>
          Required Information
        </Text>
        <Text style={[styles.requirementsSubtitle, { color: theme.colors.textSecondary }]}>
          Complete these items to start selling:
        </Text>
        {allDue.slice(0, 5).map((item, index) => (
          <View key={index} style={styles.requirementItem}>
            <Ionicons name="ellipse" size={8} color={theme.colors.warning} />
            <Text style={[styles.requirementText, { color: theme.colors.text }]}>
              {item.replace(/_/g, ' ').replace(/\./g, ' → ')}
            </Text>
          </View>
        ))}
        {allDue.length > 5 && (
          <Text style={[styles.moreItems, { color: theme.colors.textSecondary }]}>
            +{allDue.length - 5} more items
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Seller Setup
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.color + '20' }]}>
            <Ionicons name={statusBadge.icon} size={32} color={statusBadge.color} />
          </View>
          <Text style={[styles.statusText, { color: statusBadge.color }]}>
            {statusBadge.text}
          </Text>
          {stripeAccount?.stripeAccountId && (
            <Text style={[styles.accountId, { color: theme.colors.textSecondary }]}>
              Account: {stripeAccount.stripeAccountId.slice(0, 12)}...
            </Text>
          )}
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            Start Selling on MicroShop
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            To accept payments, you need to complete Stripe's secure onboarding process. 
            This verifies your identity and sets up your payout method.
          </Text>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="shield-checkmark" size={20} color={theme.colors.success} />
              <Text style={[styles.benefitText, { color: theme.colors.text }]}>
                Secure payment processing
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="flash" size={20} color={theme.colors.success} />
              <Text style={[styles.benefitText, { color: theme.colors.text }]}>
                Fast payouts to your bank
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="card" size={20} color={theme.colors.success} />
              <Text style={[styles.benefitText, { color: theme.colors.text }]}>
                Accept all major cards
              </Text>
            </View>
          </View>
        </View>

        {/* Requirements */}
        {renderRequirements()}

        {/* Action Button */}
        {sellerStatus === 'not_started' && (
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleCreateAccount}
            disabled={isCreatingAccount}
          >
            {isCreatingAccount ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <>
                <Ionicons name="storefront" size={20} color={theme.colors.background} />
                <Text style={[styles.primaryButtonText, { color: theme.colors.background }]}>
                  Enable Selling
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {sellerStatus === 'incomplete' && (
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.colors.warning }]}
            onPress={handleContinueOnboarding}
            disabled={isGettingLink}
          >
            {isGettingLink ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <>
                <Ionicons name="arrow-forward" size={20} color={theme.colors.background} />
                <Text style={[styles.primaryButtonText, { color: theme.colors.background }]}>
                  Continue Onboarding
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {sellerStatus === 'active' && (
          <View style={[styles.successCard, { backgroundColor: theme.colors.success + '20', borderColor: theme.colors.success }]}>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
            <Text style={[styles.successText, { color: theme.colors.success }]}>
              You're all set! You can now publish listings and accept payments.
            </Text>
          </View>
        )}

        {/* Refresh Button */}
        {stripeAccount && (
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.colors.border }]}
            onPress={refreshAccountStatus}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.text} />
            ) : (
              <>
                <Ionicons name="refresh" size={20} color={theme.colors.text} />
                <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}>
                  Refresh Status
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Disclaimer */}
        <Text style={[styles.disclaimer, { color: theme.colors.textSecondary }]}>
          By enabling selling, you agree to Stripe's Terms of Service and our Seller Agreement. 
          You are the merchant of record for all transactions.
        </Text>
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
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerSpacer: { width: 24 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  statusCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusText: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  accountId: { fontSize: 12 },

  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  infoTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  infoText: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  
  benefitsList: { gap: 12 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitText: { fontSize: 14 },

  requirementsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  requirementsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  requirementsSubtitle: { fontSize: 14, marginBottom: 12 },
  requirementItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  requirementText: { fontSize: 14, flex: 1, textTransform: 'capitalize' },
  moreItems: { fontSize: 12, marginTop: 4 },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: { fontSize: 16, fontWeight: '600' },

  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '500' },

  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  successText: { fontSize: 14, flex: 1 },

  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
