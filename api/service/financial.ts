import {MongoClient} from 'mongodb';
import {dateFormat} from '../util';
import axios from 'axios';
const zerorpc = require("zerorpc");
/**
 * need envs MONGODBURL, DBNAME, PYURL
 */
const iterval = 60 * 5; // five min
const url2 = `mongodb://financial:financial@cluster0-shard-00-00-w3gtt.gcp.mongodb.net:27017,cluster0-shard-00-01-w3gtt.gcp.mongodb.net:27017,cluster0-shard-00-02-w3gtt.gcp.mongodb.net:27017/my_database?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
const url = process.env['MONGODBURL']||`mongodb+srv://financial:financial@cluster0-w3gtt.gcp.mongodb.net/test?retryWrites=true&w=majority`;
 
const dbName = process.env['DBNAME']||'my_database';
const client = new MongoClient(url2, { useUnifiedTopology: true });

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
        await collection.createIndex('code', {expireAfterSeconds: iterval})
    }
    const cursor = collection.find({});
    const res = await cursor.toArray();
    const code = 'hs300';
    if (res.length < 1 ){
        const pyres = await fetchPyData('hs300', {});
        await collection.deleteMany({});
        await collection.insertMany(pyres);
        return pyres;
    }
    return res;
}

export async function profit(code:string, start:Date, end:Date){
    let collection = client.db(dbName).collection('profit');
    if (!collection){
        collection = await client.db(dbName).createCollection('profit');
        await collection.createIndex('code', {expireAfterSeconds: iterval})
    }

    const cursor = collection.find({code, timestamp: {$gte: start, $lt: end}});
    const res = await cursor.toArray();
    
    
    if (res.length < 1){
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
        return pydata;
    }
    return res

}

export async function kdata(code:string, start:Date, end:Date){
    const collectionName = 'kdata';
    let collection = client.db(dbName).collection(collectionName);
    if (!collection){
        collection = await client.db(dbName).createCollection(collectionName);
        await collection.createIndex('code', {expireAfterSeconds: iterval})
    }

    const cursor = collection.find({code, timestamp: {$gte: start, $lt: end}});
    const res = await cursor.toArray();
    
    
    if (res.length < 1){
        const pyres = await fetchPyData(collectionName, {
            code, start: dateFormat(start), end: dateFormat(end)
        });
        const pydata = pyres.map((el:any)=>({
            ...el, timestamp: new Date(el.date)
        }));
        console.log(pydata);
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
        return pydata;
    }
    return res
}

/**
 *
 * http://hq.sinajs.cn/list=sz000001
 * var hq_str_sz000001="平安银行,12.730,12.760,12.800,12.840,12.610,12.800,12.810,153952178,1954584919.950,383182,12.800,519000,12.790,218661,12.780,205700,12.770,685010,12.760,1147600,12.810,403520,12.820,587141,12.830,674900,12.840,1032100,12.850,2020-06-19,15:00:03,00";
0：“平安银行”，股票名字；
1：“9.170”，今日开盘价；
2：“9.190”，昨日收盘价；
3：“9.060”，当前价格；
4：“9.180”，今日最高价；
5：“9.050”，今日最低价；
6：“9.060”，竞买价，即“买一“报价；
7：“9.070”，竞卖价，即“卖一“报价；
8：“42148125”，成交的股票数，由于股票交易以一百股为基本单位，所以在使用时，通常把该值除以一百；
9：“384081266.460”，成交金额，单位为“元“，为了一目了然，通常以“万元“为成交金额的单位，所以通常把该值除以一万；
10：“624253”，“买一”申请624253股，即6243手；
11：“9.060”，“买一”报价；
12：“638540”，“买二”申报股数；
13：“9.050”，“买二”报价；
14：“210600”，“买三”申报股数；
15：“9.040”，“买三”报价；
16：“341700”，“买四”申报股数；
17：“9.030”，“买四”报价；
18：“2298300”，“买五”申报股数；
19：“9.020”，“买五”报价；
20：“227184”，“卖一”申报227184股，即2272手；
21：“9.070”，“卖一”报价；
(22, 23), (24, 25), (26,27), (28, 29)分别为“卖二”至“卖五”的申报股数及其价格；
30：“2016-09-14”，日期；
31：“15:11:03”，时间；



作者：江湖人称_赫大侠
链接：https://www.jianshu.com/p/fabe3811a01d
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 */

function convertSinaReal(txt:string, sinaCode:string){
    console.log('txt:',txt);
    const dd = Function(`
    "use strict";
    ${txt}
    const ls = hq_str_${sinaCode}.split(',');
    const obj = {
        股票名字: ls[0],
        今日开盘价: Number(ls[1]),
        昨日收盘价: Number(ls[2]),
        当前价格: Number(ls[3]),
        今日最高价: Number(ls[4]),
        今日最低价: Number(ls[5]),
        timestamp: (new Date(ls[30]+' '+ls[31])).valueOf()
    };
    // 
    return obj;
    `)();
    return dd;
}
/**
 * 
 * @param code sz.000001
 */
export async function realtime(code:string){
    const sinacode = code.split('.').join('').toLowerCase();
    const realtext = await axios.get(`http://hq.sinajs.cn/list=${sinacode}`);
    const res = convertSinaReal(realtext.data, sinacode);
    res.code = code;
    return res;
}