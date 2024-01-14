const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      // Handle all button interactions here
      try {
        // Execute the buttonClick method from the corresponding command (if available)
        if (interaction.command && interaction.command.buttonClick) {
          await interaction.deferReply({ ephemeral: true });
          await interaction.command.buttonClick(interaction);
        } else {
          console.error(`No buttonClick method found for button interaction.`);
        }
      } catch (error) {
        console.error(`Error handling button interaction: ${error}`);
        await interaction.reply({ content: 'An error occurred while processing the button interaction.', ephemeral: true });
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};