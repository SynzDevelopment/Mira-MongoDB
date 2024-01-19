const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const farmData = require('../../schemas/farmSchema.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('farm')
		.setDescription('Start the game!'),
	async execute(interaction) {
		let farmProfile = await farmData.findOne({ userId: interaction.user.id });

		if (!farmProfile) {
			farmProfile = new farmData({
				username: interaction.user.username,
				userId: interaction.user.id
			});
			await farmProfile.save();
		}

		const main = {
			color: 0x5865F2,
			title: `${interaction.user.username}`,
			description: `Welcome to the farm!`,
			fields: [
				{
					name: '**Balance:**',
					value: `$${farmProfile.balance}`,
				},
				{
					name: '**Inventory:**',
					value: Object.entries(farmProfile.inventory)
						.filter(([crop, count]) => count >= 1)
						.map(([crop, count]) => `${crop}: ${count}`)
						.join('\n'),
				},
			],
		};

		const farmBtn = new ButtonBuilder()
			.setCustomId('farm')
			.setLabel('Farm')
			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder().addComponents(farmBtn);

		await interaction.reply({
			embeds: [main],
			components: [row],
		});
	},
};