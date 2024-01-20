const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const farmData = require('../../schemas/farmSchema.js');
const { farmMainEmbed } = require('../embeds/farmMain.js'); // Adjust the path accordingly

async function handleFarmButton(interaction) {
  let farmProfile = await farmData.findOne({ userId: interaction.user.id });

  if (!farmProfile) {
    farmProfile = new farmData({
      username: interaction.user.username,
      userId: interaction.user.id,
    });
    await farmProfile.save();
  }

  const farmEmbed = farmMainEmbed(farmProfile);

  const farmBtn = new ButtonBuilder()
    .setCustomId('farm')
    .setLabel('Farm')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(farmBtn);

  await interaction.editReply({
    embeds: [farmEmbed],
    components: [row],
  });
}

module.exports = { handleFarmButton };