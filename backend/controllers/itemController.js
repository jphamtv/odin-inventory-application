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
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('category_id') 
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('img_url')
    .optional({ nullable: true })
    .if((value) => value !== null && value !== '')
    .isURL().withMessage('Image URL must be a valid URL'),
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
    const id = req.params.id;
    const item = await Item.getById(id);
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

async function getItemsByCategory(req, res) {
  try {
    const category_id = req.params.id;
    const items = await Item.getByCategory(category_id);
    // Return empty array instead of 404 when no items found
    res.json(items || []);
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

      const { artist, title, label, year, quantity, price, category_id, img_url } = req.body;
      const newItem = await Item.insertNew({ artist, title, label, year, quantity, price, category_id, img_url });
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

      const id = req.params.id;    
      const { artist, title, label, year, quantity, price, category_id, img_url } = req.body;
      const updatedItem = await Item.updateById(id, { artist, title, label, year, quantity, price, category_id, img_url });
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

async function reassignCategoryItems(req, res) {
  try {
    const old_category_id = req.params.oldCategoryId; // <-- verify this
    const { new_category_id } = req.body;
    console.log('Req Body:', req.body);
    console.log('Reassigning items:', { old_category_id, new_category_id });
    
    const updatedCount = await Item.updateItemsCategory(old_category_id, new_category_id);
    console.log('Updated items count:', updatedCount);
    
    res.json({ 
      message: 'Items reassigned successfully', 
      updatedCount 
    });
  } catch (error) {
    console.error('Error reassigning items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function adjustItemQuantity(req, res) {
  try {
    const id = req.params.id;
    const { adjustment } = req.body;
    const updatedItem = await Item.adjustQuantity(id, adjustment);
    if (updatedItem) {
      res.json({ message: 'Item quantity adjusted successfully', item: updatedItem });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error adjusting item quantity: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateItemPrice(req, res) {
  try {
    const id = req.params.id;
    const { price } = req.body;
    const updatedItem = await Item.updatePrice(id, price);
    if (updatedItem) {
      res.json({ message: 'Item price updated successfully', item: updatedItem });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Error updating item price: ', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteItem(req, res) {
  try {
    const id = req.params.id; 
    const deleted = await Item.deleteById(id); // deleted is boolean value
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
  getItemsByCategory,
  createItem,
  updateItem,
  reassignCategoryItems,
  adjustItemQuantity,
  updateItemPrice,
  deleteItem,
};
