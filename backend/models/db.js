// models/db.js
const { Pool, types } = require('pg');
require('dotenv').config();

types.setTypeParser(types.builtins.NUMERIC, value => parseFloat(value));

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL
});
