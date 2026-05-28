import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getGuildConfig } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("listcmds")
  .setDescription("List all custom commands for this server");

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;
  const config = getGuildConfig(interaction.guild.id);
  const cmds = Object.entries(config.customCommands);

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("📋 Custom Commands")
    .setDescription(
      cmds.length > 0
        ? cmds.map(([trigger, response]) => `\`!${trigger}\` → ${response}`).join("\n")
        : "*No custom commands set. Use /customcmd add to create one.*"
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
