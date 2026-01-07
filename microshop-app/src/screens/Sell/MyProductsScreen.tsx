import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SellStackParamList, Product } from '../../types';
import { LiquidGlassCard, LiquidGlassButton } from '../../components/LiquidGlass';
import { useAuthStore } from '../../store';

type NavigationProp = NativeStackNavigationProp<SellStackParamList, 'MyProducts'>;

const MOCK_MY_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Vintage Camera',
    description: 'Beautiful vintage film camera',
    price: 149.99,
    images: ['https://picsum.photos/400/400?random=10'],
    category: 'Electronics',
    sellerId: '1',
    sellerName: 'You',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    condition: 'good',
    localPickup: true,
  },
  {
    id: '2',
    title: 'Designer Bag',
    description: 'Luxury designer handbag',
    price: 299.00,
    images: ['https://picsum.photos/400/400?random=11'],
    category: 'Fashion',
    sellerId: '1',
    sellerName: 'You',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    condition: 'like-new',
    localPickup: false,
  },
];

export const MyProductsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();

  const [products, setProducts] = useState<Product[]>(MOCK_MY_PRODUCTS);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'inactive'>('active');

  const filteredProducts = products.filter((p) => p.status === activeTab);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <LiquidGlassCard style={styles.productCard}>
        <View style={styles.productRow}>
          <Image source={{ uri: item.images[0] }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Ionicons name="eye-outline" size={14} color="rgba(255,255,255,0.5)" />
                <Text style={styles.statText}>124</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="heart-outline" size={14} color="rgba(255,255,255,0.5)" />
                <Text style={styles.statText}>18</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>
      </LiquidGlassCard>
    ),
    []
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>My Products</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddProduct')}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCards}>
          <LiquidGlassCard style={styles.statsCard} interactive={false}>
            <Text style={styles.statsNumber}>${products.reduce((sum, p) => sum + p.price, 0).toFixed(0)}</Text>
            <Text style={styles.statsLabel}>Total Value</Text>
          </LiquidGlassCard>
          <LiquidGlassCard style={styles.statsCard} interactive={false}>
            <Text style={styles.statsNumber}>{products.length}</Text>
            <Text style={styles.statsLabel}>Listed</Text>
          </LiquidGlassCard>
          <LiquidGlassCard style={styles.statsCard} interactive={false}>
            <Text style={styles.statsNumber}>0</Text>
            <Text style={styles.statsLabel}>Sold</Text>
          </LiquidGlassCard>
        </View>

        <View style={styles.tabs}>
          {(['active', 'sold', 'inactive'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ffffff"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={64} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyText}>No {activeTab} products</Text>
              {activeTab === 'active' && (
                <LiquidGlassButton
                  title="Add Your First Product"
                  onPress={() => navigation.navigate('AddProduct')}
                  variant="primary"
                  size="medium"
                  style={styles.emptyButton}
                />
              )}
            </View>
          }
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsCards: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  statsLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  productList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  productCard: {
    marginBottom: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  moreButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
});
