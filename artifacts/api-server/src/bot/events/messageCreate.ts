import { Message } from "discord.js";
import { getGuildConfig, getLevel, setLevel } from "../store";
import { logger } from "../../lib/logger";

const XP_COOLDOWN = 60_000;
const XP_PER_MESSAGE = () => Math.floor(Math.random() * 10) + 15;

function xpForLevel(level: number) {
  return 100 * level * level;
}

export async function onMessageCreate(message: Message) {
  if (message.author.bot || !message.guild) return;

  await handleXp(message);
  await handleCustomCommands(message);
  await handleLog(message);
}

async function handleXp(message: Message) {
  const userData = getLevel(message.author.id);
  const now = Date.now();

  if (now - userData.lastXp < XP_COOLDOWN) return;

  userData.xp += XP_PER_MESSAGE();
  userData.lastXp = now;

  const needed = xpForLevel(userData.level);
  if (userData.xp >= needed) {
    userData.xp -= needed;
    userData.level += 1;
    setLevel(message.author.id, userData);
    try {
      if (message.channel.isTextBased() && "send" in message.channel) {
        await message.channel.send(
          `🎉 ${message.author} leveled up to **Level ${userData.level}**!`
        );
      }
    } catch { /* ignore */ }
  } else {
    setLevel(message.author.id, userData);
  }
}

async function handleCustomCommands(message: Message) {
  if (!message.content.startsWith("!")) return;
  const guildId = message.guild?.id;
  if (!guildId) return;

  const config = getGuildConfig(guildId);
  const trigger = message.content.slice(1).split(" ")[0]?.toLowerCase();
  if (!trigger) return;

  const response = config.customCommands[trigger];
  if (response) {
    await message.reply(response).catch(() => null);
  }
}

async function handleLog(message: Message) {
  if (!message.guild) return;
  const config = getGuildConfig(message.guild.id);
  if (!config.logChannelId) return;

  message.client.on("messageDelete", async (deleted) => {
    if (deleted.guildId !== message.guild?.id) return;
    if (!config.logChannelId) return;
    try {
      const logCh = await message.guild?.channels.fetch(config.logChannelId);
      if (!logCh?.isTextBased()) return;
      await (logCh as import("discord.js").TextChannel).send(
        `🗑️ Message by **${deleted.author?.tag}** deleted in <#${deleted.channelId}>:\n> ${deleted.content ?? "*unknown*"}`
      );
    } catch (err) {
      logger.error({ err }, "Log channel error");
    }
  });
}
