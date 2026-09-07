import { apiRequest } from './api';

export const adminService = {
  // Analytics / dashboard
  getMetrics: () => apiRequest('/admin/analytics'),

  // Users
  getUsers: () => apiRequest('/admin/users'),
  updateUserStatus: (userId, accountStatus) =>
    apiRequest(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ accountStatus }),
    }),
  deleteUser: (userId) =>
    apiRequest(`/admin/users/${userId}`, { method: 'DELETE' }),

  // Vendors
  getVendors: () => apiRequest('/admin/vendors'),
  updateVendorApproval: (vendorId, approvalStatus) =>
    apiRequest(`/admin/vendors/${vendorId}/approval`, {
      method: 'PATCH',
      body: JSON.stringify({ approvalStatus }),
    }),
};
