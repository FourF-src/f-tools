import axios from 'axios';
import moment from 'moment';
const sinaFormat = 'YYYY-MM-DD'
function convertEastMoney(txt:string){
    const dd = Function(`
    "use strict";
    ${txt}
    // 
    return Data_netWorthTrend;
    `)();
    return dd;
}

const total = 2000

export async function main(code:string){

    const fundraw2 = await axios.get(`http://fund.eastmoney.com/pingzhongdata/${code.substr(2)}.js`)
    const etfraw = await axios.get(`http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?scale=240&ma=no&datalen=${total}&symbol=${code}`)

    const fund2 = convertEastMoney(fundraw2.data).map((el:any)=>{
        return ({
        date: moment(el.x).format(sinaFormat),
        netValue: el.y
    })});
    
    const etf = eval(etfraw.data).map((el:any)=>{
        return ({
        date: el.day,
        netValue: Number(el.close)
    })})

    const mp:any = {}
    
    etf.forEach((el:any)=>{
        mp[el.date] = {
            date: el.date, etf: el.netValue
        }
    })
    fund2.forEach((el:any)=>{
        if (mp[el.date]){
            mp[el.date].fund = el.netValue
            mp[el.date].ratio = mp[el.date].etf / el.netValue
        }
    })
    const out = Object.values(mp).sort((a:any,b:any)=>a.date>b.date?-1:a.date===b.date?0:1).slice(0, total)
    return out
}
