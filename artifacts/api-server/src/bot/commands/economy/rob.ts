import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getEconomy, setEconomy } from "../../store";

const COOLDOWN = 2 * 60 * 60 * 1000;

export const data = new SlashCommandBuilder()
  .setName("rob")
  .setDescription("Attempt to rob another user")
  .addUserOption((o) => o.setName("target").setDescription("Who to rob").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser("target", true);
  if (target.id === interaction.user.id) {
    await interaction.reply({ content: "You can't rob yourself!", ephemeral: true });
    return;
  }
  if (target.bot) {
    await interaction.reply({ content: "You can't rob a bot!", ephemeral: true });
    return;
  }

  const robberEco = getEconomy(interaction.user.id);
  const now = Date.now();

  if (now - robberEco.lastRob < COOLDOWN) {
    const remaining = COOLDOWN - (now - robberEco.lastRob);
    const m = Math.floor(remaining / 60000);
    await interaction.reply({ content: `⏰ Lay low for **${m}m** before robbing again.`, ephemeral: true });
    return;
  }

  const victimEco = getEconomy(target.id);
  if (victimEco.balance < 100) {
    await interaction.reply({ content: `${target.username} is too broke to rob!`, ephemeral: true });
    return;
  }

  const hasPadlock = (victimEco.inventory["padlock"] ?? 0) > 0;
  const hasLifesaver = (victimEco.inventory["lifesaver"] ?? 0) > 0;
  robberEco.lastRob = now;

  if (hasLifesaver) {
    victimEco.inventory["lifesaver"] = (victimEco.inventory["lifesaver"] ?? 1) - 1;
    setEconomy(target.id, victimEco);
    setEconomy(interaction.user.id, robberEco);
    await interaction.reply(`🛡️ ${target.username} used a **Life Saver** and survived the robbery!`);
    return;
  }

  const success = hasPadlock ? Math.random() < 0.3 : Math.random() < 0.6;

  if (success) {
    const stolen = Math.floor(victimEco.balance * (Math.random() * 0.4 + 0.1));
    victimEco.balance -= stolen;
    robberEco.balance += stolen;
    if (hasPadlock) {
      victimEco.inventory["padlock"] = (victimEco.inventory["padlock"] ?? 1) - 1;
    }
    setEconomy(target.id, victimEco);
    setEconomy(interaction.user.id, robberEco);

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle("🦹 Robbery Successful!")
      .setDescription(`You stole **⊡ ${stolen.toLocaleString()}** from ${target}!`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  } else {
    const fine = Math.floor(robberEco.balance * 0.15);
    robberEco.balance = Math.max(0, robberEco.balance - fine);
    setEconomy(interaction.user.id, robberEco);

    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle("🚔 Caught!")
      .setDescription(`You got caught robbing ${target} and paid a **⊡ ${fine.toLocaleString()}** fine!`)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
}
