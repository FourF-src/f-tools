import React from 'react';
import { connect } from 'dva';
import { actions } from '@/models/etf';
import { PropsRoute } from 'umi';
import { AppState } from '@/models/type';
import { Tabs, WhiteSpace } from 'antd-mobile';
import Chart from './chart';
import Info from './info';
import ErrorEle from '@/layouts/error';
import {Spin} from '@/layouts';

function mapStateToProps(s: AppState) {
  const { etf, loading } = s;
  return { ...etf, loading: loading.models.etf };
}

export type Props = PropsRoute & ReturnType<typeof mapStateToProps> & typeof actions;

const Index: React.FC<Props> = p => {
  const code = p.location.pathname.split('/').pop();
  React.useEffect(() => {
    if (!code) {
        return;
    }
    p.getBasic(code, '3yrs');
    p.getInfo(code);
}, [code])


  if (!code) {
    return <ErrorEle />
  }

  const tabs = [
    { title: 'chart', key: 'chart' },
    { title: 'info', key: 'info' },
  ];


  return <div>
    <h2>{code}</h2>
    <WhiteSpace size="lg" />
    <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} tabBarBackgroundColor="transparent" >
        <Chart {...p} code={code} key="chart"/>
        <Info {...p} key="info" />
    </Tabs>
    <Spin loading={p.loading}></Spin>
  </div>
};

export default connect(mapStateToProps, actions)(Index);
