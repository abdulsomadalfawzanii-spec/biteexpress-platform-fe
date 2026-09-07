import { apiRequest } from './api';

export const vendorService = {
  // Profile
  getProfile: () => apiRequest('/vendor/profile'),
  updateProfile: (payload) =>
    apiRequest('/vendor/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  // Menu
  getMenu: () => apiRequest('/vendor/menu'),
  createMenuItem: (payload) =>
    apiRequest('/vendor/menu', { method: 'POST', body: JSON.stringify(payload) }),
  updateMenuItem: (itemId, payload) =>
    apiRequest(`/vendor/menu/${itemId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteMenuItem: (itemId) =>
    apiRequest(`/vendor/menu/${itemId}`, { method: 'DELETE' }),

  // Orders
  getOrders: () => apiRequest('/vendor/orders'),
  updateOrderStatus: (orderId, status) =>
    apiRequest(`/vendor/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Analytics
  getAnalytics: () => apiRequest('/vendor/analytics'),

  // Notifications
  getNotifications: () => apiRequest('/vendor/notifications'),
};
