import { mongoconnect } from "../db/dbConfig.js";
const { DocumentCollection, VideoCollection } = await mongoconnect();
export async function insertDoc(data) {
    const insertResult = await DocumentCollection.insertOne(data);
    if (insertResult) {
        return insertResult;
    }
}
export async function insertVideo(data) {
    const insertResult = await VideoCollection.insertOne(data);
    if (insertResult) {
        return insertResult;
    }
}
export async function searchDoc(searchTerm, page) {
    try {
        const skip = (page - 1) * 10;
        // Count filtered documents
        const totalsize = await DocumentCollection.countDocuments({ file_name: { $regex: new RegExp(`\\b${searchTerm}\\b`, "i") } });
        // Fetch filtered documents for the specified page
        const filteredDocs = await DocumentCollection.find({ file_name: { $regex: new RegExp(`\\b${searchTerm}\\b`, "i") } }).skip(skip).limit(10).toArray();
        // Return an object containing both filtered documents and total size
        return { filteredDocs, totalsize };
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function searchVid(searchTerm, page) {
    try {
        const skip = (page - 1) * 10;
        // Count filtered documents
        const totalsize = await VideoCollection.countDocuments({ file_name: { $regex: new RegExp(`\\b${searchTerm}\\b`, "i") } });
        // Fetch filtered documents for the specified page
        const filteredDocs = await VideoCollection.find({ file_name: { $regex: new RegExp(`\\b${searchTerm}\\b`, "i") } }).skip(skip).limit(10).toArray();
        // Return an object containing both filtered documents and total size
        return { filteredDocs, totalsize };
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function searchDocFileid(data) {
    try {
        const filteredDocs = await DocumentCollection.findOne({ file_unique_id: data }, { projection: { file_id: 1, _id: 0 } });
        return { filteredDocs };
    }
    catch (error) {
        console.log(error);
    }
}
export async function searchVidFileid(data) {
    try {
        const filteredDocs = await VideoCollection.findOne({ file_unique_id: data }, { projection: { file_id: 1, _id: 0 } });
        return { filteredDocs };
    }
    catch (error) {
        console.log(error);
    }
}
