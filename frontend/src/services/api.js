// src/services/api.js
import { transformToSnakeCase, transformToCamelCase } from '../utils/caseTransformer';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper to handle response and errors consistently
async function handleResponse(response) {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.errors?.[0]?.msg || data.message || 'An error occurred');
    error.status = response.status;
    error.details = data;
    throw error;
  }
  
  return transformToCamelCase(data);
}

// Basic fetch wrapper with common configuration
async function fetchApi(endpoint, options = {}) {
  try {
    if (options.body) {
      const transformedBody = transformToSnakeCase(options.body);
      options.body = JSON.stringify(transformedBody);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    return handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
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
      body: data
    });
  },

  async updateCategory(id, data) {
    return fetchApi(`/categories/${id}`, {
      method: 'PUT',
      body: data
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
      body: data
    });
  },

  async updateItem(id, data) {
    return fetchApi(`/items/${id}`, {
      method: 'PUT',
      body: data
    });
  },

  async updateItemsCategory(oldCategoryId, newCategoryId) {
    return fetchApi(`/items/category/${oldCategoryId}/reassign`, {
      method: 'PATCH',
      body: { newCategoryId }
    });
  },

  async adjustItemQuantity(id, adjustment) {
    return fetchApi(`/items/${id}/quantity`, {
      method: 'PATCH',
      body: { adjustment }
    });
  },

  async updateItemPrice(id, price) {
    return fetchApi(`/items/${id}/price`, {
      method: 'PATCH',
      body: { price }
    });
  },

  async deleteItem(id) {
    return fetchApi(`/items/${id}`, {
      method: 'DELETE'
    });
  }
};
