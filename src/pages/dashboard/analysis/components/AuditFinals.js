import { Card } from 'antd';
import React from 'react';
import { Pie } from './Charts';
import Yuan from '../utils/Yuan';

const AuditFinals = ({ loading, myAudit }) => {
  let pieData = []
  myAudit && myAudit.auditfinals.map(
    (v, i) => {
      pieData.push(
        {
          x: v.name,
          y: parseFloat(v.count),
        }
      )
    }
  )
  return (
  <Card
    loading={loading}
    bordered={false}
    title="素材通过率"
    style={{
      marginTop: 32,
      height:'100%'
    }}
  >
    <Pie
        hasLegend
        subTitle="费用"
        total={ pieData.reduce((pre, now) => now.y + pre, 0) + '个' }
        data={pieData}
        valueFormat={value => value + '个' }
        height={200}
        lineWidth={4}
      />
  </Card>
)};

export default AuditFinals;