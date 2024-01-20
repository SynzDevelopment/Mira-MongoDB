const { Events, MessageActionRow, MessageButton } = require('discord.js');
const { handleFarmButton } = require('../components/buttons/farmButton.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    switch (interaction.customId) {
      case 'farm':
        await handleFarmButton(interaction);
        break;
    }
  },
};