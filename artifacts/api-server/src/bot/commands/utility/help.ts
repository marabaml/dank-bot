import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("List all available commands");

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("📖 Dank Bot Commands")
    .setDescription("Here's everything I can do!")
    .addFields(
      { name: "💰 Economy", value: "`/balance` `/daily` `/work` `/rob` `/gamble` `/shop` `/buy` `/inventory` `/leaderboard`", inline: false },
      { name: "⬆️ Leveling", value: "`/rank` `/leaderboard xp`", inline: false },
      { name: "🔨 Moderation", value: "`/ban` `/kick` `/mute` `/unmute` `/warn` `/purge`", inline: false },
      { name: "🎉 Fun", value: "`/poll` `/giveaway` `/coinflip` `/dice` `/meme`", inline: false },
      { name: "⚙️ Admin", value: "`/setwelcome` `/setlog` `/autorole` `/customcmd` `/listcmds`", inline: false },
      { name: "🛠️ Utility", value: "`/ping` `/help`", inline: false },
    )
    .setFooter({ text: "Use ! prefix for custom server commands" })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
