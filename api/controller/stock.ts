import {CODE} from '../constant';
import {Router} from 'express';
import {profit, hs300, kdata} from '../service/financial';
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


export default router;