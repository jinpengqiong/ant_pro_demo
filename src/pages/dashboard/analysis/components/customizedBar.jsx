import { Card } from 'antd';
import React from 'react';
import { MiniArea } from './Charts';

const CumstomizedBar = ({ loading, DayData }) => (
  <Card
    loading={loading}
    bordered={false}
    title="自定义时间间隔"
    style={{
      height: '80%',
    }}
  >
    <h3>用户数</h3>
    <MiniArea line color="#cceafe" height={45} data={DayData && !DayData.error_code ? DayData.data1 : null } />
    <h3>消息数</h3>
    <MiniArea line color="#cceafe" height={45} data={DayData && !DayData.error_code ? DayData.data2 : null } />
    <h3>点赞数</h3>
    <MiniArea line color="#cceafe" height={45} data={DayData && !DayData.error_code ? DayData.data3 : null } />
  </Card>
);

export default CumstomizedBar;
