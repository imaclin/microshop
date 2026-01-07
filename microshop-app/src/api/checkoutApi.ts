import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import { CheckoutSession, ApiResponse } from '../types';

export interface CreateCheckoutSessionRequest {
  inventoryId: string;
  quantity: number;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCheckoutSessionResponse {
  session: CheckoutSession;
}

export const checkoutApi = {
  /**
   * Create a Stripe Checkout session for purchasing an inventory item
   * Uses destination charges with application_fee_amount
   * Funds go directly to seller's connected account
   */
  async createCheckoutSession(
    data: CreateCheckoutSessionRequest
  ): Promise<ApiResponse<CreateCheckoutSessionResponse>> {
    return apiClient.post<CreateCheckoutSessionResponse>(
      API_ENDPOINTS.CHECKOUT.CREATE_SESSION,
      data
    );
  },
};
