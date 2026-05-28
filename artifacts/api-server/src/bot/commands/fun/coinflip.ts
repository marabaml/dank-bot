import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("coinflip")
  .setDescription("Flip a coin")
  .addStringOption((o) =>
    o.setName("choice").setDescription("Your guess").addChoices(
      { name: "Heads", value: "heads" },
      { name: "Tails", value: "tails" },
    )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const choice = interaction.options.getString("choice");
  const result = Math.random() < 0.5 ? "heads" : "tails";
  const icon = result === "heads" ? "🪙" : "🔄";

  let description = `${icon} It landed on **${result.toUpperCase()}**!`;
  if (choice) {
    description += choice === result ? "\n✅ You guessed correctly!" : "\n❌ Wrong guess!";
  }

  const embed = new EmbedBuilder()
    .setColor(choice === result ? 0x57f287 : 0xed4245)
    .setTitle("🪙 Coin Flip")
    .setDescription(description)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
