import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { getGuildConfig, setGuildConfig } from "../../store";

export const data = new SlashCommandBuilder()
  .setName("customcmd")
  .setDescription("Add or remove a custom text command (triggered with !trigger)")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand((sub) =>
    sub.setName("add")
      .setDescription("Add a custom command")
      .addStringOption((o) => o.setName("trigger").setDescription("Trigger word (no ! prefix needed)").setRequired(true))
      .addStringOption((o) => o.setName("response").setDescription("Bot response").setRequired(true))
  )
  .addSubcommand((sub) =>
    sub.setName("remove")
      .setDescription("Remove a custom command")
      .addStringOption((o) => o.setName("trigger").setDescription("Trigger word to remove").setRequired(true))
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;
  const sub = interaction.options.getSubcommand();
  const config = getGuildConfig(interaction.guild.id);

  if (sub === "add") {
    const trigger = interaction.options.getString("trigger", true).toLowerCase();
    const response = interaction.options.getString("response", true);
    config.customCommands[trigger] = response;
    setGuildConfig(interaction.guild.id, config);
    await interaction.reply(`✅ Custom command \`!${trigger}\` created.`);
  } else {
    const trigger = interaction.options.getString("trigger", true).toLowerCase();
    if (!config.customCommands[trigger]) {
      await interaction.reply({ content: `No command \`!${trigger}\` found.`, ephemeral: true });
      return;
    }
    delete config.customCommands[trigger];
    setGuildConfig(interaction.guild.id, config);
    await interaction.reply(`✅ Removed command \`!${trigger}\`.`);
  }
}
