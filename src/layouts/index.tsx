import React from 'react';
import { NavLink } from 'umi';
import PlaceHolder from './placeholder';
import router from 'umi/router';
import { Icon, WhiteSpace, WingBlank, NavBar } from 'antd-mobile';
import Foot from './foot';

export const Spin: React.FC<{ loading: boolean }> = p => p.loading ?
  <>
    {p.children}
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3, background: '#000' }}>
    </div>
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Icon type="loading" size="lg" color="blue"></Icon>
    </div>
  </> :
  <>{p.children}</>;

const Index: React.FC = p => {
  const isHome = location.pathname === '/' ? true:false;
  return (
  <>
    <NavBar
      mode="light"
      icon={isHome?"":<Icon type="left" />}
      onLeftClick={()=>router.goBack()}
    ><NavLink to="/">Qtrade</NavLink></NavBar>

    <WingBlank size="lg" style={{minHeight: 500}}>
      <WhiteSpace size="lg" />
      {p.children}
    </WingBlank>
    {isHome?<Foot />:''}
  </>
)};

export default Index

