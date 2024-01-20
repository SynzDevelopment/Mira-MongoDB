const { MessageEmbed } = require('discord.js');

function farmMainEmbed(farmProfile) {
  const inventoryText = Object.entries(farmProfile.inventory)
    .filter(([crop, count]) => count >= 1)
    .map(([crop, count]) => `${crop}: ${count}`)
    .join('\n');

  return new MessageEmbed({
    color: 0x5865F2,
    title: `${farmProfile.username}`,
    description: 'Welcome to the farm!',
    fields: [
      {
        name: '**Balance:**',
        value: `$${farmProfile.balance}`,
      },
      {
        name: '**Inventory:**',
        value: inventoryText || 'None',
      },
    ],
  });
}

module.exports = { farmMainEmbed };