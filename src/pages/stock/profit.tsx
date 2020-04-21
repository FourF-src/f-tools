import React from 'react';
import DataSet from '@antv/data-set';
import memo from 'memoize-one';
import F2 from '@antv/f2';
import { WhiteSpace, Radio, Flex } from 'antd-mobile';
import { Props } from './$code';

const ds = new DataSet();
const convertLine = memo((data?: any[]) => {
    if (!data || data.length === 0) {
        return []
    }
    const dv = ds.createView();
    dv.source(data)
        .transform({
            type: 'map',
            callback: (row: any) => {
                row['netProfit'] = Number(row['netProfit'])
                return row;
            }
        })
        .transform({
            type: 'rename',
            map: {
                statDate: 'date',
            }
        });
    return dv.rows;
})

const Chart: React.FC<Props & { code: string }> = p => {
    const [type, changeType] = React.useState<'netProfit'|'revenue'>('netProfit')
    React.useEffect(() => {
        // Step 1: 创建 Chart 对象
        const chart = new F2.Chart({
            id: 'chart',
            pixelRatio: window.devicePixelRatio, // 指定分辨率
        });

        // Step 2: 载入数据源
        chart.source(convertLine(p.profit));
        chart.scale('date', {
            type: 'timeCat',
            tickCount: 3
        });
        chart.scale('netProfit', {
            tickCount: 5
        });
        chart.axis('date', {
            label: function label(_, index: number, total: number) {
                const textCfg: any = {};
                if (index === 0) {
                    textCfg.textAlign = 'left';
                } else if (index === total - 1) {
                    textCfg.textAlign = 'right';
                }
                return textCfg;
            }
        })

        chart.tooltip({
            custom: false, // 自定义 tooltip 内容框
        });
        chart.interval().position('date*netProfit');
        // Step 4: 渲染图表
        chart.render();
        return () => {
            chart.destroy()
        }
    }, [p.profit])


    const code = p.code;

    return <div>
        <WhiteSpace size="lg" />
        <Flex>
            <Flex.Item>
                <Radio className="radio" checked={type === 'netProfit'} onChange={e => e.target.checked && changeType('netProfit')}>netProfit</Radio>
            </Flex.Item>
            <Flex.Item>
                <Radio className="radio" checked={type === 'revenue'} onChange={e => e.target.checked && changeType('revenue')}>revenue</Radio>
            </Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <h3>{type}</h3>
        <canvas id="chart" width="800" height="600" style={{ width: '100%' }}></canvas>
        <WhiteSpace size="lg" />
        <h3>premium</h3>
        <canvas id="hist" width="800" height="600" style={{ width: '100%' }}></canvas>
    </div>
}

export default React.memo(Chart);
