import React from 'react';
import { Grid, WhiteSpace } from 'antd-mobile';
import { Props } from './$code';
import {Icon} from 'antd';
const Info: React.FC<Props> = p => {
    if (!p.info) {
        return < div />;
    }
    const data = [
        {
            icon: <Icon type="pie-chart"/>,
            text: <div>
                <p>Capital</p>
                <strong style={{color:'#108ee9'}}>{p.info.capital||0}</strong>
            </div>
        },
        {
            icon: <Icon type="user" />,
            text: <div>
                <p>Management Fee</p>
                <strong style={{color:'#108ee9'}}>{p.info.managementFee||0}</strong>
            </div>
        },
        {
            icon: <Icon type="trophy" />,
            text: <div>
                <p>Custodian Fee</p>
                <strong style={{color:'#108ee9'}}>{p.info.custodianFee||0}</strong>
            </div>
        },
        {
            icon: <Icon type="shop" />,
            text: <div>
                <p>Marketing Fee</p>
                <strong style={{color:'#108ee9'}}>{p.info.marketingfee||0}</strong>
            </div>
        },
    ];

    const renderItem=(dataItem:any) => {
        return (
            <div style={{ padding: '25px 12.5px', }} >
                <span style={{fontSize: '2em'}}>
                {dataItem.icon}

                </span>
              <div style={{ fontSize: '1em', marginTop: '12px', color:'#092048' }}>
                <span>{dataItem.text}</span>
              </div>
            </div>
        );
    }


    return <div>
        <p>
            info info info
        </p>
        <WhiteSpace size="lg" />
        <Grid data={data} columnNum={2} renderItem={renderItem}>
        </Grid>
    </div>;
};

export default Info;