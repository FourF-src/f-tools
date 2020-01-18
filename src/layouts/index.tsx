import React from 'react';
import {NavLink} from 'umi';
import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;

const Index:React.FC = p=>{
  const path = location.pathname.split('/').map(el=><Breadcrumb.Item key={el}>{el}</Breadcrumb.Item>)
  const curr = location.pathname.split('/')[1];
  return (
  <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[curr]}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="/"><NavLink to="/">HOME</NavLink></Menu.Item>
        <Menu.Item key="etf"><NavLink to="/etf">ETFs</NavLink></Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        {path}
      </Breadcrumb>
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
        {p.children}
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
)}

export default Index