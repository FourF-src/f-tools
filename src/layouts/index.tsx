import React from 'react';
import {NavLink} from 'umi';
import PlaceHolder from './placeholder';
import { Card, WhiteSpace, WingBlank } from 'antd-mobile';


const Index:React.FC = p => (
  <WingBlank size="lg">
    <div className="title">F-tools</div>
    <WhiteSpace size="lg" />
    {p.children}
    <WhiteSpace size="lg" />
  </WingBlank>
);

export default Index

