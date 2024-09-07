import { Composer } from "grammy";
import { InlineKeyboard } from "grammy";
import { insert_audio, insert_document, insert_user, insert_video, search_audio_file_id, search_document_file_id, search_video_file_id, } from "../functions/dbFunc.js";
import { cleanFileName, extractSearchTerm, keyboardlist, removeUnwanted, userMode, } from "../functions/helperFunc.js";
export const notAuthorized = new Set();
export const userComposer = new Composer();
class Queue {
    constructor() {
        this.items = [];
    }
    // Enqueue: Add an element to the end of the queue
    enqueue(element) {
        this.items.push(element);
    }
    // Dequeue: Remove an element from the front of the queue
    dequeue() {
        return this.items.shift();
    }
    // Peek: Get the front element of the queue without removing it
    peek() {
        return this.items[0];
    }
    // Check if the queue is empty
    isEmpty() {
        return this.items.length === 0;
    }
    // Get the size of the queue
    size() {
        return this.items.length;
    }
    // Clear the queue
    clear() {
        this.items = [];
    }
    // Print the queue
    print() {
        console.log(this.items.toString());
    }
}
class TaskQueue extends Queue {
    // Execute all tasks in the queue
    async execute() {
        while (!this.isEmpty()) {
            const task = this.dequeue();
            if (task) {
                try {
                    await task();
                }
                catch (error) {
                    console.error("Error executing task:", error);
                }
            }
        }
    }
}
userComposer.on("callback_query:data", async (ctx) => {
    var _a, _b;
    try {
        if (((_a = ctx.msg) === null || _a === void 0 ? void 0 : _a.date) > ((_b = ctx.msg) === null || _b === void 0 ? void 0 : _b.date) - 3600) {
            const taskQueue = new TaskQueue();
            const searchTask = () => new Promise(async (resolve, reject) => {
                var _a;
                try {
                    const calldata = ctx.update.callback_query.data;
                    const calladatanext = calldata.match(/\^next/);
                    const calladataprev = calldata.match(/\^prev/);
                    const calladatafile = calldata.match(/file/);
                    const nulldata = calldata.match(/null/);
                    const searchMode = calldata.match(/\^toggle/);
                    const messageText = (_a = ctx.update.callback_query.message) === null || _a === void 0 ? void 0 : _a.text;
                    const searchTerm = extractSearchTerm(messageText);
                    const data = calldata.split("__");
                    const file_unique_id = data[1];
                    if (calladatafile) {
                        const { filteredDocs } = await search_document_file_id(file_unique_id);
                        await ctx.answerCallbackQuery({
                            text: `${filteredDocs.file_name}`,
                            show_alert: true,
                        });
                    }
                    if (searchMode) {
                        const mode = data[1];
                        userMode.set(ctx.from.id, mode === "doc" ? "document" : mode === "vid" ? "video" : "audio");
                        await ctx.api.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id);
                        await ctx.reply(`Successfully Changed mode to: ${userMode.get(ctx.from.id)}`);
                    }
                    if (ctx.update.callback_query.message.entities[0].user.id ===
                        ctx.from.id) {
                        if (calladatanext) {
                            const page = Number(data[1]) + 1;
                            const inlineKeyboard = await keyboardlist(ctx, page, removeUnwanted(cleanFileName(searchTerm)));
                            await ctx.editMessageText(`Hey <a href="tg://user?id=${ctx.update.callback_query.message.entities[0].user.id}">${ctx.update.callback_query.message.entities[0].user.first_name}</a>, You Searched For: <code>${searchTerm}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML" });
                        }
                        else if (calladataprev) {
                            const page = Number(data[1]) - 1;
                            const inlineKeyboard = await keyboardlist(ctx, page, removeUnwanted(cleanFileName(searchTerm)));
                            await ctx.editMessageText(`Hey <a href="tg://user?id=${ctx.update.callback_query.message.entities[0].user.id}">${ctx.update.callback_query.message.entities[0].user.first_name}</a>, You Searched For: <code>${searchTerm}</code>`, { reply_markup: inlineKeyboard, parse_mode: "HTML" });
                        }
                        else if (nulldata) {
                            await ctx.answerCallbackQuery({
                                text: "Don't touch on everything you see.👻",
                            });
                        }
                    }
                    else {
                        await ctx.answerCallbackQuery({
                            text: "Request for yourself 😊",
                            show_alert: true,
                        });
                    }
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            });
            // Enqueue tasks and handle errors
            taskQueue.enqueue(searchTask);
            taskQueue
                .execute()
                .then(() => {
                console.log("search call-back task executed");
            })
                .catch((error) => {
                console.log("Error executing task:", error.message);
            });
            return;
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
            const isMember = await ctx.api.getChatMember(Number(process.env.CHECKMEMBER), ctx.from.id);
            if (["administrator", "creator", "member"].includes(isMember.status)) {
                const parts = ctx.match.split("_-_");
                const file_unique_id = parts[1];
                const type = parts[0];
                if (type == "doc") {
                    const { filteredDocs } = await search_document_file_id(file_unique_id);
                    if (filteredDocs.file_caption != "") {
                        await ctx.replyWithDocument(filteredDocs.file_id, {
                            caption: filteredDocs.file_caption,
                            protect_content: true,
                        });
                    }
                    else {
                        await ctx.replyWithDocument(filteredDocs.file_id, {
                            caption: filteredDocs.file_name,
                            protect_content: true,
                        });
                    }
                }
                else if (type == "vid") {
                    const { filteredDocs } = await search_video_file_id(file_unique_id);
                    if (filteredDocs.file_caption != "") {
                        await ctx.replyWithVideo(filteredDocs.file_id, {
                            caption: filteredDocs.file_caption,
                            protect_content: true,
                        });
                    }
                    else {
                        await ctx.replyWithVideo(filteredDocs.file_id, {
                            caption: filteredDocs.file_name,
                            protect_content: true,
                        });
                    }
                }
                else if (type == "aud") {
                    const { filteredDocs } = await search_audio_file_id(file_unique_id);
                    if (filteredDocs.file_caption != "") {
                        await ctx.replyWithAudio(filteredDocs.file_id, {
                            caption: filteredDocs.file_caption,
                            protect_content: true,
                        });
                    }
                    else {
                        await ctx.replyWithAudio(filteredDocs.file_id, {
                            caption: filteredDocs.file_name,
                            protect_content: true,
                        });
                    }
                }
            }
            else {
                if (!notAuthorized.has(ctx.from.id)) {
                    await ctx.reply("Looks like you're not authorized ❌. Please visit the channel @dedxec for more information.");
                    notAuthorized.add(ctx.from.id);
                }
            }
        }
        else {
            if (ctx.from) {
                const data = {
                    user_id: ctx.from.id,
                    first_name: ctx.from.first_name,
                    warn: 0,
                    is_banned: false,
                };
                await insert_user(data);
            }
            userMode.set(ctx.from.id, "document");
            ctx.reply(`👋 Hi ${ctx.from.first_name}, I'm ${ctx.me.first_name}! 📄🎥🎵 Feel free to search for any media files through me 😊.`, { parse_mode: "HTML" });
        }
    }
    catch (error) { }
});
userComposer.chatType("private").command("info", async (ctx, next) => {
    try {
        if (ctx.msg.chat.type == "private") {
            const replyMessage = ctx.msg.reply_to_message;
            if ((replyMessage === null || replyMessage === void 0 ? void 0 : replyMessage.document) ||
                (replyMessage === null || replyMessage === void 0 ? void 0 : replyMessage.video) ||
                (replyMessage === null || replyMessage === void 0 ? void 0 : replyMessage.audio)) {
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
    var _a, _b, _c, _d;
    try {
        const admins = process.env.OWNERS;
        // const { is_banned } = await is_user_banned(ctx.from.id);
        if (admins.includes(ctx.msg.from.id)) {
            if (ctx.msg.document) {
                const file_name = cleanFileName(ctx.msg.document.file_name);
                const file_caption = cleanFileName((_a = ctx.msg.caption) !== null && _a !== void 0 ? _a : "");
                const data = {
                    user_id: ctx.msg.from.id,
                    first_name: ctx.msg.from.first_name,
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
                const file_caption = cleanFileName((_b = ctx.msg.caption) !== null && _b !== void 0 ? _b : "");
                const data = {
                    user_id: ctx.msg.from.id,
                    first_name: ctx.msg.from.first_name,
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
                const file_caption = cleanFileName((_c = ctx.msg.caption) !== null && _c !== void 0 ? _c : "");
                const data = {
                    user_id: ctx.msg.from.id,
                    first_name: ctx.msg.from.first_name,
                    file_id: ctx.msg.audio.file_id,
                    file_name: file_name,
                    file_caption: file_caption,
                    file_unique_id: ctx.msg.audio.file_unique_id,
                    file_size: (_d = ctx.msg.audio) === null || _d === void 0 ? void 0 : _d.file_size,
                    is_banned: false,
                    // add performer section
                };
                await insert_audio(data);
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
    await next();
});
userComposer.chatType("channel").on(":file", async (ctx, next) => {
    var _a, _b, _c, _d;
    try {
        if (ctx.chat.id == parseInt(process.env.OFFICIAL_CHANNEL || "")) {
            if (ctx.msg.document) {
                const file_name = cleanFileName(ctx.msg.document.file_name);
                const file_caption = cleanFileName((_a = ctx.msg.caption) !== null && _a !== void 0 ? _a : "");
                const data = {
                    user_id: 12345678,
                    first_name: "12345678",
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
                const file_caption = cleanFileName((_b = ctx.msg.caption) !== null && _b !== void 0 ? _b : "");
                const data = {
                    user_id: 12345678,
                    first_name: "12345678",
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
                const file_caption = cleanFileName((_c = ctx.msg.caption) !== null && _c !== void 0 ? _c : "");
                const data = {
                    user_id: 12345678,
                    first_name: "12345678",
                    file_id: ctx.msg.audio.file_id,
                    file_name: file_name,
                    file_caption: file_caption,
                    file_unique_id: ctx.msg.audio.file_unique_id,
                    file_size: (_d = ctx.msg.audio) === null || _d === void 0 ? void 0 : _d.file_size,
                    is_banned: false,
                    // add performer section
                };
                await insert_audio(data);
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
    await next();
});
userComposer.chatType("private").command("mode", async (ctx, next) => {
    try {
        const keyboard = new InlineKeyboard();
        keyboard
            .text("Document", `^toggle__doc`)
            .row()
            .text("Video", `^toggle__vid`)
            .row()
            .text("Audio", `^toggle__aud`)
            .row();
        let State = userMode.get(ctx.from.id);
        await ctx.reply(`Your current mode is: ${State}\n\nPlease select one of the option below\n\nrecommended: Document`, {
            reply_markup: keyboard,
        });
    }
    catch (error) {
        console.log(error.message);
    }
    await next();
});
function hasSevenParts(inputString) {
    // Split the input string by spaces
    const parts = inputString.split(" ");
    // Check if the length of the resulting array is 4
    return parts.length <= 7;
}
userComposer.chatType("private").on(":text", async (ctx, next) => {
    try {
        const msgDeleteTime = parseInt(process.env.MESSAGE_DELETE_TIME || "");
        if (!ctx.msg.text.includes("/")) {
            const isMember = await ctx.api.getChatMember(Number(process.env.CHECKMEMBER), ctx.from.id);
            if (["administrator", "creator", "member"].includes(isMember.status)) {
                if (userMode.get(ctx.from.id)) {
                    const text = removeUnwanted(cleanFileName(ctx.msg.text));
                    if (hasSevenParts(text)) {
                        // Create a task queue
                        const taskQueue = new TaskQueue();
                        // Define some tasks
                        const searchTask = () => new Promise(async (resolve) => {
                            var _a, _b, _c, _d;
                            setTimeout(async () => {
                                try {
                                    await ctx.deleteMessage();
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            }, msgDeleteTime);
                            const { message_id } = await ctx.reply("⏳");
                            const inlineKeyboard = await keyboardlist(ctx, 1, text);
                            if (inlineKeyboard) {
                                await ctx.api.editMessageText((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id, message_id, `Hey <a href="tg://user?id=${(_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id}">${(_c = ctx.from) === null || _c === void 0 ? void 0 : _c.first_name}</a> , You Searched For: <code>${ctx.msg.text}</code>`, {
                                    reply_markup: inlineKeyboard,
                                    parse_mode: "HTML",
                                });
                            }
                            else {
                                await ctx.api.editMessageText((_d = ctx.from) === null || _d === void 0 ? void 0 : _d.id, message_id, "No media found");
                            }
                            setTimeout(async () => {
                                try {
                                    await ctx.api.deleteMessage(ctx.chat.id, message_id);
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            }, msgDeleteTime);
                            resolve();
                        });
                        // Enqueue tasks
                        taskQueue.enqueue(searchTask);
                        // Execute tasks in the queue
                        taskQueue.execute().then(() => {
                            console.log("task executed");
                        });
                    }
                    else {
                        setTimeout(async () => {
                            try {
                                await ctx.deleteMessage();
                            }
                            catch (error) {
                                console.log(error);
                            }
                        }, msgDeleteTime);
                        const { message_id } = await ctx.reply(`Please limit your request to 7 words or less.\n\neg: <code>Money Heist s04e01 1080p</code>`, {
                            parse_mode: "HTML",
                            reply_parameters: {
                                message_id: ctx.msg.message_id,
                            },
                        });
                        setTimeout(async () => {
                            try {
                                await ctx.api.deleteMessage(ctx.chat.id, message_id);
                            }
                            catch (error) {
                                console.log(error);
                            }
                        }, msgDeleteTime);
                    }
                }
                else {
                    await ctx.reply("Please set your search mode using /mode");
                }
            }
            else {
                if (!notAuthorized.has(ctx.from.id)) {
                    await ctx.reply("🤔 Looks like you're not authorized ❌. Please visit the channel @dedxec for more information.");
                    notAuthorized.add(ctx.from.id);
                }
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
    await next();
});
