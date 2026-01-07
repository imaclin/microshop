import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Share,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useThemeStore, useInventoryStore } from '../../store';
import { Product, Inventory } from '../../types';
import { inventoryApi } from '../../api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const CreateProductScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { theme } = useThemeStore();
  const { addInventory } = useInventoryStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [size, setSize] = useState('');
  const [weight, setWeight] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

  const generateShareLink = (productId: string): string => {
    return `https://microshop.app/product/${productId}`;
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = [...images, ...result.assets.map(asset => asset.uri!)];
      setImages(newImages.slice(0, 5)); // Limit to 5 images
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleCreateProduct = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const priceCents = Math.round(parseFloat(price) * 100);
      const shippingCostCents = shippingCost ? Math.round(parseFloat(shippingCost) * 100) : undefined;

      // Create inventory item via API
      const response = await inventoryApi.createInventory({
        title: title.trim(),
        description: description.trim(),
        priceCents,
        currency: 'usd',
        quantityAvailable: parseInt(quantity) || 1,
        category: category.trim() || undefined,
        condition: condition.trim() || undefined,
        shippingCostCents,
        images: images, // Pass the images to the API
      });

      if (response.success && response.data) {
        // Add to local store
        addInventory(response.data.inventory);

        // Create product object for modal display
        const newProduct: Product = {
          id: response.data.inventory.id,
          title: response.data.inventory.title,
          description: response.data.inventory.description || '',
          price: response.data.inventory.priceCents / 100,
          images: images, // Use local images for display
          shareLink: generateShareLink(response.data.inventory.publicSlug),
          createdAt: response.data.inventory.createdAt,
          updatedAt: response.data.inventory.updatedAt,
          // Store the publicSlug for navigation
          publicSlug: response.data.inventory.publicSlug,
        };

        setCreatedProduct(newProduct);
        
        Alert.alert('Success', 'Product created successfully!', [
          { text: 'OK', onPress: () => {
            setTitle('');
            setDescription('');
            setPrice('');
            setQuantity('');
            setSize('');
            setWeight('');
            setShippingCost('');
            setCategory('');
            setCondition('');
            setShowOptionalFields(false);
            setImages([]);
          }},
        ]);
      } else {
        Alert.alert('Error', response.error || 'Failed to create product');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create product');
    }
  };

  const handleShare = async () => {
    if (!createdProduct) return;

    const shareContent = `Check out this product: ${createdProduct.title}\n\n${createdProduct.description}\n\nPrice: $${createdProduct.price.toFixed(2)}\n\nView it here: ${createdProduct.shareLink}`;

    try {
      await Share.share({
        message: shareContent,
        url: createdProduct.shareLink,
        title: createdProduct.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the product');
    }
  };

  const handleCopyLink = () => {
    if (!createdProduct) return;
    
    // In a real app, you'd use Clipboard.setString
    Alert.alert('Link Copied', `Product link copied to clipboard:\n\n${createdProduct.shareLink}`);
  };

  const handleViewProduct = () => {
    if (!createdProduct) return;
    
    // Navigate to the inventory details page in the Orders tab
    navigation.navigate('OrdersTab', {
      screen: 'InventoryDetails',
      params: { inventoryId: createdProduct.id }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>Create Product</Text>

          <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Title *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }]}
                placeholder="Enter product title"
                placeholderTextColor={theme.colors.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Images</Text>
              
              {images.length > 0 && (
                <View style={styles.imageContainer}>
                  <FlatList
                    data={images}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <View style={styles.imageWrapper}>
                        <Image source={{ uri: item }} style={styles.image} />
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={() => handleRemoveImage(index)}
                        >
                          <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </View>
              )}
              
              <TouchableOpacity
                style={[styles.addImageButton, { borderColor: theme.colors.border }]}
                onPress={handlePickImage}
                disabled={images.length >= 5}
              >
                <Ionicons name="camera-outline" size={24} color={theme.colors.textSecondary} />
                <Text style={[styles.addImageText, { color: theme.colors.textSecondary }]}>
                  {images.length === 0 ? 'Add Images' : `Add More (${images.length}/5)`}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }]}
                placeholder="Enter product description"
                placeholderTextColor={theme.colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>PRICE ($)</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }]}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Quantity</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }]}
                placeholder="Enter quantity"
                placeholderTextColor={theme.colors.textSecondary}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Shipping Cost ($)</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }]}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
                value={shippingCost}
                onChangeText={setShippingCost}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.optionalDropdown, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => setShowOptionalFields(!showOptionalFields)}
          >
            <View style={styles.optionalHeader}>
              <Text style={[styles.optionalTitle, { color: theme.colors.text }]}>Optional Fields</Text>
              <Ionicons 
                name={showOptionalFields ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={theme.colors.textSecondary} 
              />
            </View>
            
            {showOptionalFields && (
              <View style={styles.optionalFields}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Category</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }]}
                    placeholder="e.g., Electronics, Clothing, Books"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={category}
                    onChangeText={setCategory}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Condition</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }]}
                    placeholder="e.g., New, Like New, Good, Fair"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={condition}
                    onChangeText={setCondition}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Size</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }]}
                    placeholder="e.g., Small, Medium, Large"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={size}
                    onChangeText={setSize}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Weight</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }]}
                    placeholder="e.g., 1.5 lbs"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={weight}
                    onChangeText={setWeight}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleCreateProduct}
          >
            <Ionicons name="add-circle-outline" size={20} color={theme.colors.background} />
            <Text style={[styles.createButtonText, { color: theme.colors.background }]}>
              Create Product
            </Text>
          </TouchableOpacity>

          {createdProduct && (
            <View style={[styles.card, styles.resultCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.resultTitle, { color: theme.colors.text }]}>Product Created!</Text>
              
              {/* Show product image with title and price */}
              {createdProduct.images && createdProduct.images.length > 0 && (
                <View style={styles.productImageWithInfoContainer}>
                  <Image source={{ uri: createdProduct.images[0] }} style={styles.productImageLarge} />
                  <View style={styles.productInfoInline}>
                    <Text style={[styles.productTitle, { color: theme.colors.text }]}>{createdProduct.title}</Text>
                    <Text style={[styles.productPrice, { color: theme.colors.primary }]}>
                      ${createdProduct.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
              
              {/* Show title and price if no images */}
              {(!createdProduct.images || createdProduct.images.length === 0) && (
                <View style={styles.productInfo}>
                  <Text style={[styles.productTitle, { color: theme.colors.text }]}>{createdProduct.title}</Text>
                  <Text style={[styles.productPrice, { color: theme.colors.primary }]}>
                    ${createdProduct.price.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.linkContainer}>
                <Text style={[styles.linkLabel, { color: theme.colors.textSecondary }]}>Share Link:</Text>
                <Text style={[styles.linkText, { color: theme.colors.accent }]} numberOfLines={2}>
                  {createdProduct.shareLink}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleViewProduct}
                >
                  <Ionicons name="eye-outline" size={18} color={theme.colors.background} />
                  <Text style={[styles.actionButtonText, { color: theme.colors.background }]}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { borderColor: theme.colors.border }]}
                  onPress={handleShare}
                >
                  <Ionicons name="share-outline" size={18} color={theme.colors.text} />
                  <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { borderColor: theme.colors.border }]}
                  onPress={handleCopyLink}
                >
                  <Ionicons name="copy-outline" size={18} color={theme.colors.text} />
                  <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  title: { fontSize: 32, fontWeight: '400', marginBottom: 24 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  resultCard: {
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  productInfo: {
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
  },
  linkContainer: {
    marginBottom: 20,
  },
  linkLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  imageContainer: {
    marginBottom: 12,
  },
  productImagesContainer: {
    marginBottom: 16,
  },
  productImageWithInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImageLarge: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfoInline: {
    flex: 1,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#000000',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 14,
  },
  optionalDropdown: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  optionalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionalTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionalFields: {
    marginTop: 16,
    gap: 0,
  },
});
