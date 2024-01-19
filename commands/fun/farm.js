const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('farm')
		.setDescription('Start the game!'),
	async execute(interaction) {
		const farmBtn = new ButtonBuilder()
			.setCustomId('farm')
			.setLabel('Farm')
			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder()
			.addComponents(farmBtn);

		await interaction.reply({
			content: 'Farm',
			components: [row]
		});
	},
};