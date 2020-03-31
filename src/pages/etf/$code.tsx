import React from 'react';
import { connect } from 'dva';
import { actions } from '@/models/etf';
import { PropsRoute } from 'umi';
import { AppState } from '@/models/type';
import DataSet from '@antv/data-set';
import memo from 'memoize-one';
import F2 from '@antv/f2';
import { WhiteSpace} from 'antd-mobile';
import '@antv/f2/lib/geom/interval';

function mapStateToProps(s: AppState) {
  const { etf, loading } = s;
  return { ...etf, loading: loading.models.etf };
}

type Props = PropsRoute & ReturnType<typeof mapStateToProps> & typeof actions;
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
      binWidth: 0.005, // 在此修改矩形的宽度，代表真实数值的大小
      as: ['溢价率', '频数']
    });
  return dv.rows;
})

const Basic: React.FC<Props> = p => {
  const code = p.location.pathname.split('/').pop();
  const [type, setType] = React.useState<'3yrs' | '5yrs'>('3yrs');

  React.useEffect(() => {
    if (!code) {
      return;
    }
    p.getBasic(code, type);
  }, [code, type])


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
      label: function label(_, index:number, total:number) {
        // 只显示每一年的第一天
        const textCfg:any = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }})

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


  React.useEffect(()=>{

    const chart = new F2.Chart({
      id: 'hist',
      pixelRatio: window.devicePixelRatio
    });
    console.log(convertHist(p.data))
    chart.source(convertHist(p.data),{
      value: {
      min:-0.5,
      max:0.5,
      tickInterval:1
      }
      });
    chart.tooltip({
      showItemMarker: false,
    });
    chart.interval().position('溢价率*频数');
    chart.render();
    return () => {
      chart.destroy()
    }

  }, [p.data])

  return <div>
    <canvas id="chart" width="800" height="600" style={{width:'100%'}}></canvas>
    <WhiteSpace size="lg" />

    <canvas id="hist" width="800" height="600" style={{width:'100%'}}></canvas>

  </div>
}

export default connect(mapStateToProps, actions)(Basic);
