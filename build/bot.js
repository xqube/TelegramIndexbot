import { Bot } from "grammy";
import { botComposer } from "./controllers/userComposer.js";
import 'dotenv/config';
import { mongoclient, mongoconnect } from "./db/dbConfig.js";
import { ownerComposer } from "./controllers/ownerComposer.js";
import { autoRetry } from "@grammyjs/auto-retry";
const bot = new Bot(process.env.TOKEN);
mongoconnect();
bot.api.config.use(autoRetry());
bot.use(ownerComposer);
bot.use(botComposer);
process.once("SIGINT", () => {
    bot.stop();
    mongoclient.close();
});
process.once("SIGTERM", () => {
    bot.stop();
    mongoclient.close();
});
await bot.start({ drop_pending_updates: true });
