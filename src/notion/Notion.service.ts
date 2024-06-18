import { notion } from "./Auth"
import dotenv from "dotenv";

dotenv.config();

export const getAllSubscriptionPlan = async () => {
    const listUsersResponse = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_SUBSCRIPTION as string,
    })
    return listUsersResponse
}