import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore, useThemeStore, useInventoryStore } from '../../store';
import { Inventory } from '../../types';

export const PublicProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const { myInventories } = useInventoryStore();
  const insets = useSafeAreaInsets();

  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadInventories();
    }, [myInventories])
  );

  useEffect(() => {
    loadInventories();
  }, [myInventories]);

  const loadInventories = (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      console.log('PublicProfile - Store myInventories:', myInventories);
      
      // Filter for active items only for public display
      const activeItems = myInventories.filter((item: Inventory) => item.status === 'active');
      console.log('PublicProfile - Active items:', activeItems);
      
      setInventories(activeItems);
    } catch (error) {
      console.error('PublicProfile - Error loading inventories:', error);
      setError('Failed to load items');
    }

    setIsLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    loadInventories(true);
  };

  const handleItemPress = (inventory: Inventory) => {
    console.log('PublicProfile - Clicking item:', inventory.title);
    console.log('PublicProfile - Item slug:', inventory.publicSlug);
    console.log('PublicProfile - Item status:', inventory.status);
    console.log('PublicProfile - Navigating to PublicProduct with slug:', inventory.publicSlug);
    navigation.navigate('PublicProduct', { slug: inventory.publicSlug });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    // In a real app, this would share the public profile URL
    // For now, just show an alert
    alert('Share profile feature coming soon!');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Public Profile</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.border }]}>
            <Text style={[styles.avatarText, { color: theme.colors.text }]}>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user?.displayName || 'User Name'}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
            {user?.email || 'user@example.com'}
          </Text>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>{inventories.length}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Items</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                {inventories.filter(item => item.status === 'sold_out').length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Sold</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>About</Text>
          <Text style={[styles.bioText, { color: theme.colors.textSecondary }]}>
            Welcome to my shop! I offer quality products with great customer service. 
            Feel free to browse my items and reach out if you have any questions.
          </Text>
        </View>

        {/* Recent Items List */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Available Items</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Loading items...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={24} color={theme.colors.error} />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
            </View>
          ) : inventories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No items available for purchase
              </Text>
            </View>
          ) : (
            <View style={styles.itemsList}>
              {inventories.map((inventory) => (
                <TouchableOpacity
                  key={inventory.id}
                  style={[styles.itemListItem, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                  onPress={() => handleItemPress(inventory)}
                >
                  <View style={[styles.itemImageContainer, { backgroundColor: theme.colors.border }]}>
                    {inventory.images && inventory.images.length > 0 ? (
                      <Image source={{ uri: inventory.images[0] }} style={styles.itemImage} />
                    ) : (
                      <Ionicons name="image-outline" size={24} color={theme.colors.textSecondary} />
                    )}
                  </View>
                  
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={2}>
                      {inventory.title}
                    </Text>
                    {inventory.description && (
                      <Text style={[styles.itemDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                        {inventory.description}
                      </Text>
                    )}
                    <View style={styles.itemMeta}>
                      <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
                        ${(inventory.priceCents / 100).toFixed(2)}
                      </Text>
                      <Text style={[styles.itemQuantity, { color: theme.colors.textSecondary }]}>
                        {inventory.quantityAvailable} available
                      </Text>
                    </View>
                    {inventory.category && (
                      <Text style={[styles.itemCategory, { color: theme.colors.textSecondary }]}>
                        {inventory.category}
                      </Text>
                    )}
                  </View>
                  
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  profileHeader: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: '500' },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: '100%',
    height: 80,
    borderRadius: 4,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  itemsList: {
    gap: 12,
  },
  itemListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
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
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemQuantity: {
    fontSize: 12,
  },
  itemCategory: {
    fontSize: 12,
    marginTop: 4,
  },
});
