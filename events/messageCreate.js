// Array of allowed guild IDs
const allowedGuildIds = ['1157480671929970729'];

// Array of allowed channel IDs
const allowedChannelIds = ['1157480672777220156', '1194338619461214359', '1194339468262506576'];

// Array of allowed role IDs
const allowedRoleIds = ['1157481855776460802', '1157480672034836560'];

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    // Ignore messages from bots or messages not in guilds to avoid issues
    if (message.author.bot || !message.guild) return;

    // Check if the message is from an allowed guild
    if (!allowedGuildIds.includes(message.guild.id)) {
      return;
    }

    // Check if the user has an allowed role
    const userRoles = message.member?.roles.cache.map(role => role.id) || [];
    if (userRoles.some(roleId => allowedRoleIds.includes(roleId))) {
      // If the user has an allowed role, ignore the message
      return;
    }

    // Check if the message content does not include "dm" and is not in an allowed channel
    if (!message.content.toLowerCase().includes('dm') && allowedChannelIds.includes(message.channel.id)) {
      // If the message does not contain "dm" and is not in an allowed channel, delete the message
      message.delete().catch(error => {
        console.error(`Error deleting message: ${error}`);
      });
    }

    // Add your own message processing logic here if needed
    // Your logic can include checking for specific commands, responding to certain messages, etc.
  },
};