import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { addWarning, getWarnings } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("warn")
  .setDescription("Warn a member")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((o) => o.setName("user").setDescription("User to warn").setRequired(true))
  .addStringOption((o) => o.setName("reason").setDescription("Reason").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;
  const target = interaction.options.getUser("user", true);
  const reason = interaction.options.getString("reason", true);

  addWarning(target.id, interaction.guild.id, {
    userId: target.id,
    reason,
    moderatorId: interaction.user.id,
    timestamp: Date.now(),
  });

  const warnings = getWarnings(target.id, interaction.guild.id);

  const embed = new EmbedBuilder()
    .setColor(0xfee75c)
    .setTitle("⚠️ Member Warned")
    .addFields(
      { name: "User", value: target.tag, inline: true },
      { name: "Total Warnings", value: String(warnings.length), inline: true },
      { name: "Reason", value: reason },
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });

  try {
    await target.send(`⚠️ You were warned in **${interaction.guild.name}** for: ${reason}`);
  } catch { /* DMs closed */ }
}
