import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { SHOP_ITEMS } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Browse the item shop");

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0xfaa61a)
    .setTitle("🛒 Item Shop")
    .setDescription("Use `/buy <item>` to purchase an item")
    .addFields(
      SHOP_ITEMS.map((item) => ({
        name: `${item.name} — ⊡ ${item.price.toLocaleString()}`,
        value: `*${item.description}* \`ID: ${item.id}\``,
        inline: false,
      }))
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
