const { ActivityType } = require('discord.js');

// Function to update presence with member count
async function statusChanging(client) {
  try {
    await client.guilds.fetch(); // Fetch the latest guild information

    let membersAmount = client.guilds.cache.reduce((acc, guild) => {
      const nonBotMembers = guild.members.cache.filter((m) => !m.user.bot).size;
      return acc + nonBotMembers;
    }, 0);

    const presenceString = `To ${membersAmount} Users in ${client.guilds.cache.size} Guilds!`;

    // Set the new presence
    await client.user.setPresence({
      activities: [{ name: presenceString, type: ActivityType.Listening }],
      status: 'online',
    });

    console.log(`Updated presence: ${presenceString}`);
  } catch (error) {
    console.error(`Error fetching guild information: ${error}`);
  }
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