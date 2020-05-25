import { NowRequest, NowResponse } from '@now/node'
const dig = require('node-dig-dns');
export default async (req: NowRequest, res: NowResponse) => {
    const website = req.query['website'];
    if (!website){
        res.json({ code: -1, msg: 'no website'})
        return
    }
    const result = await dig([website, 'ANY'])
    res.json({code:0, msg:'ok', data:result});
}
