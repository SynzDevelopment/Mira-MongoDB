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
          text: `Mira Bot © Synz ${new Date().getFullYear()} | `,
        },
      };

      // Send the embed to the channel where the command was invoked
      await interaction.reply({ embeds: [embed] });

      return interaction.followUp({ content: 'Development log added successfully.', ephemeral: true });
    } catch (error) {
      console.error(`Error in /devlog command: ${error}`);
      return interaction.reply({ content: 'An error occurred while processing the command.', ephemeral: true });
    }
  },
};