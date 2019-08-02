import { Card } from 'antd';
import React from 'react';
import { MiniArea } from './Charts';

const HourLineBar = ({ loading, HoursData }) => (
  <Card
    loading={loading}
    bordered={false}
    title="24小时实时数据"
    style={{
      height: '100%',
    }}
  >
    <h3>用户数</h3>
    <MiniArea line color="#cceafe" height={45} data={HoursData ? HoursData.data1 : null } />
    <h3>消息数</h3>
    <MiniArea line color="#cceafe" height={45} data={HoursData ? HoursData.data2 : null } />
    <h3>点赞数</h3>
    <MiniArea line color="#cceafe" height={45} data={HoursData ? HoursData.data3 : null } />
  </Card>
);

export default HourLineBar;
