import { apiRequest } from './api';

export const deliveryService = {
  getAvailable: () => apiRequest('/delivery/available'),
  getMyDeliveries: () => apiRequest('/delivery/my-deliveries'),
  claimDelivery: (orderId) =>
    apiRequest(`/delivery/claim/${orderId}`, { method: 'POST' }),
  getProfile: () => apiRequest('/delivery/profile'),
  updateProfile: (payload) =>
    apiRequest('/delivery/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  getEarnings: () => apiRequest('/delivery/earnings'),
};
