import { Client, Collection, REST, Routes } from "discord.js";
import { logger } from "../../lib/logger";
import type { BotCommand } from "../index";

import * as ping from "../commands/utility/ping";
import * as help from "../commands/utility/help";
import * as balance from "../commands/economy/balance";
import * as daily from "../commands/economy/daily";
import * as rob from "../commands/economy/rob";
import * as gamble from "../commands/economy/gamble";
import * as shop from "../commands/economy/shop";
import * as buy from "../commands/economy/buy";
import * as inventory from "../commands/economy/inventory";
import * as work from "../commands/economy/work";
import * as leaderboard from "../commands/economy/leaderboard";
import * as ban from "../commands/moderation/ban";
import * as kick from "../commands/moderation/kick";
import * as mute from "../commands/moderation/mute";
import * as unmute from "../commands/moderation/unmute";
import * as warn from "../commands/moderation/warn";
import * as purge from "../commands/moderation/purge";
import * as rank from "../commands/leveling/rank";
import * as lvlLeaderboard from "../commands/leveling/leaderboard";
import * as poll from "../commands/fun/poll";
import * as giveaway from "../commands/fun/giveaway";
import * as coinflip from "../commands/fun/coinflip";
import * as dice from "../commands/fun/dice";
import * as meme from "../commands/fun/meme";
import * as setWelcome from "../commands/admin/setwelcome";
import * as setLog from "../commands/admin/setlog";
import * as autorole from "../commands/admin/autorole";
import * as customcmd from "../commands/admin/customcmd";
import * as listcmds from "../commands/admin/listcmds";

const allCommands: BotCommand[] = [
  ping, help,
  balance, daily, rob, gamble, shop, buy, inventory, work, leaderboard,
  ban, kick, mute, unmute, warn, purge,
  rank, lvlLeaderboard,
  poll, giveaway, coinflip, dice, meme,
  setWelcome, setLog, autorole, customcmd, listcmds,
];

export async function loadCommands(client: Client) {
  const commands = (client as unknown as { commands: Collection<string, BotCommand> }).commands;

  for (const cmd of allCommands) {
    commands.set(cmd.data.name, cmd);
  }

  const token = process.env["DISCORD_TOKEN"];
  const clientId = process.env["DISCORD_CLIENT_ID"];
  if (!token || !clientId) {
    logger.warn("DISCORD_CLIENT_ID not set — skipping slash command registration");
    return;
  }

  const rest = new REST().setToken(token);
  try {
    await rest.put(Routes.applicationCommands(clientId), {
      body: allCommands.map((c) => c.data.toJSON()),
    });
    logger.info(`Registered ${allCommands.length} slash commands`);
  } catch (err) {
    logger.error({ err }, "Failed to register slash commands");
  }
}
