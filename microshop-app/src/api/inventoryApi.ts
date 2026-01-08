import AsyncStorage from '@react-native-async-storage/async-storage';
import { Inventory, ApiResponse } from '../types';

export interface CreateInventoryRequest {
  title: string;
  description: string;
  priceCents: number;
  currency?: string;
  quantityAvailable?: number;
  images?: string[];
  category?: string;
  condition?: string;
  size?: string;
  weight?: string;
  shippingCostCents?: number;
}

export interface UpdateInventoryRequest extends Partial<CreateInventoryRequest> {
  status?: 'draft' | 'active' | 'sold_out' | 'inactive';
}

export interface InventoryListResponse {
  inventories: Inventory[];
}

export interface PublishInventoryResponse {
  inventory: Inventory;
  message: string;
}

// Local storage fallback implementation
const STORAGE_KEY = 'microshop_inventory';

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const createInventoryItem = (data: CreateInventoryRequest): Inventory => {
  const now = new Date();
  return {
    id: generateId(),
    userId: 'local-user', // In real app, this would come from auth
    title: data.title,
    description: data.description,
    priceCents: data.priceCents,
    currency: data.currency || 'usd',
    quantityAvailable: data.quantityAvailable || 1,
    status: 'draft',
    publicSlug: generateId(),
    images: data.images || [],
    category: data.category,
    condition: data.condition,
    size: data.size,
    weight: data.weight,
    shippingCostCents: data.shippingCostCents,
    createdAt: now,
    updatedAt: now,
  };
};

export const inventoryApi = {
  /**
   * Get all inventories for the current user
   */
  async getMyInventories(): Promise<ApiResponse<InventoryListResponse>> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const inventories: Inventory[] = stored ? JSON.parse(stored) : [];
      return {
        success: true,
        data: { inventories },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to load inventories',
      };
    }
  },

  /**
   * Create a new inventory item (draft status)
   */
  async createInventory(
    data: CreateInventoryRequest
  ): Promise<ApiResponse<{ inventory: Inventory }>> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const inventories: Inventory[] = stored ? JSON.parse(stored) : [];
      
      const newInventory = createInventoryItem(data);
      inventories.push(newInventory);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
      
      return {
        success: true,
        data: { inventory: newInventory },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create inventory',
      };
    }
  },

  /**
   * Update an existing inventory item
   */
  async updateInventory(
    id: string,
    data: UpdateInventoryRequest
  ): Promise<ApiResponse<{ inventory: Inventory }>> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const inventories: Inventory[] = stored ? JSON.parse(stored) : [];
      
      const index = inventories.findIndex(item => item.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Inventory not found',
        };
      }
      
      inventories[index] = {
        ...inventories[index],
        ...data,
        updatedAt: new Date(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
      
      return {
        success: true,
        data: { inventory: inventories[index] },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update inventory',
      };
    }
  },

  /**
   * Delete an inventory item
   */
  async deleteInventory(id: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const inventories: Inventory[] = stored ? JSON.parse(stored) : [];
      
      const filteredInventories = inventories.filter(item => item.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredInventories));
      
      return {
        success: true,
        data: { success: true },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete inventory',
      };
    }
  },

  /**
   * Publish an inventory item (requires seller to be enabled)
   * This makes the listing publicly available for purchase
   */
  async publishInventory(id: string): Promise<ApiResponse<PublishInventoryResponse>> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const inventories: Inventory[] = stored ? JSON.parse(stored) : [];
      
      const index = inventories.findIndex(item => item.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Inventory not found',
        };
      }
      
      inventories[index] = {
        ...inventories[index],
        status: 'active',
        updatedAt: new Date(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
      
      return {
        success: true,
        data: { 
          inventory: inventories[index],
          message: 'Inventory published successfully',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to publish inventory',
      };
    }
  },

  /**
   * Unpublish an inventory item (set to inactive)
   */
  async unpublishInventory(id: string): Promise<ApiResponse<{ inventory: Inventory }>> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const inventories: Inventory[] = stored ? JSON.parse(stored) : [];
      
      const index = inventories.findIndex(item => item.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Inventory not found',
        };
      }
      
      inventories[index] = {
        ...inventories[index],
        status: 'draft',
        updatedAt: new Date(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
      
      return {
        success: true,
        data: { inventory: inventories[index] },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to unpublish inventory',
      };
    }
  },

  /**
   * Get a public inventory item by its slug
   */
  async getInventoryBySlug(
    slug: string
  ): Promise<ApiResponse<{ inventory: Inventory }>> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const inventories: Inventory[] = stored ? JSON.parse(stored) : [];
      
      const inventory = inventories.find(item => item.publicSlug === slug && item.status === 'active');
      
      if (!inventory) {
        return {
          success: false,
          error: 'Inventory not found',
        };
      }
      
      return {
        success: true,
        data: { inventory },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get inventory',
      };
    }
  },
};
