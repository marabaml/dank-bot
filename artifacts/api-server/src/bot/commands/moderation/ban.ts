import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Ban a member from the server")
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption((o) => o.setName("user").setDescription("User to ban").setRequired(true))
  .addStringOption((o) => o.setName("reason").setDescription("Reason for ban"))
  .addIntegerOption((o) => o.setName("days").setDescription("Delete messages from last N days (0-7)").setMinValue(0).setMaxValue(7));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser("user", true);
  const reason = interaction.options.getString("reason") ?? "No reason provided";
  const days = interaction.options.getInteger("days") ?? 0;

  const member = await interaction.guild?.members.fetch(target.id).catch(() => null);
  if (!member) {
    await interaction.reply({ content: "User not found in this server.", ephemeral: true });
    return;
  }

  if (!member.bannable) {
    await interaction.reply({ content: "I cannot ban this user (insufficient permissions).", ephemeral: true });
    return;
  }

  try {
    await member.ban({ reason, deleteMessageSeconds: days * 86400 });
    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle("🔨 Member Banned")
      .addFields(
        { name: "User", value: `${target.tag}`, inline: true },
        { name: "Moderator", value: `${interaction.user.tag}`, inline: true },
        { name: "Reason", value: reason },
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  } catch {
    await interaction.reply({ content: "Failed to ban the user.", ephemeral: true });
  }
}
