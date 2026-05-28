import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { getGuildConfig, setGuildConfig } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("autorole")
  .setDescription("Set a role to auto-assign to new members")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addRoleOption((o) => o.setName("role").setDescription("Role to assign (leave empty to disable)"));

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;
  const role = interaction.options.getRole("role");
  const config = getGuildConfig(interaction.guild.id);

  if (!role) {
    config.autoRoleId = undefined;
    setGuildConfig(interaction.guild.id, config);
    await interaction.reply("✅ Auto-role disabled.");
    return;
  }

  config.autoRoleId = role.id;
  setGuildConfig(interaction.guild.id, config);
  await interaction.reply(`✅ New members will automatically receive the **${role.name}** role.`);
}
