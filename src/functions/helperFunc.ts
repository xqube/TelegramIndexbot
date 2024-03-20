import { InlineKeyboard } from "grammy";
import { search_audio, search_document, search_video } from "./dbFunc.js";


export async function keyboardlist(ctx: any, page: number, searchTerm: string, threadid: number | undefined) {
    const inlineKeyboard = new InlineKeyboard()
    if (threadid == process.env.DOC_THREAD_ID) {
        const { filteredDocs, totalsize } = await search_document(searchTerm, page);
        const totalPages = Math.ceil(totalsize / 10);
        // Display paginated data
        if (filteredDocs.length === 0) {
            await ctx.reply("No documents found.", { message_thread_id: threadid });
            return;
        } else {
            (filteredDocs.map(async (doc: any) => {
                const file_size = bytesToMegabytes(doc.file_size)
                inlineKeyboard
                    .text("hello", `${doc.file_unique_id}__${threadid}`) //changed it to __ coz fileid can have an underscore
                    .url(file_size.toFixed(1) + 'MB 📩', `https://t.me/${process.env.BOT_USERNAME}?start=doc__${doc.file_unique_id}`)
                    .row()
            }));
        }
        if (page == 1 && page < totalPages) {
            inlineKeyboard
                .text("Next>>", `^next__${page}__${threadid}`).row()
        } else if (page > 1 && page < totalPages) {
            inlineKeyboard.text("<<Prev", `^prev__${page}__${threadid}`)
                .text("Next>>", `^next__${page}__${threadid}`).row()
        } else if (page == totalPages && page != 1) {
            inlineKeyboard.text("<<Prev", `^prev__${page}__${threadid}`)
        }

    } else if (threadid == process.env.VIDEO_THREAD_ID) {
        const { filteredDocs, totalsize } = await search_video(searchTerm, page);
        const totalPages = Math.ceil(totalsize / 10);
        // Display paginated data
        if (filteredDocs.length === 0) {
            await ctx.reply("No documents found.", { message_thread_id: threadid });
            return;
        } else {
            (filteredDocs.map(async (doc: any) => {
                const file_size = bytesToMegabytes(doc.file_size)
                inlineKeyboard
                    .text(doc.file_name, `${doc.file_unique_id}__${threadid}`)
                    .url(file_size.toFixed(1) + 'MB 📩', `https://t.me/${process.env.BOT_USERNAME}?start=vid__${doc.file_unique_id}`)
                    .row()
            }));
        }
        if (page == 1 && page < totalPages) {
            inlineKeyboard
                .text("Next>>", `^next__${page}__${threadid}`).row()
        } else if (page > 1 && page < totalPages) {
            inlineKeyboard.text("<<Prev", `^prev__${page}__${threadid}`)
                .text("Next>>", `^next__${page}__${threadid}`).row()
        } else if (page == totalPages && page != 1) {
            inlineKeyboard.text("<<Prev", `^prev__${page}__${threadid}`)
        }
    } else if (threadid == process.env.AUDIO_THREAD_ID) {
        const { filteredDocs, totalsize } = await search_audio(searchTerm, page);
        const totalPages = Math.ceil(totalsize / 10);
        // Display paginated data
        if (filteredDocs.length === 0) {
            await ctx.reply("No documents found.", { message_thread_id: threadid });
            return;
        } else {
            (filteredDocs.map(async (doc: any) => {
                const file_size = bytesToMegabytes(doc.file_size)
                inlineKeyboard
                    .text(doc.file_name, `${doc.file_unique_id}__${threadid}`)
                    .url(file_size.toFixed(1) + 'MB 📩',`https://t.me/${process.env.BOT_USERNAME}?start=aud__${doc.file_unique_id}`)
                    .row()
            }));
        }
        if (page == 1 && page < totalPages) {
            inlineKeyboard
                .text("Next>>", `^next__${page}__${threadid}`).row()
        } else if (page > 1 && page < totalPages) {
            inlineKeyboard.text("<<Prev", `^prev__${page}__${threadid}`)
                .text("Next>>", `^next__${page}__${threadid}`).row()
        } else if (page == totalPages && page != 1) {
            inlineKeyboard.text("<<Prev", `^prev__${page}__${threadid}`)
        }
    }
    return inlineKeyboard
}


export function bytesToMegabytes(bytes: number) {
    return bytes / (1024 * 1024);
}

export function hasAlphanumericAndSpaces(text: any): boolean {
    // Define a regular expression pattern to match all characters that are alphanumeric, '-', '_', '[', ']', '.', or a space
    const pattern = /^[a-zA-Z0-9\s\-_\[\].]*$/;
    // Test if the string matches the pattern
    return pattern.test(text);
}

export function cleanFileName(fileName: any): string {
    // Define a regular expression pattern to match characters to be removed
    const pattern = /[^a-zA-Z0-9\s]+/g;
    // Remove special characters
    let cleanedFileName = fileName.replace(pattern, " ");
    // Replace consecutive spaces with a single space
    cleanedFileName = cleanedFileName.replace(/\s{2,}/g, " ");
    return cleanedFileName;
}




export function extractSearchTerm(searchString: string) {
    // Define a regular expression pattern to match the term after "Searched For:"
    const regexPattern = /Searched For:\s*(.+)/i;
    // Use the match method with the regular expression pattern
    const match = searchString.match(regexPattern);
    // Extract the term after "Searched For:"
    const termAfterSearchedFor = match ? match[1] : null;
    return termAfterSearchedFor;
}
