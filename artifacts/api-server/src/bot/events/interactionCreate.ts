import { Interaction, Collection } from "discord.js";
import { logger } from "../../lib/logger";
import type { BotCommand } from "../index";

export async function onInteractionCreate(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const client = interaction.client as unknown as { commands: Collection<string, BotCommand> };
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    logger.error({ err, command: interaction.commandName }, "Command error");
    const msg = { content: "An error occurred running that command.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg).catch(() => null);
    } else {
      await interaction.reply(msg).catch(() => null);
    }
  }
}
