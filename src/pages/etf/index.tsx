import React from 'react'
import {Link} from 'umi';
import {SearchBar, WhiteSpace} from 'antd-mobile';
import Table, {IColumn} from '@/layouts/table';
import {connect} from 'dva';
import {actions} from '@/models/etf';
import { AppState } from '@/models/type';
import { PropsRoute } from 'umi';
import memo from 'memoize-one';
import debounce from '@/util/debounce';

function mapStateToProps(s: AppState) {
    const { etf, loading } = s;
    return { ...etf, loading: loading.models.etf };
}

type Props = PropsRoute & ReturnType<typeof mapStateToProps> & typeof actions;

const filter = memo((kw:string, data:any[])=>!kw?data:data.filter(el=>(el.name+el.symbol as string).toLowerCase().includes(kw)))

const debounceFn = debounce((fn:Function)=>fn(), 200);

const ETF:React.FC<Props> = p=>{
    const cols:IColumn<any>[] = [
        {
            dataIndex: 'symbol',
            title: '名称',
            render: (_, it)=><Link to={'/etf/'+it.symbol}>{(it.name as string).substr(0, 4)}</Link>,
            fixed: true,
            width: 100
        },
        {
            dataIndex: 'premium_rate',
            title: '折溢价',
            render: (val:number)=>val+'%',
        },
        {
            dataIndex: 'unit_nav',
            title: '单位净值'
        },
        {
            dataIndex: 'current',
            title: '当前价格'
        },
        {
            dataIndex: 'symbol',
            title: '代码',
        },
        {
            dataIndex: 'percent',
            title: '涨跌幅',
            render: val=>val+'%'
        },
    ]
    React.useEffect(()=>{
        p.getList()
    }, [])


    const [keyword, setKeyWord] = React.useState('');

    const [fix, setFix] = React.useState(false)



    return <div >
            <div className="sub-title">ETFs</div>
            <SearchBar onChange={val => debounceFn(()=>setKeyWord(val))} />
            <WhiteSpace size="lg" />
            <Table columns={cols} dataSource={filter(keyword, p.list)} scrollWidth={500} ></Table>
    </div>
}
export default connect(mapStateToProps, actions)(ETF);