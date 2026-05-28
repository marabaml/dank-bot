import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} from "discord.js";
import { logger } from "../lib/logger";
import { loadCommands } from "./handlers/commandHandler";
import { loadEvents } from "./handlers/eventHandler";

export interface BotCommand {
  data: { name: string; toJSON: () => unknown };
  execute: (interaction: unknown) => Promise<void>;
}

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

(client as unknown as { commands: Collection<string, BotCommand> }).commands =
  new Collection();

export async function startBot() {
  const token = process.env["DISCORD_TOKEN"];
  if (!token) {
    logger.warn("DISCORD_TOKEN not set — bot will not start");
    return;
  }

  await loadCommands(client);
  await loadEvents(client);

  await client.login(token);
  logger.info("Discord bot logged in");
}
