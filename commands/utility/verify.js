const { SlashCommandBuilder } = require("discord.js");
const verifyData = require("../../schemas/verifySchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verify your account using the code.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The verification code received in your DM.")
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const guild = interaction.guild;
      const providedCode = interaction.options.getString("code");
      const user = await guild.members.fetch(interaction.user.id);

      const verifyProfile = await verifyData.findOne({ id: interaction.user.id });

      if (!verifyProfile) {
        return interaction.editReply("You are unable to run this command!");
      }

      const storedCode = verifyProfile.code;

      if (providedCode === storedCode) {
        const unverifiedRole = guild.roles.cache.get(process.env.UNVERIFIED_ROLE_ID);
        const verifiedRole = guild.roles.cache.get(process.env.VERIFIED_ROLE_ID);

        if (unverifiedRole && verifiedRole) {
          await user.roles.remove(unverifiedRole);
          await user.roles.add(verifiedRole);

          // Remove user data using Mongoose method
          async function removeVerifyProfile(interaction) {
            try {
              const removeProfile = await verifyData.findOneAndDelete({ id: interaction.user.id });

              if (removeProfile) {
                console.log(`Profile removed for user with ID: ${interaction.user.id}`);
              } else {
                console.log(`No profile found for user with ID: ${interaction.user.id}`);
              }
            } catch (error) {
              console.error(`Error removing profile: ${error}`);
            }
          }

          // Usage
          await removeVerifyProfile(interaction);

          return interaction.editReply({
            content: "Verification successful! [Link](https://discord.com/channels/1193401538052358214/1193401538522140787)",
            ephemeral: true,
          });
        } else {
          console.error("UNVERIFIED_ROLE_ID or VERIFIED_ROLE_ID not found.");
          return interaction.editReply({
            content: "Verification failed due to role configuration issue.",
            ephemeral: true,
          });
        }
      } else {
        return interaction.editReply({
          content: "Verification failed. Please double-check the code.",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(`Error during verification: ${error}`);
      return interaction.editReply({
        content: "Verification failed. Internal error.",
        ephemeral: true,
      });
    }
  },
};