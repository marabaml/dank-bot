import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("mute")
  .setDescription("Timeout (mute) a member")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((o) => o.setName("user").setDescription("User to mute").setRequired(true))
  .addIntegerOption((o) => o.setName("minutes").setDescription("Duration in minutes").setRequired(true).setMinValue(1).setMaxValue(10080))
  .addStringOption((o) => o.setName("reason").setDescription("Reason"));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser("user", true);
  const minutes = interaction.options.getInteger("minutes", true);
  const reason = interaction.options.getString("reason") ?? "No reason provided";

  const member = await interaction.guild?.members.fetch(target.id).catch(() => null);
  if (!member) {
    await interaction.reply({ content: "User not found.", ephemeral: true });
    return;
  }

  try {
    await member.timeout(minutes * 60 * 1000, reason);
    const embed = new EmbedBuilder()
      .setColor(0xfaa61a)
      .setTitle("🔇 Member Muted")
      .addFields(
        { name: "User", value: target.tag, inline: true },
        { name: "Duration", value: `${minutes} minute(s)`, inline: true },
        { name: "Reason", value: reason },
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  } catch {
    await interaction.reply({ content: "Failed to mute the user.", ephemeral: true });
  }
}
