import { Composer } from "grammy";
import { sysinfo } from "../plugins/sysinfo.js";
export const ownerComposer = new Composer();
ownerComposer.command("sysinfo", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            await sysinfo(ctx);
        }
    }
    catch (error) {
        console.log(error.message);
    }
    await next();
});
