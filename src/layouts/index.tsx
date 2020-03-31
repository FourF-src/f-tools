import React from 'react';
import {NavLink} from 'umi';
import PlaceHolder from './placeholder';
import { Icon, WhiteSpace, WingBlank } from 'antd-mobile';

const Spin:React.FC<{loading:boolean}> = p => p.loading?
<>
{p.children}
<div style={{position:'fixed', top:0, left:0, right:0, bottom:0, opacity:0.3, background:'#000'}}>
  <Icon type="loading" style={{left:'50%', width:50, marginLeft:-25, top: '45%'}}></Icon>
</div>
</>:
<>{p.children}</>;

const Index:React.FC = p => (
  <WingBlank size="lg">
    <h1><NavLink to="/">Qtrade</NavLink></h1>
    <WhiteSpace size="lg" />
    {p.children}
  </WingBlank>
);

export default Index

