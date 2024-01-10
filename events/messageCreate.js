

// Array of allowed guild IDs
const allowedGuildIds = ['1157480671929970729', '1193401538052358214'];

// Array of allowed channel IDs
const allowedChannelIds = ['1193405005143744572', '1193464204338929785'];

// Array of allowed role IDs
const allowedRoleIds = ['1193402360286957578', '1193401769682812969'];

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

    // Log information about the received message
    console.log(`Message received in ${message.guild.name} from ${message.author.tag} in #${message.channel.name}: "${message.content}"`);

    // Check if the user has an allowed role
    const member = await message.guild.members.fetch(message.author.id);
    const userRoles = member.roles.cache.map(role => role.id);
    if (userRoles.some(roleId => allowedRoleIds.includes(roleId))) {
      // If the user has an allowed role, ignore the message
      return;
    }

    // Check if the message is from an allowed channel
    if (!allowedChannelIds.includes(message.channel.id)) {
      // If not from an allowed channel and without an allowed role, delete the message
      message.delete().catch(error => {
        console.error(`Error deleting message: ${error}`);
      });
    }

    // Add your own message processing logic here if needed
    // Your logic can include checking for specific commands, responding to certain messages, etc.
  },
};