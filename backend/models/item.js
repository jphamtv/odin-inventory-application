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

async function insertNew({ artist, title, label, year, quantity, price, category_id }) {
  const { rows } = await db.query(`
    INSERT INTO items (artist, title, label, year, quantity, price, category_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `, [artist, title, label, year, quantity, price, category_id]
  );
  return rows[0];
}

async function updateById(id, { artist, title, label, year, quantity, price, category_id }) {
  const { rows } = await db.query(`
    UPDATE items SET artist = $1, title = $2, label = $3, year = $4, quantity = $5, price = $6, category_id = $7
    WHERE id = $8
    RETURNING *
    `, [artist, title, label, year, quantity, price, category_id, id]
  );
  return rows[0] || null;
}

async function adjustQuantity(id, adjustment) {
  const { rows } = await db.query(`
    UPDATE items
    SET quantity = GREATEST(quantity + $1, 0)
    WHERE id = $2
    RETURNING *
    `, [adjustment, id]
  );
  return rows[0] || null;
}

async function updatePrice(id, newPrice) {
  const { rows } = await db.query(`
    UPDATE items
    SET price = $1
    WHERE id = $2
    RETURNING *
    `, [newPrice, id]
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
  adjustQuantity,
  updatePrice,
  deleteById,
};
