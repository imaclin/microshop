# MicroShop Stripe Connect Implementation

This document explains the Stripe Connect marketplace implementation for MicroShop, which enables users to sell items through the platform with minimal liability.

## Architecture Overview

MicroShop uses **Stripe Connect Standard accounts** with:
- **Destination charges**: Funds go directly to sellers
- **Application fees**: Platform takes a percentage fee
- **Stripe-hosted onboarding**: No KYC burden on the platform
- **Two-phase user model**: Draft listings → Seller activation

## Key Features

### 🛡️ Lowest Liability Approach
- **No funds held by platform**: All payments go directly to sellers
- **Standard accounts**: Sellers manage their own payouts
- **Stripe-hosted compliance**: KYC/AML handled by Stripe
- **No platform balances**: No escrow or holding funds

### 🔄 Two-Phase User Model
1. **Platform User**: Can create draft listings
2. **Seller-Active User**: Can publish and accept payments after Stripe onboarding

### 💰 Payment Flow
1. Buyer purchases via Stripe Checkout
2. Funds go directly to seller's Stripe account
3. Platform fee automatically deducted
4. Seller handles their own payouts

## Environment Variables

### Frontend (.env)
```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000

# Stripe Configuration
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# App Configuration
EXPO_PUBLIC_APP_SCHEME=microshop
EXPO_PUBLIC_PLATFORM_FEE_PERCENT=0.05
```

### Backend (.env)
```env
# Stripe Secret Key
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App URL for redirects
APP_URL=https://your-app-url.com
```

## API Endpoints

### Stripe Connect
- `POST /api/stripe/connect/account` - Create Connect account
- `POST /api/stripe/connect/account-link` - Generate onboarding link
- `GET /api/stripe/connect/status` - Get account status

### Inventory Management
- `GET /api/inventory` - List user's inventory
- `POST /api/inventory` - Create inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `POST /api/inventory/:id/publish` - Publish listing
- `POST /api/inventory/:id/unpublish` - Unpublish listing
- `GET /api/inventory/slug/:slug` - Get public inventory by slug

### Checkout
- `POST /api/checkout/create-session` - Create Stripe Checkout session

### Webhooks
- `POST /api/webhooks/stripe` - Handle Stripe events

## Database Schema

### Users
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Stripe Accounts
```sql
stripe_accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_account_id VARCHAR UNIQUE,
  status VARCHAR, -- 'pending', 'incomplete', 'active'
  capabilities JSONB,
  requirements JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Inventory
```sql
inventory (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR,
  description TEXT,
  price_cents INTEGER,
  currency VARCHAR DEFAULT 'usd',
  quantity_available INTEGER,
  status VARCHAR, -- 'draft', 'active', 'sold_out'
  slug VARCHAR UNIQUE,
  category VARCHAR,
  condition VARCHAR,
  shipping_cost_cents INTEGER,
  images JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Orders
```sql
orders (
  id UUID PRIMARY KEY,
  inventory_id UUID REFERENCES inventory(id),
  buyer_id UUID REFERENCES users(id),
  stripe_checkout_session_id VARCHAR,
  stripe_payment_intent_id VARCHAR,
  amount_cents INTEGER,
  platform_fee_cents INTEGER,
  status VARCHAR, -- 'pending', 'paid', 'completed', 'refunded'
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Frontend Implementation

### State Management
- **stripeStore**: Manages seller status and Stripe account info
- **inventoryStore**: Manages user's inventory items
- **authStore**: Updated with seller status helpers

### Key Screens
- **SellerOnboardingScreen**: Guides users through Stripe setup
- **SellerDashboardScreen**: Overview of seller activity
- **CreateInventoryScreen**: Create new listings (seller-gated)
- **PublicProductScreen**: Public product page with checkout

### Navigation
- Seller screens added to ProfileNavigator
- PublicProduct screen added to RootNavigator

## Backend Implementation

### Stripe Connect Setup
1. Create Stripe Connect platform account
2. Configure Standard account type
3. Set up platform fee (5% default)
4. Configure webhook endpoints

### Key Services
- **Account Creation**: Create Standard accounts for sellers
- **Account Links**: Generate onboarding URLs
- **Status Monitoring**: Track account requirements
- **Checkout Sessions**: Create destination charges with fees
- **Webhook Handling**: Process payment events

## Security & Compliance

### Prohibited Items
- Implement content filtering
- Add reporting mechanisms
- Regular compliance reviews

### Data Protection
- Secure API endpoints
- Encrypted data storage
- GDPR compliance

### Financial Compliance
- AML monitoring via Stripe
- Transaction limits
- Suspicious activity reporting

## Testing

### Stripe Test Mode
1. Use test keys for development
2. Test various account statuses
3. Simulate payment flows
4. Test webhook events

### Test Scenarios
- Complete seller onboarding flow
- Create and publish listings
- Process test payments
- Handle failed payments
- Test refund flows

## Deployment

### Production Setup
1. Switch to live Stripe keys
2. Update webhook endpoints
3. Configure proper domains
4. Set up monitoring

### Monitoring
- Track conversion rates
- Monitor payment failures
- Watch webhook delivery
- Track seller onboarding

## Support

### Common Issues
- Account onboarding failures
- Payment processing errors
- Webhook delivery issues
- Account requirement updates

### Debugging
- Check Stripe Dashboard logs
- Review webhook events
- Verify API responses
- Test with Stripe CLI

## Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe Connect Standard Accounts](https://stripe.com/docs/connect/standard-accounts)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [React Native Stripe SDK](https://stripe.com/docs/stripe-js/react-native)

## Legal Considerations

- **Terms of Service**: Clearly define platform-seller relationship
- **Acceptable Use Policy**: Define prohibited items and activities
- **Privacy Policy**: Explain data handling and sharing
- **Seller Agreement**: Outline responsibilities and fees

Consult with legal counsel to ensure compliance with applicable regulations in your jurisdiction.
