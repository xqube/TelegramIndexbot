import { MongoClient } from "mongodb";
import 'dotenv/config';
export const mongoclient = new MongoClient(process.env.MONGODB_URL);
export async function mongoconnect() {
    // Use connect method to connect to the server
    try {
        await mongoclient.connect();
        const db = mongoclient.db("tgindex");
        const DocumentCollection = db.collection('documents');
        const VideoCollection = db.collection('videos');
        const AudioCollection = db.collection('audios');
        const UserCollection = db.collection('users');
        //Indexing is DB admins only command don't use it with applications, just written here for reference
        await DocumentCollection.createIndex({ file_unique_id: 1 }, { unique: true });
        await DocumentCollection.createIndex({ file_name: 1 });
        await DocumentCollection.createIndex({ is_banned: 1 });
        await VideoCollection.createIndex({ file_unique_id: 1 }, { unique: true });
        await VideoCollection.createIndex({ file_name: 1 });
        await VideoCollection.createIndex({ is_banned: 1 });
        await AudioCollection.createIndex({ file_unique_id: 1 }, { unique: true });
        await AudioCollection.createIndex({ file_name: 1 });
        await AudioCollection.createIndex({ is_banned: 1 });
        await UserCollection.createIndex({ user_id: 1 }, { unique: true });
        return { DocumentCollection, VideoCollection, AudioCollection, UserCollection };
    }
    catch (error) {
        console.log("Error on db config", error.message);
        return null;
    }
}
