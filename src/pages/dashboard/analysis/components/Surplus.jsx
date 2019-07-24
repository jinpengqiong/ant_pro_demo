import { Card } from 'antd';
import React from 'react';
import { Pie } from './Charts';


const Surplus = ({ loading, surplusData }) => (
  <Card
    loading={loading}
    bordered={false}
    title="存储剩余"
    style={{
      marginTop: 32,
      height:'100%',
    }}
  >
    <Pie
      height={201}
      subTitle={surplusData && surplusData.surplus.title}
      total={surplusData && surplusData.surplus.percent + '%' }
      percent={surplusData && parseFloat(surplusData.surplus.percent)} />
  </Card>
);

export default Surplus;
