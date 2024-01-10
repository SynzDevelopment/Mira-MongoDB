const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('openapps')
    .setDescription('Send an embed with a reaction to open applications'),

  async execute(interaction) {
    try {
      // Create an embed with a title and refined description
      const embed = {
        color: 0x5865F2, // Discord's classic color
        title: 'Bot Tester Application',
        description: `🚀 Ready to become a pioneer in bot testing? React to this message to initiate the application process for our esteemed Bot Testing Program. By doing so, you're taking the first step towards joining an exclusive community of bot testers. Join us in shaping the future of bot interactions!`,
      };

      // Send the embed and add a reaction
      const message = await interaction.channel.send({
        embeds: [embed],
      });

      // Add a reaction to the sent message
      await message.react('✅');
    } catch (error) {
      console.error(`Error in /openapps: ${error}`);
      return interaction.reply({ content: 'An error occurred while processing the command.', ephemeral: true });
    }
  },
};