import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getAllLevels } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("xpleaderboard")
  .setDescription("Top users by XP level");

export async function execute(interaction: ChatInputCommandInteraction) {
  const all = getAllLevels();
  const sorted = [...all.entries()]
    .map(([id, data]) => ({ id, level: data.level, xp: data.xp }))
    .sort((a, b) => b.level - a.level || b.xp - a.xp)
    .slice(0, 10);

  const lines = sorted.map((e, i) => `**${i + 1}.** <@${e.id}> — Level ${e.level} (${e.xp.toLocaleString()} XP)`);

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("⬆️ XP Leaderboard")
    .setDescription(lines.length > 0 ? lines.join("\n") : "*No data yet*")
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
