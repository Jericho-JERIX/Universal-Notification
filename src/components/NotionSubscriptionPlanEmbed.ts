import { EmbedBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();
export function NotionSubscriptionPlanEmbed({
    url,
    title,
    renewalDate,
    dayLeft,
}:{
    url: string,
    title: string,
    renewalDate: Date,
    dayLeft: number
}):EmbedBuilder {

    const databaseId = process.env.NOTION_DATABASE_SUBSCRIPTION as string;
    const formattedRenewalDate = renewalDate.toLocaleDateString("en-GB");

    return new EmbedBuilder()
    .setAuthor({
        name: "Notion: Subscription Plan Notification",
        url: `https://www.notion.so/${databaseId}`,
    })
    .setTitle(title)
    .setURL(url)
    .setDescription(`**Renewal Date:** ${formattedRenewalDate} *(${dayLeft} days left)*`)
}