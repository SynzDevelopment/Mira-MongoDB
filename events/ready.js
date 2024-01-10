const { Events } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    client.user.setPresence({
      activities: [{ name: `With ${client.guilds.cache.size} Guilds And ${client.users.cache.size} Users!`, type: 'PLAYING'}]
    });
  },
};