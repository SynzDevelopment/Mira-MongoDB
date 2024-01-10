require('dotenv').config();
const { Events } = require('discord.js');
const { GUILD_ID, UNVERIFIED_ROLE_ID, VERIFY_CHANNEL_ID } = process.env;
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const clientMongo = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });

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

    try {
      // Assign UNVERIFIED_ROLE_ID to the new member
      const unverifiedRole = member.guild.roles.cache.get(UNVERIFIED_ROLE_ID);
      if (unverifiedRole) {
        await member.roles.add(unverifiedRole);
        console.log(`Assigned UNVERIFIED_ROLE to ${member.user.tag}`);
      } else {
        console.error(`UNVERIFIED_ROLE_ID (${UNVERIFIED_ROLE_ID}) not found.`);
      }

      // Connect to MongoDB
      await clientMongo.connect();
      const database = clientMongo.db();
      const userCollection = database.collection('user_data');

      // Insert user data into MongoDB
      const userData = {
        user_id: member.user.id,
        verification_code: verificationCode,
      };

      const insertResult = await userCollection.insertOne(userData);

      if (insertResult.result.ok !== 1) {
        console.error(`Error inserting user data into MongoDB`);
        return;
      }

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
      console.error(`Error handling guild member add event: ${error}`);
    } finally {
      // Close the MongoDB connection
      await clientMongo.close();
    }

    console.log(`New member joined ${member.guild.name}: ${member.user.tag}`);
  },
};