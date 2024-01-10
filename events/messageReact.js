const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    // Check if the reaction is added to a message
    if (!reaction.message.guild) return;

    // Check if the reaction is added to the Bot Tester Application message
    if (reaction.message.id === '' && reaction.emoji.name === '✅') {
      // Handle the reaction logic here
      console.log(`${user.tag} reacted to the Bot Tester Application message!`);
    }
  },
};