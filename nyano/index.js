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
  'Yay!',
  'Wowza!',
  'Super duper!',
  'Amazing!',
  'Wowie!',
  'Fantastic!',
  'Impressive!',
  'Sparkly!',
  'Awesome sauce!',
  'Wonderific!',
  'Totally tubular!',
  'Stellarific!',
  'Super cool!',
  'Great jobaroo!',
  'Remarkabobble!',
  'Excellent-o!',
  'Wickedly awesome!',
  'Bravissimo!',
  'Awe-tastic!',
  'Top-notcharoo!',
  'Totally awesome!',
  'Cool beans!',
];

let messageCount = 0;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ignore messages from other bots

  messageCount++;

  if (messageCount % 4 === 0) {
    const randomIndex = Math.floor(Math.random() * similarResponses.length);
    const randomResponse = similarResponses[randomIndex];
    message.reply(randomResponse);
  }
});

client.login(token);