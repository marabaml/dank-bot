import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { getGuildConfig, setGuildConfig } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("setlog")
  .setDescription("Set the moderation log channel")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addChannelOption((o) => o.setName("channel").setDescription("Channel for logs").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;
  const channel = interaction.options.getChannel("channel", true);
  const config = getGuildConfig(interaction.guild.id);
  config.logChannelId = channel.id;
  setGuildConfig(interaction.guild.id, config);
  await interaction.reply(`✅ Log messages will be sent in <#${channel.id}>.`);
}
