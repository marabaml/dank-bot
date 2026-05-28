import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { getEconomy, setEconomy, SHOP_ITEMS } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("buy")
  .setDescription("Buy an item from the shop")
  .addStringOption((o) => o.setName("item").setDescription("Item ID to buy").setRequired(true))
  .addIntegerOption((o) => o.setName("quantity").setDescription("How many to buy").setMinValue(1));

export async function execute(interaction: ChatInputCommandInteraction) {
  const itemId = interaction.options.getString("item", true).toLowerCase();
  const qty = interaction.options.getInteger("quantity") ?? 1;
  const item = SHOP_ITEMS.find((i) => i.id === itemId);

  if (!item) {
    await interaction.reply({ content: `Item \`${itemId}\` not found. Check \`/shop\` for valid IDs.`, ephemeral: true });
    return;
  }

  const total = item.price * qty;
  const eco = getEconomy(interaction.user.id);

  if (eco.balance < total) {
    await interaction.reply({ content: `You need **⊡ ${total.toLocaleString()}** but only have **⊡ ${eco.balance.toLocaleString()}**!`, ephemeral: true });
    return;
  }

  eco.balance -= total;
  eco.inventory[item.id] = (eco.inventory[item.id] ?? 0) + qty;
  setEconomy(interaction.user.id, eco);

  await interaction.reply(`✅ Bought **${qty}x ${item.name}** for **⊡ ${total.toLocaleString()}**! Remaining: **⊡ ${eco.balance.toLocaleString()}**`);
}
