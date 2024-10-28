// controllers/categoryController.js
const Category = require('../models/category');
const { body, validationResult } = require('express-validator');

const validateCategory = [
  body('name').trim()
    .isLength({ min: 1, max: 200 }).withMessage(`Name must be between 1 and 200 characters`)
    .matches(/^[a-z0-9 .,!?'-/]+$/i).withMessage('Name can only contain letters, numbers, and spaces'),
  body('description').trim()
    .optional({ nullable: true })
    .if((value) => value !== null && value !== '')
    .isLength({ max: 200 }).withMessage(`Description must not exceed 200 characters`)
    .matches(/^[a-z0-9 .,!?'-/]+$/i).withMessage('Description contains invalid characters')
    .escape()
];

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

const createCategory = [
  validateCategory,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { name, description } = req.body;
      const newCategory = await Category.insertNew({ name, description });
      res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];

const updateCategory = [
  validateCategory,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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
];

async function deleteCategory(req, res) {
  try {
    const categoryId = req.params.id; 
    const deleted = await Category.deleteById(categoryId);
    
    if (deleted) {
      res.json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error('Error deleting category: ', error);
    // More specific error message based on the error type
    if (error.code === '23503') { // Foreign key violation
      res.status(400).json({ 
        error: 'Cannot delete category while it contains items. Please move items first.' 
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
