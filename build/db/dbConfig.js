import { MongoClient } from "mongodb";
import 'dotenv/config';
export const mongoclient = new MongoClient(process.env.MONGODB_URL);
export async function mongoconnect() {
    // Use connect method to connect to the server
    try {
        await mongoclient.connect();
        const database = mongoclient.db("tgindex");
        const DocumentCollection = database.collection('documents');
        const VideoCollection = database.collection('videos');
        const AudioCollection = database.collection('audios');
        const UserCollection = database.collection('users');
        //Indexing is DB admins only command don't use it with applications, just written here for reference
        await DocumentCollection.createIndex({ file_unique_id: 1 }, { unique: true });
        // await DocumentCollection.createIndex({ file_name: 1 });
        // await DocumentCollection.createIndex({ is_banned: 1 });
        await VideoCollection.createIndex({ file_unique_id: 1 }, { unique: true });
        // await VideoCollection.createIndex({ file_name: 1 });
        // await VideoCollection.createIndex({ is_banned: 1 });
        await AudioCollection.createIndex({ file_unique_id: 1 }, { unique: true });
        // await AudioCollection.createIndex({ file_name: 1 });
        // await AudioCollection.createIndex({ is_banned: 1 });
        await UserCollection.createIndex({ user_id: 1 }, { unique: true });
        // await UserCollection.createIndex({ is_banned: 1 });
        return { DocumentCollection, VideoCollection, AudioCollection, UserCollection, database };
    }
    catch (error) {
        console.log("Error on db config", error.message);
        return null;
    }
}
