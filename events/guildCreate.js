const { Events } = require('discord.js');
const guildData = require('../schemas/guildSchema.js');

module.exports = {
  name: Events.GuildCreate,
  once: false,
  async execute(guild) {
    try {
      console.log(`Bot joined guild: ${guild.name} (${guild.id})`);

      let guildProfile = await guildData.findOne({
        id: guild.id
      });

      if (!guildProfile) {
        console.log('Creating a new profile for the guild...');
        guildProfile = new guildData({
          id: guild.id,
          name: guild.name,
          verification: false
        });
        await guildProfile.save();
        console.log('Guild profile saved.');
      }

      const textChannels = await guild.channels.fetch().then(channels => channels.filter(channel => channel.type === 'GUILD_TEXT'));
      const textChannel = textChannels.find(channel => channel.permissionsFor(guild.me).has('SEND_MESSAGES' || 'ADMINISTRATOR'));

      if (textChannel) {
        console.log(`Sending welcome message in text channel: ${textChannel.name} (${textChannel.id})`);
        await textChannel.send('Thanks for adding me to your server!');
        console.log('Welcome message sent successfully.');
      } else {
        console.error('Bot does not have permission to send messages in any text channel.');
      }

      // You can perform additional actions here if needed
    } catch (error) {
      console.error(`Error handling guild create event: ${error}`);
    }
  },
};