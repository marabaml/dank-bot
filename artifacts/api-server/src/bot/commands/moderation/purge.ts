import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("purge")
  .setDescription("Bulk delete messages")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption((o) => o.setName("amount").setDescription("Number of messages to delete (1-100)").setRequired(true).setMinValue(1).setMaxValue(100))
  .addUserOption((o) => o.setName("user").setDescription("Only delete messages from this user"));

export async function execute(interaction: ChatInputCommandInteraction) {
  const amount = interaction.options.getInteger("amount", true);
  const filterUser = interaction.options.getUser("user");
  const channel = interaction.channel as TextChannel;

  if (!channel) return;

  await interaction.deferReply({ ephemeral: true });

  try {
    let messages = await channel.messages.fetch({ limit: 100 });
    if (filterUser) {
      messages = messages.filter((m) => m.author.id === filterUser.id);
    }
    const toDelete = [...messages.values()].slice(0, amount);
    const deleted = await channel.bulkDelete(toDelete, true);
    await interaction.editReply(`✅ Deleted **${deleted.size}** messages.`);
  } catch {
    await interaction.editReply("Failed to delete messages (may be older than 14 days).");
  }
}
