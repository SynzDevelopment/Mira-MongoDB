// index.js

require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const express = require('express');
const { connectToDatabase } = require('./mysql.js'); // Adjust the path accordingly

const { TOKEN, PORT } = process.env;

// Create an Express app
const app = express();

// New endpoint for uptime monitoring
app.get('/keep-alive', (req, res) => {
  res.status(200).send('I am awake!');
});

// Start the server
const port = PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Initialize the database connection before loading commands and events
connectToDatabase()
  .then((connection) => {
    console.log('MySQL database connection established');

    // Load commands and events after the database connection is established
    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      }
    }

    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }

    // Log in to Discord
    client.login(TOKEN);
  })
  .catch((error) => {
    console.error('Exiting due to database connection error:', error);
    process.exit(1); // Exit the process with an error code
  });