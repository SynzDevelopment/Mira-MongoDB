const { SlashCommandBuilder } = require('discord.js');
const { handleFarmButton } = require('../../components/buttons/farmButton.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('farm')
    .setDescription('Start the game!'),
  async execute(interaction) {
    await handleFarmButton(interaction);
  },
};