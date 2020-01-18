import React from 'react';
import { connect } from 'dva';
import { actions } from '@/models/etf';
import { PropsRoute } from 'umi';
import { AppState } from '@/models/type';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from '@antv/data-set';

function mapStateToProps(s: AppState) {
  const { etf } = s;
  return { ...etf };
}

type Props = PropsRoute & ReturnType<typeof mapStateToProps> & typeof actions;


const Index: React.FC<Props> = p => {
  const code = p.location.pathname.split('/').pop();
  
  React.useEffect(() => {
    if (!code) {
      return;
    }
    p.set({ current: { code } });
    p.getNetValue(code);
  }, [code])
  
  const cols = {
    value: {
      min: 0
    },
  };
  const cols2 = {
    ratio: {
      min: -0.1,
      max: 0.1
    },
  };

  const ds = new DataSet();
  const dv = ds.createView();
  const hisDV = ds.createView();
  

  if(p.data){
    dv.source(p.data)
    .transform({
      type: 'fold',
      fields: [ 'etf', 'fund' ], // 展开字段集
      key: 'key',                   // key字段
      value: 'value',               // value字段
      retains: [ 'date','ratio' ]        // 保留字段集，默认为除 fields 以外的所有字段
    })
    .transform({
      type: 'map',
      callback(row:any) { // 加工数据后返回新的一行，默认返回行数据本身
        row.ratio = Math.floor((row.ratio - 1)*1000)/1000;
        return row;
      }
    })    
    .transform({
      type: 'rename',
      map: {
        ratio: '溢价',
        value: '价格' // row.xxx 会被替换成 row.yyy
      }
    }); 


    hisDV.source(p.data)
    .transform({
      type: 'map',
      callback(row:any) { // 加工数据后返回新的一行，默认返回行数据本身
        row.ratio = Math.floor((row.ratio - 1)*1000)/1000;
        return row;
      }
    })
    .transform({
      type: 'bin.histogram',
      field: 'ratio',
      binWidth: 0.005, // 在此修改矩形的宽度，代表真实数值的大小
      as: [ 'ratio', 'count' ]
    });
    
  }


  return <div>
    <h4>
      {code}
    </h4>
    <Chart height={600} forceFit>
    <Tooltip
          crosshairs={{
            type: "y"
          }}
        />

      <View start={{x:0, y:0}} end={{x:1, y:0.55}} data={dv.rows} scale={cols}>
        <Axis name="价格" title/>
        <Geom type="line" position="date*价格" color="key" size={2} />
      </View>
      <View start={{x:0, y:0.7}} data={dv.rows} scale={cols2}>
        <Axis name="date" />
        <Axis name="溢价" title/>
        <Geom type="line" position="date*溢价" size={2} />
      </View>
    </Chart>
    <Chart height={400} width={600} data={hisDV.rows} scale={cols2}>
       <Axis name="count" />
      <Axis name="ratio" title/>
      <Tooltip inPlot={false} crosshairs={false} position={"top"} />
          <Geom type="interval" position="ratio*count" />

     
    </Chart>
  </div>
}
export default connect(mapStateToProps, actions)(Index);
