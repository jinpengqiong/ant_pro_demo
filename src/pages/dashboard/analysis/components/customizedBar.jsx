import { Card } from 'antd';
import React from 'react';
import { MiniArea } from './Charts';

const CumstomizedBar = ({ loading, customData }) => (
  <Card
    loading={loading}
    bordered={false}
    title="自定义时间间隔"
    style={{
      height: '80%',
    }}
  >
    <h3>用户数</h3>
    <MiniArea line color="#cceafe" height={45} data={customData && !customData.error_code ? customData.data1 : null } />
    <h3>消息数</h3>
    <MiniArea line color="#cceafe" height={45} data={customData && !customData.error_code ? customData.data2 : null } />
    <h3>点赞数</h3>
    <MiniArea line color="#cceafe" height={45} data={customData && !customData.error_code ? customData.data3 : null } />
  </Card>
);

export default CumstomizedBar;
