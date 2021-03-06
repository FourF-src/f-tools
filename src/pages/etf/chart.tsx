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
            type: 'fold',
            fields: ['close', 'netValue'], // 展开字段集
            key: 'key',                   // key字段
            value: 'value',               // value字段
            retains: ['date', 'premium']        // 保留字段集，默认为除 fields 以外的所有字段
        })
        .transform({
            type: 'map',
            callback: (row: any) => {
                switch (row['key']) {
                    case 'close':
                        row['key'] = '场内收盘价';
                        break;
                    case 'netValue':
                        row['key'] = '当日净值';
                        break;
                    default:
                        break;
                }
                return row;
            }
        })
        .transform({
            type: 'rename',
            map: {
                premium: '溢价率',
                value: '价格' // row.xxx 会被替换成 row.yyy
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
            type: 'rename',
            map: {
                premium: '溢价率',
            }
        })
        .transform({
            type: 'bin.histogram',
            field: '溢价率',
            binWidth: 0.01, // 在此修改矩形的宽度，代表真实数值的大小
            as: ['溢价率', '频数']
        });
    return dv.rows;
})

const Chart: React.FC<Props & { code: string }> = p => {
    const [type, setType] = React.useState<'1yrs' | '3yrs' | '5yrs'>('3yrs');

    React.useEffect(() => {
        // Step 1: 创建 Chart 对象
        const chart = new F2.Chart({
            id: 'chart',
            pixelRatio: window.devicePixelRatio, // 指定分辨率
        });

        // Step 2: 载入数据源
        chart.source(convertLine(p.data));
        chart.scale('date', {
            type: 'timeCat',
            tickCount: 3
        });
        chart.scale('close', {
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
        chart.line().position('date*价格').color('key');
        // Step 4: 渲染图表
        chart.render();
        return () => {
            chart.destroy()
        }
    }, [p.data])


    React.useEffect(() => {

        const chart = new F2.Chart({
            id: 'hist',
            pixelRatio: window.devicePixelRatio
        });
        chart.source(convertHist(p.data));
        chart.scale('溢价率', {
            min: -0.4,
            max: 0.4,
            nice: false,
            tickCount: 10
        });
        chart.axis('溢价率', {
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
        chart.interval().position('溢价率*频数');
        chart.render();
        return () => {
            chart.destroy()
        }

    }, [p.data])
    const code = p.code;

    function changeType(type:any){
        setType(type);
        p.getBasic(code, type);    
    }
    return <div>
        <WhiteSpace size="lg" />
        <Flex>
            <Flex.Item>
                <Radio className="radio" checked={type === '1yrs'} onChange={e => e.target.checked && changeType('1yrs')}>last year</Radio>
            </Flex.Item>
            <Flex.Item>
                <Radio className="radio" checked={type === '3yrs'} onChange={e => e.target.checked && changeType('3yrs')}>last 3 years</Radio>
            </Flex.Item>
            <Flex.Item>
                <Radio className="radio" checked={type === '5yrs'} onChange={e => e.target.checked && changeType('5yrs')}>last 5 years</Radio>
            </Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <h3>history price</h3>
        <canvas id="chart" width="800" height="600" style={{ width: '100%' }}></canvas>
        <WhiteSpace size="lg" />
        <h3>premium</h3>
        <canvas id="hist" width="800" height="600" style={{ width: '100%' }}></canvas>
    </div>
}

export default React.memo(Chart);
