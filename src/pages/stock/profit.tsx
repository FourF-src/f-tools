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
const convertHist = memo((data?: any[]) => {
    if (!data || data.length === 0) {
        return []
    }
    const dv = ds.createView();
    dv.source(data)
        .transform({
            type: 'map',
            callback(row:any) {
                row.lowPcg = Number(row.low) / Number(row.preclose) - 1; // 为每条记录新添加一个 z 字段
                return row;
            },
        })
        .transform({
            type: 'rename',
            map: {
                lowPcg: '最大跌幅',
            }
        })
        .transform({
            type: 'bin.histogram',
            field: '最大跌幅',
            binWidth: 0.001, // 在此修改矩形的宽度，代表真实数值的大小
            as: ['最大跌幅', '频数']
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

    React.useEffect(() => {

        const chart = new F2.Chart({
            id: 'hist',
            pixelRatio: window.devicePixelRatio
        });
        chart.source(convertHist(p.kdata));
        chart.scale('跌幅分布', {
            min: -0.4,
            max: 0.4,
            nice: false,
            tickCount: 10
        });
        chart.axis('最大跌幅', {
            label: function label(_, index: number, total: number) {
                const textCfg: any = {};
                if (index === 0) {
                    textCfg.textAlign = 'left';
                } else if (index === total - 1) {
                    textCfg.textAlign = 'right';
                } else if (index === Math.ceil(total / 2)) {
                    textCfg.textAlign = 'center';
                } else {
                    textCfg.display = 'none';
                }
                return textCfg;
            }
        })

        chart.tooltip({
            showItemMarker: false,
        });
        chart.interval().position('最大跌幅*频数');
        chart.render();
        return () => {
            chart.destroy()
        }

    }, [p.kdata])

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
