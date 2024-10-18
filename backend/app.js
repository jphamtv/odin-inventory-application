// app.js
const express = require('express');
const cors = require('cors');
const categoriesRouter = require('./routes/categoriesRouter');
const itemsRouter = require('./routes/itemsRouter');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/categories', categoriesRouter);
app.use('/items', itemsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Basic routing for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Vinyl Inventory Management API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
