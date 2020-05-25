import {MongoClient} from 'mongodb';
import { NowRequest, NowResponse } from '@now/node'

const url = `mongodb+srv://financial:financial@cluster0-w3gtt.gcp.mongodb.net/test?retryWrites=true&w=majority`;
 
const dbName = 'my_database';
let cachedDb:MongoClient|null = null;

function connectToDatabase (uri:string) {
  console.log('=> connect to database');

  if (cachedDb) {
    console.log('=> using cached database instance');
    return Promise.resolve(cachedDb);
  }
  const client = new MongoClient(url, { useUnifiedTopology: true });
  return client.connect()
    .then(db => {
      cachedDb = db;
      return cachedDb;
    });
}

export default async (req: NowRequest, res: NowResponse) => {
    const client = await connectToDatabase(url);
    let collection = client.db(dbName).collection('hs300');
    if (!collection){
        res.json({ code: -1, msg: 'no collection'})
        return
    }
    const cursor = collection.find({});
    const result = await cursor.toArray();
    res.json({ code: 0, msg: 'ok', data: result });
}
