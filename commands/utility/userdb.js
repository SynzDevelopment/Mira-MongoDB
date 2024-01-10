const { SlashCommandBuilder } = require('discord.js');
const mongoose = require("mongoose");
const User = require("../../schemas/userSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userdb')
    .setDescription('Replies with user!'),
  async execute(interaction) {
    let userProfile = await User.findOne({ id: interaction.user.id });

    if (!userProfile) {
      userProfile = new User({
        // Use the default option in the userSchema for _id
        id: interaction.user.id,
        name: interaction.user.username
      });

      await userProfile.save();
      interaction.reply(`User: ${userProfile.name}\nID: ${userProfile.id}`);
    }
  },
};