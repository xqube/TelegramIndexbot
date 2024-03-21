import { MongoClient } from "mongodb";
import 'dotenv/config'


export const mongoclient = new MongoClient(process.env.MONGODB_URL!);


export async function mongoconnect(): Promise<any> {
    // Use connect method to connect to the server
    try {
        await mongoclient.connect();
        const db = mongoclient.db("tgindex");
        console.log('Connected successfully to DB server');
        const DocumentCollection = db.collection('documents');
        const VideoCollection = db.collection('videos');
        const AudioCollection = db.collection('audios');
        const UserCollection = db.collection('users');

        await DocumentCollection.createIndex({ file_unique_id: 1 }, { unique: true });
        await DocumentCollection.createIndex({ file_name: 1 });

        await VideoCollection.createIndex({ file_unique_id: 1 }, { unique: true });
        await VideoCollection.createIndex({ file_name: 1 });

        await AudioCollection.createIndex({ file_unique_id: 1 }, { unique: true });
        await AudioCollection.createIndex({ file_name: 1 });

        await UserCollection.createIndex({ id: 1 }, { unique: true });

        return { DocumentCollection, VideoCollection, AudioCollection, UserCollection }
    } catch (error: any) {
        console.log("Error on db config", error.message);
        return null
    }
}