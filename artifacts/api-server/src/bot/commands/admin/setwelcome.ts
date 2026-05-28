import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { getGuildConfig, setGuildConfig } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("setwelcome")
  .setDescription("Set the welcome message channel")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addChannelOption((o) => o.setName("channel").setDescription("Channel for welcome messages").setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;
  const channel = interaction.options.getChannel("channel", true);
  const config = getGuildConfig(interaction.guild.id);
  config.welcomeChannelId = channel.id;
  setGuildConfig(interaction.guild.id, config);
  await interaction.reply(`✅ Welcome messages will now be sent in <#${channel.id}>.`);
}
