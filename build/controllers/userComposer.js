import { Composer } from "grammy";
import { insert_audio, insert_document, insert_user, insert_video, search_audio_file_id, search_document_file_id, search_video_file_id } from "../functions/dbFunc.js";
import { cleanFileName, extractSearchTerm, keyboardlist } from "../functions/helperFunc.js";
export const userComposer = new Composer;
userComposer.on("callback_query:data", async (ctx) => {
    var _a;
    try {
        const calldata = ctx.update.callback_query.data;
        const calladatanext = calldata.match(/\^next/);
        const calladataprev = calldata.match(/\^prev/);
        const calladatafile = calldata.match(/file/);
        const messageText = (_a = ctx.update.callback_query.message) === null || _a === void 0 ? void 0 : _a.text;
        const searchTerm = extractSearchTerm(messageText);
        const data = calldata.split('__');
        ///below code is for nav button click
        const thread_id_nav = Number(data[2]);
        /////below code is for the file name button click
        const file_thread_id = Number(data[2]); //checking the the req from if its from a specific thread id
        const file_unique_id = data[1];
        if (calladatafile) {
            if (file_thread_id.toString() == process.env.DOC_THREAD_ID) {
                const { filteredDocs } = await search_document_file_id(file_unique_id);
                await ctx.answerCallbackQuery({
                    text: `${filteredDocs.file_name}`,
                    show_alert: true,
                });
                // if (filteredDocs.file_caption) {
                //     await ctx.replyWithDocument(filteredDocs.file_id, { message_thread_id: file_thread_id, caption: filteredDocs.file_caption })
                // } else {
                //     await ctx.replyWithDocument(filteredDocs.file_id, { message_thread_id: file_thread_id, caption: filteredDocs.file_name })
                // }
            }
            else if (file_thread_id.toString() == process.env.VIDEO_THREAD_ID) {
                const { filteredDocs } = await search_video_file_id(file_unique_id);
                await ctx.answerCallbackQuery({
                    text: `${filteredDocs.file_name}`,
                    show_alert: true,
                });
                // if (filteredDocs.file_caption) {
                //     await ctx.replyWithVideo(filteredDocs.file_id, { message_thread_id: file_thread_id, caption: filteredDocs.file_caption })
                // } else {
                //     await ctx.replyWithVideo(filteredDocs.file_id, { message_thread_id: file_thread_id, caption: filteredDocs.file_name })
                // }
            }
            else if (file_thread_id.toString() == process.env.AUDIO_THREAD_ID) {
                const { filteredDocs } = await search_audio_file_id(file_unique_id);
                await ctx.answerCallbackQuery({
                    text: `${filteredDocs.file_name}`,
                    show_alert: true,
                });
                // if (filteredDocs.file_caption) {
                //     await ctx.replyWithVideo(filteredDocs.file_id, { message_thread_id: file_thread_id, caption: filteredDocs.file_caption })
                // } else {
                //     await ctx.replyWithVideo(filteredDocs.file_id, { message_thread_id: file_thread_id, caption: filteredDocs.file_name })
                // }
            }
        }
        if (ctx.update.callback_query.message.entities[0].user.id == ctx.from.id) { //checks if the same user is clicking the button
            //get next page
            if (calladatanext) {
                const page = Number(data[1]);
                const nextpage = page + 1;
                const inlineKeyboard = await keyboardlist(ctx, nextpage, searchTerm, thread_id_nav);
                await ctx.editMessageText(`Hey <a href="tg://user?id=${ctx.update.callback_query.message.entities[0].user.id}">${ctx.update.callback_query.message.entities[0].user.first_name}</a> , You Searched For: <code>${searchTerm}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: thread_id_nav });
            }
            //get prev page
            if (calladataprev) {
                const page = Number(data[1]);
                const prevpage = page - 1;
                const inlineKeyboard = await keyboardlist(ctx, prevpage, searchTerm, thread_id_nav);
                await ctx.editMessageText(`Hey <a href="tg://user?id=${ctx.update.callback_query.message.entities[0].user.id}">${ctx.update.callback_query.message.entities[0].user.first_name}</a> , You Searched For: <code>${searchTerm}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: thread_id_nav });
            }
        }
        else {
            await ctx.answerCallbackQuery({
                text: "Request for yourself 😊",
                show_alert: true,
            });
        }
    }
    catch (error) {
        console.log("Error in callback_query:data at UserComposer", error.message);
    }
});
//////////////////////////////////////////////////////////////////////////////////////////
userComposer.chatType("private").command("start", async (ctx) => {
    try {
        if (ctx.match) {
            const parts = ctx.match.split("__");
            const file_unique_id = parts[1];
            const type = parts[0];
            if (type == "doc") {
                const { filteredDocs } = await search_document_file_id(file_unique_id);
                if (filteredDocs.file_caption != "") {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_caption });
                }
                else {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_name });
                }
            }
            else if (type == "vid") {
                const { filteredDocs } = await search_video_file_id(file_unique_id);
                if (filteredDocs.file_caption != "") {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_caption });
                }
                else {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_name });
                }
            }
            else if (type == "aud") {
                const { filteredDocs } = await search_audio_file_id(file_unique_id);
                if (filteredDocs.file_caption != "") {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_caption });
                }
                else {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_name });
                }
            }
        }
        else {
            if (ctx.from) {
                const data = {
                    user_id: ctx.from.id,
                    first_name: ctx.from.first_name,
                    warn: 0,
                    is_banned: false
                };
                await insert_user(data);
            }
            ctx.reply(`👋 Hi, I'm ${ctx.me.first_name}! 📄🎥🎵 Send me your documents, videos, and audios, and I'll store them for public use. You can access them later from our group. <blockquote>Please note that the bot is in the beta phase, and all files will be deleted upon stable release.</blockquote> 🌟 Access our group here: https://t.me/+Q1fGy7GpkJ81NjA1`);
        }
    }
    catch (error) {
    }
});
userComposer.chatType("private").command("info", async (ctx, next) => {
    try {
        if (ctx.msg.chat.type == 'private') {
            const replyMessage = ctx.msg.reply_to_message;
            if (replyMessage) {
                if (replyMessage.document) {
                    ctx.reply(`<pre language="json">id: ${replyMessage.document.file_unique_id}</pre>`, { parse_mode: "HTML" });
                }
                else if (replyMessage.video) {
                    ctx.reply(`<pre language="json">id: ${replyMessage.video.file_unique_id}</pre>`, { parse_mode: "HTML" });
                }
                else if (replyMessage.audio) {
                    ctx.reply(`<pre language="json">id: ${replyMessage.audio.file_unique_id}</pre>`, { parse_mode: "HTML" });
                }
            }
            else {
                ctx.reply("Please reply to a message containing a document, video, or audio.");
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
    await next();
});
userComposer.chatType("private").on(":file", async (ctx, next) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    try {
        if (ctx.msg.document) {
            const file_name = cleanFileName(ctx.msg.document.file_name);
            const file_caption = cleanFileName((_a = ctx.msg.caption) !== null && _a !== void 0 ? _a : '');
            const data = {
                user_id: (_b = ctx.msg.from) === null || _b === void 0 ? void 0 : _b.id,
                first_name: (_c = ctx.msg.from) === null || _c === void 0 ? void 0 : _c.first_name,
                file_id: ctx.msg.document.file_id,
                file_name: file_name,
                file_caption: file_caption,
                file_unique_id: ctx.msg.document.file_unique_id,
                file_size: ctx.msg.document.file_size,
                is_banned: false,
            };
            await insert_document(data);
        }
        else if (ctx.msg.video) {
            const file_name = cleanFileName(ctx.msg.video.file_name);
            const file_caption = cleanFileName((_d = ctx.msg.caption) !== null && _d !== void 0 ? _d : '');
            const data = {
                user_id: (_e = ctx.msg.from) === null || _e === void 0 ? void 0 : _e.id,
                first_name: (_f = ctx.msg.from) === null || _f === void 0 ? void 0 : _f.first_name,
                file_id: ctx.msg.video.file_id,
                file_name: file_name,
                file_caption: file_caption,
                file_unique_id: ctx.msg.video.file_unique_id,
                file_size: ctx.msg.video.file_size,
                is_banned: false,
            };
            await insert_video(data);
        }
        else if (ctx.msg.audio) {
            const file_name = cleanFileName(ctx.msg.audio.file_name);
            const file_caption = cleanFileName((_g = ctx.msg.caption) !== null && _g !== void 0 ? _g : '');
            const data = {
                user_id: (_h = ctx.msg.from) === null || _h === void 0 ? void 0 : _h.id,
                first_name: (_j = ctx.msg.from) === null || _j === void 0 ? void 0 : _j.first_name,
                file_id: (_k = ctx.msg.audio) === null || _k === void 0 ? void 0 : _k.file_id,
                file_name: file_name,
                file_caption: file_caption,
                file_unique_id: (_l = ctx.msg.audio) === null || _l === void 0 ? void 0 : _l.file_unique_id,
                file_size: (_m = ctx.msg.audio) === null || _m === void 0 ? void 0 : _m.file_size,
                is_banned: false,
                // add performer section
            };
            await insert_audio(data);
        }
    }
    catch (error) {
        console.log(error.message);
    }
    await next();
});
userComposer.on(":text", async (ctx, next) => {
    var _a, _b, _c, _d, _e, _f;
    try {
        const msgDeleteTime = parseInt(process.env.MESSAGE_DELETE_TIME || "");
        const searchparam = ctx.msg.text;
        const inlineKeyboard = await keyboardlist(ctx, 1, searchparam, ctx.msg.message_thread_id);
        if (inlineKeyboard) {
            if (ctx.msg.message_thread_id == process.env.DOC_THREAD_ID) {
                const { message_id } = await ctx.reply(`Hey <a href="tg://user?id=${(_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id}">${(_b = ctx.from) === null || _b === void 0 ? void 0 : _b.first_name}</a> , You Searched For: <code>${searchparam}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: process.env.DOC_THREAD_ID });
                setTimeout(async () => {
                    await ctx.api.deleteMessage(ctx.chat.id, message_id);
                    await ctx.deleteMessage();
                }, msgDeleteTime);
            }
            else if (ctx.msg.message_thread_id == process.env.VIDEO_THREAD_ID) {
                const { message_id } = await ctx.reply(`Hey <a href="tg://user?id=${(_c = ctx.from) === null || _c === void 0 ? void 0 : _c.id}">${(_d = ctx.from) === null || _d === void 0 ? void 0 : _d.first_name}</a> , You Searched For: <code>${searchparam}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: process.env.VIDEO_THREAD_ID });
                setTimeout(async () => {
                    await ctx.api.deleteMessage(ctx.chat.id, message_id);
                    await ctx.deleteMessage();
                }, msgDeleteTime);
            }
            else if (ctx.msg.message_thread_id == process.env.AUDIO_THREAD_ID) {
                const { message_id } = await ctx.reply(`Hey <a href="tg://user?id=${(_e = ctx.from) === null || _e === void 0 ? void 0 : _e.id}">${(_f = ctx.from) === null || _f === void 0 ? void 0 : _f.first_name}</a> , You Searched For: <code>${searchparam}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: process.env.AUDIO_THREAD_ID });
                setTimeout(async () => {
                    await ctx.api.deleteMessage(ctx.chat.id, message_id);
                    await ctx.deleteMessage();
                }, msgDeleteTime);
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
    await next();
});
