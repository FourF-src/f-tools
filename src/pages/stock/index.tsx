import React from 'react'
import { Link } from 'umi';
import { SearchBar, WhiteSpace } from 'antd-mobile';
import Table, { IColumn } from '@/layouts/table';
import { connect } from 'dva';
import { actions } from '@/models/stock';
import { AppState } from '@/models/type';
import { PropsRoute } from 'umi';
import memo from 'memoize-one';
import debounce from '@/util/debounce';
import { Spin } from '@/layouts';
function mapStateToProps(s: AppState) {
    const {stock, loading } = s;
    return { ...stock, loading: loading.models.stock };
}

type Props = PropsRoute & ReturnType<typeof mapStateToProps> & typeof actions;

const filter = memo((kw: string, data: any[]) => !kw ? data : data.filter(el => (el.code_name + el.code as string).toLowerCase().includes(kw)))

const debounceFn = debounce((fn: Function) => fn(), 200);

const Stock: React.FC<Props> = p => {
    const cols: IColumn<any>[] = [
        {
            dataIndex: 'code',
            title: '代码',
            render: (val) => <Link to={'/stock/' + val}>{val}</Link>,
        },

        {
            dataIndex: 'code_name',
            title: '名称',
            render: (val, it) => <span title={val}>{val}</span>,
        },
    ]
    React.useEffect(() => {
        p.getHS300()
    }, [])


    const [keyword, setKeyWord] = React.useState('');

    return <div >
        <h2>HS300 Stocks</h2>
        <SearchBar onChange={val => debounceFn(() => setKeyWord(val))} />
        <WhiteSpace size="lg" />
        <Table columns={cols} dataSource={filter(keyword, p.hs300)} ></Table>
        <Spin loading={p.loading} />
    </div>
}
export default connect(mapStateToProps, actions)(Stock);