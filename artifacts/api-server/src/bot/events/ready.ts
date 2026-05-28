import { Client, ActivityType } from "discord.js";
import { logger } from "../../lib/logger";

export function onReady(client: Client) {
  logger.info(`Logged in as ${client.user?.tag}`);
  client.user?.setActivity("🎮 /help | Dank Bot", { type: ActivityType.Playing });
}
