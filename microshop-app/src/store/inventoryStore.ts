import { create } from 'zustand';
import { Inventory, InventoryStatus } from '../types';

interface InventoryState {
  inventories: Inventory[];
  myInventories: Inventory[];
  selectedInventory: Inventory | null;
  isLoading: boolean;
  error: string | null;

  setInventories: (inventories: Inventory[]) => void;
  setMyInventories: (inventories: Inventory[]) => void;
  addInventory: (inventory: Inventory) => void;
  updateInventory: (id: string, updates: Partial<Inventory>) => void;
  deleteInventory: (id: string) => void;
  setSelectedInventory: (inventory: Inventory | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  getInventoryBySlug: (slug: string) => Inventory | undefined;
  getActiveInventories: () => Inventory[];
  getDraftInventories: () => Inventory[];
  clearInventories: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventories: [],
  myInventories: [],
  selectedInventory: null,
  isLoading: false,
  error: null,

  setInventories: (inventories) => set({ inventories }),

  setMyInventories: (inventories) => set({ myInventories: inventories }),

  addInventory: (inventory) =>
    set((state) => ({
      inventories: [inventory, ...state.inventories],
      myInventories: [inventory, ...state.myInventories],
    })),

  updateInventory: (id, updates) =>
    set((state) => ({
      inventories: state.inventories.map((inv) =>
        inv.id === id ? { ...inv, ...updates, updatedAt: new Date() } : inv
      ),
      myInventories: state.myInventories.map((inv) =>
        inv.id === id ? { ...inv, ...updates, updatedAt: new Date() } : inv
      ),
      selectedInventory:
        state.selectedInventory?.id === id
          ? { ...state.selectedInventory, ...updates, updatedAt: new Date() }
          : state.selectedInventory,
    })),

  deleteInventory: (id) =>
    set((state) => ({
      inventories: state.inventories.filter((inv) => inv.id !== id),
      myInventories: state.myInventories.filter((inv) => inv.id !== id),
      selectedInventory:
        state.selectedInventory?.id === id ? null : state.selectedInventory,
    })),

  setSelectedInventory: (inventory) => set({ selectedInventory: inventory }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  getInventoryBySlug: (slug) => {
    const { inventories } = get();
    return inventories.find((inv) => inv.publicSlug === slug);
  },

  getActiveInventories: () => {
    const { inventories } = get();
    return inventories.filter((inv) => inv.status === 'active');
  },

  getDraftInventories: () => {
    const { myInventories } = get();
    return myInventories.filter((inv) => inv.status === 'draft');
  },

  clearInventories: () =>
    set({
      inventories: [],
      myInventories: [],
      selectedInventory: null,
      error: null,
    }),
}));
