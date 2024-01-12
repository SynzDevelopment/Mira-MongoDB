const { SlashCommandBuilder } = require('discord.js');
const guildData = require('../../schemas/guildSchema.js');
require('dotenv').config(); // Load environment variables from .env

module.exports = {
  data: new SlashCommandBuilder()
    .setName('updateguilds')
    .setDescription('Updates or creates guild profiles in the database'),

  async execute(interaction) {
    try {
      // Check if the user executing the command is the owner
      const OWNER_ID = process.env.OWNER_ID;
      if (interaction.user.id !== OWNER_ID) {
        interaction.reply('You do not have permission to run this command.');
        return;
      }

      await interaction.deferReply(); // Acknowledge the command immediately

      await interaction.client.guilds.fetch(); // Fetch the latest guild information
      const guilds = interaction.client.guilds.cache;

      for (const guild of guilds.values()) {
        // Check if the guild profile exists in the database
        let guildProfile = await guildData.findOne({ guildId: guild.id });

        if (!guildProfile) {
          // Guild profile doesn't exist, create a new one
          console.log('Creating a new profile for the guild...');

          guildProfile = new guildData({
            ownerId: guild.ownerId,
            guildId: guild.id,
            guildName: guild.name,
            verification: false,
            channels: [],
            roles: [],
          });

          await guildProfile.save();
        }

        // Update channels
        const allChannels = await guild.channels.fetch();
        allChannels.forEach((channel) => {
          if (channel.type === 0) {
            guildProfile.channels.push({
              channel: channel.name,
              channelId: channel.id,
            });
          }
        });

        // Update roles
        const allRoles = guild.roles.cache;
        allRoles.forEach((role) => {
          guildProfile.roles.push({
            role: role.name,
            roleId: role.id,
          });
        });

        // Save the updated guild profile
        await guildProfile.save();
      }

      console.log('Guilds updated successfully.');
      interaction.editReply('Guilds updated successfully.');
    } catch (error) {
      console.error(`Error updating guilds: ${error}`);
      interaction.editReply('An error occurred while updating guilds.');
    }
  },
};