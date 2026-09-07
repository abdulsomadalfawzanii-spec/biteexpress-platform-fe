import { apiRequest } from './api';

export const restaurantService = {
  // Get all restaurants for customers
  getRestaurants: async (params = {}) => {
    const query = new URLSearchParams();

    if (params.search) {
      query.append('search', params.search);
    }

    if (params.category && params.category !== 'All') {
      query.append('category', params.category);
    }

    if (params.sort) {
      query.append('sort', params.sort);
    }

    const queryString = query.toString();

    const response = await apiRequest(
      `/customer/restaurants${queryString ? `?${queryString}` : ''}`
    );

    // Support different backend response formats
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.restaurants)) {
      return response.restaurants;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    return [];
  },

  // Get one restaurant and its menu
  getById: async (restaurantId) => {
    if (!restaurantId) {
      throw new Error('Restaurant ID is required.');
    }

    const response = await apiRequest(
      `/customer/restaurants/${restaurantId}`
    );

    // Support different backend response formats
    if (response?.restaurant) {
      return response.restaurant;
    }

    if (response?.data?.restaurant) {
      return response.data.restaurant;
    }

    if (response?.data) {
      return response.data;
    }

    return response;
  },
};