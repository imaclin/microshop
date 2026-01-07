// API Configuration
// In production, this should be your backend server URL
// For development, you can use a local server or mock endpoints

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  PLATFORM_FEE_PERCENT: 0.05, // 5% platform fee
};

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  
  // Stripe Connect
  STRIPE: {
    CREATE_ACCOUNT: '/stripe/connect/create-account',
    ACCOUNT_LINK: '/stripe/connect/account-link',
    ACCOUNT_STATUS: '/stripe/connect/account-status',
    WEBHOOK: '/stripe/webhook',
  },
  
  // Inventory
  INVENTORY: {
    LIST: '/inventory',
    CREATE: '/inventory',
    UPDATE: (id: string) => `/inventory/${id}`,
    DELETE: (id: string) => `/inventory/${id}`,
    PUBLISH: (id: string) => `/inventory/${id}/publish`,
    UNPUBLISH: (id: string) => `/inventory/${id}/unpublish`,
    BY_SLUG: (slug: string) => `/inventory/public/${slug}`,
  },
  
  // Checkout
  CHECKOUT: {
    CREATE_SESSION: '/checkout/create-session',
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
  },
};
