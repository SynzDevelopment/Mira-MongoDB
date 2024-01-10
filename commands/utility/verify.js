const { SlashCommandBuilder } = require('discord.js');
const UserData = require('../schemas/userSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your account using the code.')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('The verification code received in your DM.')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    const providedCode = interaction.options.getString('code');
    const user = await guild.members.fetch(interaction.user.id);

    try {
      // Find user data in MongoDB using Mongoose
      const userData = await UserData.findOne({ user_id: user.id });

      if (!userData) {
        // User data not found
        await interaction.editReply({
          content: 'Verification failed. User data not found.',
          ephemeral: true,
        });
        return;
      }

      const storedCode = userData.verification_code;

      if (providedCode === storedCode) {
        const unverifiedRole = guild.roles.cache.get(process.env.UNVERIFIED_ROLE_ID);
        const verifiedRole = guild.roles.cache.get(process.env.VERIFIED_ROLE_ID);

        if (unverifiedRole && verifiedRole) {
          try {
            await user.roles.remove(unverifiedRole);
            await user.roles.add(verifiedRole);

            // Remove user data using Mongoose method
            await userData.remove();

            await interaction.editReply({
              content: 'Verification successful! https://discord.com/channels/1193401538052358214/1193401538522140787',
              ephemeral: true,
            });
          } catch (error) {
            console.error(`Error updating roles or deleting user data: ${error}`);
            await interaction.editReply({
              content: 'Verification failed due to role or data update issue.',
              ephemeral: true,
            });
          }
        } else {
          console.error('UNVERIFIED_ROLE_ID or VERIFIED_ROLE_ID not found.');
          await interaction.editReply({
            content: 'Verification failed due to role configuration issue.',
            ephemeral: true,
          });
        }
      } else {
        await interaction.editReply({
          content: 'Verification failed. Please double-check the code.',
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`Error during verification: ${error}`);
      await interaction.editReply({
        content: 'Verification failed. Internal error.',
        ephemeral: true,
      });
    }
  },
};