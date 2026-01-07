import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore, useInventoryStore } from '../../store';
import { Inventory } from '../../types';

export const InventoryScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { theme } = useThemeStore();
  const { myInventories } = useInventoryStore();
  const [activeTab, setActiveTab] = useState<'forSale' | 'sold'>('forSale');
  const [refreshing, setRefreshing] = useState(false);

  // Filter inventories by status
  const forSaleInventories = myInventories.filter(inv => inv.status === 'active' || inv.status === 'draft');
  const soldInventories = myInventories.filter(inv => inv.status === 'sold_out');

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderProduct = ({ item }: { item: Inventory }) => {
    return (
      <TouchableOpacity 
        style={[styles.productCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        onPress={() => navigation.navigate('InventoryDetails', { inventoryId: item.id })}
      >
        {/* Product Image */}
        {item.images && item.images.length > 0 ? (
          <Image 
            source={{ uri: item.images[0] }} 
            style={[styles.productImage, { borderColor: theme.colors.border }]}
          />
        ) : (
          <View style={[styles.productImage, styles.productImagePlaceholder, { borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
            <Ionicons name="image-outline" size={32} color={theme.colors.textSecondary} />
          </View>
        )}
        
        <View style={styles.productContent}>
          <View style={styles.productHeader}>
            <Text style={[styles.productTitle, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={[styles.productPrice, { color: theme.colors.primary }]}>
              ${(item.priceCents / 100).toFixed(2)}
            </Text>
          </View>
          <Text style={[styles.productDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.productFooter}>
            <Text style={[styles.productDate, { color: theme.colors.textSecondary }]}>
              {item.createdAt.toLocaleDateString()}
            </Text>
            <Text style={[styles.productStatus, { color: item.status === 'active' ? theme.colors.success : theme.colors.textSecondary }]}>
              {item.status}
            </Text>
            <TouchableOpacity 
              style={[styles.shareButton, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
              onPress={(e) => {
                e.stopPropagation();
                // Handle share functionality
              }}
            >
              <Ionicons name="share-outline" size={16} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Inventory</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'forSale' && [styles.activeTab, { backgroundColor: theme.colors.primary }],
            { borderColor: theme.colors.border },
          ]}
          onPress={() => setActiveTab('forSale')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'forSale' && { color: theme.colors.background },
              { color: activeTab === 'forSale' ? theme.colors.background : theme.colors.text },
            ]}>
            For Sale ({forSaleInventories.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'sold' && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => setActiveTab('sold')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'sold' && { color: theme.colors.background },
              { color: activeTab === 'sold' ? theme.colors.background : theme.colors.text },
            ]}>
            Sold ({soldInventories.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'forSale' ? forSaleInventories : soldInventories}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No {activeTab === 'forSale' ? 'items for sale' : 'sold items'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 32,
    fontWeight: '400',
    marginBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 8,
  },
  activeTab: {},
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  productCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
  },
  productImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productContent: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productDate: {
    fontSize: 12,
  },
  productStatus: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  shareButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
