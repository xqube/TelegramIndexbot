import { Bot, GrammyError, HttpError } from "grammy";
import { userComposer } from "./controllers/userComposer.js";
import 'dotenv/config';
import { mongoclient, mongoconnect } from "./db/dbConfig.js";
import { ownerComposer } from "./controllers/ownerComposer.js";
import { autoRetry } from "@grammyjs/auto-retry";
export const bot = new Bot(process.env.TOKEN);
const db = await mongoconnect();
if (db) {
    console.log('Connected successfully to DB server');
}
bot.api.config.use(autoRetry());
bot.use(userComposer);
bot.use(ownerComposer);
process.once("SIGINT", () => {
    bot.stop();
    mongoclient.close();
});
process.once("SIGTERM", () => {
    bot.stop();
    mongoclient.close();
});
bot.start({ drop_pending_updates: true });
bot.catch(async (err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    }
    else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    }
    else {
        console.error("Unknown error:", e);
    }
});
