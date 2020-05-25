import { NowRequest, NowResponse } from '@now/node'
import {connectToDatabase} from '../services/db';

import axios from 'axios';
const colName = 'v2ray';
const dbname = 'my_database';
const url = "https://view.ssfree.ru/";
const regTxt = /vmess:\/\/[a-zA-Z0-9+/=]+/g;

function now(){
  let now = new Date();
  return `${now.getDate()} ${now.getHours()}:${now.getMinutes()}`
}

export async function getVmess() {
  const res = await axios.get(url);
  if (res.status !== 200 || !res.data) {
    return null;
  }
  const vmess = res.data.match(regTxt);
  if (vmess.length < 1) {
    return null;
  }
  return replacePS(vmess[0]);
}

function replacePS(txt:string){
  const protocol = 'vmess://';
  txt = txt.replace(protocol,'')
  const tt = new Buffer(txt, 'base64');
  const obj = JSON.parse(tt.toString());
  obj['ps'] = '失效请及时更新@'+now();
  const buff = new Buffer(JSON.stringify(obj));
  return protocol + buff.toString('base64');
}

async function validate(req: NowRequest){
  const client = await connectToDatabase();
  const collection = client.db(dbname).collection(colName);
  const utdid = req.query['utdid'];
  if (!utdid){
    return false;
  }

  const result = await collection.findOne({utdid});

  if (!result){
    return false
  }

  if (!result.active){
    return false
  }
  /**
   * utdid: xxxx
   * devices: [
   *  {ua, realip}
   * ]
   */

  const isOld = result.devices.find((el:any)=>el['user-agent'] === req.headers['user-agent']);
  if (isOld){
    return true;
  }
  result.devices.push({
    'user-agent': req.headers['user-agent'],
    'x-real-ip': req.headers['x-real-ip']
  });
  if (result.devices.length < 5) {
    await collection.findOneAndUpdate({utdid}, result);
    return true;
  }
  return false;
}

export default async (req: NowRequest, res: NowResponse) => {
    const canTrust = await validate(req);
    let b64 = '';
  
    if (canTrust) {
      const data = await getVmess();
      if (data){
        const buff = new Buffer(data);
        b64 = buff.toString('base64');    
      }
    }

    const type = req.query['type'];
    if (type === 'text/plain'){
      return res.send(b64);
    }
    res.json({code:0, msg:'ok', data:b64});
}
