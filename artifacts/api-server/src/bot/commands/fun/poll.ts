import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("poll")
  .setDescription("Create a poll")
  .addStringOption((o) => o.setName("question").setDescription("Poll question").setRequired(true))
  .addStringOption((o) => o.setName("option1").setDescription("Option 1").setRequired(true))
  .addStringOption((o) => o.setName("option2").setDescription("Option 2").setRequired(true))
  .addStringOption((o) => o.setName("option3").setDescription("Option 3 (optional)"))
  .addStringOption((o) => o.setName("option4").setDescription("Option 4 (optional)"));

const EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];

export async function execute(interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString("question", true);
  const options = [
    interaction.options.getString("option1", true),
    interaction.options.getString("option2", true),
    interaction.options.getString("option3"),
    interaction.options.getString("option4"),
  ].filter(Boolean) as string[];

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`📊 ${question}`)
    .setDescription(options.map((o, i) => `${EMOJIS[i]} ${o}`).join("\n"))
    .setFooter({ text: `Poll by ${interaction.user.tag}` })
    .setTimestamp();

  const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
  for (let i = 0; i < options.length; i++) {
    await msg.react(EMOJIS[i]!);
  }
}
