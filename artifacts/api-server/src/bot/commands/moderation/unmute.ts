import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("unmute")
  .setDescription("Remove timeout from a member")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((o) => o.setName("user").setDescription("User to unmute").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser("user", true);
  const member = await interaction.guild?.members.fetch(target.id).catch(() => null);
  if (!member) {
    await interaction.reply({ content: "User not found.", ephemeral: true });
    return;
  }

  try {
    await member.timeout(null);
    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle("🔊 Member Unmuted")
      .setDescription(`${target.tag} has been unmuted.`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  } catch {
    await interaction.reply({ content: "Failed to unmute the user.", ephemeral: true });
  }
}
