import { NowRequest, NowResponse } from '@now/node'
import {connectToDatabase} from '../services/db';
 
const dbName = 'my_database';

export default async (req: NowRequest, res: NowResponse) => {
    const client = await connectToDatabase();
    let collection = client.db(dbName).collection('hs300');
    if (!collection){
        res.json({ code: -1, msg: 'no collection'})
        return
    }
    const cursor = collection.find({});
    const result = await cursor.toArray();
    res.json({ code: 0, msg: 'ok', data: result });
}
