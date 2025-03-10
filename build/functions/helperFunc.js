import { InlineKeyboard } from "grammy";
import { search_audio, search_document, search_video } from "./dbFunc.js";
import { hashStringWithKeyToBase64Url } from "../plugins/base64.js";
export async function keyboardlist(ctx, page, searchTerm, threadid) {
    try {
        const msgDeleteTime = parseInt(process.env.MESSAGE_DELETE_TIME || "");
        const inlineKeyboard = new InlineKeyboard();
        const currentHour = new Date().getHours().toString();
        const encodedString = hashStringWithKeyToBase64Url(currentHour, ctx.msg.from.id.toString()).slice(22);
        if (threadid == process.env.DOC_THREAD_ID) {
            const { filteredDocs, totalsize } = await search_document(searchTerm, page);
            const totalPages = Math.ceil(totalsize / 10);
            // Display paginated data
            if (filteredDocs.length === 0) {
                const { message_id } = await ctx.reply("No Document found.", {
                    message_thread_id: threadid,
                });
                setTimeout(async () => {
                    try {
                        await ctx.api.deleteMessage(ctx.chat.id, message_id);
                    }
                    catch (error) {
                        console.log(error.message);
                    }
                }, msgDeleteTime);
                return;
            }
            else {
                filteredDocs.map(async (doc) => {
                    const file_size = bytesToMegabytes(doc.file_size);
                    inlineKeyboard
                        .text(doc.file_name, `file__${doc.file_unique_id}__${threadid}`) //changed it to __ coz fileid can have an underscore
                        .url(file_size.toFixed(1) + "MB 📩", `https://t.me/${process.env.BOT_USERNAME}?start=doc_-_${doc.file_unique_id}_-_${encodedString}`)
                        .row();
                });
            }
            if (page == 1 && page < totalPages) {
                inlineKeyboard.text("Next>>", `^next__${page}__${threadid}`).row();
            }
            else if (page > 1 && page < totalPages) {
                inlineKeyboard
                    .text("<<Prev", `^prev__${page}__${threadid}`)
                    .text(`${page}/${totalPages}📄`)
                    .text("Next>>", `^next__${page}__${threadid}`)
                    .row();
            }
            else if (page == totalPages && page != 1) {
                inlineKeyboard.text("<<Prev", `^prev__${page}__${threadid}`).row();
            }
        }
        else if (threadid == process.env.VIDEO_THREAD_ID) {
            const { filteredDocs, totalsize } = await search_video(searchTerm, page);
            const totalPages = Math.ceil(totalsize / 10);
            // Display paginated data
            if (filteredDocs.length === 0) {
                const { message_id } = await ctx.reply("No Video found.", {
                    message_thread_id: threadid,
                });
                setTimeout(async () => {
                    try {
                        await ctx.api.deleteMessage(ctx.chat.id, message_id);
                    }
                    catch (error) {
                        console.log(error.message);
                    }
                }, msgDeleteTime);
                return;
            }
            else {
                filteredDocs.map(async (doc) => {
                    const file_size = bytesToMegabytes(doc.file_size);
                    inlineKeyboard
                        .text(doc.file_name, `file__${doc.file_unique_id}__${threadid}`)
                        .url(file_size.toFixed(1) + "MB 📩", `https://t.me/${process.env.BOT_USERNAME}?start=vid_-_${doc.file_unique_id}_-_${encodedString}`)
                        .row();
                });
            }
            if (page == 1 && page < totalPages) {
                inlineKeyboard.text("Next>>", `^next__${page}__${threadid}`).row();
            }
            else if (page > 1 && page < totalPages) {
                inlineKeyboard
                    .text("<<Prev", `^prev__${page}__${threadid}`)
                    .text(`${page}/${totalPages}📄`)
                    .text("Next>>", `^next__${page}__${threadid}`)
                    .row();
            }
            else if (page == totalPages && page != 1) {
                inlineKeyboard.text("<<Prev", `^prev__${page}__${threadid}`);
            }
        }
        else if (threadid == process.env.AUDIO_THREAD_ID) {
            const { filteredDocs, totalsize } = await search_audio(searchTerm, page);
            const totalPages = Math.ceil(totalsize / 10);
            // Display paginated data
            if (filteredDocs.length === 0) {
                const { message_id } = await ctx.reply("No Audio found.", {
                    message_thread_id: threadid,
                });
                setTimeout(async () => {
                    try {
                        await ctx.api.deleteMessage(ctx.chat.id, message_id);
                    }
                    catch (error) {
                        console.log(error.message);
                    }
                }, msgDeleteTime);
                return;
            }
            else {
                filteredDocs.map(async (doc) => {
                    const file_size = bytesToMegabytes(doc.file_size);
                    inlineKeyboard
                        .text(doc.file_name, `file__${doc.file_unique_id}__${threadid}`)
                        .url(file_size.toFixed(1) + "MB 📩", `https://t.me/${process.env.BOT_USERNAME}?start=aud_-_${doc.file_unique_id}_-_${encodedString}`)
                        .row();
                });
            }
            if (page == 1 && page < totalPages) {
                inlineKeyboard.text("Next>>", `^next__${page}__${threadid}`).row();
            }
            else if (page > 1 && page < totalPages) {
                inlineKeyboard
                    .text("<<Prev", `^prev__${page}__${threadid}`)
                    .text(`${page}/${totalPages}📄`)
                    .text("Next>>", `^next__${page}__${threadid}`)
                    .row();
            }
            else if (page == totalPages && page != 1) {
                inlineKeyboard.text("<<Prev", `^prev__${page}__${threadid}`);
            }
        }
        return inlineKeyboard;
    }
    catch (error) {
        console.log("Error at keyboardlist in helperFunc.ts", error.message);
    }
}
export function bytesToMegabytes(bytes) {
    return bytes / (1024 * 1024);
}
// export function cleanFileName(fileName: any): string {
//     // Define a regular expression pattern to match characters to be removed
//     const pattern = /[^a-zA-Z0-9\s]+/g;
//     // Remove special characters
//     let cleanedFileName = fileName.replace(pattern, " ");
//     // Replace consecutive spaces with a single space
//     cleanedFileName = cleanedFileName.replace(/\s{2,}/g, " ");
//     return cleanedFileName;
// }
export function cleanFileName(fileName) {
    // Define a regular expression pattern to match characters to be removed
    const pattern = /[_.,\[\]\|\\\/\?\>\<\+\=\-\!\@\#\$\%\^\&\*\(\)\~\`\{\}\s]+/g;
    // Remove special characters
    let cleanedFileName = fileName.replace(pattern, " ");
    // Replace consecutive spaces with a single space
    cleanedFileName = cleanedFileName.replace(/\s{2,}/g, " ");
    return cleanedFileName;
}
export function extractSearchTerm(searchString) {
    // Define a regular expression pattern to match the term after "Searched For:"
    const regexPattern = /Searched For:\s*(.+)/i;
    // Use the match method with the regular expression pattern
    const match = searchString.match(regexPattern);
    // Extract the term after "Searched For:"
    const termAfterSearchedFor = match ? match[1] : null;
    return termAfterSearchedFor;
}
