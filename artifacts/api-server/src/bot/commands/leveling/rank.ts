import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getLevel } from "../../store";

function xpForLevel(level: number) {
  return 100 * level * level;
}

export const data = new SlashCommandBuilder()
  .setName("rank")
  .setDescription("Check your XP and level")
  .addUserOption((o) => o.setName("user").setDescription("Check another user"));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser("user") ?? interaction.user;
  const userData = getLevel(target.id);
  const needed = xpForLevel(userData.level);
  const progress = Math.floor((userData.xp / needed) * 20);
  const bar = "█".repeat(progress) + "░".repeat(20 - progress);

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`⬆️ ${target.username}'s Rank`)
    .addFields(
      { name: "Level", value: String(userData.level), inline: true },
      { name: "XP", value: `${userData.xp.toLocaleString()} / ${needed.toLocaleString()}`, inline: true },
    )
    .setDescription(`\`${bar}\``)
    .setThumbnail(target.displayAvatarURL())
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
