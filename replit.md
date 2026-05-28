# Dank Bot

A feature-rich Discord bot inspired by Dank Memer — economy, leveling, moderation, games, giveaways, and more.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server + bot (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 22+, TypeScript 5.9
- API: Express 5
- Discord: discord.js v14
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/api-server/src/bot/` — all bot code
  - `bot/index.ts` — bot client setup & startup
  - `bot/store.ts` — in-memory data store (economy, levels, guilds)
  - `bot/events/` — Discord event handlers (ready, interactionCreate, guildMemberAdd, messageCreate)
  - `bot/handlers/` — command + event loaders
  - `bot/commands/economy/` — balance, daily, work, rob, gamble, shop, buy, inventory, leaderboard
  - `bot/commands/moderation/` — ban, kick, mute, unmute, warn, purge
  - `bot/commands/leveling/` — rank, xpleaderboard
  - `bot/commands/fun/` — poll, giveaway, coinflip, dice, meme
  - `bot/commands/admin/` — setwelcome, setlog, autorole, customcmd, listcmds
  - `bot/commands/utility/` — ping, help

## Environment Variables Required

| Variable | Where to get it |
|---|---|
| `DISCORD_TOKEN` | discord.com/developers → App → Bot → Reset Token |
| `DISCORD_CLIENT_ID` | discord.com/developers → App → General Information → Application ID |
| `PORT` | Set automatically by Replit/Railway |

## Deploying to Railway

1. Push this repo to GitHub
2. Create a new Railway project → "Deploy from GitHub repo"
3. Add environment variables: `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`
4. Railway auto-detects `railway.toml` and builds/starts the bot

## Architecture decisions

- In-memory store (`bot/store.ts`) — fast, zero infra needed; data resets on restart. Swap for PostgreSQL + Drizzle to persist data.
- Slash commands registered globally on startup when `DISCORD_CLIENT_ID` is set; skipped otherwise (dev mode).
- Bot runs inside the same Express process — one dyno/container covers both the health endpoint and the bot.
- Custom prefix commands (`!trigger`) run alongside slash commands via `messageCreate` event.

## Product

- **Economy**: earn coins via daily/work, gamble, rob others, buy items from the shop
- **Leveling**: gain XP by chatting, level-up announcements, rank card, leaderboard
- **Moderation**: ban, kick, mute (timeout), warn with DM notification, bulk purge
- **Fun**: polls with reactions, giveaways with auto-draw, coinflip, dice, Reddit memes
- **Admin**: configure welcome channel, log channel, auto-role, custom `!commands`

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Slash commands only register when `DISCORD_CLIENT_ID` is set — without it the bot still works but commands won't show in Discord's UI until you provide the ID.
- Data is in-memory — restarts wipe economy/levels. Add a DB to persist.
- Music playback requires `@discordjs/voice` + `ffmpeg` — not yet wired up; stub can be added.
