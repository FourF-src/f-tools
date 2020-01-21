import axios from 'axios'

export async function etfBasic(code:string, type:'3yrs'|'5yrs'){
    const res = await axios.post('/api/etf/basic', {
        code,
        type
    })
    return res.data
}

export async function etfInfo(code:string){
    const res = await axios.post('/api/etf/info', {
        code,
    })
    return res.data
}