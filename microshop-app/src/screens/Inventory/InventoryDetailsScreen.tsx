import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { useThemeStore, useInventoryStore } from '../../store';
import { Inventory } from '../../types';

type InventoryDetailsRouteProp = RouteProp<{ InventoryDetails: { inventoryId: string } }, 'InventoryDetails'>;

interface Buyer {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

interface ShippingUpdate {
  id: string;
  timestamp: Date;
  message: string;
  type: 'shipped' | 'in_transit' | 'delivered' | 'delayed';
}

export const InventoryDetailsScreen: React.FC = () => {
  const route = useRoute<InventoryDetailsRouteProp>();
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const { inventories, updateInventory } = useInventoryStore();
  const { inventoryId } = route.params;
  
  // Find the inventory item by ID
  const inventory = inventories.find(item => item.id === inventoryId);
  
  // Show error if inventory not found
  if (!inventory) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Item Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>Item not found</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const [shippingUpdates, setShippingUpdates] = useState<ShippingUpdate[]>([
    {
      id: '1',
      timestamp: new Date('2024-01-15T10:00:00'),
      message: 'Order placed and payment confirmed',
      type: 'shipped',
    },
    {
      id: '2',
      timestamp: new Date('2024-01-15T14:30:00'),
      message: 'Package picked up by carrier',
      type: 'in_transit',
    },
  ]);
  
  const [newUpdate, setNewUpdate] = useState('');
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  // Mock buyer data - in real app this would come from backend
  const buyer: Buyer = {
    id: 'buyer_123',
    name: 'John Doe',
    email: 'john.doe@email.com',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    phone: '(555) 123-4567',
  };

  const handlePurchaseShippingLabel = () => {
    Alert.alert(
      'Purchase Shipping Label',
      'This will redirect you to the shipping carrier to purchase a label. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            // In real app, this would open shipping carrier integration
            Alert.alert('Success', 'Redirecting to shipping carrier...');
          }
        },
      ]
    );
  };

  const handleAddShippingUpdate = () => {
    if (!newUpdate.trim()) {
      Alert.alert('Error', 'Please enter an update message');
      return;
    }

    const update: ShippingUpdate = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message: newUpdate.trim(),
      type: 'in_transit',
    };

    setShippingUpdates([...shippingUpdates, update]);
    setNewUpdate('');
    Alert.alert('Success', 'Shipping update added');
  };

  const getStatusColor = (type: ShippingUpdate['type']) => {
    switch (type) {
      case 'shipped': return theme.colors.primary;
      case 'in_transit': return theme.colors.warning;
      case 'delivered': return theme.colors.success;
      case 'delayed': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (type: ShippingUpdate['type']) => {
    switch (type) {
      case 'shipped': return 'cube-outline';
      case 'in_transit': return 'bus-outline';
      case 'delivered': return 'checkmark-circle-outline';
      case 'delayed': return 'alert-circle-outline';
      default: return 'ellipse-outline';
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
          <View style={styles.placeholder} />
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.headerButton, 
                { 
                  backgroundColor: inventory.status === 'active' ? theme.colors.success : theme.colors.textSecondary 
                }
              ]}
              onPress={() => {
                // Show status options with better messaging
                if (inventory.status === 'draft') {
                  Alert.alert(
                    'Publish Item',
                    'Make this item available for purchase in your public store?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Publish', 
                        onPress: () => {
                          console.log('Publishing item:', inventory.id, 'Current status:', inventory.status);
                          updateInventory(inventory.id, { status: 'active' });
                          Alert.alert('Published!', 'Your item is now available for purchase.');
                        }
                      },
                    ]
                  );
                } else {
                  Alert.alert(
                    'Unpublish Item',
                    'Remove this item from your public store? It will no longer be available for purchase.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Unpublish', 
                        onPress: () => {
                          updateInventory(inventory.id, { status: 'draft' });
                          Alert.alert('Unpublished', 'Your item is now a draft and not visible to the public.');
                        }
                      },
                    ]
                  );
                }
              }}
            >
              <Text style={[styles.statusText, { color: theme.colors.background }]}>
                {inventory.status === 'active' ? 'ACTIVE' : 'PUBLISH'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Information */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {inventory.images && inventory.images.length > 0 && (
            <Image 
              source={{ uri: inventory.images[0] }} 
              style={[
                styles.productImage, 
                imageDimensions.width > 0 && {
                  aspectRatio: imageDimensions.width / imageDimensions.height,
                }
              ]}
              onLoad={(e) => {
                const { width, height } = e.nativeEvent.source;
                setImageDimensions({ width, height });
              }}
              resizeMode="contain"
            />
          )}
          
          <View style={styles.titleRow}>
            <Text style={[styles.productTitle, { color: theme.colors.text }]}>{inventory.title}</Text>
            <TouchableOpacity
              style={[styles.editButton, { borderColor: theme.colors.border }]}
              onPress={() => {
                // Navigate to edit screen
                navigation.navigate('EditInventory', { inventoryId: inventory.id });
              }}
            >
              <Ionicons name="create-outline" size={16} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.productPrice, { color: theme.colors.primary }]}>
            ${(inventory.priceCents / 100).toFixed(2)}
          </Text>
          <Text style={[styles.productDescription, { color: theme.colors.textSecondary }]}>
            {inventory.description}
          </Text>
          
          <View style={styles.productMeta}>
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              Listed: {inventory.createdAt.toLocaleDateString()}
            </Text>
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              Status: {inventory.status}
            </Text>
            <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
              Quantity: {inventory.quantityAvailable}
            </Text>
          </View>
        </View>

        
        {/* Shipping Management */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Shipping Management</Text>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={handlePurchaseShippingLabel}
          >
            <Ionicons name="pricetag-outline" size={20} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Purchase Shipping Label</Text>
          </TouchableOpacity>
        </View>

        {/* Shipping Updates */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Shipping Updates</Text>
          
          {shippingUpdates.map((update) => (
            <View key={update.id} style={styles.updateItem}>
              <View style={styles.updateHeader}>
                <Ionicons 
                  name={getStatusIcon(update.type) as any} 
                  size={20} 
                  color={getStatusColor(update.type)} 
                />
                <Text style={[styles.updateTime, { color: theme.colors.textSecondary }]}>
                  {update.timestamp.toLocaleString()}
                </Text>
              </View>
              <Text style={[styles.updateMessage, { color: theme.colors.text }]}>
                {update.message}
              </Text>
            </View>
          ))}
          
          <View style={styles.addUpdateSection}>
            <TextInput
              style={[styles.updateInput, { 
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              }]}
              placeholder="Add shipping update..."
              placeholderTextColor={theme.colors.textSecondary}
              value={newUpdate}
              onChangeText={setNewUpdate}
              multiline
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleAddShippingUpdate}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={[styles.addButtonText, { color: '#FFFFFF' }]}>Add Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 24,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%', // Take full width of available space
    justifyContent: 'flex-end', // Right-align buttons
    paddingHorizontal: 24, // Match header padding
    marginRight: -24, // Offset to align with card content
  },
  headerButton: {
    height: 36,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
  },
  headerButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  productImage: {
    width: '92%',
    maxWidth: '92%',
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 200,
    maxHeight: 400,
    alignSelf: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
  },
  editButton: {
    width: 36,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    marginLeft: 12,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  productMeta: {
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  buyerInfo: {
    marginBottom: 16,
  },
  buyerName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  buyerEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  buyerPhone: {
    fontSize: 14,
  },
  shippingAddress: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  managementActions: {
    gap: 12,
  },
  updateItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 12,
  },
  updateMessage: {
    fontSize: 14,
    paddingLeft: 28,
  },
  addUpdateSection: {
    paddingTop: 16,
  },
  updateInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
