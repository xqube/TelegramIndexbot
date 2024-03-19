import { Composer, Context, InlineKeyboard } from "grammy";
import { insertDoc, insertVideo, searchDoc, searchDocFileid, searchVid, searchVidFileid } from "../functions/dbFunc.js";
import { bytesToMegabytes, cleanFileName, extractSearchTerm } from "../functions/helperFunc.js";


export const botComposer = new Composer<Context>

async function keyboardlist(ctx: any, page: number, searchTerm: string, threadid: number | undefined) {
    const inlineKeyboard = new InlineKeyboard()
    if (threadid == process.env.DOC_THREAD_ID) {
        const { filteredDocs, totalsize } = await searchDoc(searchTerm, page);
        const totalPages = Math.ceil(totalsize / 10);
        // Display paginated data
        if (filteredDocs.length === 0) {
            await ctx.reply("No documents found.", { message_thread_id: threadid });
            return;
        } else {
            (filteredDocs.map((doc: any) => {
                const file_size = bytesToMegabytes(doc.file_size)
                inlineKeyboard
                    .text(doc.file_name, `${doc.file_unique_id}_${threadid}`)
                    .text(file_size.toFixed(1) + 'MB 📩')
                    .row()
            }));
        }
        if (page == 1 && page < totalPages) {
            inlineKeyboard
                .text("Next>>", `^next_${page}_${threadid}`).row()
        } else if (page > 1 && page < totalPages) {
            inlineKeyboard.text("<<Prev", `^prev_${page}_${threadid}`)
                .text("Next>>", `^next_${page}_${threadid}`).row()
        } else if (page == totalPages && page != 1) {
            inlineKeyboard.text("<<Prev", `^prev_${page}_${threadid}`)
        }

    } else if (threadid == process.env.VIDEO_THREAD_ID) {
        const { filteredDocs, totalsize } = await searchVid(searchTerm, page);
        const totalPages = Math.ceil(totalsize / 10);
        // Display paginated data
        if (filteredDocs.length === 0) {
            await ctx.reply("No documents found.", { message_thread_id: threadid });
            return;
        } else {
            (filteredDocs.map((doc: any) => {
                const file_size = bytesToMegabytes(doc.file_size)
                inlineKeyboard
                    .text(doc.file_name, `${doc.file_unique_id}_${threadid}`)
                    .text(file_size.toFixed(1) + 'MB 📩')
                    .row()
            }));
        }
        if (page == 1 && page < totalPages) {
            inlineKeyboard
                .text("Next>>", `^next_${page}_${threadid}`).row()
        } else if (page > 1 && page < totalPages) {
            inlineKeyboard.text("<<Prev", `^prev_${page}_${threadid}`)
                .text("Next>>", `^next_${page}_${threadid}`).row()
        } else if (page == totalPages && page != 1) {
            inlineKeyboard.text("<<Prev", `^prev_${page}_${threadid}`)
        }
    }
    return inlineKeyboard
}


botComposer.on("callback_query:data", async (ctx: any) => {
    try {
        const calldata = ctx.update.callback_query.data
        const calladatanext = calldata.match(/\^next/)
        const calladataprev = calldata.match(/\^prev/)
        const searchTerm: any = extractSearchTerm(ctx.update.callback_query.message.text)
        const data = calldata.split('_')
        const thread_id_nav= Number(data[2])
        const file_thread_id= Number(data[1])
        const file_unique_id = data[0]
        
        

        if (file_thread_id.toString() == process.env.DOC_THREAD_ID) {
            const { filteredDocs } = await searchDocFileid(file_unique_id) 
            await ctx.replyWithDocument(filteredDocs.file_id, { message_thread_id: file_thread_id })
        } else if (file_thread_id.toString() == process.env.VIDEO_THREAD_ID) {
            const { filteredDocs } = await searchVidFileid(file_unique_id)
            await ctx.replyWithVideo(filteredDocs.file_id, { message_thread_id: file_thread_id })
        }

        //get next page
        if (calladatanext) {
            const page = Number(data[1])
            const nextpage = page + 1
            const inlineKeyboard = await keyboardlist(ctx, nextpage, searchTerm, thread_id_nav)
            await ctx.editMessageText(`Searched For: <code>${searchTerm}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: thread_id_nav });

        }

        if (calladataprev) {
            const page = Number(data[1])
            const prevpage = page - 1
            const inlineKeyboard = await keyboardlist(ctx, prevpage, searchTerm, thread_id_nav)
            await ctx.editMessageText(`Searched For: <code>${searchTerm}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: thread_id_nav });

        }

    } catch (error: any) {
        console.log(error.message);
    }

})

//////////////////////////////////////////////////////////////////////////////////////////


botComposer.command("start", (ctx) => {
    ctx.reply("Bot made by @N_0_D_E")
})

botComposer.on(":file", (ctx) => {
    if (ctx.msg.document) {
        const file_name = cleanFileName(ctx.msg.document.file_name)
        const data = {
            userid: ctx.msg.from?.id,
            first_name: ctx.msg.from?.first_name,
            file_id: ctx.msg.document.file_id,
            file_name: file_name,
            file_caption: ctx.msg.caption,
            file_unique_id: ctx.msg.document.file_unique_id,
            file_size: ctx.msg.document.file_size,
            type: "doc"
        }
        insertDoc(data)
    } else if (ctx.msg.video) {
        const file_name = cleanFileName(ctx.msg.video.file_name)
        const data = {
            userid: ctx.msg.from?.id,
            first_name: ctx.msg.from?.first_name,
            file_id: ctx.msg.video.file_id,
            file_name: file_name,
            file_caption: ctx.msg.caption,
            file_unique_id: ctx.msg.video.file_unique_id,
            file_size: ctx.msg.video.file_size,
            type: "video"
        }
        insertVideo(data)
    }
})


botComposer.on(":text", async (ctx) => {
    try {
        const searchparam = ctx.msg.text
        console.log(searchparam);
        const inlineKeyboard = await keyboardlist(ctx, 1, searchparam, ctx.msg.message_thread_id)
        if (inlineKeyboard) {
            if (ctx.msg.message_thread_id == process.env.DOC_THREAD_ID) {
                await ctx.reply(`Searched For: <code>${searchparam}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: process.env.DOC_THREAD_ID });
            } else if (ctx.msg.message_thread_id == process.env.VIDEO_THREAD_ID) {
                await ctx.reply(`Searched For: <code>${searchparam}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML", message_thread_id: process.env.VIDEO_THREAD_ID });
            }
        }
    } catch (error: any) {
        console.log(error.message);
    }
});

