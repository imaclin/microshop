import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SellStackParamList } from '../../types';
import {
  LiquidGlassButton,
  LiquidGlassCard,
  LiquidGlassInput,
} from '../../components/LiquidGlass';
import { useProductStore } from '../../store';

type NavigationProp = NativeStackNavigationProp<SellStackParamList, 'AddProduct'>;

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Sports',
  'Books',
  'Toys',
  'Art',
  'Other',
];

const CONDITIONS = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
];

export const AddProductScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { addProduct } = useProductStore();

  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [localPickup, setLocalPickup] = useState(true);
  const [shippingPrice, setShippingPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert('Missing Photos', 'Please add at least one photo of your product.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your product.');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }
    if (!category) {
      Alert.alert('Missing Category', 'Please select a category.');
      return;
    }
    if (!condition) {
      Alert.alert('Missing Condition', 'Please select the condition of your product.');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addProduct({
        id: Date.now().toString(),
        title,
        description,
        price: parseFloat(price),
        images,
        category,
        sellerId: '1',
        sellerName: 'You',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        condition: condition as 'new' | 'like-new' | 'good' | 'fair',
        shippingPrice: shippingPrice ? parseFloat(shippingPrice) : undefined,
        localPickup,
      });

      Alert.alert(
        'Product Listed! 🎉',
        'Your product is now live and visible to buyers.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to list product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Product</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LiquidGlassCard style={styles.photosCard} interactive={false}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <Text style={styles.sectionSubtitle}>
              Add up to 5 photos. The first photo will be the cover.
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photosScroll}
            >
              {images.map((uri, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhoto}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF453A" />
                  </TouchableOpacity>
                  {index === 0 && (
                    <View style={styles.coverBadge}>
                      <Text style={styles.coverText}>Cover</Text>
                    </View>
                  )}
                </View>
              ))}
              {images.length < 5 && (
                <View style={styles.addPhotoButtons}>
                  <TouchableOpacity style={styles.addPhotoButton} onPress={takePhoto}>
                    <Ionicons name="camera" size={24} color="#0A84FF" />
                    <Text style={styles.addPhotoText}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                    <Ionicons name="images" size={24} color="#0A84FF" />
                    <Text style={styles.addPhotoText}>Gallery</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </LiquidGlassCard>

          <LiquidGlassCard style={styles.formCard} interactive={false}>
            <Text style={styles.sectionTitle}>Details</Text>
            <LiquidGlassInput
              label="Title"
              placeholder="What are you selling?"
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />
            <LiquidGlassInput
              label="Description"
              placeholder="Describe your item..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <LiquidGlassInput
              label="Price"
              placeholder="0.00"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              leftIcon={<Text style={styles.currencySymbol}>$</Text>}
            />
          </LiquidGlassCard>

          <LiquidGlassCard style={styles.formCard} interactive={false}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.optionsGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.optionChip,
                    category === cat && styles.optionChipActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      category === cat && styles.optionTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LiquidGlassCard>

          <LiquidGlassCard style={styles.formCard} interactive={false}>
            <Text style={styles.sectionTitle}>Condition</Text>
            <View style={styles.optionsRow}>
              {CONDITIONS.map((cond) => (
                <TouchableOpacity
                  key={cond.value}
                  style={[
                    styles.conditionChip,
                    condition === cond.value && styles.optionChipActive,
                  ]}
                  onPress={() => setCondition(cond.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      condition === cond.value && styles.optionTextActive,
                    ]}
                  >
                    {cond.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LiquidGlassCard>

          <LiquidGlassCard style={styles.formCard} interactive={false}>
            <Text style={styles.sectionTitle}>Delivery Options</Text>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setLocalPickup(!localPickup)}
            >
              <View style={styles.toggleInfo}>
                <Ionicons name="location-outline" size={24} color="#ffffff" />
                <Text style={styles.toggleLabel}>Local Pickup</Text>
              </View>
              <View style={[styles.toggle, localPickup && styles.toggleActive]}>
                <View style={[styles.toggleKnob, localPickup && styles.toggleKnobActive]} />
              </View>
            </TouchableOpacity>
            <LiquidGlassInput
              label="Shipping Price (optional)"
              placeholder="0.00"
              value={shippingPrice}
              onChangeText={setShippingPrice}
              keyboardType="decimal-pad"
              leftIcon={<Text style={styles.currencySymbol}>$</Text>}
            />
          </LiquidGlassCard>
        </ScrollView>

        <View style={styles.footer}>
          <LiquidGlassButton
            title="List Product"
            onPress={handleSubmit}
            variant="primary"
            size="large"
            loading={isSubmitting}
            style={styles.submitButton}
          />
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  photosCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 16,
  },
  photosScroll: {
    marginHorizontal: -8,
  },
  photoContainer: {
    position: 'relative',
    marginHorizontal: 8,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removePhoto: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  coverBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
    paddingVertical: 2,
  },
  coverText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  addPhotoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 8,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(10, 132, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#0A84FF',
    marginTop: 4,
  },
  formCard: {
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionChipActive: {
    backgroundColor: 'rgba(10, 132, 255, 0.2)',
    borderColor: 'rgba(10, 132, 255, 0.5)',
  },
  optionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  optionTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  conditionChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 16,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#ffffff',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#30D158',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  toggleKnobActive: {
    marginLeft: 'auto',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
  },
  submitButton: {
    width: '100%',
  },
});
