import { Composer } from "grammy";
import { notAuthorized } from "./userComposer.js";
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
botComposer.on("chat_member", async (ctx, next) => {
    try {
        if (ctx.chat.id == Number(process.env.CHECKMEMBER)) {
            if (["member", "left"].includes(ctx.chatMember.new_chat_member.status)) {
                notAuthorized.delete(ctx.chatMember.new_chat_member.user.id);
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
    next();
});
