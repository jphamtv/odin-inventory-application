// controllers/categoryController.js
const Category = require('../models/category');

async function getAllCategories(req, res) {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getCategoryById(req, res) {
  try {
    const categoryId = req.params.id;
    const category = await Category.getById(categoryId);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error('Error fetching category: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    const newCategory = await Category.insertNew({ name, description });
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateCategory(req, res) {
  try {
    const categoryId = req.params.id;    
    const { name, description } = req.body;
    const updatedCategory = await Category.updateById(categoryId, { name, description });
    if (updatedCategory) {
      res.json({ message: 'Category updated successfully', category: updatedCategory });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error('Error updating category: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteCategory(req, res) {
  try {
    const categoryId = req.params.id; 
    const deleted = await Category.deleteById(categoryId); // deleted is boolean value
    if (deleted) {
      res.json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error('Error deleting category: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
