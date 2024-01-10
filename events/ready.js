const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    client.user.setPresence({
      activities: [{ name: `To ${client.users.cache.size} Users in ${client.guilds.cache.size} Guilds!`, type: ActivityType.Listening }],
      status: 'online',
    });
  },
};