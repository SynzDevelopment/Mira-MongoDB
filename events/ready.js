const { ActivityType } = require('discord.js');

// Function to update presence with guild count
async function statusChanging(client) {
  try {
    await client.guilds.fetch(); // Fetch the latest guild information

    const guildCount = client.guilds.cache.size;
    const presenceString = `In ${guildCount} Guilds!`;

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
    }, 1000 * 1000);
  },
};