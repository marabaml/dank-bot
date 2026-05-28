import { GuildMember, EmbedBuilder, TextChannel } from "discord.js";
import { getGuildConfig } from "../store";
import { logger } from "../../lib/logger";

export async function onGuildMemberAdd(member: GuildMember) {
  const config = getGuildConfig(member.guild.id);

  if (config.autoRoleId) {
    try {
      const role = await member.guild.roles.fetch(config.autoRoleId);
      if (role) await member.roles.add(role);
    } catch (err) {
      logger.error({ err }, "Failed to assign auto-role");
    }
  }

  if (config.welcomeChannelId) {
    try {
      const channel = await member.guild.channels.fetch(config.welcomeChannelId) as TextChannel;
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle("👋 Welcome!")
        .setDescription(`Welcome to **${member.guild.name}**, ${member}!\nYou are member **#${member.guild.memberCount}**.`)
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter({ text: `Joined ${member.guild.name}` })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    } catch (err) {
      logger.error({ err }, "Failed to send welcome message");
    }
  }
}
