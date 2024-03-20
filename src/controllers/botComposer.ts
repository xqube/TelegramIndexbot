import { Composer } from "grammy";
import { insert_user } from "../functions/dbFunc.js";

export const botComposer = new Composer();

// botComposer.on("my_chat_member", async (ctx, next) => {
//     try {
//         if (ctx.myChatMember.chat.type == 'supergroup') {

//         } else if (ctx.myChatMember.chat.type == 'private') {
            
//         }
//     } catch (error: any) {
//         console.log(error.message);
//     }
//     await next()
// });