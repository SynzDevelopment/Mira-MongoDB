const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

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
    const verifyFilePath = path.join(__dirname, '..', '../verify.json');
    const user = await guild.members.fetch(interaction.user.id);

    try {
      if (!fs.existsSync(verifyFilePath)) {
        console.warn('Verification file not found, creating a new one.');
        fs.writeFileSync(verifyFilePath, JSON.stringify([], null, 2));
      }

      const existingData = fs.readFileSync(verifyFilePath, 'utf-8');
      const verifyData = JSON.parse(existingData);

      let userData = verifyData.find(data => data.userId === user.id);

      if (!userData) {
        // If user data does not exist, create a new entry with attempts starting at 1
        userData = {
          userId: user.id,
          code: 'your_initial_verification_code', // Set this to the actual initial verification code
          attempts: 1,
        };

        verifyData.push(userData);
        fs.writeFileSync(verifyFilePath, JSON.stringify(verifyData, null, 2));
      }

      if (userData.attempts >= 3) {
        // Send DM before kicking the user
        await user.send('You have exceeded the maximum number of verification attempts and will be kicked from the server.');
        await guild.members.kick(user.id, 'Failed verification attempts.');

        verifyData.splice(verifyData.indexOf(userData), 1);
        fs.writeFileSync(verifyFilePath, JSON.stringify(verifyData, null, 2));

        await interaction.editReply({
          content: 'Verification failed. You have been kicked from the server.',
          ephemeral: true,
        });
        return;
      }

      const storedCode = userData.code;

      if (providedCode === storedCode) {
        const unverifiedRole = guild.roles.cache.get(process.env.UNVERIFIED_ROLE_ID);
        const verifiedRole = guild.roles.cache.get(process.env.VERIFIED_ROLE_ID);

        if (unverifiedRole && verifiedRole) {
          if (user.roles) {
            await user.roles.remove(unverifiedRole);
            await user.roles.add(verifiedRole);

            // Redirect to a different channel
            const verifiedChannel = guild.channels.cache.get(process.env.VERIFIED_CHANNEL_ID);
            if (verifiedChannel) {
              await user.edit({
                channel: verifiedChannel,
              });
            } else {
              console.error('Verified channel not found.');
            }

            // Delete user data from verify.json
            verifyData.splice(verifyData.indexOf(userData), 1);
            fs.writeFileSync(verifyFilePath, JSON.stringify(verifyData, null, 2));
          } else {
            console.error('User roles not available.');
            await interaction.editReply({
              content: 'Verification failed due to user roles issue.',
              ephemeral: true,
            });
            return;
          }

          await interaction.editReply({
            content: 'Verification successful! You now have the verified role and have been redirected.',
            ephemeral: true,
          });
        } else {
          console.error('UNVERIFIED_ROLE_ID or VERIFIED_ROLE_ID not found.');
          await interaction.editReply({
            content: 'Verification failed due to role configuration issue.',
            ephemeral: true,
          });
        }
      } else {
        userData.attempts++;
        fs.writeFileSync(verifyFilePath, JSON.stringify(verifyData, null, 2));

        await interaction.editReply({
          content: `Verification failed. Please double-check the code. Attempt ${userData.attempts}/3.`,
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