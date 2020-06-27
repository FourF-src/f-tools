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

export async function stockProfit(code:string){
    const res = await request('/api/stock/profit', {
        code,
        start: "2007",
        end: (new Date()).getFullYear()+''
    })
    return res.data
}

export async function hs300(){
    const res = await request('/api/stock/hs300', {
    })
    return res.data
}

export async function kdata(code:string, start:string, end:string){
    const res = await request('/api/stock/kdata', {
        code, start, end
    })
    return res.data
}