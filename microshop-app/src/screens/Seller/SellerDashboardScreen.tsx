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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore, useStripeStore, useInventoryStore } from '../../store';

export const SellerDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { theme } = useThemeStore();
  const { getSellerStatus, isSellerEnabled, stripeAccount } = useStripeStore();
  const { myInventories } = useInventoryStore();

  const sellerStatus = getSellerStatus();
  const sellerEnabled = isSellerEnabled();

  const activeListings = myInventories.filter(inv => inv.status === 'active').length;
  const draftListings = myInventories.filter(inv => inv.status === 'draft').length;
  const soldOutListings = myInventories.filter(inv => inv.status === 'sold_out').length;

  const getStatusColor = () => {
    switch (sellerStatus) {
      case 'active': return theme.colors.success;
      case 'incomplete': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (sellerStatus) {
      case 'active': return 'Ready to Sell';
      case 'incomplete': return 'Setup Incomplete';
      default: return 'Not Set Up';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Seller Dashboard
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Seller Status Card */}
        <TouchableOpacity
          style={[styles.statusCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('SellerOnboarding')}
        >
          <View style={styles.statusRow}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
            <View style={styles.statusInfo}>
              <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>
                Seller Status
              </Text>
              <Text style={[styles.statusValue, { color: getStatusColor() }]}>
                {getStatusText()}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{activeListings}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Active</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{draftListings}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Drafts</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{soldOutListings}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Sold Out</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.actionsCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          
          <TouchableOpacity
            style={[styles.actionItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('CreateInventory')}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name="add" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Create New Listing</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => navigation.navigate('InventoryList')}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.accent + '20' }]}>
              <Ionicons name="list" size={20} color={theme.colors.accent} />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Manage Listings</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {!sellerEnabled && (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => navigation.navigate('SellerOnboarding')}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                <Ionicons name="storefront" size={20} color={theme.colors.warning} />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.text }]}>Complete Seller Setup</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Info Card */}
        {!sellerEnabled && (
          <View style={[styles.infoCard, { backgroundColor: theme.colors.warning + '15', borderColor: theme.colors.warning }]}>
            <Ionicons name="information-circle" size={20} color={theme.colors.warning} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              Complete seller setup to publish listings and accept payments.
            </Text>
          </View>
        )}
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
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusInfo: { flex: 1 },
  statusLabel: { fontSize: 12, marginBottom: 2 },
  statusValue: { fontSize: 16, fontWeight: '600' },

  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  statLabel: { fontSize: 12 },

  actionsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: { flex: 1, fontSize: 14, fontWeight: '500' },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: { flex: 1, fontSize: 14 },
});
