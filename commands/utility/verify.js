const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your account using the provided code.')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('The verification code received in your DM.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.user;
    const guild = interaction.guild;
    const providedCode = interaction.options.getString('code');
    const verifyFilePath = path.join(__dirname, '..', 'verify.json');

    try {
      if (fs.existsSync(verifyFilePath)) {
        const existingData = fs.readFileSync(verifyFilePath, 'utf-8');
        const verifyData = JSON.parse(existingData);

        const userData = verifyData.find(data => data.userId === user.id);

        if (userData) {
          const storedCode = userData.code;

          if (providedCode === storedCode) {
            const unverifiedRole = guild.roles.cache.get(process.env.UNVERIFIED_ROLE_ID);
            const verifiedRole = guild.roles.cache.get(process.env.VERIFIED_ROLE_ID);

            if (unverifiedRole && verifiedRole) {
              await user.roles.remove(unverifiedRole);
              await user.roles.add(verifiedRole);

              verifyData.splice(verifyData.indexOf(userData), 1);
              fs.writeFileSync(verifyFilePath, JSON.stringify(verifyData, null, 2));

              await interaction.reply({
                content: 'Verification successful! You now have the verified role.',
                ephemeral: true,
              });
            } else {
              console.error('UNVERIFIED_ROLE_ID or VERIFIED_ROLE_ID not found.');
              await interaction.reply({
                content: 'Verification failed due to role configuration issue.',
                ephemeral: true,
              });
            }
          } else {
            userData.attempts = (userData.attempts || 0) + 1;

            if (userData.attempts >= 3) {
              await guild.members.kick(user.id, 'Failed verification attempts.');
              await user.send('You have exceeded the maximum number of verification attempts and have been kicked from the server.');

              verifyData.splice(verifyData.indexOf(userData), 1);
              fs.writeFileSync(verifyFilePath, JSON.stringify(verifyData, null, 2));

              await interaction.reply({
                content: 'Verification failed. You have been kicked from the server.',
                ephemeral: true,
              });
            } else {
              await interaction.reply({
                content: `Verification failed. Please double-check the code. Attempt ${userData.attempts}/3.`,
                ephemeral: true,
              });
            }
          }
        } else {
          await interaction.reply({
            content: 'Verification failed. User not found.',
            ephemeral: true,
          });
        }
      } else {
        await interaction.reply({
          content: 'Verification failed. Internal error.',
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`Error during verification: ${error}`);
      await interaction.reply({
        content: 'Verification failed. Internal error.',
        ephemeral: true,
      });
    }
  },
};