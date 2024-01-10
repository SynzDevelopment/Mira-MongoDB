// events/guildMemberAdd.js
require('dotenv').config();
const { Events } = require('discord.js');
const { GUILD_ID, UNVERIFIED_ROLE_ID, VERIFY_CHANNEL_ID, MONGODB_URI } = process.env;
const mongoose = require('mongoose');
const UserData = require('../schemas/userSchema');

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

function generateVerificationCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    if (member.guild.id !== GUILD_ID) {
      return;
    }

    try {
      const unverifiedRole = member.guild.roles.cache.get(UNVERIFIED_ROLE_ID);
      if (unverifiedRole) {
        await member.roles.add(unverifiedRole);
        console.log(`Assigned UNVERIFIED_ROLE to ${member.user.tag}`);
      } else {
        console.error(`UNVERIFIED_ROLE_ID (${UNVERIFIED_ROLE_ID}) not found.`);
      }

      // Check if the user ID already exists in the collection
      const userIdExists = await UserData.userExists(member.user.id);

      if (userIdExists) {
        console.log(`User ID ${member.user.id} already exists in the collection.`);

        // Update the verification code for the existing user
        const newVerificationCode = generateVerificationCode();
        await UserData.updateVerificationCode(member.user.id, newVerificationCode);

        console.log(`Updated verification code for ${member.user.tag}: ${newVerificationCode}`);
        return;
      }

      const verificationCode = generateVerificationCode();

      // Create a new document using the Mongoose model
      const userData = new UserData({
        user_id: member.user.id,
        verification_code: verificationCode,
      });

      // Save the document to MongoDB
      await userData.save();

      console.log(`Generated and saved verification code for ${member.user.tag}: ${verificationCode}`);

      const verifyChannel = member.guild.channels.cache.get(VERIFY_CHANNEL_ID);
      if (verifyChannel) {
        const verificationMessage = await verifyChannel.send(`Hey ${member.user}! Please verify your account using the code we've sent to your DM's\n Verify using the command: \`/verify <code>\``);

        await member.send(`Your verification code:\n \`\`\`${verificationCode}\`\`\``);

        setTimeout(() => {
          verificationMessage.delete().catch((error) => console.error(`Error deleting verification message: ${error}`));
        }, 60000); // 60 seconds in milliseconds
      } else {
        console.error(`VERIFY_CHANNEL_ID (${VERIFY_CHANNEL_ID}) not found.`);
      }
    } catch (error) {
      console.error(`Error handling guild member add event: ${error}`);
    } finally {
      mongoose.connection.close();
    }

    console.log(`New member joined ${member.guild.name}: ${member.user.tag}`);
  },
};