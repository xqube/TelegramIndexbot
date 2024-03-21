import { Composer } from "grammy";
import { sysinfo } from "../plugins/sysinfo.js";
import { ban_all_user_files, ban_all_user_files_reply, copyright_file } from "../functions/dbFunc.js";

export const ownerComposer = new Composer();

ownerComposer.command("sysinfo", async (ctx: any, next) => {
    try {
        const admins: any = process.env.OWNERS
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            await sysinfo(ctx)
        }
    } catch (error: any) {
        console.log(error.message);
    }
    await next();
})



ownerComposer.command("fullban", async (ctx: any, next) => {
    try {
        const admins: any = process.env.OWNERS
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { doc_result, vid_result, aud_result } = await ban_all_user_files(Number(ctx.match))

                if (doc_result.modifiedCount != 0 || vid_result.modifiedCount != 0 || aud_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${doc_result.modifiedCount} files in document Collection\n\nBanned ${vid_result.modifiedCount} files in video Collection\n\nBanned ${aud_result.modifiedCount} files in audio Collection`)
                }
                else {
                    await ctx.reply(`Users files already Banned ;)`)
                }
            } else if (ctx.msg.reply_to_message.document) {
                const { doc_result, vid_result, aud_result } = await ban_all_user_files_reply(ctx.msg.reply_to_message.document.file_unique_id)
                if (doc_result.modifiedCount != 0 || vid_result.modifiedCount != 0 || aud_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${doc_result.modifiedCount} files in document Collection\n\nBanned ${vid_result.modifiedCount} files in video Collection\n\nBanned ${aud_result.modifiedCount} files in audio Collection`)
                }
                else {
                    await ctx.reply(`Users files already Banned ;)`)
                }
            }
        }
    } catch (error: any) {
        console.log(error.message);
    }
    await next();
})


ownerComposer.command("copyright", async (ctx: any, next) => {
    try {
        const admins: any = process.env.OWNERS
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { doc_result, vid_result, aud_result } = await copyright_file(ctx.match)
                if (doc_result.modifiedCount != 0 || vid_result.modifiedCount != 0 || aud_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${doc_result.modifiedCount} file in document Collection\n\nBanned ${vid_result.modifiedCount} file in video Collection\n\nBanned ${aud_result.modifiedCount} file in audio Collection`)
                } else {
                    await ctx.reply(`file already Banned ;)`)
                }
            } else if (ctx.msg.reply_to_message.document) {
                const { doc_result, vid_result, aud_result } = await copyright_file(ctx.msg.reply_to_message.document.file_unique_id)
                if (doc_result.modifiedCount != 0 || vid_result.modifiedCount != 0 || aud_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${doc_result.modifiedCount} file in document Collection\n\nBanned ${vid_result.modifiedCount} file in video Collection\n\nBanned ${aud_result.modifiedCount} file in audio Collection`)
                } else {
                    await ctx.reply(`file already Banned ;)`)
                }
            }
        }
    } catch (error: any) {
        console.log(error.message);
    }
    await next();
})