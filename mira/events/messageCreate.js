const { Message } = require('discord.js');

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
    // Fetch partial messages if necessary
    if (message.partial) {
      try {
        await message.fetch();
      } catch (error) {
        console.error('[ERROR] Error fetching partial message:', error);
        return;
      }
    }

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
      const user = message.author;
      const guild = message.guild;
      const channel = message.channel;
      try {
        await user.send(`Your message in **${guild.name}** was removed because it didn't comply with the channel's rules!\n \`\`\` Message: ${message.content}\n Reason: Message did NOT contain "dm"\`\`\``);
      } catch (error) {
        console.error(`Failed to send DM: ${error}`);
      }

      // Delete the message
      try {
        await message.delete();
      } catch (error) {
        console.error(`Error deleting message: ${error}`);
      }
    }

    // Add your own message processing logic here if needed
    // Your logic can include checking for specific commands, responding to certain messages, etc.
  },
};