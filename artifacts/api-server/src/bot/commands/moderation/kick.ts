import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kick a member from the server")
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .addUserOption((o) => o.setName("user").setDescription("User to kick").setRequired(true))
  .addStringOption((o) => o.setName("reason").setDescription("Reason for kick"));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser("user", true);
  const reason = interaction.options.getString("reason") ?? "No reason provided";

  const member = await interaction.guild?.members.fetch(target.id).catch(() => null);
  if (!member) {
    await interaction.reply({ content: "User not found in this server.", ephemeral: true });
    return;
  }

  if (!member.kickable) {
    await interaction.reply({ content: "I cannot kick this user.", ephemeral: true });
    return;
  }

  try {
    await member.kick(reason);
    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle("👢 Member Kicked")
      .addFields(
        { name: "User", value: target.tag, inline: true },
        { name: "Moderator", value: interaction.user.tag, inline: true },
        { name: "Reason", value: reason },
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  } catch {
    await interaction.reply({ content: "Failed to kick the user.", ephemeral: true });
  }
}
