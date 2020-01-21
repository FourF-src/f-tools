import {CODE} from '../constant';
import {Router} from 'express';
import {basic, info} from '../service/etf';
const router = Router();
router.post('/basic', async (req, res)=>{
    const code = req.body.code;
    const type = req.body.type;
    try {
        const result = await basic(code, type);
        res.send({
            state: CODE.OK,
            result
        });        
    } catch (error) {
        res.send({
            state: CODE.FORBID,
            error
        })
    }

})    

router.post('/info', async (req, res)=>{
    const code = req.body.code;
    try {
        const result = await info(code);
        res.send({
            state: CODE.OK,
            result
        });        
    } catch (error) {
        res.send({
            state: CODE.FORBID,
            error
        })
    }
})    

export default router;