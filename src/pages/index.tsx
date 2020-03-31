import React from 'react';
import { Card } from 'antd-mobile';
import Link from 'umi/link';
export default function () {
  return <>
    <Card >
      <Card.Header
        title="ETFs"
        thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
        extra={<span>inspect ETFs</span>}
      />
      <Card.Body>
        <Link to="/etf">ETF's details</Link>
      </Card.Body>
      <Card.Footer content="footer content" extra={<div>view detail</div>} />
    </Card>

  </>
}
