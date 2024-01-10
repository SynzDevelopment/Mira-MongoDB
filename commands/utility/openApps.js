const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('openapps')
    .setDescription('Send an embed with a button to open applications'),

  async execute(interaction) {
    try {
      // Create a button with a label and style
      const button = new ButtonBuilder()
        .setCustomId('button_click') // Ensure this is a string
        .setLabel('Click to apply now!')
        .setStyle(ButtonStyle.PRIMARY); // Change to your desired style

      // Create an action row with the button
      const row = new ActionRowBuilder().addComponent(button);

      // Create an embed with a title and refined description
      const embed = {
        color: 0x5865F2, // Discord's classic color
        title: 'Bot Tester Application',
        description: `🚀 Ready to become a pioneer in bot testing? Click the button below to initiate the application process for our esteemed Bot Testing Program. By doing so, you're taking the first step towards joining an exclusive community of bot testers. Join us in shaping the future of bot interactions!`,
      };

      // Send the embed with the button and action row
      await interaction.reply({
        embeds: [embed],
        components: [row],
      });
    } catch (error) {
      console.error(`Error in /openapps: ${error}`);
      return interaction.reply({ content: 'An error occurred while processing the command.', ephemeral: true });
    }
  },

  async buttonClick(interaction) {
    try {
      // Handle button click logic here
      await interaction.followUp({ content: 'Button clicked! Initiating the Bot Tester Application process...', ephemeral: true });
    } catch (error) {
      console.error(`Error handling button click: ${error}`);
      await interaction.followUp({ content: 'An error occurred while processing the button click.', ephemeral: true });
    }
  },
};