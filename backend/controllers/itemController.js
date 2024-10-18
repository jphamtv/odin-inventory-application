// controllers/itemController.js
const Item = require('../models/item');

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

async function createItem(req, res) {
  try {
    const { artist, title, label, year, genre } = req.body;
    const newItem = await Item.insertNew({ artist, title, label, year, genre });
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateItem(req, res) {
  try {
    const itemId = req.params.id;    
    const { artist, title, label, year, genre } = req.body;
    const updatedItem = await Item.updateById(itemId, { artist, title, label, year, genre });
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
