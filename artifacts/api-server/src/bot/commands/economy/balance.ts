import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getEconomy } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("balance")
  .setDescription("Check your wallet and bank balance")
  .addUserOption((o) => o.setName("user").setDescription("Check another user's balance"));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser("user") ?? interaction.user;
  const eco = getEconomy(target.id);

  const embed = new EmbedBuilder()
    .setColor(0xfaa61a)
    .setTitle(`💰 ${target.username}'s Balance`)
    .addFields(
      { name: "👛 Wallet", value: `⊡ **${eco.balance.toLocaleString()}**`, inline: true },
      { name: "🏦 Bank", value: `⊡ **${eco.bank.toLocaleString()}**`, inline: true },
      { name: "📊 Total", value: `⊡ **${(eco.balance + eco.bank).toLocaleString()}**`, inline: true },
    )
    .setThumbnail(target.displayAvatarURL())
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
