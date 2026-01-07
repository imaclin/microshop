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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore, useStripeStore, useInventoryStore } from '../../store';
import { inventoryApi } from '../../api';
import { Inventory } from '../../types';

export const CreateInventoryScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { theme } = useThemeStore();
  const { isSellerEnabled, getSellerStatus } = useStripeStore();
  const { addInventory } = useInventoryStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const sellerEnabled = isSellerEnabled();
  const sellerStatus = getSellerStatus();

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    setIsSavingDraft(true);

    const priceCents = Math.round(parseFloat(price) * 100);
    const shippingCostCents = shippingCost ? Math.round(parseFloat(shippingCost) * 100) : undefined;

    const response = await inventoryApi.createInventory({
      title: title.trim(),
      description: description.trim(),
      priceCents,
      currency: 'usd',
      quantityAvailable: parseInt(quantity) || 1,
      category: category.trim() || undefined,
      condition: condition.trim() || undefined,
      shippingCostCents,
    });

    setIsSavingDraft(false);

    if (response.success && response.data) {
      addInventory(response.data.inventory);
      Alert.alert('Success', 'Draft saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', response.error || 'Failed to save draft');
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    if (!sellerEnabled) {
      Alert.alert(
        'Seller Setup Required',
        'You need to complete seller onboarding before publishing listings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Set Up Now', onPress: () => navigation.navigate('SellerOnboarding') },
        ]
      );
      return;
    }

    setIsLoading(true);

    const priceCents = Math.round(parseFloat(price) * 100);
    const shippingCostCents = shippingCost ? Math.round(parseFloat(shippingCost) * 100) : undefined;

    const createResponse = await inventoryApi.createInventory({
      title: title.trim(),
      description: description.trim(),
      priceCents,
      currency: 'usd',
      quantityAvailable: parseInt(quantity) || 1,
      category: category.trim() || undefined,
      condition: condition.trim() || undefined,
      shippingCostCents,
    });

    if (!createResponse.success || !createResponse.data) {
      setIsLoading(false);
      Alert.alert('Error', createResponse.error || 'Failed to create listing');
      return;
    }

    const publishResponse = await inventoryApi.publishInventory(createResponse.data.inventory.id);

    setIsLoading(false);

    if (publishResponse.success && publishResponse.data) {
      addInventory(publishResponse.data.inventory);
      Alert.alert('Success', 'Listing published successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      addInventory(createResponse.data.inventory);
      Alert.alert('Partial Success', 'Draft saved but publishing failed. You can publish later from your listings.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          New Listing
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Seller Status Warning */}
          {!sellerEnabled && (
            <TouchableOpacity
              style={[styles.warningCard, { backgroundColor: theme.colors.warning + '15', borderColor: theme.colors.warning }]}
              onPress={() => navigation.navigate('SellerOnboarding')}
            >
              <Ionicons name="alert-circle" size={20} color={theme.colors.warning} />
              <View style={styles.warningContent}>
                <Text style={[styles.warningTitle, { color: theme.colors.text }]}>
                  Seller Setup Required
                </Text>
                <Text style={[styles.warningText, { color: theme.colors.textSecondary }]}>
                  Complete setup to publish and accept payments
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.warning} />
            </TouchableOpacity>
          )}

          {/* Form Fields */}
          <View style={[styles.formCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Title *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="What are you selling?"
                placeholderTextColor={theme.colors.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="Describe your item..."
                placeholderTextColor={theme.colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Price ($) *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Quantity</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                  placeholder="1"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Category</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                  placeholder="e.g., Electronics"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={category}
                  onChangeText={setCategory}
                />
              </View>

              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Condition</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                  placeholder="e.g., New"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={condition}
                  onChangeText={setCondition}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Shipping Cost ($)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder="0.00 (optional)"
                placeholderTextColor={theme.colors.textSecondary}
                value={shippingCost}
                onChangeText={setShippingCost}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: theme.colors.border }]}
              onPress={handleSaveDraft}
              disabled={isSavingDraft || isLoading}
            >
              {isSavingDraft ? (
                <ActivityIndicator color={theme.colors.text} />
              ) : (
                <>
                  <Ionicons name="document-outline" size={20} color={theme.colors.text} />
                  <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}>
                    Save Draft
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: sellerEnabled ? theme.colors.primary : theme.colors.textSecondary }
              ]}
              onPress={handlePublish}
              disabled={isLoading || isSavingDraft}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.background} />
              ) : (
                <>
                  <Ionicons name="rocket-outline" size={20} color={theme.colors.background} />
                  <Text style={[styles.primaryButtonText, { color: theme.colors.background }]}>
                    {sellerEnabled ? 'Publish' : 'Publish (Setup Required)'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Prohibited Items Notice */}
          <View style={[styles.noticeCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Ionicons name="shield-checkmark" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.noticeText, { color: theme.colors.textSecondary }]}>
              By listing, you confirm this item complies with our Acceptable Use Policy and is not prohibited.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  warningContent: { flex: 1 },
  warningTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  warningText: { fontSize: 12 },

  formCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: { flex: 1 },

  actions: { gap: 12, marginBottom: 16 },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
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
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '500' },

  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  noticeText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
