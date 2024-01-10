const { ActivityType } = require('discord.js');

// Function to update presence with member count
function statusChanging(client) {
  let membersAmount = 0;

  client.guilds.cache.forEach((guild) => {
    const nonBotMembers = guild.members.cache.filter((m) => !m.user.bot);
    membersAmount += nonBotMembers.size;
  });

  const presenceString = `To ${membersAmount} Users in ${client.guilds.cache.size} Guilds!`;

  // Set the new presence
  client.user.setPresence({
    activities: [{ name: presenceString, type: ActivityType.Listening }],
    status: 'online',
  });

  console.log(`Updated presence: ${presenceString}`);
}

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Call the function initially
    statusChanging(client);

    // Set up interval to update every 90 seconds (90 * 1000 milliseconds)
    setInterval(() => {
      statusChanging(client);
    }, 90 * 1000);
  },
};