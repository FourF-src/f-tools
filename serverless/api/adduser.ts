import {connectToDatabase} from '../services/db';
import { NowRequest, NowResponse } from '@now/node'

const dbname = 'my_database';
const colName = 'v2ray';

function reg(){
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>add user</title>
</head>
<body>
<form action="/api/adduser" method="POST">
    <label for="email">email<input type="email" name="email" id="email"></label>
    <label for="password">password<input type="password" name="password" id="password"></label>        
    <input type="submit" value="注册">
</form>
</body>
</html>
    `
}

function result(utdid:string){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>result</title>
    </head>
    <body>
        <strong>注册成功！</strong>
        订阅地址：
        <code>https://serverless-eight-ecru.now.sh/api/vmess?type=text/plain&utdid=${utdid}</code>
    </body>
    </html>    
    `
}

export default async (req: NowRequest, res: NowResponse) => {
    if (req.method === 'GET'){
        res.send(reg());
        return;
    }

    const email = req.body['email'];
    const password = req.body['password'];
    
    if (!email || password.length < 6) {
        res.send('注册失败');
        return 
    }

    const client = await connectToDatabase();
    const col = await client.db(dbname).collection(colName);
    const user = await col.findOne({email, password});

    if (user) {
        res.send('用户已经存在');
        return 
    }

    const utdid = (new Buffer(`${email}:${password}`)).toString("base64");
    await col.insertOne({
        email, password, utdid, devices: [], active: true
    })

    res.send(result(utdid))
    return ;
}