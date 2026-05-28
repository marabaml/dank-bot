import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

const SUBREDDITS = ["memes", "dankmemes", "me_irl", "shitposting", "AdviceAnimals"];

export const data = new SlashCommandBuilder()
  .setName("meme")
  .setDescription("Get a random meme");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const sub = SUBREDDITS[Math.floor(Math.random() * SUBREDDITS.length)]!;

  try {
    const res = await fetch(`https://www.reddit.com/r/${sub}/random.json?limit=1`, {
      headers: { "User-Agent": "DankBot/1.0" },
    });
    const json = await res.json() as unknown;

    // Reddit returns an array of listings
    const post = (json as [{ data: { children: [{ data: { title: string; url: string; permalink: string; over_18: boolean } }] } }])[0]
      ?.data?.children?.[0]?.data;

    if (!post || post.over_18) {
      await interaction.editReply("Couldn't find a suitable meme. Try again!");
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0xff4500)
      .setTitle(post.title.slice(0, 256))
      .setURL(`https://reddit.com${post.permalink}`)
      .setImage(post.url)
      .setFooter({ text: `r/${sub}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch {
    await interaction.editReply("Failed to fetch a meme. Reddit may be rate-limiting.");
  }
}
