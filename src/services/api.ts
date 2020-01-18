import axios from 'axios'

export async function fundNetValue(code:string){
    const res = await axios.post('/api/fund/netvalue', {
        code
    })
    return res.data
}