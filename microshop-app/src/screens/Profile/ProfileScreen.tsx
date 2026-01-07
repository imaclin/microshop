import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore, useThemeStore, useStripeStore } from '../../store';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user, logout } = useAuthStore();
  const { theme, isDark, toggleDarkMode } = useThemeStore();
  const { getSellerStatus, isSellerEnabled, stripeAccount } = useStripeStore();

  const sellerStatus = getSellerStatus();
  const sellerEnabled = isSellerEnabled();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const handleSellerSetup = () => {
    if (sellerEnabled) {
      navigation.navigate('SellerDashboard');
    } else {
      navigation.navigate('SellerOnboardingFlow');
    }
  };

  const handlePublicProfile = () => {
    // Navigate to public profile page
    navigation.navigate('PublicProfile');
  };

  const getSellerStatusColor = () => {
    switch (sellerStatus) {
      case 'active': return theme.colors.success;
      case 'incomplete': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  const getSellerStatusText = () => {
    switch (sellerStatus) {
      case 'active': return 'Seller Account Active';
      case 'incomplete': return 'Setup Incomplete';
      default: return 'Not a Seller Yet';
    }
  };

  const settingsItems = [
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => {} },
    { icon: 'lock-closed-outline', label: 'Privacy', onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
    { icon: 'document-text-outline', label: 'Terms of Service', onPress: () => {} },
    { icon: 'information-circle-outline', label: 'About', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerProfile}>
          <View style={[styles.headerAvatar, { backgroundColor: theme.colors.border }]}>
            <Text style={[styles.headerAvatarText, { color: theme.colors.text }]}>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {user?.displayName || 'Profile'}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={handlePublicProfile}
          >
            <Ionicons name="globe-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIcon} 
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Seller Status Card */}
        <TouchableOpacity
          style={[styles.card, styles.sellerCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={handleSellerSetup}
        >
          <View style={styles.sellerHeader}>
            <View style={styles.sellerInfo}>
              <View style={[styles.sellerIcon, { backgroundColor: getSellerStatusColor() + '20' }]}>
                <Ionicons 
                  name={sellerEnabled ? 'storefront' : 'add-circle-outline'} 
                  size={24} 
                  color={getSellerStatusColor()} 
                />
              </View>
              <View style={styles.sellerText}>
                <Text style={[styles.sellerTitle, { color: theme.colors.text }]}>
                  {sellerEnabled ? 'Seller Dashboard' : 'Become a Seller'}
                </Text>
                <Text style={[styles.sellerStatus, { color: getSellerStatusColor() }]}>
                  {getSellerStatusText()}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
          
          {!sellerEnabled && (
            <View style={[styles.onboardingPrompt, { borderTopColor: theme.colors.border }]}>
              <Ionicons name="information-circle-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.onboardingText, { color: theme.colors.textSecondary }]}>
                Start selling in minutes with Stripe Connect
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Seller Data</Text>
          
          <View style={[styles.statsRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>12</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Items for Sale</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>8</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Items Sold</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>$3,450</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Inventory ($)</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
          MicroShop v1.0.0
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
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 18, fontWeight: '500' },
  headerTitle: { fontSize: 32, fontWeight: '400' },
  headerSpacer: { width: 40 },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: '500' },
  userName: { fontSize: 20, fontWeight: '500' },
  userEmail: { fontSize: 14 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '500' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
  },
  logoutText: { fontSize: 16, fontWeight: '500' },
  version: { textAlign: 'center', fontSize: 12, marginTop: 24 },
  
  // Seller Card Styles
  sellerCard: {
    marginBottom: 16,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  sellerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerText: {
    flex: 1,
  },
  sellerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  sellerStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  onboardingPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
  },
  onboardingText: {
    flex: 1,
    fontSize: 12,
  },
});
