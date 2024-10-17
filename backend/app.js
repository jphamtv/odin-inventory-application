// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic routing for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Vinyl Inventory Management API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
