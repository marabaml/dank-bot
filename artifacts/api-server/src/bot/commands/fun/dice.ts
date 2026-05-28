import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("dice")
  .setDescription("Roll dice")
  .addIntegerOption((o) => o.setName("sides").setDescription("Number of sides (default 6)").setMinValue(2).setMaxValue(100))
  .addIntegerOption((o) => o.setName("count").setDescription("Number of dice (default 1)").setMinValue(1).setMaxValue(10));

export async function execute(interaction: ChatInputCommandInteraction) {
  const sides = interaction.options.getInteger("sides") ?? 6;
  const count = interaction.options.getInteger("count") ?? 1;

  const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  const total = rolls.reduce((a, b) => a + b, 0);

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`🎲 Rolled ${count}d${sides}`)
    .setDescription(`Results: **${rolls.join(", ")}**${count > 1 ? `\nTotal: **${total}**` : ""}`)
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
