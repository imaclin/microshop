import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StripeAccount, SellerStatus } from '../types';
import { storage } from '../utils/storage';

interface StripeState {
  stripeAccount: StripeAccount | null;
  isLoading: boolean;
  error: string | null;

  setStripeAccount: (account: StripeAccount | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateStripeAccount: (updates: Partial<StripeAccount>) => void;
  getSellerStatus: () => SellerStatus;
  isSellerEnabled: () => boolean;
  clearStripeAccount: () => void;
}

export const useStripeStore = create<StripeState>()(
  persist(
    (set, get) => ({
      stripeAccount: null,
      isLoading: false,
      error: null,

      setStripeAccount: (stripeAccount) => set({ stripeAccount, error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      updateStripeAccount: (updates) =>
        set((state) => ({
          stripeAccount: state.stripeAccount
            ? { ...state.stripeAccount, ...updates }
            : null,
        })),

      getSellerStatus: (): SellerStatus => {
        const { stripeAccount } = get();
        
        if (!stripeAccount) {
          return 'not_started';
        }

        if (stripeAccount.chargesEnabled && stripeAccount.payoutsEnabled) {
          return 'active';
        }

        return 'incomplete';
      },

      isSellerEnabled: (): boolean => {
        const { stripeAccount } = get();
        return !!(
          stripeAccount?.chargesEnabled && 
          stripeAccount?.payoutsEnabled
        );
      },

      clearStripeAccount: () => set({ stripeAccount: null, error: null }),
    }),
    {
      name: 'stripe-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        stripeAccount: state.stripeAccount,
      }),
    }
  )
);
