import {MongoClient} from 'mongodb';
const zerorpc = require("zerorpc");
/**
 * need envs MONGODBURL, DBNAME, PYURL
 */
const lastUpdateTime:Record<string, number> = {};
const iterval = 60000;

const url = process.env['MONGODBURL']||`mongodb+srv://financial:financial@cluster0-w3gtt.gcp.mongodb.net/test?retryWrites=true&w=majority`;
 
const dbName = process.env['DBNAME']||'my_database';
const client = new MongoClient(url, { useUnifiedTopology: true });

const pyurl = process.env['PYURL']||'tcp://0.0.0.0:4242'
const rpcClient = new zerorpc.Client();
rpcClient.connect(pyurl);

function fetchPyData(service:string, arg:any){
    return new Promise<any>((resolve, rej)=>{
        rpcClient.invoke(service, JSON.stringify(arg), function(error:Error, res:any) {
            if (error){
                rej(error);
            } else {
                resolve(res);
            }
        });
    })   
}
client.connect().then(_=>console.log('mongodb connected')).catch(e=>console.error(e));

export async function hs300(){
    let collection = client.db(dbName).collection('hs300');
    if (!collection){
        collection = await client.db(dbName).createCollection('hs300');
    }
    const cursor = collection.find({});
    const res = await cursor.toArray();
    const code = 'hs300';
    if (res.length < 1 || Date.now()-lastUpdateTime[code] > iterval){
        const pyres = await fetchPyData('hs300', {});
        await collection.deleteMany({});
        await collection.insertMany(pyres);
        lastUpdateTime[code] = Date.now();
        return pyres;
    }
    return res;
}

export async function profit(code:string, start:Date, end:Date){
    let collection = client.db(dbName).collection('profit');
    if (!collection){
        collection = await client.db(dbName).createCollection('profit');
        await collection.createIndex('code')
    }

    const cursor = collection.find({code, timestamp: {$gte: start, $lt: end}});
    const res = await cursor.toArray();
    
    
    if (res.length < 1 || Date.now()-lastUpdateTime[code] > iterval){
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
        lastUpdateTime[code] = Date.now();

        return pydata;
    }
    return res

}