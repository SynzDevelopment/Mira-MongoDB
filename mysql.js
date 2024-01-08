// mysql.js

require('dotenv').config();
const mysql = require('mysql2/promise');
const { userSchema } = require('./Schemas/userSchemas.js'); // Import the user schema

// Define the JDBC connection string
const jdbcConnectionString = process.env.JDBC_CONNECTION_STRING;

// Connection configuration using the JDBC connection string
const connectionConfig = {
  uri: jdbcConnectionString,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Add other connection options as needed
};

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    // Execute the guildSettingsSchema when connecting to the database
    await connection.query(guildSettingsSchema);

    // Execute the userSettingsSchema when connecting to the database
    await connection.query(userSettingsSchema);

    console.log('Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
    throw error;
  }
}

async function executeQuery(query, values) {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(query, values);
    connection.end();
    return [rows, null];
  } catch (error) {
    console.error(`Error executing query: ${error}`);
    return [null, error];
  }
}

module.exports = { executeQuery };