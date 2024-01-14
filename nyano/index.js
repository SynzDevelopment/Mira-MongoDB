require("dotenv").config();
const { Client, GatewayIntentBits } = require('discord.js');
const openaiApiKey  = process.env.openaiApiKey; // Make sure to set up an OpenAI GPT-3 API key

const OpenAI = require('openai');
const openai = new OpenAI(openaiApiKey);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

console.log('Starting Nyano bot...');

let messageCount = 0;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  messageCount++;

  if (messageCount % 4 === 0) {
    try {
      // Use ChatGPT to generate a playful response based on user input
      const gptResponse = await openai.complete({
        engine: 'text-davinci-002', // You may adjust the engine according to your preferences
        prompt: message.content,
        max_tokens: 50, // You can adjust the response length
      });

      const playfulResponse = gptResponse.choices[0].text.trim();
      
      message.reply(playfulResponse);
    } catch (error) {
      console.error('Error communicating with ChatGPT:', error);
      message.reply("Oops! Something went wrong. I'm feeling a bit shy right now.");
    }
  }
});

client.login(process.env.nyano);