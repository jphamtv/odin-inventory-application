// models/category.js
const db = require('./db');

export async function getAll() {
  const { rows } = await db.query('SELECT * FROM categories');
  return rows;
}

