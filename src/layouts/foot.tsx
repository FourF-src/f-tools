import React from 'react';
import * as style from './index.less';
export default function(){
    return <footer className={style.foot}>
        <h1>
            Qtrade
        </h1>
        <p>
            qtrade.xyz @ {(new Date()).getFullYear()}
        </p>
  </footer>
}