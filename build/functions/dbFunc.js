import { bot } from "../bot.js";
import { mongoconnect } from "../db/dbConfig.js";
// const { DocumentCollection, VideoCollection, AudioCollection, UserCollection } = await mongoconnect()
const db = await mongoconnect();
export async function insert_document(data) {
    try {
        const insertResult = await db.DocumentCollection.insertOne(data);
        if (insertResult) {
            return insertResult;
        }
    }
    catch (error) {
        if (error.code === 11000 && error.keyPattern.file_unique_id) {
            console.log("Duplicate file_unique_id detected. Skipping insertion.");
        }
        else {
            // Handle other types of errors
            console.error("Error inserting document:", error);
        }
    }
}
export async function insert_video(data) {
    try {
        const insertResult = await db.VideoCollection.insertOne(data);
        if (insertResult) {
            return insertResult;
        }
    }
    catch (error) {
        if (error.code === 11000 && error.keyPattern.file_unique_id) {
            console.log("Duplicate file_unique_id detected. Skipping insertion.");
        }
        else {
            // Handle other types of errors
            console.error("Error inserting document:", error);
        }
    }
}
export async function insert_audio(data) {
    try {
        const insertResult = await db.AudioCollection.insertOne(data);
        if (insertResult) {
            return insertResult;
        }
    }
    catch (error) {
        if (error.code === 11000 && error.keyPattern.file_unique_id) {
            console.log("Duplicate file_unique_id detected. Skipping insertion.");
        }
        else {
            // Handle other types of errors
            console.error("Error inserting document:", error);
        }
    }
}
export async function insert_user(data) {
    try {
        const insertResult = await db.UserCollection.insertOne(data);
        if (insertResult) {
            return insertResult;
        }
    }
    catch (error) {
        if (error.code === 11000 && error.keyPattern.id) {
            console.log("Duplicate file_unique_id detected. Skipping insertion.");
        }
        else {
            // Handle other types of errors
            console.error("Error inserting document:", error);
        }
    }
}
export async function search_document(searchTerms, page) {
    try {
        const skip = (page - 1) * 10;
        // Split the search terms into individual words
        const searchWords = searchTerms.trim().split(/\s+/);
        // Construct an array of regex patterns, one for each search word
        const regexPatterns = searchWords.map(word => new RegExp(`\\b${word}\\b`, "i"));
        // Combine the regex patterns using the OR operator
        const combinedRegex = {
            $and: [
                { $or: regexPatterns.map(pattern => ({ file_name: pattern })) },
                { is_banned: false },
                { is_copyrighted: false }
            ]
        };
        // Count filtered documents
        const totalsize = await db.DocumentCollection.countDocuments(combinedRegex);
        // Fetch filtered documents for the specified page
        const filteredDocs = await db.DocumentCollection.find(combinedRegex).skip(skip).limit(10).toArray();
        // Return an object containing both filtered documents and total size
        return { filteredDocs, totalsize };
    }
    catch (error) {
        console.error("Error in search_document at dbFunc.ts", error.message);
        throw (error);
    }
}
export async function search_video(searchTerms, page) {
    try {
        const skip = (page - 1) * 10;
        // Split the search terms into individual words
        const searchWords = searchTerms.trim().split(/\s+/);
        // Construct an array of regex patterns, one for each search word
        const regexPatterns = searchWords.map(word => new RegExp(`\\b${word}\\b`, "i"));
        // Combine the regex patterns using the OR operator
        const combinedRegex = {
            $and: [
                { $or: regexPatterns.map(pattern => ({ file_name: pattern })) },
                { is_banned: false },
                { is_copyrighted: false }
            ]
        };
        // Count filtered documents
        const totalsize = await db.VideoCollection.countDocuments(combinedRegex);
        // Fetch filtered documents for the specified page
        const filteredDocs = await db.VideoCollection.find(combinedRegex).skip(skip).limit(10).toArray();
        // Return an object containing both filtered documents and total size
        return { filteredDocs, totalsize };
    }
    catch (error) {
        console.error("Error in search_video at dbFunc.ts", error.message);
        throw (error);
    }
}
export async function search_audio(searchTerms, page) {
    try {
        const skip = (page - 1) * 10;
        // Split the search terms into individual words
        const searchWords = searchTerms.trim().split(/\s+/);
        // Construct an array of regex patterns, one for each search word
        const regexPatterns = searchWords.map(word => new RegExp(`\\b${word}\\b`, "i"));
        // Combine the regex patterns using the OR operator
        const combinedRegex = {
            $and: [
                { $or: regexPatterns.map(pattern => ({ file_name: pattern })) },
                { is_banned: false },
                { is_copyrighted: false }
            ]
        };
        // Count filtered documents
        const totalsize = await db.AudioCollection.countDocuments(combinedRegex);
        // Fetch filtered documents for the specified page
        const filteredDocs = await db.AudioCollection.find(combinedRegex).skip(skip).limit(10).toArray();
        // Return an object containing both filtered documents and total size
        return { filteredDocs, totalsize };
    }
    catch (error) {
        console.error("Error in search_audio at dbFunc.ts", error.message);
        throw (error);
    }
}
export async function search_document_file_id(data) {
    try {
        const filteredDocs = await db.DocumentCollection.findOne({ file_unique_id: data }, { projection: { file_id: 1, file_name: 1, file_caption: 1, _id: 0 } });
        return { filteredDocs };
    }
    catch (error) {
        console.log(error.message);
    }
}
export async function search_video_file_id(data) {
    try {
        const filteredDocs = await db.VideoCollection.findOne({ file_unique_id: data }, { projection: { file_id: 1, file_name: 1, file_caption: 1, _id: 0 } });
        return { filteredDocs };
    }
    catch (error) {
        console.log(error.message);
    }
}
export async function search_audio_file_id(data) {
    try {
        const filteredDocs = await db.AudioCollection.findOne({ file_unique_id: data }, { projection: { file_id: 1, file_name: 1, file_caption: 1, _id: 0 } });
        return { filteredDocs };
    }
    catch (error) {
        console.log(error.message);
    }
}
export async function ban_all_user_files(data) {
    try {
        const filter = { userid: data };
        const chat_id = data.toString();
        const updateDoc = {
            $set: {
                is_banned: true,
            }
        };
        const doc_result = await db.DocumentCollection.updateMany(filter, updateDoc);
        const vid_result = await db.VideoCollection.updateMany(filter, updateDoc);
        const aud_result = await db.AudioCollection.updateMany(filter, updateDoc);
        if (doc_result.modifiedCount != 0 || vid_result.modifiedCount != 0 || aud_result.modifiedCount != 0) {
            try {
                await bot.api.sendMessage(chat_id, `<b>Sorry to inform that some of your files are reported due to copyright</b>\n\nBanned ${doc_result.modifiedCount} file in document section\nBanned ${vid_result.modifiedCount} file in video section\nBanned ${aud_result.modifiedCount} file in audio section`, { parse_mode: "HTML" });
            }
            catch (error) {
                console.log("Error on sending ban meessage in dbFunc", error.message);
            }
        }
        return { doc_result, vid_result, aud_result };
    }
    catch (error) {
        console.log(error.message);
    }
}
export async function ban_all_user_files_reply(data) {
    try {
        const filter = { file_unique_id: data };
        const updateDoc = {
            $set: {
                is_banned: true,
            }
        };
        const result = await db.DocumentCollection.findOne(filter, { projection: { userid: 1, _id: 0 } });
        if (result) {
            const doc_result = await db.DocumentCollection.updateMany({ userid: result.userid }, updateDoc);
            const vid_result = await db.VideoCollection.updateMany({ userid: result.userid }, updateDoc);
            const aud_result = await db.AudioCollection.updateMany({ userid: result.userid }, updateDoc);
            if (doc_result.modifiedCount != 0 || vid_result.modifiedCount != 0 || aud_result.modifiedCount != 0) {
                try {
                    await bot.api.sendMessage(result.userid, `<b>Sorry to inform that some of your files are reported due to copyright</b>\n\nBanned ${doc_result.modifiedCount} file in document section\nBanned ${vid_result.modifiedCount} file in video section\nBanned ${aud_result.modifiedCount} file in audio section`, { parse_mode: "HTML" });
                }
                catch (error) {
                    console.log("Error on sending ban meessage in dbFunc", error.message);
                }
            }
            return { doc_result, vid_result, aud_result };
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
export async function copyright_file(data) {
    try {
        const filter = { file_unique_id: data };
        const updateDoc = {
            $set: {
                is_banned: true,
            }
        };
        const result = await db.DocumentCollection.findOne(filter, { projection: { userid: 1, _id: 0 } });
        const doc_result = await db.DocumentCollection.updateMany(filter, updateDoc);
        const vid_result = await db.VideoCollection.updateMany(filter, updateDoc);
        const aud_result = await db.AudioCollection.updateMany(filter, updateDoc);
        if (doc_result.modifiedCount != 0 || vid_result.modifiedCount != 0 || aud_result.modifiedCount != 0) {
            try {
                await bot.api.sendMessage(result.userid, `<b>Sorry to inform that some of your files are reported due to copyright</b>\n\nBanned ${doc_result.modifiedCount} file in document section\nBanned ${vid_result.modifiedCount} file in video section\nBanned ${aud_result.modifiedCount} file in audio section`, { parse_mode: "HTML" });
            }
            catch (error) {
                console.log("Error on sending ban meessage in dbFunc", error.message);
            }
        }
        return { doc_result, vid_result, aud_result };
    }
    catch (error) {
        console.log(error.message);
    }
}
