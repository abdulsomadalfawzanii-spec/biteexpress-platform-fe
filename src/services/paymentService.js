import { apiRequest } from './api';

export const paymentService = {
  createCheckoutSession: async ({ amount, orderId }) => apiRequest('/payments/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ amount, orderId }),
  }),
};
