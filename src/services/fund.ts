import axios from 'axios';
import moment from 'moment';
import {writeFileSync} from 'fs';
const format = 'YYMMDD'
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

async function main(code:string){

    const fundraw2 = await axios.get(`http://fund.eastmoney.com/pingzhongdata/${code.substr(2)}.js`)
    // const fundraw = await axios.get('https://api.doctorxiong.club/v1/fund/detail?code='+code.substr(2))
    const etfraw = await axios.get('http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?scale=240&ma=no&datalen=2000&symbol='+code)

    const fund2 = convertEastMoney(fundraw2.data).map((el:any)=>{
        return ({
        date: moment(el.x).format(sinaFormat),
        netValue: el.y
    })});

    // const fund = fundraw.data.data.netWorthData.map((el:any)=>({
    //     date: moment(el[0], format).format(sinaFormat),
    //     netValue: el[1]
    // }))
    
    const etf = eval(etfraw.data).map((el:any)=>{
        return ({
        date: el.day,
        netValue: Number(el.close)
    })})

    const mp:any = {}
    
    etf.forEach((el:any)=>{
        mp[el.date] = {
            date: el.date, fund: el.netValue
        }
    })
    // console.log(etf)
    fund2.forEach((el:any)=>{
        if (mp[el.date]){
            mp[el.date].etf = el.netValue
            mp[el.date].ratio = el.netValue / mp[el.date].fund
        }
    })
    // console.log(fund, etf)
    const out = Object.values(mp).sort((a:any,b:any)=>a.date>b.date?-1:a.date===b.date?0:1)
    return out
}
function csv(d:Array<any>){
    return d.map(el=>Object.values(el).join(',')).join('\n')
}
// const code = 'sz159941';
const code = 'sh513100';
main(code).then(res=>{
    writeFileSync(`./ratio_${code}.csv`, csv(res))
}).catch(console.error);