// Theme Types
export interface LiquidGlassTheme {
  glass: {
    blur: number;
    transparency: number;
    borderOpacity: number;
    shadowOpacity: number;
  };
  colors: {
    glassBackground: string;
    glassBorder: string;
    glassShadow: string;
    glassHighlight: string;
  };
  animations: {
    shimmer: boolean;
    ripple: boolean;
    morphing: boolean;
    fluid: boolean;
  };
}

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    accent: string;
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      mono: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeight: {
      light: string;
      normal: string;
      medium: string;
      bold: string;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Stripe Connect Types
export interface StripeAccount {
  userId: string;
  stripeAccountId: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirements?: StripeAccountRequirements;
  updatedAt: Date;
}

export interface StripeAccountRequirements {
  currentlyDue: string[];
  eventuallyDue: string[];
  pastDue: string[];
  pendingVerification: string[];
  disabledReason?: string;
}

export type SellerStatus = 'not_started' | 'incomplete' | 'active';

// Inventory/Listing Types
export type InventoryStatus = 'draft' | 'active' | 'sold_out' | 'inactive';

export interface Inventory {
  id: string;
  userId: string;
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  quantityAvailable: number;
  status: InventoryStatus;
  publicSlug: string;
  images: string[];
  category?: string;
  condition?: string;
  size?: string;
  weight?: string;
  shippingCostCents?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export type OrderStatus = 'created' | 'paid' | 'failed' | 'refunded' | 'disputed';

export interface Order {
  id: string;
  inventoryId: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string;
  sellerStripeAccountId: string;
  amountTotalCents: number;
  currency: string;
  status: OrderStatus;
  buyerEmail?: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Legacy Product Types (for backwards compatibility)
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  shareLink: string;
  publicSlug?: string;
  category?: string;
  status?: InventoryStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Checkout Types
export interface CheckoutSession {
  sessionId: string;
  url: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AccountLinkResponse {
  url: string;
  expiresAt: number;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  PublicProduct: { slug: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  OrdersTab: undefined;
  CreateOrderTab: undefined;
  InventoryTab: undefined;
  ProfileTab: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  PublicProfile: undefined;
  SellerOnboarding: undefined;
  SellerOnboardingFlow: undefined;
  SellerDashboard: undefined;
};

export type InventoryStackParamList = {
  InventoryList: undefined;
  CreateInventory: undefined;
  EditInventory: { inventoryId: string };
  InventoryDetail: { inventoryId: string };
};
