import { Client } from "discord.js";
import { onReady } from "../events/ready";
import { onInteractionCreate } from "../events/interactionCreate";
import { onGuildMemberAdd } from "../events/guildMemberAdd";
import { onMessageCreate } from "../events/messageCreate";

export async function loadEvents(client: Client) {
  client.once("ready", () => onReady(client));
  client.on("interactionCreate", onInteractionCreate);
  client.on("guildMemberAdd", onGuildMemberAdd);
  client.on("messageCreate", onMessageCreate);
}
