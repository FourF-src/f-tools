import {CODE} from '../constant';
import {Router} from 'express';
import {profit, hs300, kdata, realtime} from '../service/financial';
import {tProb} from '../service/calc';
const router = Router();
router.post('/profit', async (req, res)=>{
    const code = req.body.code;
    const start = req.body.start;
    const end = req.body.end;
    try {
        const result = await profit(code, new Date(start), new Date(end));
        res.send({
            state: CODE.OK,
            result
        });        
    } catch (error) {
        console.error(error);
        res.send({
            state: CODE.FORBID,
            error
        })
    }

})    

router.post('/kdata', async (req, res)=>{
    const code = req.body.code;
    const start = req.body.start;
    const end = req.body.end;
    try {
        const result = await kdata(code, new Date(start), new Date(end));
        res.send({
            state: CODE.OK,
            result
        });        
    } catch (error) {
        console.error(error);
        res.send({
            state: CODE.FORBID,
            error
        })
    }

})    

router.post('/hs300', async (req, res)=>{
    try {
        const result = await hs300();
        res.send({
            state: CODE.OK,
            result
        });        
    } catch (error) {
        console.error(error);
        res.send({
            state: CODE.FORBID,
            error
        })
    }

})    

router.post('/t-probability', async (req, res)=>{
    const code = req.body.code;
    const days = req.body.days; // 30 days, 90 days, 360 days 
    const end = new Date();
    const start = new Date(end.valueOf()- 1000 * 60 * 60 * 24 * days);
    try {
        const kRes = await kdata(code, start, end);
        const realRes = await realtime(code);
        res.send({
            state: CODE.OK,
            result: {
                kRes, realRes, tProb:tProb(kRes, realRes['当前价格'], realRes['昨日收盘价'])
            }
        })        
    } catch (error) {
        console.error(error);
        res.send({
            state: CODE.ERROR,
            error
        })
    }
})    

export default router;