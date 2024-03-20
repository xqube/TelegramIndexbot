import { Composer, Context } from "grammy";
import { insert_audio, insert_document, insert_user, insert_video, search_audio_file_id, search_document_file_id, search_video_file_id } from "../functions/dbFunc.js";
import { cleanFileName, extractSearchTerm, keyboardlist } from "../functions/helperFunc.js";


export const botComposer = new Composer<Context>


botComposer.on("callback_query:data", async (ctx: any) => {
    try {
        const calldata = ctx.update.callback_query.data
        const calladatanext = calldata.match(/\^next/)
        const calladataprev = calldata.match(/\^prev/)
        const calladatafile = calldata.match(/file/)
        const messageText = ctx.update.callback_query.message?.text;
        const searchTerm: any = extractSearchTerm(messageText!);
        const data = calldata.split('__')
        ///below code is for nav button click
        const thread_id_nav = Number(data[2])

        /////below code is for the file name button click
        const file_thread_id = Number(data[2])  //checking the the req from if its from a specific thread id
        const file_unique_id = data[1]

        if (calladatafile) {
            if (file_thread_id.toString() == process.env.DOC_THREAD_ID) {
                const { filteredDocs } = await search_document_file_id(file_unique_id)
                await ctx.answerCallbackQuery({
                    text: `${filteredDocs.file_name}`,
                    show_alert: true,
                });
                // if (filteredDocs.file_caption) {
                //     await ctx.replyWithDocument(filteredDocs.file_id, { message_thread_id: file_thread_id, caption: filteredDocs.file_caption })
                // } else {
                //     await ctx.replyWithDocument(filteredDocs.file_id, { message_thread_id: file_thread_id, caption: filteredDocs.file_name })
                // }
            } else if (file_thread_id.toString() == process.env.VIDEO_THREAD_ID) {
                const { filteredDocs } = await search_video_file_id(file_unique_id)
                await ctx.answerCallbackQuery({
                    text: `${filteredDocs.file_name}`,
                    show_alert: true,
                });
                // if (filteredDocs.file_caption) {
                //     await ctx.replyWithVideo(filteredDocs.file_id, { message_thread_id: file_thread_id, caption: filteredDocs.file_caption })
                // } else {
                //     await ctx.replyWithVideo(filteredDocs.file_id, { message_thread_id: file_thread_id, caption: filteredDocs.file_name })
                // }
            } else if (file_thread_id.toString() == process.env.AUDIO_THREAD_ID) {
                const { filteredDocs } = await search_audio_file_id(file_unique_id)
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
                const page = Number(data[1])
                const nextpage = page + 1
                const inlineKeyboard = await keyboardlist(ctx, nextpage, searchTerm, thread_id_nav)
                await ctx.editMessageText(`Hey <a href="tg://user?id=${ctx.update.callback_query.message.entities[0].user.id}">${ctx.update.callback_query.message.entities[0].user.first_name}</a> , You Searched For: <code>${searchTerm}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: thread_id_nav });
            }
            //get prev page
            if (calladataprev) {
                const page = Number(data[1])
                const prevpage = page - 1
                const inlineKeyboard = await keyboardlist(ctx, prevpage, searchTerm, thread_id_nav)
                await ctx.editMessageText(`Hey <a href="tg://user?id=${ctx.update.callback_query.message.entities[0].user.id}">${ctx.update.callback_query.message.entities[0].user.first_name}</a> , You Searched For: <code>${searchTerm}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: thread_id_nav });
            }
        } else {
            await ctx.answerCallbackQuery({
                text: "Request for yourself 😊",
                show_alert: true,
            });
        }

    } catch (error: any) {
        console.log("Error in callback_query:data at UserComposer", error.message);
    }

})

//////////////////////////////////////////////////////////////////////////////////////////

botComposer.chatType("private").command("start", async (ctx) => {
    try {
        if (ctx.match) {
            const parts = ctx.match.split("__");
            const file_unique_id = parts[1]
            const type = parts[0]
            if (type == "doc") {
                const { filteredDocs } = await search_document_file_id(file_unique_id)
                if (filteredDocs.file_caption) {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_caption })
                } else {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_name })
                }
            } else if (type == "vid") {
                const { filteredDocs } = await search_video_file_id(file_unique_id)
                if (filteredDocs.file_caption) {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_caption })
                } else {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_name })
                }
            } else if (type == "aud") {
                const { filteredDocs } = await search_audio_file_id(file_unique_id)
                if (filteredDocs.file_caption) {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_caption })
                } else {
                    await ctx.replyWithDocument(filteredDocs.file_id, { caption: filteredDocs.file_name })
                }
            }
        } else ctx.reply("Hi, send me Documents, videos and audios")
    } catch (error) {

    }
})




botComposer.chatType("private").on(":file", async (ctx) => {
    try {
        if (ctx.msg.document) {
            const file_name = cleanFileName(ctx.msg.document.file_name)
            const file_caption = cleanFileName(ctx.msg.caption ?? '')
            const data = {
                userid: ctx.msg.from?.id,
                first_name: ctx.msg.from?.first_name,
                file_id: ctx.msg.document.file_id,
                file_name: file_name,
                file_caption: file_caption,
                file_unique_id: ctx.msg.document.file_unique_id,
                file_size: ctx.msg.document.file_size,
            }
            await insert_document(data)
        } else if (ctx.msg.video) {
            const file_name = cleanFileName(ctx.msg.video.file_name)
            const file_caption = cleanFileName(ctx.msg.caption ?? '')
            const data = {
                userid: ctx.msg.from?.id,
                first_name: ctx.msg.from?.first_name,
                file_id: ctx.msg.video.file_id,
                file_name: file_name,
                file_caption: file_caption,
                file_unique_id: ctx.msg.video.file_unique_id,
                file_size: ctx.msg.video.file_size,
            }
            await insert_video(data)
        } else if (ctx.msg.audio) {
            const file_name = cleanFileName(ctx.msg.audio.file_name)
            const file_caption = cleanFileName(ctx.msg.caption ?? '')
            const data = {
                userid: ctx.msg.from?.id,
                first_name: ctx.msg.from?.first_name,
                file_id: ctx.msg.audio?.file_id,
                file_name: file_name,
                file_caption: file_caption,
                file_unique_id: ctx.msg.audio?.file_unique_id,
                file_size: ctx.msg.audio?.file_size,
                // add performer section
            }
            await insert_audio(data)
        }
    } catch (error: any) {
        console.log(error.message);
    }
})


botComposer.on(":text", async (ctx) => {
    try {
        const searchparam = ctx.msg.text
        const inlineKeyboard = await keyboardlist(ctx, 1, searchparam, ctx.msg.message_thread_id)
        if (inlineKeyboard) {
            if (ctx.msg.message_thread_id == process.env.DOC_THREAD_ID) {
                await ctx.reply(`Hey <a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a> , You Searched For: <code>${searchparam}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: process.env.DOC_THREAD_ID });
            } else if (ctx.msg.message_thread_id == process.env.VIDEO_THREAD_ID) {
                await ctx.reply(`Hey <a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a> , You Searched For: <code>${searchparam}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: process.env.VIDEO_THREAD_ID });
            } else if (ctx.msg.message_thread_id == process.env.AUDIO_THREAD_ID) {
                await ctx.reply(`Hey <a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a> , You Searched For: <code>${searchparam}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: process.env.AUDIO_THREAD_ID });
            }
        }
        if (ctx.from) {
            const data = {
                id: ctx.from.id,
                first_name: ctx.from.first_name,
            }
            await insert_user(data)
        }
    } catch (error: any) {
        console.log(error.message);
    }
});








