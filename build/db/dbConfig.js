import { MongoClient } from "mongodb";
import 'dotenv/config';
export const mongoclient = new MongoClient(process.env.MONGODB_URL);
export async function mongoconnect() {
    // Use connect method to connect to the server
    await mongoclient.connect();
    console.log('Connected successfully to server');
    const db = mongoclient.db("tgindex");
    const DocumentCollection = db.collection('documents');
    const VideoCollection = db.collection('Video');
    return { DocumentCollection, VideoCollection };
}
