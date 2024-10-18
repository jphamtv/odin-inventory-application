// models/category.js
const db = require('./db');

async function getAll() {
  const { rows } = await db.query('SELECT * FROM categories');
  return rows;
}

async function getById(id) {
  const { rows } = await db.query('SELECT * FROM categories WHERE id=$1', [id]);
  return rows[0] || null;
}

async function insertNew({ name, description }) {
  const { rows } = await db.query(
    'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return rows[0];
}

async function updateById(id, { name, description }) {
  const { rows } = await db.query(
    'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  return rows[0] || null;
}

async function deleteById(id) {
  const { rowCount } = await db.query(
    'DELETE FROM categories WHERE id=$1',
    [id]
  );
  return rowCount > 0; // Return true if a row was deleted, false otherwise
}

module.exports = {
  getAll,
  getById,
  insertNew,
  updateById,
  deleteById,
};
