import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ShopStackParamList, Product } from '../../types';
import { LiquidGlassProductCard } from '../../components/LiquidGlass';
import { useProductStore, useThemeStore } from '../../store';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'ProductFeed'>;

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Vintage Camera',
    description: 'Beautiful vintage film camera in excellent condition',
    price: 149.99,
    images: ['https://picsum.photos/400/400?random=1'],
    category: 'Electronics',
    sellerId: '1',
    sellerName: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    condition: 'good',
    localPickup: true,
  },
  {
    id: '2',
    title: 'Leather Jacket',
    description: 'Genuine leather jacket, size M',
    price: 89.99,
    images: ['https://picsum.photos/400/400?random=2'],
    category: 'Fashion',
    sellerId: '2',
    sellerName: 'Jane Smith',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    condition: 'like-new',
    localPickup: false,
  },
  {
    id: '3',
    title: 'MacBook Pro 2020',
    description: '13-inch, 16GB RAM, 512GB SSD',
    price: 899.00,
    images: ['https://picsum.photos/400/400?random=3'],
    category: 'Electronics',
    sellerId: '3',
    sellerName: 'Tech Store',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    condition: 'good',
    localPickup: true,
  },
  {
    id: '4',
    title: 'Nike Air Max',
    description: 'Size 10, barely worn',
    price: 75.00,
    images: ['https://picsum.photos/400/400?random=4'],
    category: 'Fashion',
    sellerId: '4',
    sellerName: 'Shoe Lover',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    condition: 'like-new',
    localPickup: true,
  },
  {
    id: '5',
    title: 'Gaming Chair',
    description: 'Ergonomic gaming chair with lumbar support',
    price: 199.99,
    images: ['https://picsum.photos/400/400?random=5'],
    category: 'Furniture',
    sellerId: '5',
    sellerName: 'Gaming Gear',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    condition: 'new',
    localPickup: true,
  },
  {
    id: '6',
    title: 'Wireless Earbuds',
    description: 'High quality wireless earbuds with noise cancellation',
    price: 59.99,
    images: ['https://picsum.photos/400/400?random=6'],
    category: 'Electronics',
    sellerId: '6',
    sellerName: 'Audio Pro',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'active',
    condition: 'new',
    localPickup: false,
  },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Furniture', 'Sports', 'Books'];

export const ProductFeedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme, isLiquidGlassEnabled } = useThemeStore();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useProductStore();

  const [refreshing, setRefreshing] = useState(false);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery
      ? product.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory =
      selectedCategory && selectedCategory !== 'All'
        ? product.category === selectedCategory
        : true;
    return matchesSearch && matchesCategory;
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <LiquidGlassProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        size="medium"
      />
    ),
    [navigation]
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>MicroShop</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          {isLiquidGlassEnabled && (
            <BlurView
              intensity={15}
              tint="dark"
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  (selectedCategory === item || (!selectedCategory && item === 'All')) &&
                    styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(item === 'All' ? null : item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    (selectedCategory === item || (!selectedCategory && item === 'All')) &&
                      styles.categoryTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={keyExtractor}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.productList}
          columnWrapperStyle={styles.productRow}
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
              <Ionicons name="search-outline" size={64} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyText}>No products found</Text>
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
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryChipActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    borderColor: 'rgba(0, 122, 255, 0.5)',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  productList: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 100,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 16,
  },
});
