import React from 'react';
import {Icon} from 'antd-mobile';
export default function(){
    return <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%', flexDirection:'column'}}>
        <Icon type="cross-circle-o" color="#c00" size="lg"></Icon>
        <span>Error</span>
    </div>
}