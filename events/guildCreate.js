const { Events } = require('discord.js');
const guildData = require('../schemas/guildSchema.js');

module.exports = {
  name: Events.GuildCreate,
  once: false,
  async execute(guild) {
    try {
      let guildProfile = await guildData.findOne({
        id: guild.id
      });

      if (!guildProfile) {
        guildProfile = new guildData({
          id: guild.id,
          name: guild.name,
          verification: false
        });
        await guildProfile.save();
      }

      const textChannel = guild.channels.cache.find(
        (channel) => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES')
      );

      if (textChannel) {
        await textChannel.send('Thanks for adding me to your server!');
      } else {
        console.error('Bot does not have permission to send messages in any text channel.');
      }

      // You can perform additional actions here if needed
    } catch (error) {
      console.error(`Error handling guild create event: ${error}`);
    }
  },
};