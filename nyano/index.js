require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js');
const token = process.env.nyano; // Make sure to create a 'config.json' file with your bot token

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const similarResponses = [
  'Rad!',
  'Neat!',
  'Fantastic!',
  'Outstanding!',
  'Tremendous!',
  'Marvelous!',
  'Impressive!',
  'Splendid!',
  'Superb!',
  'Wonderful!',
  'Terrific!',
  'Stellar!',
  'Dope!',
  'Great job!',
  'Remarkable!',
  'Excellent!',
  'Wicked!',
  'Bravo!',
  'Awe-inspiring!',
  'Top-notch!',
  'Awesome!',
  'Cool!',
];

client.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ignore messages from other bots

  let messageCount = 0;
  messageCount++;

  if (messageCount % 5 === 0) {
    const randomIndex = Math.floor(Math.random() * similarResponses.length);
    const randomResponse = similarResponses[randomIndex];
    message.reply(randomResponse);
  }
});

client.login(token);