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
                { is_banned: false }
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
                { is_banned: false }
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
                { is_banned: false }
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
///////////////////////////////////////////////////////////////////////////////////////////////
//moderation area
///////////////////////////////////////////////////////////////////////////////////////////////
export async function terminate_user_files(data) {
    try {
        const user_id = { user_id: data };
        const updateDoc = {
            $set: {
                is_banned: true,
            }
        };
        const doc_mod_result = await db.DocumentCollection.updateMany(user_id, updateDoc);
        const vid_mod_result = await db.VideoCollection.updateMany(user_id, updateDoc);
        const aud_mod_result = await db.AudioCollection.updateMany(user_id, updateDoc);
        const user_mod_result = await db.UserCollection.updateOne(user_id, updateDoc);
        const user_data = await db.UserCollection.findOne({ user_id: user_id });
        return { doc_mod_result, vid_mod_result, aud_mod_result, user_mod_result, user_data };
    }
    catch (error) {
        console.log(error.message);
    }
}
export async function terminate_user_files_reply(data) {
    try {
        const file_unique_id = { file_unique_id: data };
        const updateDoc = {
            $set: {
                is_banned: true,
            }
        };
        const file_result = await db.DocumentCollection.findOne(file_unique_id, { projection: { user_id: 1, _id: 0 } });
        if (file_result) {
            const doc_mod_result = await db.DocumentCollection.updateMany({ user_id: file_result.user_id }, updateDoc);
            const vid_mod_result = await db.VideoCollection.updateMany({ user_id: file_result.user_id }, updateDoc);
            const aud_mod_result = await db.AudioCollection.updateMany({ user_id: file_result.user_id }, updateDoc);
            const user_data = await db.UserCollection.findOne({ user_id: file_result.user_id });
            const user_mod_result = await db.UserCollection.updateOne({ user_id: user_data.user_id }, updateDoc);
            return { doc_mod_result, vid_mod_result, aud_mod_result, user_data, user_mod_result };
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
export async function remove_file(data) {
    try {
        const file_unique_id = { file_unique_id: data };
        const updateDoc = {
            $set: {
                is_banned: true,
            }
        };
        const doc_mod_result = await db.DocumentCollection.updateOne(file_unique_id, updateDoc);
        const vid_mod_result = await db.VideoCollection.updateOne(file_unique_id, updateDoc);
        const aud_mod_result = await db.AudioCollection.updateOne(file_unique_id, updateDoc);
        return { doc_mod_result, vid_mod_result, aud_mod_result };
    }
    catch (error) {
        console.log(error.message);
    }
}
export async function warn_user_file(data) {
    try {
        const warn_limit = parseInt(process.env.WARN_LIMIT || "3");
        const file_unique_id = {
            file_unique_id: data
        };
        const updateDoc = {
            $set: {
                is_banned: true,
            },
        };
        const userDoc = {
            $inc: {
                warn: 1
            }
        };
        const file_result = await db.DocumentCollection.findOne(file_unique_id, { projection: { user_id: 1, _id: 0 } });
        if (file_result) {
            const doc_mod_result = await db.DocumentCollection.updateOne(file_unique_id, updateDoc);
            const vid_mod_result = await db.VideoCollection.updateOne(file_unique_id, updateDoc);
            const aud_mod_result = await db.AudioCollection.updateOne(file_unique_id, updateDoc);
            const user_data = await db.UserCollection.findOne({ user_id: file_result.user_id });
            if (doc_mod_result.modifiedCount != 0 || vid_mod_result.modifiedCount != 0 || aud_mod_result.modifiedCount != 0) {
                if (user_data && user_data.warn < warn_limit && !user_data.is_banned) {
                    const user_mod_result = await db.UserCollection.updateOne({ user_id: user_data.user_id }, userDoc);
                    return { doc_mod_result, vid_mod_result, aud_mod_result, user_data, user_mod_result };
                }
            }
            return { doc_mod_result, vid_mod_result, aud_mod_result, user_data };
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
