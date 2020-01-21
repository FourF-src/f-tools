import React from 'react';
import { connect } from 'dva';
import { actions } from '@/models/etf';
import { PropsRoute } from 'umi';
import { AppState } from '@/models/type';
import { Radio, Form, Spin, Menu, Icon, Layout } from 'antd';
const SubMenu = Menu.SubMenu
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
import memo from 'memoize-one';
import GaugeChart from 'react-gauge-chart';



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


  return <div>
    <Form>
      <Form.Item>
        <Radio.Group value={type} onChange={e => setType(e.target.value)}>
          <Radio.Button value="3yrs">3 years</Radio.Button>
          <Radio.Button value="5yrs">5 years</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </Form>
    <Chart height={600} forceFit>
      <Tooltip
        crosshairs={{
          type: "y"
        }}
      />

      <View start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.55 }} data={convertLine(p.data)} scale={cols}>
        <Axis name="价格" title />
        <Geom type="line" position="date*价格" color="key" size={2} />
      </View>
      <View start={{ x: 0, y: 0.7 }} data={convertLine(p.data)} scale={cols2}>
        <Axis name="date" />
        <Axis name="溢价率" title />·
        <Geom type="line" position="date*溢价率" size={2} />
      </View>
    </Chart>
    <Chart height={400} width={600} data={convertHist(p.data)} scale={cols2}>
      <Axis name="频数" title />
      <Axis name="溢价率" title />
      <Tooltip inPlot={false} crosshairs={false} />
      <Geom type="interval" position="溢价率*频数" />


    </Chart>
  </div>
}

const Info: React.FC<Props> = p => {
  const code = p.location.pathname.split('/').pop();

  React.useEffect(() => {
    if (!code) {
      return
    }
    p.getInfo(code);
  }, [code])

  if (!p.info) {
    return '-';
  }
  return <div style={{ display: 'flex', width:900, margin:'auto' }}>
    <div style={{ flex: '1', textAlign:'center' }}>
      <GaugeChart id="gauge-management"
        nrOfLevels={3}
        percent={p.info.managementFee/0.1}
        textColor="#000"
        formatTextValue={(value:number) => value*10 + '%'}
        colors={['#5BE12C', '#F5CD19', '#EA4228']}
        style={{ margin:'auto' }}
      />
      管理费
      </div>
    <div style={{  flex: '1', textAlign:'center' }}>
      <GaugeChart id="gauge-custodian"
        nrOfLevels={3}
        percent={p.info.custodianFee/0.1}
        formatTextValue={(value:number) => value*10 + '%'}
        textColor="#000"
        style={{ margin:'auto' }}
        colors={['#5BE12C', '#F5CD19', '#EA4228']}
        />
      托管费
      </div>
    <div style={{  flex: '1', textAlign:'center' }}>
      <GaugeChart id="gauge-marketing"
        nrOfLevels={3}
        percent={p.info.marketingfee/0.1}
        formatTextValue={(value:number) => value*10 + '%'}
        textColor="#000"
        colors={['#5BE12C', '#F5CD19', '#EA4228']}
        style={{ margin:'auto' }}
      />
      销售服务费
      </div>

  </div>;
}

const Index: React.FC<Props> = p => {
  const curr = p.type;
  const [okey, setOkey] = React.useState<string[]>(['sub1']);
  // submenu keys of first level


  const changeMemu = React.useCallback((openKeys: string[]) => {
    const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

    const latestOpenKey = openKeys.find(key => okey.indexOf(key) === -1) || '';
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOkey(openKeys);
    } else {
      setOkey(latestOpenKey ? [latestOpenKey] : []);
    }
  }, [okey]);
  const menu = <Menu
    mode="inline"
    openKeys={okey}
    defaultSelectedKeys={[curr]}
    onClick={(t: any) => p.set({ type: t.key })}
    onOpenChange={changeMemu}
    style={{ height: '100%' }}
  >
    <SubMenu
      key="sub1"
      title={
        <span>
          <Icon type="mail" />
          <span>图表工具</span>
        </span>
      }
    >
      <Menu.Item key="basic">基本图表</Menu.Item>
      <Menu.Item key="info">基金详细</Menu.Item>
    </SubMenu>

  </Menu>

  let content = <div></div>;
  if (curr === 'basic') {
    content = <Basic {...p}></Basic>
  }
  if (curr === 'info') {
    content = <Info {...p} />;
  }
  return <Spin spinning={p.loading}>
    <div style={{ display: 'flex' }}>
      <section style={{ flexBasis: 200, marginRight: 20 }}>
        {menu}
      </section>
      <section style={{ flexGrow: 1 }}>
        {content}
      </section>
    </div>
  </Spin>
}

export default connect(mapStateToProps, actions)(Index);
