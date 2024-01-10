const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('openapps')
    .setDescription('Send an embed with a button to open applications'),

  async execute(interaction) {
    try {
      const apply = new ButtonBuilder()
        .setCustomId("apply")
        .setLabel("Click here to apply!")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder()
        .addComponents(apply);

      await interaction.reply({
        content: "Click the button below to open the application!",
        components: [row],
      });

    } catch (error) {
      console.error(`Error in /openapps: ${error}`);
      return interaction.reply({ content: 'An error occurred while processing the command.', ephemeral: true });
    }
  },

  async buttonClick(interaction) {
    try {
      if (interaction.customId === "apply") {
        await interaction.reply({
          content: "You clicked the button!",
          ephemeral: true
        });
      }
    } catch (error) {
      console.error(`Error handling button click: ${error}`);
      await interaction.followUp({ content: 'An error occurred while processing the button click.', ephemeral: true });
    }
  },
};