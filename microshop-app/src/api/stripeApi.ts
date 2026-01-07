import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import { StripeAccount, AccountLinkResponse, ApiResponse } from '../types';

export interface CreateAccountResponse {
  stripeAccountId: string;
  account: StripeAccount;
}

export interface AccountStatusResponse {
  account: StripeAccount;
}

export const stripeApi = {
  /**
   * Create a new Stripe Connect Standard account for the user
   */
  async createConnectAccount(): Promise<ApiResponse<CreateAccountResponse>> {
    return apiClient.post<CreateAccountResponse>(API_ENDPOINTS.STRIPE.CREATE_ACCOUNT);
  },

  /**
   * Get an account link for Stripe Connect onboarding
   * This redirects the user to Stripe's hosted onboarding flow
   */
  async getAccountLink(
    refreshUrl: string,
    returnUrl: string
  ): Promise<ApiResponse<AccountLinkResponse>> {
    return apiClient.post<AccountLinkResponse>(API_ENDPOINTS.STRIPE.ACCOUNT_LINK, {
      refreshUrl,
      returnUrl,
    });
  },

  /**
   * Get the current status of the user's Stripe Connect account
   */
  async getAccountStatus(): Promise<ApiResponse<AccountStatusResponse>> {
    return apiClient.get<AccountStatusResponse>(API_ENDPOINTS.STRIPE.ACCOUNT_STATUS);
  },
};
