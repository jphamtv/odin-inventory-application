// controllers/itemController.js
const Item = require('../models/item');
const { body, validationResult } = require('express-validator');

const lengthErr = 'must be between 1 and 200 characters'
const matchErr = 'contains invalid characters'

const validateItem = [
  body('artist').trim()
    .isLength({ min: 1, max: 200 }).withMessage(`Artist name ${lengthErr}`)
    .matches(/^[a-zA-Z0-9 .,!?'&-]+$/i).withMessage(`Artist name ${matchErr}`),
  body('title').trim()
    .isLength({ min: 1, max: 200 }).withMessage(`Title ${lengthErr}`)
    .matches(/^[a-zA-Z0-9 .,!?'&-]+$/i).withMessage(`Title ${matchErr}`),
  body('label').trim()
    .isLength({ min: 1, max: 200 }).withMessage(`Label ${lengthErr}`)
    .matches(/^[a-zA-Z0-9 .,!?'&-]+$/i).withMessage(`Label ${matchErr}`),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Year must be a 4-digit number between 1900 and the current year`),
];

async function getAllItems(req, res) {
  try {
    const items = await Item.getAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getItemById(req, res) {
  try {
    const itemId = req.params.id;
    const item = await Item.getById(itemId);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error fetching item: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getItemsByCategoryId(req, res) {
  try {
    const categoryId = req.params.id;
    const items = await Item.getByCategoryId(categoryId);
    if (items && items.length > 0) {
      res.json(items);
    } else {
      res.status(404).json({ message: 'No items found for this category' });
    }
  } catch (error) {
    console.error('Error fetching items by category: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const createItem = [
  validateItem,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { artist, title, label, year, category_id } = req.body;
      const newItem = await Item.insertNew({ artist, title, label, year, category_id });
      res.status(201).json({ message: 'Item created successfully', item: newItem });
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];

const updateItem = [
  validateItem,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const itemId = req.params.id;    
      const { artist, title, label, year, category_id } = req.body;
      const updatedItem = await Item.updateById(itemId, { artist, title, label, year, category_id });
      if (updatedItem) {
        res.json({ message: 'Item updated successfully', item: updatedItem });
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      console.error('Error updating item: ', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
];

async function deleteItem(req, res) {
  try {
    const itemId = req.params.id; 
    const deleted = await Item.deleteById(itemId); // deleted is boolean value
    if (deleted) {
      res.json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllItems,
  getItemById,
  getItemsByCategoryId,
  createItem,
  updateItem,
  deleteItem,
};
