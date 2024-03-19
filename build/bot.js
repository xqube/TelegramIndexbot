import { Bot } from "grammy";
import { botComposer } from "./controllers/start.js";
import 'dotenv/config';
import { mongoclient, mongoconnect } from "./db/dbConfig.js";
const bot = new Bot(process.env.TOKEN);
mongoconnect()
    .then(() => {
    console.log("Connected mongodb");
})
    .catch(console.error);
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
