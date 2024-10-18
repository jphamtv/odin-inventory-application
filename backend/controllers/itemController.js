// controllers/itemController.js
const Item = require('../models/item');

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.getAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
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
};

exports.createItem = async (req, res) => {
  try {
    const { artist, title, label, year, genre } = req.body;
    const newItem = await Item.insertNew({ artist, title, label, year, genre });
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// CONTINUE HERE

exports.updateItem = async (req, res) => {
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
};

exports.deleteItem = async (req, res) => {
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
};
