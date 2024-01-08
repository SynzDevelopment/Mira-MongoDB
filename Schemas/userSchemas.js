// userSchemas.js

const userSchema = `
  CREATE SCHEMA IF NOT EXISTS users_schema;

  CREATE TABLE IF NOT EXISTS users_schema.user_verification_data (
    user_id VARCHAR(20) PRIMARY KEY,
    guild_id VARCHAR(20),
    code VARCHAR(6)
  );
`;

module.exports = { userSchema };