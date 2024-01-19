const { Events, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    // Handle different button interactions based on custom IDs
    switch (interaction.customId) {
      case 'farm':
        await handleFarmButton(interaction);
        break;
      // Add more cases for other buttons as needed
    }
  },
};

async function handleFarmButton(interaction) {
  // Your logic for handling the 'Farm' button click
  await interaction.reply('OK');
}