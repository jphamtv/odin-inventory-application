// models/item.js
const db = require('./db');

async function getAll() {
  const { rows } = await db.query(`
    SELECT i.*, c.name as genre
    FROM items i
    JOIN categories c ON i.category_id = c.id
  `);
  return rows;
}

async function getById(id) {
  const { rows } = await db.query(`
    SELECT i.*, c.name as genre 
    FROM items i 
    JOIN categories c ON i.category_id = c.id
    WHERE i.id=$1
    `, [id]);
  return rows[0] || null;
}

async function getByCategory(categoryId) {
  const { rows } = await db.query(`
    SELECT i.*, c.name as genre 
    FROM items i
    JOIN categories c ON i.category_id = c.id
    WHERE i.category_id=$1
    `, [categoryId]);
  return rows || null;
}

async function insertNew({ artist, title, label, year, category_id }) {
  const { rows } = await db.query(`
    INSERT INTO items (artist, title, label, year, category_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, [artist, title, label, year, category_id]
  );
  return rows[0];
}

async function updateById(id, { artist, title, label, year, category_id }) {
  const { rows } = await db.query(`
    UPDATE items SET artist = $1, title = $2, label = $3, year = $4, category_id = $5
    WHERE id = $6
    RETURNING *
    `, [artist, title, label, year, category_id, id]
  );
  return rows[0] || null;
}

async function deleteById(id) {
  const { rowCount } = await db.query(
    'DELETE FROM items WHERE id=$1',
    [id]
  );
  return rowCount > 0; // Return true if a row was deleted, false otherwise
}

module.exports = {
  getAll,
  getById,
  getByCategory,
  insertNew,
  updateById,
  deleteById,
};
