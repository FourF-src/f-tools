import axios from 'axios'
import {CODE} from '../../api/constant';
import {notification} from 'antd';
async function request(url:string, data?:any){
    try {
        const res = await axios.post(url, data)
        if (res.data.state === CODE.ERROR || res.data.state === CODE.FORBID){
            notification.error({
                message:'出错'
            });
            return {
                data: {}
            }
        }
        return res;
    } catch (error) {
        notification.error(error);
        return {
            data:{}
        }
    }
}
export async function etfBasic(code:string, type:'3yrs'|'5yrs'){
    const res = await request('/api/etf/basic', {
        code,
        type
    })
    return res.data
}

export async function etfList(){
    const res = await request('/api/etf/list')
    return res.data
}

export async function etfInfo(code:string){
    const res = await request('/api/etf/info', {
        code,
    })
    return res.data
}