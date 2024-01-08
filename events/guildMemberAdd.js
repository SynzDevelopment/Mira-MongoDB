require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Events } = require('discord.js');
const { GUILD_ID, UNVERIFIED_ROLE_ID, VERIFY_CHANNEL_ID } = process.env;

// Function to generate a random 6-character code
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
    // Check if the member joined the specified guild
    if (member.guild.id !== GUILD_ID) {
      return; // Ignore the event if it's not the specified guild
    }

    // Generate a verification code
    const verificationCode = generateVerificationCode();

    // Path to verify.json
    const verifyFilePath = path.join(__dirname, '..', 'verify.json');

    try {
      let verifyData = [];

      // Check if verify.json exists
      if (fs.existsSync(verifyFilePath)) {
        // Read existing data
        const existingData = fs.readFileSync(verifyFilePath, 'utf-8');
        verifyData = JSON.parse(existingData);

        // Check if user ID already exists
        const existingUserIndex = verifyData.findIndex((data) => data.userId === member.user.id);

        if (existingUserIndex !== -1) {
          // If user exists, update the code
          verifyData[existingUserIndex].code = verificationCode;
        } else {
          // If user doesn't exist, add a new entry
          verifyData.push({ userId: member.user.id, code: verificationCode });
        }
      } else {
        // If verify.json doesn't exist, create a new entry
        verifyData.push({ userId: member.user.id, code: verificationCode });
      }

      // Assign UNVERIFIED_ROLE_ID to the new member
      const unverifiedRole = member.guild.roles.cache.get(UNVERIFIED_ROLE_ID);
      if (unverifiedRole) {
        await member.roles.add(unverifiedRole);
        console.log(`Assigned UNVERIFIED_ROLE to ${member.user.tag}`);
      } else {
        console.error(`UNVERIFIED_ROLE_ID (${UNVERIFIED_ROLE_ID}) not found.`);
      }

      // Write the updated array back to verify.json
      fs.writeFileSync(verifyFilePath, JSON.stringify(verifyData, null, 2));

      console.log(`Generated and saved verification code for ${member.user.tag}: ${verificationCode}`);

      // Send a message to VERIFY_CHANNEL_ID
      const verifyChannel = member.guild.channels.cache.get(VERIFY_CHANNEL_ID);
      if (verifyChannel) {
        // Send a message in the channel
        const verificationMessage = await verifyChannel.send(`Hey ${member.user}! Please verify your account using the code we've sent to your DM's\n Verify using the command: \`/verify <code>\``);

        // Send the verification code via direct message
        await member.send(`Your verification code:\n \`\`\`${verificationCode}\`\`\``);

        // Delete the verification message in VERIFY_CHANNEL_ID after 60 seconds
        setTimeout(() => {
          verificationMessage.delete().catch((error) => console.error(`Error deleting verification message: ${error}`));
        }, 60000); // 60 seconds in milliseconds
      } else {
        console.error(`VERIFY_CHANNEL_ID (${VERIFY_CHANNEL_ID}) not found.`);
      }
    } catch (error) {
      console.error(`Error updating verify.json: ${error}`);
    }

    // Your additional code to handle the guild member add event goes here
    console.log(`New member joined ${member.guild.name}: ${member.user.tag}`);

    // You can send a welcome message or perform any other actions.
  },
};