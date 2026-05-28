import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getEconomy, setEconomy } from "../../store";

const COOLDOWN = 24 * 60 * 60 * 1000;
const REWARD = () => Math.floor(Math.random() * 500) + 500;

export const data = new SlashCommandBuilder()
  .setName("daily")
  .setDescription("Claim your daily coins");

export async function execute(interaction: ChatInputCommandInteraction) {
  const eco = getEconomy(interaction.user.id);
  const now = Date.now();
  const diff = now - eco.lastDaily;

  if (diff < COOLDOWN) {
    const remaining = COOLDOWN - diff;
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    await interaction.reply({ content: `⏰ You already claimed your daily! Come back in **${h}h ${m}m**.`, ephemeral: true });
    return;
  }

  const amount = REWARD();
  eco.balance += amount;
  eco.lastDaily = now;
  setEconomy(interaction.user.id, eco);

  const embed = new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle("📅 Daily Reward!")
    .setDescription(`You claimed your daily reward of **⊡ ${amount.toLocaleString()}**!\nWallet: **⊡ ${eco.balance.toLocaleString()}**`)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
