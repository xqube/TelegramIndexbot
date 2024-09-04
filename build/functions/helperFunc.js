import { InlineKeyboard } from "grammy";
import { search_audio, search_document, search_video } from "./dbFunc.js";
export const userMode = new Map();
export async function keyboardlist(ctx, page, searchTerm) {
    try {
        const msgDeleteTime = parseInt(process.env.MESSAGE_DELETE_TIME || "");
        const inlineKeyboard = new InlineKeyboard();
        const currentHour = new Date().getHours().toString();
        let currentState = userMode.get(ctx.from.id);
        if (currentState == "document") {
            const { filteredDocs, totalsize } = await search_document(searchTerm, page);
            const totalPages = Math.ceil(totalsize / 10);
            // Display paginated data
            if (filteredDocs.length === 0) {
                return;
            }
            else {
                filteredDocs.map(async (doc) => {
                    const file_size = bytesToMegabytes(doc.file_size);
                    inlineKeyboard
                        .text(doc.file_name, `file__${doc.file_unique_id}`) //changed it to __ coz fileid can have an underscore
                        .url(file_size.toFixed(1) + "MB 📩", `https://t.me/${process.env.BOT_USERNAME}?start=doc_-_${doc.file_unique_id}`)
                        .row();
                });
            }
            if (page == 1 && page < totalPages) {
                inlineKeyboard.text("Next>>", `^next__${page}`).row();
            }
            else if (page > 1 && page < totalPages) {
                inlineKeyboard
                    .text("<<Prev", `^prev__${page}`)
                    .text(`${page}/${totalPages}📄`)
                    .text("Next>>", `^next__${page}`)
                    .row();
            }
            else if (page == totalPages && page != 1) {
                inlineKeyboard.text("<<Prev", `^prev__${page}`).row();
            }
            return inlineKeyboard;
        }
        else if (currentState == "video") {
            const { filteredDocs, totalsize } = await search_video(searchTerm, page);
            const totalPages = Math.ceil(totalsize / 10);
            // Display paginated data
            if (filteredDocs.length === 0) {
                return;
            }
            else {
                filteredDocs.map(async (doc) => {
                    const file_size = bytesToMegabytes(doc.file_size);
                    inlineKeyboard
                        .text(doc.file_name, `file__${doc.file_unique_id}`) //changed it to __ coz fileid can have an underscore
                        .url(file_size.toFixed(1) + "MB 📩", `https://t.me/${process.env.BOT_USERNAME}?start=vid_-_${doc.file_unique_id}`)
                        .row();
                });
            }
            if (page == 1 && page < totalPages) {
                inlineKeyboard.text("Next>>", `^next__${page}`).row();
            }
            else if (page > 1 && page < totalPages) {
                inlineKeyboard
                    .text("<<Prev", `^prev__${page}`)
                    .text(`${page}/${totalPages}📄`)
                    .text("Next>>", `^next__${page}`)
                    .row();
            }
            else if (page == totalPages && page != 1) {
                inlineKeyboard.text("<<Prev", `^prev__${page}`).row();
            }
            return inlineKeyboard;
        }
        else if (currentState == "audio") {
            const { filteredDocs, totalsize } = await search_audio(searchTerm, page);
            const totalPages = Math.ceil(totalsize / 10);
            // Display paginated data
            if (filteredDocs.length === 0) {
                return;
            }
            else {
                filteredDocs.map(async (doc) => {
                    const file_size = bytesToMegabytes(doc.file_size);
                    inlineKeyboard
                        .text(doc.file_name, `file__${doc.file_unique_id}`) //changed it to __ coz fileid can have an underscore
                        .url(file_size.toFixed(1) + "MB 📩", `https://t.me/${process.env.BOT_USERNAME}?start=aud_-_${doc.file_unique_id}`)
                        .row();
                });
            }
            if (page == 1 && page < totalPages) {
                inlineKeyboard.text("Next>>", `^next__${page}`).row();
            }
            else if (page > 1 && page < totalPages) {
                inlineKeyboard
                    .text("<<Prev", `^prev__${page}`)
                    .text(`${page}/${totalPages}📄`)
                    .text("Next>>", `^next__${page}`)
                    .row();
            }
            else if (page == totalPages && page != 1) {
                inlineKeyboard.text("<<Prev", `^prev__${page}`).row();
            }
            return inlineKeyboard;
        }
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
export function removeUnwanted(str) {
    return str
        .replace(/(\d+)p\b/g, '$1') // Remove 'p' after numbers
        .replace(/\b(mkv|mp4|mp3|avi)\b/g, '').trim(); // Remove specified file extensions
    // Optionally, you can also trim extra spaces after removal
}
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
