export interface UserEconomy {
  balance: number;
  bank: number;
  lastDaily: number;
  lastWork: number;
  lastRob: number;
  inventory: Record<string, number>;
}

export interface UserLevel {
  xp: number;
  level: number;
  lastXp: number;
}

export interface GuildConfig {
  welcomeChannelId?: string;
  logChannelId?: string;
  autoRoleId?: string;
  customCommands: Record<string, string>;
}

export interface GiveawayEntry {
  channelId: string;
  messageId: string;
  guildId: string;
  prize: string;
  endsAt: number;
  hostId: string;
  winners: number;
  entries: Set<string>;
}

export interface WarnEntry {
  userId: string;
  reason: string;
  moderatorId: string;
  timestamp: number;
}

const economy = new Map<string, UserEconomy>();
const levels = new Map<string, UserLevel>();
const guilds = new Map<string, GuildConfig>();
const giveaways = new Map<string, GiveawayEntry>();
const warnings = new Map<string, WarnEntry[]>();

export function getEconomy(userId: string): UserEconomy {
  if (!economy.has(userId)) {
    economy.set(userId, {
      balance: 500,
      bank: 0,
      lastDaily: 0,
      lastWork: 0,
      lastRob: 0,
      inventory: {},
    });
  }
  return economy.get(userId)!;
}

export function setEconomy(userId: string, data: UserEconomy) {
  economy.set(userId, data);
}

export function getLevel(userId: string): UserLevel {
  if (!levels.has(userId)) {
    levels.set(userId, { xp: 0, level: 1, lastXp: 0 });
  }
  return levels.get(userId)!;
}

export function setLevel(userId: string, data: UserLevel) {
  levels.set(userId, data);
}

export function getGuildConfig(guildId: string): GuildConfig {
  if (!guilds.has(guildId)) {
    guilds.set(guildId, { customCommands: {} });
  }
  return guilds.get(guildId)!;
}

export function setGuildConfig(guildId: string, data: GuildConfig) {
  guilds.set(guildId, data);
}

export function getAllEconomy(): Map<string, UserEconomy> {
  return economy;
}

export function getAllLevels(): Map<string, UserLevel> {
  return levels;
}

export function addGiveaway(id: string, entry: GiveawayEntry) {
  giveaways.set(id, entry);
}

export function getGiveaway(id: string): GiveawayEntry | undefined {
  return giveaways.get(id);
}

export function getAllGiveaways(): Map<string, GiveawayEntry> {
  return giveaways;
}

export function removeGiveaway(id: string) {
  giveaways.delete(id);
}

export function getWarnings(userId: string, guildId: string): WarnEntry[] {
  const key = `${guildId}:${userId}`;
  return warnings.get(key) ?? [];
}

export function addWarning(userId: string, guildId: string, entry: WarnEntry) {
  const key = `${guildId}:${userId}`;
  const list = warnings.get(key) ?? [];
  list.push(entry);
  warnings.set(key, list);
}

export const SHOP_ITEMS: Array<{ id: string; name: string; price: number; description: string }> = [
  { id: "fishing_rod", name: "Fishing Rod", price: 1000, description: "Catch fish for coins" },
  { id: "shovel", name: "Shovel", price: 1500, description: "Dig for buried treasure" },
  { id: "laptop", name: "Laptop", price: 5000, description: "Work online for more coins" },
  { id: "padlock", name: "Padlock", price: 800, description: "Protect yourself from robberies" },
  { id: "pet_cat", name: "Pet Cat", price: 3000, description: "A cute companion that earns passive coins" },
  { id: "lifesaver", name: "Life Saver", price: 2500, description: "Survive one robbery attempt" },
];
