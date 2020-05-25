import {MongoClient} from 'mongodb';

const url = `mongodb+srv://financial:financial@cluster0-w3gtt.gcp.mongodb.net/test?retryWrites=true&w=majority`;
 
let cachedDb:MongoClient|null = null;

export function connectToDatabase () {
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