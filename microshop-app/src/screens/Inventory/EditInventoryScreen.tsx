import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore, useInventoryStore } from '../../store';
import { Inventory } from '../../types';
import * as ImagePicker from 'expo-image-picker';

type EditInventoryRouteProp = {
  params: {
    inventoryId: string;
  };
};

export const EditInventoryScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute<EditInventoryRouteProp>();
  const { theme } = useThemeStore();
  const { inventories, updateInventory } = useInventoryStore();
  const { inventoryId } = route.params;

  // Find the inventory item
  const inventory = inventories.find(item => item.id === inventoryId);

  // Form state
  const [title, setTitle] = useState(inventory?.title || '');
  const [description, setDescription] = useState(inventory?.description || '');
  const [price, setPrice] = useState((inventory?.priceCents ? inventory.priceCents / 100 : 0).toString());
  const [quantity, setQuantity] = useState(inventory?.quantityAvailable?.toString() || '1');
  const [category, setCategory] = useState(inventory?.category || '');
  const [condition, setCondition] = useState(inventory?.condition || '');
  const [shippingCost, setShippingCost] = useState(
    inventory?.shippingCostCents ? (inventory.shippingCostCents / 100).toString() : ''
  );
  const [images, setImages] = useState<string[]>(inventory?.images || []);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleUpdateInventory = async () => {
    if (!title.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const priceCents = Math.round(parseFloat(price) * 100);
      const shippingCostCents = shippingCost ? Math.round(parseFloat(shippingCost) * 100) : undefined;

      await updateInventory(inventoryId, {
        title: title.trim(),
        description: description.trim(),
        priceCents,
        currency: 'usd',
        quantityAvailable: parseInt(quantity) || 1,
        category: category.trim() || undefined,
        condition: condition.trim() || undefined,
        shippingCostCents,
        images: images,
      });

      Alert.alert('Success', 'Inventory updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update inventory');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Edit Item</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Form */}
        <View style={[styles.form, { backgroundColor: theme.colors.surface }]}>
          {/* Title */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Title *</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter product title"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* Images */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Images</Text>
            
            {/* Image Grid */}
            {images.length > 0 && (
              <View style={styles.imageGrid}>
                {images.map((imageUri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Ionicons name="close-circle" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                {/* Add Image Button */}
                <TouchableOpacity
                  style={[styles.addImageButton, { borderColor: theme.colors.border }]}
                  onPress={handleImagePicker}
                >
                  <Ionicons name="add" size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            
            {images.length === 0 && (
              <TouchableOpacity
                style={[styles.addImageContainer, { borderColor: theme.colors.border }]}
                onPress={handleImagePicker}
              >
                <Ionicons name="camera-outline" size={32} color={theme.colors.textSecondary} />
                <Text style={[styles.addImageText, { color: theme.colors.textSecondary }]}>
                  Add Images
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Price */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Price ($) *</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }
              ]}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your item"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Quantity */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Quantity</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }
              ]}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="1"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Category */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Category</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }
              ]}
              value={category}
              onChangeText={setCategory}
              placeholder="e.g., Electronics, Clothing"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* Condition */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Condition</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }
              ]}
              value={condition}
              onChangeText={setCondition}
              placeholder="e.g., New, Like New, Good"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* Shipping Cost */}
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Shipping Cost ($)</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }
              ]}
              value={shippingCost}
              onChangeText={setShippingCost}
              placeholder="0.00"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Update Button */}
          <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleUpdateInventory}
          >
            <Text style={[styles.updateButtonText, { color: theme.colors.background }]}>
              Update Item
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 24,
  },
  form: {
    borderRadius: 12,
    padding: 20,
  },
  field: {
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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  addImageContainer: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 14,
    marginTop: 8,
  },
  updateButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
