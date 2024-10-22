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
    await makeRequest('get', `${BASE_URL}/api/categories`);

    // Test POST new category
    const newCategory = await makeRequest('post', `${BASE_URL}/api/categories`, {
      name: 'Test Category',
      description: 'This is a test category'
    });

    const categoryId = newCategory.category.id;

    // Test GET category by ID
    await makeRequest('get', `${BASE_URL}/api/categories/${categoryId}`);

    // Test PUT update category
    await makeRequest('put', `${BASE_URL}/api/categories/${categoryId}`, {
      name: 'Updated Test Category',
      description: 'This category has been updated'
    });

    // Test DELETE category
    await makeRequest('delete', `${BASE_URL}/api/categories/${categoryId}`);

    console.log('All category tests completed successfully!');
  } catch (error) {
    console.error('Error during category tests:', error.message);
  }
}

async function testItems() {
  console.log('\nTesting Items...');
  
  try {
    // First create a category for our test items
    const categoryResponse = await makeRequest('post', `${BASE_URL}/api/categories`, {
      name: 'Test Genre',
      description: 'Test Genre Description'
    });
    const categoryId = categoryResponse.category.id;

    // Test GET all items
    await makeRequest('get', `${BASE_URL}/api/items`);

    // Test POST new item with camelCase
    const newItem = await makeRequest('post', `${BASE_URL}/api/items`, {
      artist: 'Test Artist',
      title: 'Test Album',
      label: 'Test Label',
      year: 2024,
      quantity: 10,
      price: 19.99,
      categoryId: categoryId,
      imgUrl: 'https://example.com/test.jpg'
    });

    console.log('Checking response for camelCase properties...');
    const hasCorrectCasing = newItem.item.categoryId !== undefined && newItem.item.imgUrl !== undefined;
    console.log('CamelCase properties present:', hasCorrectCasing);

    const itemId = newItem.item.id;

    // Test GET item by ID
    const getResponse = await makeRequest('get', `${BASE_URL}/api/items/${itemId}`);
    console.log('GET response has camelCase:', 
      getResponse.categoryId !== undefined && 
      getResponse.imgUrl !== undefined
    );

    // Test GET items by category
    await makeRequest('get', `${BASE_URL}/api/items/category/${categoryId}`);

    // Test PUT update item
    await makeRequest('put', `${BASE_URL}/api/items/${itemId}`, {
      artist: 'Updated Test Artist',
      title: 'Updated Test Album',
      label: 'Updated Test Label',
      year: 2024,
      quantity: 15,
      price: 24.99,
      categoryId: categoryId,
      imgUrl: 'https://example.com/updated.jpg'
    });

    // Test PATCH adjust item quantity
    await makeRequest('patch', `${BASE_URL}/api/items/${itemId}/quantity`, {
      adjustment: 5
    });

    // Test PATCH update item price
    await makeRequest('patch', `${BASE_URL}/api/items/${itemId}/price`, {
      price: 29.99
    });

    // Test DELETE item
    await makeRequest('delete', `${BASE_URL}/api/items/${itemId}`);

    // Clean up test category
    await makeRequest('delete', `${BASE_URL}/api/categories/${categoryId}`);

    console.log('All item tests completed successfully!');
  } catch (error) {
    console.error('Error during item tests:', error.message);
  }
}

async function runTests() {
  console.log('Starting API tests...');
  console.log('Testing with case transformations...');
  
  try {
    await testCategories();
    await testItems();
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('\nError during tests:', error.message);
  }
}

runTests();
