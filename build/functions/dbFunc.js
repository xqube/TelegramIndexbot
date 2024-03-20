import { mongoconnect } from "../db/dbConfig.js";
const { DocumentCollection, VideoCollection, AudioCollection, UserCollection } = await mongoconnect();
export async function insert_document(data) {
    try {
        const insertResult = await DocumentCollection.insertOne(data);
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
        const insertResult = await VideoCollection.insertOne(data);
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
        const insertResult = await AudioCollection.insertOne(data);
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
        const insertResult = await UserCollection.insertOne(data);
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
        const combinedRegex = { $and: regexPatterns.map(pattern => ({ file_name: pattern })) };
        // Count filtered documents
        const totalsize = await DocumentCollection.countDocuments(combinedRegex);
        // Fetch filtered documents for the specified page
        const filteredDocs = await DocumentCollection.find(combinedRegex).skip(skip).limit(10).toArray();
        // Return an object containing both filtered documents and total size
        return { filteredDocs, totalsize };
    }
    catch (error) {
        console.error(error);
        throw error;
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
        const combinedRegex = { $and: regexPatterns.map(pattern => ({ file_name: pattern })) };
        // Count filtered documents
        const totalsize = await VideoCollection.countDocuments(combinedRegex);
        // Fetch filtered documents for the specified page
        const filteredDocs = await VideoCollection.find(combinedRegex).skip(skip).limit(10).toArray();
        // Return an object containing both filtered documents and total size
        return { filteredDocs, totalsize };
    }
    catch (error) {
        console.error(error);
        throw error;
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
        const combinedRegex = { $and: regexPatterns.map(pattern => ({ file_name: pattern })) };
        // Count filtered documents
        const totalsize = await AudioCollection.countDocuments(combinedRegex);
        // Fetch filtered documents for the specified page
        const filteredDocs = await AudioCollection.find(combinedRegex).skip(skip).limit(10).toArray();
        // Return an object containing both filtered documents and total size
        return { filteredDocs, totalsize };
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function search_document_file_id(data) {
    try {
        const filteredDocs = await DocumentCollection.findOne({ file_unique_id: data }, { projection: { file_id: 1, file_name: 1, file_caption: 1, _id: 0 } });
        return { filteredDocs };
    }
    catch (error) {
        console.log(error);
    }
}
export async function search_video_file_id(data) {
    try {
        const filteredDocs = await VideoCollection.findOne({ file_unique_id: data }, { projection: { file_id: 1, file_name: 1, file_caption: 1, _id: 0 } });
        return { filteredDocs };
    }
    catch (error) {
        console.log(error);
    }
}
export async function search_audio_file_id(data) {
    try {
        const filteredDocs = await AudioCollection.findOne({ file_unique_id: data }, { projection: { file_id: 1, file_name: 1, file_caption: 1, _id: 0 } });
        return { filteredDocs };
    }
    catch (error) {
        console.log(error);
    }
}
