import { Bot, Context, session, SessionFlavor } from "grammy";
import { userComposer } from "./controllers/userComposer.js";
import 'dotenv/config'
import { mongoclient, mongoconnect } from "./db/dbConfig.js";
import { ownerComposer } from "./controllers/ownerComposer.js";

import { autoRetry } from "@grammyjs/auto-retry";


type MyContext = Context


export const bot = new Bot<MyContext>(process.env.TOKEN!);

const db = await mongoconnect()
if (db) {
    console.log('Connected successfully to DB server');
}

bot.api.config.use(autoRetry());
bot.use(ownerComposer)
bot.use(userComposer)

process.once("SIGINT", () => {
    bot.stop()
    mongoclient.close()
});
process.once("SIGTERM", () => {
    bot.stop()
    mongoclient.close()
});

await bot.start({ drop_pending_updates: true });