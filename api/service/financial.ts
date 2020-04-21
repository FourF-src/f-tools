import axios from 'axios';
import {MongoClient} from 'mongodb';

let lastUpdateTime = Date.now();
const iterval = 60000;

const url = 'mongodb://my_user:password123@34.80.33.204:3333/my_database';

const dbName = 'my_database';
const client = new MongoClient(url, { useUnifiedTopology: true });

const pyurl = 'http://127.0.0.1:5000/httprpc'

function getPyURL(service:string){
    return pyurl + '/' + service;
}

async function fetchPyData(service:string, arg:any){
    const res = await axios.post(getPyURL(service), arg);
    if (res.data.data){
        return res.data.data
    }
    return []
}
client.connect().then(_=>console.log('mongodb connected')).catch(e=>console.error(e));

export async function profit(code:string, start:Date, end:Date){
    let collection = client.db(dbName).collection('profit');
    if (!collection){
        collection = await client.db(dbName).createCollection('profit');
        await collection.createIndex('code')
    }

    const cursor = collection.find({code, timestamp: {$gte: start, $lt: end}});
    const res = await cursor.toArray();
    
    
    if (res.length < 1 || Date.now()-lastUpdateTime > iterval){
        const pyres = await fetchPyData('profit', {
            code, start: start.getFullYear(), end: end.getFullYear()
        });
        const pydata = pyres.map((el:any)=>({
            ...el, timestamp: new Date(el.statDate)
        }));
        const mp:Record<string, boolean> = {};
        res.forEach((el:any)=>{
            mp[(el.timestamp as Date).toISOString()] = true;
        })
        const finalData = pydata.filter((el:any)=>{
            if(mp[(el.timestamp as Date).toISOString()]){
                return false;
            }
            return true;
        })
        if(finalData.length > 0){
            await collection.insertMany(finalData);
        }
        lastUpdateTime = Date.now();

        return pydata;
    }
    return res

}