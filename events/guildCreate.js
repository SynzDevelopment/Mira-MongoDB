const { Events } = require('discord.js');
const guildData = require('../schemas/guildSchema.js');

module.exports = {
  name: Events.GuildCreate,
  once: false,
  async execute(guild) {
    try {
      console.log(`Bot joined guild: ${guild.name} (${guild.id})`);

      let owner = guild.owner;

      let guildProfile = await guildData.findOne({
        id: guild.id
      });

      if (!guildProfile) {
        console.log('Creating a new profile for the guild...');
        guildProfile = new guildData({
          guildId: guild.id,
          ownerId: owner.id,
          guildName: guild.name,
          verification: false,
          channels: [],
          roles: []
        });
        await guildProfile.save();
      }

      const allChannels = await guild.channels.fetch();

      allChannels.forEach(channel => {
        if (channel.type === 0) {
          guildProfile.channels.push({
            channel: channel.name,
            channelId: channel.id,
          });
        }
      });
      await guildProfile.save();

      const allRoles = guild.roles.cache;

      console.log('All roles and IDs:');
      allRoles.forEach(role => {
        
        guildProfile.roles.push({
          role: role.name,
          roleId: role.id,
        });
      });

      // Save the updated guild profile
      await guildProfile.save();

      console.log('Roles stored in guild profile.');

      
      const textChannel = guild.channels.cache.find(channel => channel.type === 0);

      if (textChannel) {
        console.log(`Sending welcome message in text channel: ${textChannel.name} (${textChannel.id})`);
        await textChannel.send(`<@${owner.id}> Thanks for adding me to your server!`);
        console.log('Welcome message sent successfully.');
      } else {
        console.error('No text channels found in the guild.');
      }

      // You can perform additional actions here if needed
    } catch (error) {
      console.error(`Error handling guild create event: ${error}`);
    }
  },
};