const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    // Fetch partial reactions and users if necessary
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('[ERROR] Error fetching partial reaction:', error);
        return;
      }
    }
    if (user.partial) {
      try {
        await user.fetch();
      } catch (error) {
        console.error('[ERROR] Error fetching partial user:', error);
        return;
      }
    }

    // Check if the reaction is added to a message
    if (!reaction.message.guild) return;

    // Check if the reaction is added to the correct message
    if (reaction.message.id === '1194704019772407910' && reaction.emoji.name === '✅') {
      // Handle the reaction logic here
      console.log(`${user.tag} reacted to the Bot Tester Application message!`);
    }
  },
};