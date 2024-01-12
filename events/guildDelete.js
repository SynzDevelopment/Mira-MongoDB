const { Events } = require('discord.js');
const guildData = require('../schemas/guildSchema.js');

module.exports = {
  name: Events.GuildDelete,
  once: false,
  async execute(guild) {
    try {
      console.log(`Bot removed from guild: ${guild.name} (${guild.id})`);

      // Find and remove the guild profile
      await guildData.findOneAndDelete({
        id: guild.id
      });

      console.log('Guild profile removed successfully.');

      // You can perform additional actions here if needed
    } catch (error) {
      console.error(`Error handling guild delete event: ${error}`);
    }
  },
};