import { apiRequest } from './api';

export const authService = {
  login: async ({ email, password, role = 'customer' }) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    return response;
  },

  register: async ({ name, email, password, role = 'customer', phone = '', address = '' }) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone, role, address }),
    });
    return response;
  },

  getProfile: async () => apiRequest('/auth/me'),

  requestPasswordReset: async (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  resetPassword: async ({ token, password }) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  }),

  verifyEmail: async (token) => apiRequest('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),
};
