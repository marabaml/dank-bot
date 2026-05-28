import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getAllEconomy } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Top richest users on this server");

export async function execute(interaction: ChatInputCommandInteraction) {
  const all = getAllEconomy();
  const sorted = [...all.entries()]
    .map(([id, eco]) => ({ id, total: eco.balance + eco.bank }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const lines = sorted.map((e, i) => `**${i + 1}.** <@${e.id}> — ⊡ ${e.total.toLocaleString()}`);

  const embed = new EmbedBuilder()
    .setColor(0xfaa61a)
    .setTitle("💰 Economy Leaderboard")
    .setDescription(lines.length > 0 ? lines.join("\n") : "*No data yet*")
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
