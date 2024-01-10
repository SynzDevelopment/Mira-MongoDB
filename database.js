require('dotenv').config();
const mariadb = require('mariadb');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env();

const pool = mariadb.createPool({
  host: DB_HOST, 
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  connectionLimit: 10,
});

async function executeQuery(query, values) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(query, values);
    return [result, null];
  } catch (error) {
    return [null, error];
  } finally {
    if (conn) conn.release();
  }
}

module.exports = {
  executeQuery,
};