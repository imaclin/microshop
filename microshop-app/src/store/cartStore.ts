import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Address } from '../types';
import { storage } from '../utils/storage';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  shippingAddress: Address | null;
  selectedPaymentMethod: string | null;

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setShippingAddress: (address: Address) => void;
  setPaymentMethod: (methodId: string) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingAddress: null,
      selectedPaymentMethod: null,

      addItem: (product) => set((state) => {
        const existingItem = state.items.find(
          (item) => item.product.id === product.id
        );
        if (existingItem) {
          return {
            items: state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        return { items: [...state.items, { product, quantity: 1 }] };
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.product.id !== productId),
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: quantity > 0
          ? state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            )
          : state.items.filter((item) => item.product.id !== productId),
      })),

      clearCart: () => set({ items: [] }),

      setShippingAddress: (address) => set({ shippingAddress: address }),

      setPaymentMethod: (methodId) => set({ selectedPaymentMethod: methodId }),

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
