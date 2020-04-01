import axios from 'axios';
import moment from 'moment';
import cheerio from 'cheerio';
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

function convertinfo(txt:string){
    const capitalIdx = txt.indexOf('总净资产');
    const capital = txt.substring(txt.indexOf('<span>', capitalIdx)+6, txt.indexOf('</span>', capitalIdx))
    const feeIdx = txt.indexOf('<th>费率费用</th>', txt.indexOf('管理及托管费用'))+13;
    const fee = txt.substring(feeIdx, txt.indexOf('</tr>', feeIdx)).replace(/\<td\>/g, '').split('</td>').filter(el=>!!el).map(el=>parseFloat(el.trim())/100);
    return {
        capital: parseFloat(capital)*(capital.includes('亿')?100000000:capital.includes('千万')?10000000:capital.includes('万')?10000:1),
        managementFee: fee[0],
        custodianFee: fee[1],
        marketingfee: fee[2]
    }
}

function convertInvestETF(txt:string){
    const idx = txt.indexOf('<tbody>');
    const idx2 = txt.indexOf('</tbody>')+'</tbody>'.length;
    let r = txt.substring(idx, idx2);
    const $ = cheerio.load(r)
    if (!$){
        return []
    }
    const res:any[] = [];
    $('a').each((_, el)=>{
        const t = $(el);
        const href = t.attr('href');
        let code = '';
        if (href){
            const tmp = href.split('/');
            code = tmp[tmp.length-2];
            if(!code){
                return;
            }
            code = code.toLowerCase();
        }
        res.push({
            name: t.text(),
            code
        });
    });
    return res;
}

export async function listv1(){
    const txtraw = await axios.get('https://androidinvest.com/etf/');
    const ls = convertInvestETF(txtraw.data);
    return ls;
}

export async function list(){
    const txtraw = await axios.get('https://xueqiu.com/service/v5/stock/screener/fund/list?type=18&parent_type=1&order=desc&order_by=percent&page=1&size=3000');
    return txtraw.data.data.list;
}

export async function info(code:string){
    const txtraw = await axios.get(`http://quotes.money.163.com/fund/sgfl_${code.substr(2)}.html`)
    return convertinfo(txtraw.data);
}

export async function basic(code:string, type:'1yrs'|'5yrs'|'3yrs' = '3yrs'){
    const datalen = Math.max(Math.min(parseInt(type, 10) * 250, 10* 250), 250);
    const fundraw2 = await axios.get(`http://fund.eastmoney.com/pingzhongdata/${code.substr(2)}.js`)
    const etfraw = await axios.get(`http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?scale=240&ma=no&datalen=${datalen}&symbol=${code}`)

    const fund2 = convertEastMoney(fundraw2.data).map((el:any)=>{
        return ({
        date: moment(el.x).format(sinaFormat),
        netValue: el.y
    })});
    
    const etf = eval(etfraw.data).map((el:any)=>{
    return ({
        date: el.day,
        close: Number(el.close),
    })})

    const mp:any = {}
    
    etf.forEach((el:any)=>{
        mp[el.date] = {...el}
    })

    fund2.forEach((el:any)=>{
        if (mp[el.date]){
            mp[el.date].netValue = el.netValue
            mp[el.date].premium = Math.floor((mp[el.date].close / el.netValue - 1) * 10000) / 10000
        }
    })
    const out = Object.values(mp).sort((a:any,b:any)=>a.date>b.date?-1:a.date===b.date?0:1).slice(0, datalen)
    return out
}
