import React from 'react';
import { connect } from 'dva';
import { actions } from '@/models/stock';
import { PropsRoute } from 'umi';
import { AppState } from '@/models/type';
import { Tabs, WhiteSpace } from 'antd-mobile';
import ErrorEle from '@/layouts/error';
import {Spin} from '@/layouts';
import Profit from './profit';

function mapStateToProps(s: AppState) {
  const { stock, loading } = s;
  return { ...stock, loading: loading.models.stock };
}

export type Props = PropsRoute & ReturnType<typeof mapStateToProps> & typeof actions;

const Index: React.FC<Props> = p => {
  const code = p.location.pathname.split('/').pop();
  React.useEffect(() => {
    if (!code) {
        return;
    }
    p.getProfit(code)
    p.getKdata(code,  Date.now() - 1000*3600*24*90, Date.now());
}, [code])


  if (!code) {
    return <ErrorEle />
  }

  const tabs = [
    { title: 'profit', key: 'profit' },
    { title: 'info', key: 'info' },
  ];


  return <div>
    <h2>{code}</h2>
    <WhiteSpace size="lg" />
    <Tabs tabs={tabs} initialPage={0} animated={false} useOnPan={false} tabBarBackgroundColor="transparent" >
        <Profit {...p} code={code} key="profit"/>
        <div {...p} key="info" />
    </Tabs>
    <Spin loading={p.loading}></Spin>
  </div>
};

export default connect(mapStateToProps, actions)(Index);
