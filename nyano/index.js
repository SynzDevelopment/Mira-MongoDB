require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js');
const token = process.env.nyano;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

console.log('Starting Nyano bot...');

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

let messageCount = 0;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ignore messages from other bots

  messageCount++;

  if (messageCount % 5 === 0) {
    const randomIndex = Math.floor(Math.random() * similarResponses.length);
    const randomResponse = similarResponses[randomIndex];
    message.reply(randomResponse);
  }
});

client.login(token);