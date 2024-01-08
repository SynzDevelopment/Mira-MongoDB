// guildSchemas.js

const guildSettingsSchema = `
  CREATE SCHEMA IF NOT EXISTS guilds_schema;

  CREATE TABLE IF NOT EXISTS guilds_schema.guild_settings (
    guild_id VARCHAR(20) PRIMARY KEY,
    selection_one VARCHAR(255),
    selection_two VARCHAR(255)
    // Add more columns for additional selections or settings
  );
`;

module.exports = { guildSettingsSchema };