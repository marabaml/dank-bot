import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { addGiveaway, getAllGiveaways, removeGiveaway } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("giveaway")
  .setDescription("Start a giveaway")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((o) => o.setName("prize").setDescription("What are you giving away?").setRequired(true))
  .addIntegerOption((o) => o.setName("minutes").setDescription("Duration in minutes").setRequired(true).setMinValue(1))
  .addIntegerOption((o) => o.setName("winners").setDescription("Number of winners").setMinValue(1).setMaxValue(10));

export async function execute(interaction: ChatInputCommandInteraction) {
  const prize = interaction.options.getString("prize", true);
  const minutes = interaction.options.getInteger("minutes", true);
  const winners = interaction.options.getInteger("winners") ?? 1;
  const endsAt = Date.now() + minutes * 60 * 1000;

  const embed = new EmbedBuilder()
    .setColor(0xfaa61a)
    .setTitle("🎉 GIVEAWAY!")
    .setDescription(`**Prize:** ${prize}\n\nReact with 🎉 to enter!\n**Winners:** ${winners}\n**Ends:** <t:${Math.floor(endsAt / 1000)}:R>`)
    .setFooter({ text: `Hosted by ${interaction.user.tag}` })
    .setTimestamp(endsAt);

  const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
  await msg.react("🎉");

  const id = `${interaction.guild!.id}-${msg.id}`;
  addGiveaway(id, {
    channelId: interaction.channelId,
    messageId: msg.id,
    guildId: interaction.guild!.id,
    prize,
    endsAt,
    hostId: interaction.user.id,
    winners,
    entries: new Set(),
  });

  setTimeout(async () => {
    const giveaway = getAllGiveaways().get(id);
    if (!giveaway) return;

    const fetchedMsg = await msg.fetch().catch(() => null);
    if (!fetchedMsg) return;

    const reaction = fetchedMsg.reactions.cache.get("🎉");
    const users = await reaction?.users.fetch();
    const entries = users ? [...users.values()].filter((u) => !u.bot) : [];

    if (entries.length === 0) {
      await interaction.followUp("🎉 Giveaway ended but nobody entered!");
    } else {
      const picked: string[] = [];
      const pool = [...entries];
      for (let i = 0; i < Math.min(winners, pool.length); i++) {
        const idx = Math.floor(Math.random() * pool.length);
        picked.push(pool.splice(idx, 1)[0]!.toString());
      }
      await interaction.followUp(`🎉 Congratulations ${picked.join(", ")}! You won **${prize}**!`);
    }

    removeGiveaway(id);
  }, minutes * 60 * 1000);
}
