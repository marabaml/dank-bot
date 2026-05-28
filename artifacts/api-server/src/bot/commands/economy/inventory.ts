import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getEconomy, SHOP_ITEMS } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("inventory")
  .setDescription("View your inventory")
  .addUserOption((o) => o.setName("user").setDescription("Check another user's inventory"));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser("user") ?? interaction.user;
  const eco = getEconomy(target.id);

  const items = Object.entries(eco.inventory)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const shopItem = SHOP_ITEMS.find((s) => s.id === id);
      return `**${shopItem?.name ?? id}** x${qty}`;
    });

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`🎒 ${target.username}'s Inventory`)
    .setDescription(items.length > 0 ? items.join("\n") : "*Nothing here yet! Visit /shop*")
    .setThumbnail(target.displayAvatarURL())
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
