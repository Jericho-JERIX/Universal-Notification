import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getAllSubscriptionPlan } from "../notion/Notion.service";
import { NotionSubscriptionPlanEmbed } from "../components/NotionSubscriptionPlanEmbed";
import { EmbedBuilder } from "discord.js";

function getSubscriptionDate(subscriptionPlan: PageObjectResponse) {
    const startedDate = subscriptionPlan.properties['Started Date'];
    if (startedDate.type !== "date") return;
    if (!startedDate.date?.start) return;
    return new Date(startedDate.date.start);
}

function getSubscriptionTitle(subscriptionPlan: PageObjectResponse) {
    const title = subscriptionPlan.properties['Name'];
    if (title.type !== "title") return;
    return title.title[0].plain_text;
}

function getNextRenewalDate(date: Date) {

    while (date.getTime() < Date.now()) {
        const nextMonth = date.getMonth() + 1;
        date.setMonth(nextMonth);
    }

    return date;
}

function getNextRenewalCountdown(date: Date) {
    const nextMonth = getNextRenewalDate(date);

    // Find difference between next month and current date
    const difference = nextMonth.getTime() - Date.now();
    return difference;

}

export async function notifySubscriptionPlan():Promise<EmbedBuilder[]> {
    const subscriptionPlans = await getAllSubscriptionPlan();

    const dayCountdowns = subscriptionPlans.results.map((subscriptionPlan) => {
        const renewalDate = getSubscriptionDate(subscriptionPlan as PageObjectResponse) as Date;
        const nextRenewalDate = getNextRenewalDate(renewalDate)
        return {
            dayLeft: Math.ceil(getNextRenewalCountdown(renewalDate) / 86400000),
            subscription: subscriptionPlan as PageObjectResponse,
            renewalDate: nextRenewalDate
        }
    }).sort((a, b) => a.dayLeft - b.dayLeft)
    
    const embeds:EmbedBuilder[] = []
    for (const { dayLeft, subscription, renewalDate } of dayCountdowns) {
        if ([0,1,3,7].includes(dayLeft)) {
            embeds.push(NotionSubscriptionPlanEmbed({
                url: subscription.url,
                title: getSubscriptionTitle(subscription) as string,
                renewalDate: renewalDate,
                dayLeft
            }))
        }
    }

    return embeds;
}