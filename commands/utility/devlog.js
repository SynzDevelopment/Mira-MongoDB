require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');
const { OWNER_ID, DEVLOGS_CHANNEL_ID } = process.env;

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
        title: title,
        description: log,
        timestamp: new Date(),
        footer: {
          text: `Mira Bot © SynzDev ${new Date().getFullYear()} | Timestamp:`,
        },
      };

      // Get the DEVLOGS channel
      const devlogsChannel = interaction.guild.channels.cache.get(DEVLOGS_CHANNEL_ID);

      if (!devlogsChannel || devlogsChannel.type !== 'text') {
        console.error(`DEVLOGS_CHANNEL_ID (${DEVLOGS_CHANNEL_ID}) not found or not a text channel.`);
        return interaction.reply({ content: 'Development log channel not found or invalid.', ephemeral: true });
      }

      // Send the embed to the DEVLOGS channel
      await devlogsChannel.send({ embeds: [embed] });

      return interaction.reply({ content: 'Development log added successfully.', ephemeral: true });
    } catch (error) {
      console.error(`Error in /devlog command: ${error}`);
      return interaction.reply({ content: 'An error occurred while processing the command.', ephemeral: true });
    }
  },
};