// test.js
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function makeRequest(method, url, data = null) {
  try {
    const response = await axios({ method, url, data });
    console.log(`${method.toUpperCase()} ${url} - Success:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`${method.toUpperCase()} ${url} - Error:`, error.response ? error.response.data : error.message);
    throw error;
  }
}

async function testCategories() {
  console.log('\nTesting Categories...');
  
  try {
    // Test GET all categories
    await makeRequest('get', `${BASE_URL}/categories`);

    // Test POST new category
    const newCategory = await makeRequest('post', `${BASE_URL}/categories`, {
      name: 'Test Category',
      description: 'This is a test category'
    });

    const categoryId = newCategory.category.id;

    // Test GET category by ID
    await makeRequest('get', `${BASE_URL}/categories/${categoryId}`);

    // Test PUT update category
    await makeRequest('put', `${BASE_URL}/categories/${categoryId}`, {
      name: 'Updated Test Category',
      description: 'This category has been updated'
    });

    // Test DELETE category
    await makeRequest('delete', `${BASE_URL}/categories/${categoryId}`);

    console.log('All category tests completed successfully!');
  } catch (error) {
    console.error('Error during category tests:', error.message);
  }
}

async function testItems() {
  console.log('\nTesting Items...');
  
  try {
    // Test GET all items
    await makeRequest('get', `${BASE_URL}/items`);

    // Test POST new item
    const newItem = await makeRequest('post', `${BASE_URL}/items`, {
      artist: 'Test Artist',
      title: 'Test Album',
      label: 'Test Label',
      year: 2023,
      quantity: 10,
      price: 19.99,
      category_id: 1  // Make sure this category exists in your database
    });

    const itemId = newItem.item.id;

    // Test GET item by ID
    await makeRequest('get', `${BASE_URL}/items/${itemId}`);

    // Test PUT update item
    await makeRequest('put', `${BASE_URL}/items/${itemId}`, {
      artist: 'Updated Test Artist',
      title: 'Updated Test Album',
      label: 'Updated Test Label',
      year: 2024,
      quantity: 15,
      price: 24.99,
      category_id: 1
    });

    // Test PATCH adjust item quantity
    await makeRequest('patch', `${BASE_URL}/items/${itemId}/quantity`, {
      adjustment: 5
    });

    // Test PATCH update item price
    await makeRequest('patch', `${BASE_URL}/items/${itemId}/price`, {
      price: 29.99
    });

    // Test DELETE item
    await makeRequest('delete', `${BASE_URL}/items/${itemId}`);

    console.log('All item tests completed successfully!');
  } catch (error) {
    console.error('Error during item tests:', error.message);
  }
}

async function runTests() {
  try {
    await testCategories();
    await testItems();
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('\nError during tests:', error.message);
  }
}

runTests();