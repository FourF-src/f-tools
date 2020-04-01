import React from 'react';
import { Card } from 'antd-mobile';
import Link from 'umi/link';
export default function () {
  return <>
    <Card >
      <Card.Header
        title="ETFs"
        thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
        extra={<span>invest ETFs</span>}
      />
      <Card.Body>
        <Link to="/etf">ETF's chart and info </Link>
      </Card.Body>
      <Card.Footer extra={<Link to="/etf">view detail</Link>} />
    </Card>

  </>
}
