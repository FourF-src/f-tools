import React from 'react'
import { Link } from 'umi';
import { SearchBar, WhiteSpace } from 'antd-mobile';
import Table, { IColumn } from '@/layouts/table';
import { connect } from 'dva';
import { actions } from '@/models/etf';
import { AppState } from '@/models/type';
import { PropsRoute } from 'umi';
import memo from 'memoize-one';
import debounce from '@/util/debounce';
import { Spin } from '@/layouts';
function mapStateToProps(s: AppState) {
    const { etf, loading } = s;
    return { ...etf, loading: loading.models.etf };
}

type Props = PropsRoute & ReturnType<typeof mapStateToProps> & typeof actions;

const filter = memo((kw: string, data: any[]) => !kw ? data : data.filter(el => (el.name + el.symbol as string).toLowerCase().includes(kw)))

const debounceFn = debounce((fn: Function) => fn(), 200);

const ETF: React.FC<Props> = p => {
    const cols: IColumn<any>[] = [
        {
            dataIndex: 'symbol',
            title: '代码',
            fixed: true,
            width: 100,
            render: (val) => <Link to={'/etf/' + val}>{val}</Link>,
        },

        {
            dataIndex: 'name',
            title: '名称',
            render: (_, it) => <span title={it.name}>{it.name.length >4?(it.name as string).substr(0, 4)+'...':it.name}</span>,
        },
        {
            dataIndex: 'premium_rate',
            title: '折溢价',
            render: (val: number) => val + '%',
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
            dataIndex: 'percent',
            title: '涨跌幅',
            render: val => val + '%'
        },
    ]
    React.useEffect(() => {
        p.getList()
    }, [])


    const [keyword, setKeyWord] = React.useState('');

    return <div >
        <h2>ETFs</h2>
        <SearchBar onChange={val => debounceFn(() => setKeyWord(val))} />
        <WhiteSpace size="lg" />
        <Table columns={cols} dataSource={filter(keyword, p.list)} scrollWidth={450} ></Table>
        <Spin loading={p.loading} />
    </div>
}
export default connect(mapStateToProps, actions)(ETF);