const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Channel, Partials.Reaction, Partials.Message]
});
const token = process.env.TOKEN;
const serverIdToLeave = '1157480671929970729';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  const server = client.guilds.cache.get(serverIdToLeave);

  if (server) {
    server.leave();
    console.log(`Left server: ${server.name}`);
    client.destroy();
  } else {
    console.log(`Unable to find server with ID: ${serverIdToLeave}`);
    client.destroy();
  }
});

client.login(token);