const { SlashCommandBuilder } = require('discord.js');
const { OWNER_ID } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('devlog')
    .setDescription('Add development log.')
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('Title of the development log.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('log')
        .setDescription('Content of the development log.')
        .setRequired(true),
    ),
  async execute(interaction) {
    // Check if the user executing the command is the owner
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
    }

    // The command logic for the owner
    try {
      // Get the values of title and log from the options
      const title = interaction.options.getString('title');
      const log = interaction.options.getString('log');

      // Create an embed with classic Discord color
      const embed = {
        color: 0x5865F2, // Discord's classic color
        title,
        description: log,
        timestamp: new Date(),
        footer: {
          text: `Mira Bot Â© Synz ${new Date().getFullYear()} | Timestamp:`,
        },
      };

      // Get the specified channel by ID
      const targetChannelId = '1193404504461295626'; // Replace with your target channel ID
      const targetChannel = interaction.guild.channels.cache.get(targetChannelId);

      if (!targetChannel || targetChannel.type !== 'text') {
        console.error(`Target channel (${targetChannelId}) not found or not a text channel.`);
        return interaction.reply({ content: 'Development log channel not found or invalid.', ephemeral: true });
      }

      // Get the specified role by ID
      const targetRoleId = '1194550697027436574'; // Replace with your target role ID
      const targetRole = interaction.guild.roles.cache.get(targetRoleId);

      if (!targetRole) {
        console.error(`Target role (${targetRoleId}) not found.`);
        return interaction.reply({ content: 'Target role not found or invalid.', ephemeral: true });
      }

      // Send the embed to the specified channel with the role mention
      await targetChannel.send({ content: targetRole.toString(), embeds: [embed] });

      return interaction.reply({ content: 'Development log added successfully.', ephemeral: true });
    } catch (error) {
      console.error(`Error in /devlog command: ${error}`);
      return interaction.reply({ content: 'An error occurred while processing the command.', ephemeral: true });
    }
  },
};