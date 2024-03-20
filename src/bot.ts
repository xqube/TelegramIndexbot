import { Bot, Context, session, SessionFlavor } from "grammy";
import { botComposer } from "./controllers/userComposer.js";
import 'dotenv/config'
import { mongoclient, mongoconnect } from "./db/dbConfig.js";
import { ownerComposer } from "./controllers/ownerComposer.js";

import { autoRetry } from "@grammyjs/auto-retry";


type MyContext = Context


const bot = new Bot<MyContext>(process.env.TOKEN!);

mongoconnect()
    .then(() => {
        console.log("Connected mongodb");

    })
    .catch(console.error)

bot.api.config.use(autoRetry());

bot.use(ownerComposer)
bot.use(botComposer)

process.once("SIGINT", () => {
    bot.stop()
    mongoclient.close()
});
process.once("SIGTERM", () => {
    bot.stop()
    mongoclient.close()
});

await bot.start({ drop_pending_updates: true });