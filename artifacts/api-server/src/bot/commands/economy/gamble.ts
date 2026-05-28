import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getEconomy, setEconomy } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("gamble")
  .setDescription("Gamble your coins")
  .addStringOption((o) =>
    o.setName("amount").setDescription("Amount to gamble (number or 'all')").setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const eco = getEconomy(interaction.user.id);
  const raw = interaction.options.getString("amount", true);

  let amount: number;
  if (raw.toLowerCase() === "all") {
    amount = eco.balance;
  } else {
    amount = parseInt(raw, 10);
  }

  if (isNaN(amount) || amount <= 0) {
    await interaction.reply({ content: "Enter a valid amount!", ephemeral: true });
    return;
  }

  if (amount > eco.balance) {
    await interaction.reply({ content: `You only have **⊡ ${eco.balance.toLocaleString()}**!`, ephemeral: true });
    return;
  }

  if (amount < 10) {
    await interaction.reply({ content: "Minimum bet is **⊡ 10**!", ephemeral: true });
    return;
  }

  const roll = Math.random();
  let result: "jackpot" | "win" | "lose";
  let payout: number;

  if (roll < 0.05) {
    result = "jackpot";
    payout = amount * 3;
  } else if (roll < 0.45) {
    result = "win";
    payout = Math.floor(amount * (Math.random() * 0.8 + 0.5));
  } else {
    result = "lose";
    payout = -amount;
  }

  eco.balance += payout;
  if (eco.balance < 0) eco.balance = 0;
  setEconomy(interaction.user.id, eco);

  const colors: Record<string, number> = { jackpot: 0xfee75c, win: 0x57f287, lose: 0xed4245 };
  const titles: Record<string, string> = { jackpot: "🎰 JACKPOT!", win: "🎲 You Won!", lose: "💸 You Lost!" };

  const embed = new EmbedBuilder()
    .setColor(colors[result]!)
    .setTitle(titles[result]!)
    .setDescription(
      result === "lose"
        ? `You lost **⊡ ${amount.toLocaleString()}**!`
        : `You won **⊡ ${Math.abs(payout).toLocaleString()}**!`
    )
    .addFields({ name: "New Balance", value: `⊡ ${eco.balance.toLocaleString()}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
