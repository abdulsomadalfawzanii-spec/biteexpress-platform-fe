import { apiRequest } from './api';

export const orderService = {
  create: async (payload) => {
    if (!payload) {
      throw new Error(
        'Order payload is required.'
      );
    }

    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  listForCustomer: () =>
    apiRequest('/orders/my-orders'),

  getById: (orderId) =>
    apiRequest(
      `/orders/${orderId}`
    ),

  updateStatus: (
    orderId,
    status,
    note = ''
  ) =>
    apiRequest(
      `/orders/${orderId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          note,
        }),
      }
    ),
};