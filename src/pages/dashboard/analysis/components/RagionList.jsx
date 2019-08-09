import { Card, Table } from 'antd';
import React from 'react';

const columns = [
  {
    title: '省份',
    dataIndex: 'province',
    key: 'province',
  },
  {
    title: '城市',
    dataIndex: 'city',
    key: 'city',
  },
  {
    title: '用户',
    dataIndex: 'userCount',
    key: 'userCount',
  },
  {
    title: '消息',
    dataIndex: 'msgCount',
    key: 'msgCount',
  },
  {
    title: '点赞',
    dataIndex: 'likeCount',
    key: 'likeCount',
  }
];


const RagionList = ({ loading, RegionData }) => (
  <Card
    loading={loading}
    bordered={false}
    title="互动区域排行TOP10"
    style={{
      height: '100%',
    }}
  >
    <Table
      columns={columns}
      dataSource={RegionData && !RegionData.error_code ? RegionData : null}
      pagination={false}
      size="small"
      // rowKey={record => record.userCount}
      />
  </Card>
);

export default RagionList;
