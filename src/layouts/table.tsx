import React from 'react';
import { Flex } from 'antd-mobile';
import * as style from './index.less';
export interface IColumn<T> {
    key?: string
    dataIndex: keyof T
    title: string
    render?: (val: any, item: T) => React.ReactElement | string
    fixed?: boolean
    width?: number
}

interface TableProps<T extends any> {
    columns: IColumn<T>[]
    dataSource: T[]
    rowKey?: (val: T) => string | string
    scrollWidth?: number
}
const TableHeader: React.FC = p => <div className={style.tableHeader}>
    {p.children}
</div>

const TableItem: React.FC = p => <div className={style.tableItem}>
    {p.children}
</div>

const Table: React.FC<TableProps<any>> = p => {

    const ls = p.dataSource.map((el, idx) =>(
        <Flex key={typeof p.rowKey === 'undefined' ? idx : typeof p.rowKey === 'string' ? el[p.rowKey] : p.rowKey(el)}>
            {p.columns.map(col => col.fixed? '':(
                <Flex.Item key={col.key || col.dataIndex} style={{width: col.width||'auto'}}><TableItem>{col.render ? col.render(el[col.dataIndex], el) : el[col.dataIndex]}</TableItem></Flex.Item>
            ))}
        </Flex>
    ));

    const fixedEle = p.columns.find(el => !!el.fixed);

    let fixed = !fixedEle ? '' :
        <div style={{ width: fixedEle.width, position:'absolute', top: 0, left: 0 }} >
                <Flex >
                    <Flex.Item key={fixedEle.key || fixedEle.dataIndex}><TableHeader>
                        {fixedEle.title}</TableHeader></Flex.Item>
                </Flex>
                {p.dataSource.map((el, idx) =>
                    <Flex key={typeof p.rowKey === 'undefined' ? idx : typeof p.rowKey === 'string' ? el[p.rowKey] : p.rowKey(el)}>
                        <Flex.Item key={fixedEle.key || fixedEle.dataIndex}>
                            <TableItem>{fixedEle.render ? fixedEle.render(el[fixedEle.dataIndex], el) : el[fixedEle.dataIndex]}</TableItem>
                        </Flex.Item>
                    </Flex>)}
        </div>


    return <div style={{ width: '100%', position:'relative' }}>
        {fixed}
        <div style={fixedEle?{marginLeft: fixedEle.width, overflow: 'scroll'}:{marginLeft:'inherit'}}>
            <div style={fixedEle?{width:p.scrollWidth}:{}}>
            <Flex>
                    {p.columns.map(col => col.fixed?'':(
                        <Flex.Item key={col.key || col.dataIndex} style={{width: col.width||'auto'}}><TableHeader>
                            {col.title}</TableHeader></Flex.Item>
                    ))}
                </Flex>
                {ls}

            </div>
        </div>
    </div>
}

export default Table