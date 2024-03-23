import { Composer } from "grammy";
import { sysinfo } from "../plugins/sysinfo.js";
import { terminate_user_files, terminate_user_files_reply, remove_file, warn_user_file, reinstate_user_files, reinstate_user_files_reply, restore_file, rwarn_user, ban_user, unban_user, get_file_details, get_user_data, get_db_data } from "../functions/dbFunc.js";
import { bot } from "../bot.js";
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
ownerComposer.command("lookdb", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.msg.reply_to_message.document) {
                const { doc_result } = await get_file_details(ctx.msg.reply_to_message.document.file_unique_id);
                const data = JSON.stringify(doc_result, null, 4);
                await ctx.reply(`<pre language="json">${data}</pre>`, { parse_mode: "HTML" });
            }
            else if (ctx.msg.reply_to_message.video) {
                const { vid_result } = await get_file_details(ctx.msg.reply_to_message.video.file_unique_id);
                const data = JSON.stringify(vid_result, null, 4);
                await ctx.reply(`<pre language="json">${data}</pre>`, { parse_mode: "HTML" });
            }
            else if (ctx.msg.reply_to_message.audio) {
                const { aud_result } = await get_file_details(ctx.msg.reply_to_message.audio.file_unique_id);
                const data = JSON.stringify(aud_result, null, 4);
                await ctx.reply(`<pre language="json">${data}</pre>`, { parse_mode: "HTML" });
            }
        }
    }
    catch (error) {
        console.log("Error at db in owner Composer", error.message);
    }
    await next();
});
ownerComposer.command("user", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        const from = ctx.msg.from;
        if (from) {
            if (ctx.msg.chat.type === 'private' && admins.includes(from.id)) {
                if (ctx.match) {
                    const user_data = await get_user_data(parseInt(ctx.match));
                    const data = JSON.stringify(user_data, null, 4);
                    await ctx.reply(`<pre language="json">${data}</pre>`, { parse_mode: "HTML" });
                }
            }
        }
    }
    catch (error) {
        console.log("Error at user command in owner Composer", error.message);
    }
    await next();
});
ownerComposer.command("stats", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        const from = ctx.msg.from;
        if (from) {
            if (ctx.msg.chat.type === 'private' && admins.includes(from.id)) {
                const dbdata = await get_db_data();
                const data = JSON.stringify(dbdata, null, 4);
                await ctx.reply(`<pre language="json">${data}</pre>`, { parse_mode: "HTML" });
            }
        }
    }
    catch (error) {
        console.log("Error at user command in owner Composer", error.message);
    }
    await next();
});
ownerComposer.command("info", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.msg.reply_to_message) {
                const data = JSON.stringify(ctx.msg.reply_to_message, null, 4);
                await ctx.reply(`<pre language="json">${data}</pre>`, { parse_mode: "HTML" });
            }
        }
    }
    catch (error) {
        console.log("Error at remove in owner Composer", error.message);
    }
    await next();
});
ownerComposer.command("terminate", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { doc_mod_result, vid_mod_result, aud_mod_result, user_mod_result, user_data } = await terminate_user_files(parseInt(ctx.match));
                console.log(user_data);
                if (doc_mod_result.modifiedCount != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                    if (user_mod_result.modifiedCount != 0) {
                        try {
                            await bot.api.sendMessage(ctx.match, `<b>We regret to inform you that your access to our system has been revoked. You will no longer be able to index files.</b>`, { parse_mode: "HTML" });
                        }
                        catch (error) {
                            console.log("Error on sending ban meessage on terminate command ownerComposer", error.message);
                        }
                    }
                    else {
                        await ctx.reply(`User is already Banned`);
                    }
                    await ctx.reply(`Banned ${doc_mod_result.modifiedCount} file in document Collection\n\nBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nBanned ${aud_mod_result.modifiedCount} file in audio Collection\n\nBanned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data === null || user_data === void 0 ? void 0 : user_data.user_id}</code>]`, { parse_mode: "HTML" });
                }
                else {
                    await ctx.reply(`Users files already Banned ;)`);
                }
            }
            else if (ctx.msg.reply_to_message.document || ctx.msg.reply_to_message.video || ctx.msg.reply_to_message.audio) {
                const { doc_mod_result, vid_mod_result, aud_mod_result, user_data, user_mod_result } = await terminate_user_files_reply(ctx.msg.reply_to_message.document.file_unique_id);
                if (doc_mod_result.modifiedCount != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                    if (user_mod_result.modifiedCount != 0) {
                        try {
                            await bot.api.sendMessage(user_data.user_id, `<b>We regret to inform you that your access to our system has been revoked. You will no longer be able to index files.</b>`, { parse_mode: "HTML" });
                        }
                        catch (error) {
                            console.log("Error on sending ban meessage on terminate command ownerComposer", error.message);
                        }
                    }
                    else {
                        await ctx.reply(`User is already Banned`);
                    }
                    await ctx.reply(`Banned ${doc_mod_result.modifiedCount} file in document Collection\n\nBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nBanned ${aud_mod_result.modifiedCount} file in audio Collection\n\nBanned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                }
                else {
                    await ctx.reply(`Users files already Banned ;)`);
                }
            }
        }
    }
    catch (error) {
        console.log("Error at terminate in owner Composer", error.message);
    }
    await next();
});
ownerComposer.command("reinstate", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { doc_mod_result, vid_mod_result, aud_mod_result, user_mod_result, user_data } = await reinstate_user_files(Number(ctx.match));
                if (doc_mod_result.modifiedCount != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                    if (user_mod_result.modifiedCount != 0) {
                        try {
                            await bot.api.sendMessage(ctx.match, `<b>🎉 Good news! Your access to our system has been reinstated, and your previously banned files are now unbanned. You are now able to index new files again. 📁</b>`, { parse_mode: "HTML" });
                        }
                        catch (error) {
                            console.log("Error on sending uban meessage on reinstate command ownerComposer", error.message);
                        }
                    }
                    else {
                        await ctx.reply(`User is already UnBanned`);
                    }
                    await ctx.reply(`UnBanned ${doc_mod_result.modifiedCount} file in document Collection\n\nUnBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nUnBanned ${aud_mod_result.modifiedCount} file in audio Collection\n\nUnBanned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                }
                else {
                    await ctx.reply(`Users files already UnBanned ;)`);
                }
            }
            else if (ctx.msg.reply_to_message.document || ctx.msg.reply_to_message.video || ctx.msg.reply_to_message.audio) {
                const { doc_mod_result, vid_mod_result, aud_mod_result, user_data, user_mod_result } = await reinstate_user_files_reply(ctx.msg.reply_to_message.document.file_unique_id);
                if (doc_mod_result.modifiedCount != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                    if (user_mod_result.modifiedCount != 0) {
                        try {
                            await bot.api.sendMessage(user_data.user_id, `<b>🎉 Good news! Your access to our system has been reinstated, and your previously banned files are now unbanned. You are now able to index new files again. 📁</b>`, { parse_mode: "HTML" });
                        }
                        catch (error) {
                            console.log("Error on sending uban meessage on reinstate command ownerComposer", error.message);
                        }
                    }
                    else {
                        await ctx.reply(`User is already UnBanned`);
                    }
                    await ctx.reply(`UnBanned ${doc_mod_result.modifiedCount} file in document Collection\n\nUnBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nUnBanned ${aud_mod_result.modifiedCount} file in audio Collection\n\nUnBanned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                }
                else {
                    await ctx.reply(`Users files already UnBanned ;)`);
                }
            }
        }
    }
    catch (error) {
        console.log("Error at reinstate in owner Composer", error.message);
    }
    await next();
});
ownerComposer.command("remove", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { doc_mod_result, vid_mod_result, aud_mod_result } = await remove_file(ctx.match);
                if (doc_mod_result.modifiedCount != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${doc_mod_result.modifiedCount} file in document Collection\n\nBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nBanned ${aud_mod_result.modifiedCount} file in audio Collection`);
                }
                else {
                    await ctx.reply(`file already Banned ;)`);
                }
            }
            else if (ctx.msg.reply_to_message.document) {
                const { doc_mod_result } = await remove_file(ctx.msg.reply_to_message.document.file_unique_id);
                if (doc_mod_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${doc_mod_result.modifiedCount} file in document Collection`);
                }
                else {
                    await ctx.reply(`file already Banned ;)`);
                }
            }
            else if (ctx.msg.reply_to_message.video) {
                const { vid_mod_result } = await remove_file(ctx.msg.reply_to_message.video.file_unique_id);
                if (vid_mod_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${vid_mod_result.modifiedCount} file in document Collection`);
                }
                else {
                    await ctx.reply(`file already Banned ;)`);
                }
            }
            else if (ctx.msg.reply_to_message.audio) {
                const { aud_mod_result } = await remove_file(ctx.msg.reply_to_message.audio.file_unique_id);
                if (aud_mod_result.modifiedCount != 0) {
                    await ctx.reply(`Banned ${aud_mod_result.modifiedCount} file in document Collection`);
                }
                else {
                    await ctx.reply(`file already Banned ;)`);
                }
            }
        }
    }
    catch (error) {
        console.log("Error at remove in owner Composer", error.message);
    }
    await next();
});
ownerComposer.command("restore", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { doc_mod_result, vid_mod_result, aud_mod_result } = await restore_file(ctx.match);
                if (doc_mod_result.modifiedCount != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                    await ctx.reply(`UnBanned ${doc_mod_result.modifiedCount} file in document Collection\n\nUnBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nUnBanned ${aud_mod_result.modifiedCount} file in audio Collection`);
                }
                else {
                    await ctx.reply(`file already UnBanned ;)`);
                }
            }
            else if (ctx.msg.reply_to_message.document) {
                const { doc_mod_result } = await restore_file(ctx.msg.reply_to_message.document.file_unique_id);
                if (doc_mod_result.modifiedCount != 0) {
                    await ctx.reply(`UnBanned ${doc_mod_result.modifiedCount} file in document Collection`);
                }
                else {
                    await ctx.reply(`file already UnBanned ;)`);
                }
            }
            else if (ctx.msg.reply_to_message.video) {
                const { vid_mod_result } = await restore_file(ctx.msg.reply_to_message.video.file_unique_id);
                if (vid_mod_result.modifiedCount != 0) {
                    await ctx.reply(`UnBanned ${vid_mod_result.modifiedCount} file in document Collection`);
                }
                else {
                    await ctx.reply(`file already UnBanned ;)`);
                }
            }
            else if (ctx.msg.reply_to_message.audio) {
                const { aud_mod_result } = await restore_file(ctx.msg.reply_to_message.audio.file_unique_id);
                if (aud_mod_result.modifiedCount != 0) {
                    await ctx.reply(`UnBanned ${aud_mod_result.modifiedCount} file in document Collection`);
                }
                else {
                    await ctx.reply(`file already UnBanned ;)`);
                }
            }
        }
    }
    catch (error) {
        console.log("Error at restore file in owner Composer", error.message);
    }
    await next();
});
ownerComposer.command("warn", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { doc_mod_result, vid_mod_result, aud_mod_result, user_data, user_mod_result } = await warn_user_file(ctx.match);
                if ((doc_mod_result === null || doc_mod_result === void 0 ? void 0 : doc_mod_result.modifiedCount) != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                    if (user_mod_result) {
                        try {
                            await bot.api.sendMessage(user_data.user_id, `<b>⚠️ Warning:</b> You have received a warning for sending inappropriate content or unwanted messages. \n\n🚫 Warn: ${user_data.warn + 1}/${process.env.WARN_LIMIT}. Each unwanted file sent will result in a warning. Please be mindful before sending files.`, { parse_mode: "HTML" });
                        }
                        catch (error) {
                            console.log("Error on sending warn meessage on terminate command ownerComposer", error.message);
                        }
                        await ctx.reply(`Banned ${doc_mod_result === null || doc_mod_result === void 0 ? void 0 : doc_mod_result.modifiedCount} file in document Collection\n\nBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nBanned ${aud_mod_result.modifiedCount} file in audio Collection\n\nWarned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                    }
                    else {
                        await ctx.reply(`Banned ${doc_mod_result === null || doc_mod_result === void 0 ? void 0 : doc_mod_result.modifiedCount} file in document Collection\n\nBanned ${vid_mod_result.modifiedCount} file in video Collection\n\nBanned ${aud_mod_result.modifiedCount} file in audio Collection\n\n<b>Max Warning Reached, user need to be banned</b>\n\nUSER: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                    }
                }
                else {
                    await ctx.reply(`file already Banned ;)`);
                }
            }
            else if (ctx.msg.reply_to_message.document) {
                const { doc_mod_result, user_data, user_mod_result } = await warn_user_file(ctx.msg.reply_to_message.document.file_unique_id);
                if ((doc_mod_result === null || doc_mod_result === void 0 ? void 0 : doc_mod_result.modifiedCount) != 0) {
                    if (user_mod_result) {
                        try {
                            await bot.api.sendMessage(user_data.user_id, `<b>⚠️ Warning:</b> You have received a warning for sending inappropriate content or unwanted messages. \n\n🚫 Warn: ${user_data.warn + 1}/${process.env.WARN_LIMIT}. Each unwanted file sent will result in a warning. Please be mindful before sending files.`, { parse_mode: "HTML" });
                        }
                        catch (error) {
                            console.log("Error on sending warn meessage on terminate command ownerComposer", error.message);
                        }
                        await ctx.reply(`Banned ${doc_mod_result === null || doc_mod_result === void 0 ? void 0 : doc_mod_result.modifiedCount} file in document Collection\n\nWarned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                    }
                    else {
                        await ctx.reply(`Banned ${doc_mod_result === null || doc_mod_result === void 0 ? void 0 : doc_mod_result.modifiedCount} file in document Collection\n\n<b>Max Warning Reached, user need to be banned</b>\n\nUSER: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                    }
                }
                else {
                    await ctx.reply(`file already Banned ;)`);
                }
            }
            else if (ctx.msg.reply_to_message.video) {
                const { vid_mod_result, user_data, user_mod_result } = await warn_user_file(ctx.msg.reply_to_message.document.file_unique_id);
                if ((vid_mod_result === null || vid_mod_result === void 0 ? void 0 : vid_mod_result.modifiedCount) != 0) {
                    if (user_mod_result) {
                        try {
                            await bot.api.sendMessage(user_data.user_id, `<b>⚠️ Warning:</b> You have received a warning for sending inappropriate content or unwanted messages. \n\n🚫 Warn: ${user_data.warn + 1}/${process.env.WARN_LIMIT}. Each unwanted file sent will result in a warning. Please be mindful before sending files.`, { parse_mode: "HTML" });
                        }
                        catch (error) {
                            console.log("Error on sending warn meessage on terminate command ownerComposer", error.message);
                        }
                        await ctx.reply(`Banned ${vid_mod_result === null || vid_mod_result === void 0 ? void 0 : vid_mod_result.modifiedCount} file in document Collection\n\nWarned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                    }
                    else {
                        await ctx.reply(`Banned ${vid_mod_result === null || vid_mod_result === void 0 ? void 0 : vid_mod_result.modifiedCount} file in document Collection\n\n<b>Max Warning Reached, user need to be banned</b>\n\nUSER: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                    }
                }
                else {
                    await ctx.reply(`file already Banned ;)`);
                }
            }
            else if (ctx.msg.reply_to_message.audio) {
                const { aud_mod_result, user_data, user_mod_result } = await warn_user_file(ctx.msg.reply_to_message.document.file_unique_id);
                if ((aud_mod_result === null || aud_mod_result === void 0 ? void 0 : aud_mod_result.modifiedCount) != 0) {
                    if (user_mod_result) {
                        try {
                            await bot.api.sendMessage(user_data.user_id, `<b>⚠️ Warning:</b> You have received a warning for sending inappropriate content or unwanted messages. \n\n🚫 Warn: ${user_data.warn + 1}/${process.env.WARN_LIMIT}. Each unwanted file sent will result in a warning. Please be mindful before sending files.`, { parse_mode: "HTML" });
                        }
                        catch (error) {
                            console.log("Error on sending warn meessage on terminate command ownerComposer", error.message);
                        }
                        await ctx.reply(`Banned ${aud_mod_result === null || aud_mod_result === void 0 ? void 0 : aud_mod_result.modifiedCount} file in document Collection\n\nWarned user: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                    }
                    else {
                        await ctx.reply(`Banned ${aud_mod_result === null || aud_mod_result === void 0 ? void 0 : aud_mod_result.modifiedCount} file in document Collection\n\n<b>Max Warning Reached, user need to be banned</b>\n\nUSER: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                    }
                }
                else {
                    await ctx.reply(`file already Banned ;)`);
                }
            }
        }
    }
    catch (error) {
        console.log("Error at warning user in ownerComposer", error.message);
    }
    await next();
});
ownerComposer.command("rwarn", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { user_data, user_mod_result } = await rwarn_user(ctx.match);
                if (user_mod_result.modifiedCount != 0) {
                    try {
                        await bot.api.sendMessage(user_data.user_id, `<b>🎉 Good news! Your warning has been removed. Please be mindful when indexing files in the future. 📁</b>`, { parse_mode: "HTML" });
                        await ctx.reply(`Removed warn of USER: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                    }
                    catch (error) {
                        console.log("Error on sending warn meessage on terminate command ownerComposer", error.message);
                    }
                }
                else {
                    await ctx.reply(`User warn is already 0, USER: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                }
            }
        }
    }
    catch (error) {
        console.log("Error at rwarning user in ownerComposer", error.message);
    }
    await next();
});
ownerComposer.command("ban", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { user_data, user_mod_result } = await ban_user(ctx.match);
                if (user_mod_result.modifiedCount != 0) {
                    try {
                        await bot.api.sendMessage(user_data.user_id, `<b>Unfortunately, your access to our indexing feature has been restricted due to a violation of our policies.</b>`, { parse_mode: "HTML" });
                        await ctx.reply(`Banned the USER: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                    }
                    catch (error) {
                        console.log("Error on sending warn meessage on terminate command ownerComposer", error.message);
                    }
                }
                else {
                    await ctx.reply(`User is already banned, USER: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                }
            }
        }
    }
    catch (error) {
        console.log("Error at banning user in ownerComposer", error.message);
    }
    await next();
});
ownerComposer.command("unban", async (ctx, next) => {
    try {
        const admins = process.env.OWNERS;
        if (ctx.msg.chat.type === 'private' && admins.includes(ctx.msg.from.id)) {
            if (ctx.match) {
                const { user_data, user_mod_result } = await unban_user(ctx.match);
                if (user_mod_result.modifiedCount != 0) {
                    try {
                        await bot.api.sendMessage(user_data.user_id, `<b>We're pleased to inform you that your ban has been lifted. However, please note that files previously banned will remain restricted permanently.</b>`, { parse_mode: "HTML" });
                        await ctx.reply(`Removed BAN of USER: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                    }
                    catch (error) {
                        console.log("Error on sending warn meessage on terminate command ownerComposer", error.message);
                    }
                }
                else {
                    await ctx.reply(`User is already unbanned, USER: <a href="tg://user?id=${user_data.user_id}">${user_data.first_name}</a> [<code>${user_data.user_id}</code>]`, { parse_mode: "HTML" });
                }
            }
        }
    }
    catch (error) {
        console.log("Error at ubanning user in ownerComposer", error.message);
    }
    await next();
});
