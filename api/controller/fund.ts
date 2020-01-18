import {CODE} from '../constant';
import {Router} from 'express';
import {main} from '../service/fund';
const router = Router();
router.post('/netvalue', async (req, res)=>{
    const code = req.body.code;
    try {
        const result = await main(code);
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