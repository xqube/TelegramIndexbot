import { Composer } from "grammy";
import { sysinfo } from "../plugins/sysinfo.js";
import { terminate_user_files, terminate_user_files_reply, remove_file, warn_user_file } from "../functions/dbFunc.js";
import { bot } from "../bot.js";

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



ownerComposer.command("terminate", async (ctx: any, next) => {
    try {
        const admins: any = process.env.OWNERS
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { doc_mod_result, vid_mod_result, aud_mod_result, user_mod_result, user_data } = await terminate_user_files(Number(ctx.match))

                if (doc_mod_result.modifiedCount != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                    if (user_mod_result.modifiedCount != 0) {
                        try {
                            await bot.api.sendMessage(parseInt(ctx.match), `<b>Sorry to inform that you have been terminated from our system, you can't no longer use the service</b>`)
                        } catch (error: any) {
                            console.log("Error on sending ban meessage on terminate command ownerComposer", error.message);

                        }
                    }
                    await ctx.reply(`Banned ${doc_mod_result.modifiedCount} file in document Collection\n\nBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nBanned ${aud_mod_result.modifiedCount} file in audio Collection\n\nBanned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" })
                }
                else {
                    await ctx.reply(`Users files already Banned ;)`)
                }
            } else if (ctx.msg.reply_to_message.document || ctx.msg.reply_to_message.video || ctx.msg.reply_to_message.audio) {
                const { doc_mod_result, vid_mod_result, aud_mod_result, user_data, user_mod_result } = await terminate_user_files_reply(ctx.msg.reply_to_message.document.file_unique_id)
                if (doc_mod_result.modifiedCount != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                    if (user_mod_result.modifiedCount != 0) {
                        try {
                            await bot.api.sendMessage(parseInt(user_data.user_id), `<b>Sorry to inform that you have been terminated from our system, you can't no longer use the service</b>`)
                        } catch (error: any) {
                            console.log("Error on sending ban meessage on terminate command ownerComposer", error.message);

                        }
                    }
                    await ctx.reply(`Banned ${doc_mod_result.modifiedCount} file in document Collection\n\nBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nBanned ${aud_mod_result.modifiedCount} file in audio Collection\n\nWarned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" })
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


ownerComposer.command("remove", async (ctx: any, next) => {
    try {
        const admins: any = process.env.OWNERS
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { doc_mod_result, vid_mod_result, aud_mod_result } = await remove_file(ctx.match)
                if (doc_mod_result.modifiedCount != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${doc_mod_result.modifiedCount} file in document Collection\n\nBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nBanned ${aud_mod_result.modifiedCount} file in audio Collection`)
                } else {
                    await ctx.reply(`file already Banned ;)`)
                }
            } else if (ctx.msg.reply_to_message.document) {
                const { doc_mod_result } = await remove_file(ctx.msg.reply_to_message.document.file_unique_id)
                if (doc_mod_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${doc_mod_result.modifiedCount} file in document Collection`)
                } else {
                    await ctx.reply(`file already Banned ;)`)
                }
            } else if (ctx.msg.reply_to_message.video) {
                const { vid_mod_result } = await remove_file(ctx.msg.reply_to_message.video.file_unique_id)
                if (vid_mod_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${vid_mod_result.modifiedCount} file in document Collection`)
                } else {
                    await ctx.reply(`file already Banned ;)`)
                }
            } else if (ctx.msg.reply_to_message.audio) {
                const { aud_mod_result } = await remove_file(ctx.msg.reply_to_message.audio.file_unique_id)
                if (aud_mod_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${aud_mod_result.modifiedCount} file in document Collection`)
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




ownerComposer.command("warn", async (ctx: any, next) => {
    try {
        const admins: any = process.env.OWNERS
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { doc_mod_result, vid_mod_result, aud_mod_result, user_data, user_mod_result } = await warn_user_file(ctx.match)
                if (doc_mod_result?.modifiedCount != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                    if (user_mod_result.modifiedCount != 0) {
                        try {
                            await bot.api.sendMessage(user_data.user_id, `<b>You have warned for sending porn or unwanted message</b>`)
                        } catch (error: any) {
                            console.log("Error on sending warn meessage on terminate command ownerComposer", error.message);

                        }
                        await ctx.reply(`Banned ${doc_mod_result?.modifiedCount} file in document Collection\n\nBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nBanned ${aud_mod_result.modifiedCount} file in audio Collection\n\nWarned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" })
                    } else {
                        await ctx.reply(`Banned ${doc_mod_result?.modifiedCount} file in document Collection\n\nBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nBanned ${aud_mod_result.modifiedCount} file in audio Collection\n\n<b>Max Warning Reached, user need to be banned</b>`, { parse_mode: "HTML" })
                    }
                } else {
                    await ctx.reply(`file already Banned ;)`)
                }
            } else if (ctx.msg.reply_to_message.document) {
                const { doc_mod_result, user_data, user_mod_result } = await warn_user_file(ctx.msg.reply_to_message.document.file_unique_id)
                if (doc_mod_result?.modifiedCount != 0) {
                    if (user_mod_result.modifiedCount != 0) {
                        try {
                            await bot.api.sendMessage(user_data.user_id, `<b>You have warned for sending porn or unwanted message</b>`)
                        } catch (error: any) {
                            console.log("Error on sending warn meessage on terminate command ownerComposer", error.message);

                        }
                        await ctx.reply(`Banned ${doc_mod_result?.modifiedCount} file in document Collection\n\nWarned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" })
                    } else {
                        await ctx.reply(`Banned ${doc_mod_result?.modifiedCount} file in document Collection\n\n<b>Max Warning Reached, user need to be banned</b>`, { parse_mode: "HTML" })
                    }
                } else {
                    await ctx.reply(`file already Banned ;)`)
                }
            } else if (ctx.msg.reply_to_message.video) {
                const { vid_mod_result, user_data, user_mod_result } = await warn_user_file(ctx.msg.reply_to_message.document.file_unique_id)
                if (vid_mod_result?.modifiedCount != 0) {
                    if (user_mod_result.modifiedCount != 0) {
                        try {
                            await bot.api.sendMessage(user_data.user_id, `<b>You have warned for sending porn or unwanted message</b>`)
                        } catch (error: any) {
                            console.log("Error on sending warn meessage on terminate command ownerComposer", error.message);

                        }
                        await ctx.reply(`Banned ${vid_mod_result?.modifiedCount} file in document Collection\n\nWarned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" })
                    } else {
                        await ctx.reply(`Banned ${vid_mod_result?.modifiedCount} file in document Collection\n\n<b>Max Warning Reached, user need to be banned</b>`, { parse_mode: "HTML" })
                    }
                } else {
                    await ctx.reply(`file already Banned ;)`)
                }
            } else if (ctx.msg.reply_to_message.audio) {
                const { aud_mod_result, user_data, user_mod_result } = await warn_user_file(ctx.msg.reply_to_message.document.file_unique_id)
                if (aud_mod_result?.modifiedCount != 0) {
                    if (user_mod_result.modifiedCount != 0) {
                        try {
                            await bot.api.sendMessage(user_data.user_id, `<b>You have warned for sending porn or unwanted message</b>`)
                        } catch (error: any) {
                            console.log("Error on sending warn meessage on terminate command ownerComposer", error.message);

                        }
                        await ctx.reply(`Banned ${aud_mod_result?.modifiedCount} file in document Collection\n\nWarned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" })
                    } else {
                        await ctx.reply(`Banned ${aud_mod_result?.modifiedCount} file in document Collection\n\n<b>Max Warning Reached, user need to be banned</b>`, { parse_mode: "HTML" })
                    }
                } else {
                    await ctx.reply(`file already Banned ;)`)
                }
            }
        }
    } catch (error: any) {
        console.log("Error at warning user in ownerComposer", error.message);
    }
    await next();
})