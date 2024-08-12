import { Client } from "discord.js";
import { notifySubscriptionPlan } from "./notifications/NotifySubscriptionPlan";
import dotenv from "dotenv";

dotenv.config();
const jobs: Function[] = [
    notifySubscriptionPlan
];

async function executeAllJobs(client:Client) {
    const user = await client.users.fetch(process.env.DISCORD_USER_ID as string);
    
    for (const job of jobs) {
        const embeds = await job();
        if (embeds.length === 0) continue;
        user.send({embeds: embeds});
    }
}

export async function triggerDailyUpdate(client: Client) {
	const today = new Date();
	const tomorrow = new Date(today);

	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(0, 1, 0, 0);

	const beforeMidnight = tomorrow.getTime() - Date.now() + Number(process.env.DAILY_UPDATE_OFFSET_MILLISECONDS);

	console.log(
		`✅ Daily update activated (will be triggered in ${
			beforeMidnight / 1000
		}s)`
	);
	setTimeout(async () => {
		await executeAllJobs(client)
		setInterval(async () => {
			await executeAllJobs(client)
		}, 86400000);
	}, 1);
}