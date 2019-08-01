import { Card } from 'antd';
import React from 'react';
import { Pie } from './Charts';


const CurrentDateData = ({ loading, currentDateData }) => (
  <Card
    loading={loading}
    // className={styles.salesCard}
    bordered={false}
    title="费用占比"
    style={{
      height: '100%',
    }}
  >
      {JSON.stringify(currentDateData)}
  </Card>
);

export default CurrentDateData;
