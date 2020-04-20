import React from 'react';
import { Card } from 'antd-mobile';
import Link from 'umi/link';
import * as style from './index.less';
export default function () {
  return <>
    <Card className={style.card}>
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
    <Card className={style.card}>
      <Card.Header
        title="Stock"
        thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
        extra={<span>stock research</span>}
      />
      <Card.Body>
        <Link to="/stock">stock research </Link>
      </Card.Body>
      <Card.Footer extra={<Link to="/stock">view detail</Link>} />
    </Card>

  </>
}
