const db = require('./db');

async function getAll() {
  const { rows } = await db.query('SELECT * FROM categories');
  return rows;
}

async function getById(id) {

}

async function insertNew({ name, description }) {

}

async function updateById(id, { name, description }) {

}

async function deleteById(id) {

}

module.exports = {
  getAll,
  getById,
  insertNew,
  updateById,
  deleteById,
};
