// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper to handle response and errors consistently
async function handleResponse(response) {
  if (!response.ok) {
    // Get error message from server or use default
    const error = await response.json().catch(() => ({
      message: 'An error occurred'
    }));
    throw new Error(error.message);
  }
  return response.json();
}

// Basic fetch wrapper with common configuration
async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  return handleResponse(response);
}

// API methods
export const api = {
  // Categories
  async getCategories() {
    return fetchApi('/categories');
  },

  async getCategory(id) {
    return fetchApi(`/categories/${id}`);
  },

  async createCategory(data) {
    return fetchApi('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateCategory(id, data) {
    return fetchApi(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteCategory(id) {
    return fetchApi(`/categories/${id}`, {
      method: 'DELETE'
    });
  },

  // Items
  async getItems() {
    return fetchApi('/items');
  },

  async getItem(id) {
    return fetchApi(`/items/${id}`);
  },

  async getItemsByCategory(categoryId) {
    return fetchApi(`/items/category/${categoryId}`);
  },

  async createItem(data) {
    return fetchApi('/items', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateItem(id, data) {
    return fetchApi(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async adjustItemQuantity(id, adjustment) {
    return fetchApi(`/items/${id}/quantity`, {
      method: 'PATCH',
      body: JSON.stringify({ adjustment })
    });
  },

  async updateItemPrice(id, price) {
    return fetchApi(`/items/${id}/price`, {
      method: 'PATCH',
      body: JSON.stringify({ price })
    });
  },

  async deleteItem(id) {
    return fetchApi(`/items/${id}`, {
      method: 'DELETE'
    });
  }
};
