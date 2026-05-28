import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getEconomy, setEconomy } from "../../store";

const COOLDOWN = 60 * 60 * 1000;
const JOBS = [
  { job: "Programmer", msg: "You wrote code for a startup", reward: [200, 600] },
  { job: "Delivery Driver", msg: "You delivered 20 packages", reward: [100, 400] },
  { job: "Chef", msg: "You cooked amazing meals", reward: [150, 450] },
  { job: "Streamer", msg: "You got donations on stream", reward: [50, 800] },
  { job: "Doctor", msg: "You treated patients at the clinic", reward: [300, 700] },
];

export const data = new SlashCommandBuilder()
  .setName("work")
  .setDescription("Work to earn coins");

export async function execute(interaction: ChatInputCommandInteraction) {
  const eco = getEconomy(interaction.user.id);
  const now = Date.now();
  const diff = now - eco.lastWork;

  if (diff < COOLDOWN) {
    const remaining = COOLDOWN - diff;
    const m = Math.floor(remaining / 60000);
    await interaction.reply({ content: `⏰ You're too tired to work! Rest for **${m}m**.`, ephemeral: true });
    return;
  }

  const job = JOBS[Math.floor(Math.random() * JOBS.length)]!;
  const amount = Math.floor(Math.random() * (job.reward[1]! - job.reward[0]!)) + job.reward[0]!;
  eco.balance += amount;
  eco.lastWork = now;
  setEconomy(interaction.user.id, eco);

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`💼 ${job.job}`)
    .setDescription(`${job.msg} and earned **⊡ ${amount.toLocaleString()}**!`)
    .setFooter({ text: `Wallet: ⊡ ${eco.balance.toLocaleString()}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
