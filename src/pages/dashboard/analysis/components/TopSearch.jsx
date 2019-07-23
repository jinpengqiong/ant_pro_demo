import { Card, Col, Icon, Row, Table, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import numeral from 'numeral';
import { MiniArea, MiniProgress } from './Charts';
import NumberInfo from './NumberInfo';
import Trend from './Trend';
import styles from '../style.less';

const columns = [
  {
    title: <FormattedMessage id="dashboard-analysis.table.rank" defaultMessage="Rank" />,
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: (
      <FormattedMessage
        id="dashboard-analysis.table.search-keyword"
        defaultMessage="Search keyword"
      />
    ),
    dataIndex: 'keyword',
    key: 'keyword',
    render: text => <a href="/">{text}</a>,
  },
  {
    title: <FormattedMessage id="dashboard-analysis.table.users" defaultMessage="Users" />,
    dataIndex: 'count',
    key: 'count',
    sorter: (a, b) => a.count - b.count,
    className: styles.alignRight,
  },
  {
    title: (
      <FormattedMessage id="dashboard-analysis.table.weekly-range" defaultMessage="Weekly Range" />
    ),
    dataIndex: 'range',
    key: 'range',
    sorter: (a, b) => a.range - b.range,
    render: (text, record) => (
      <Trend flag={record.status === 1 ? 'down' : 'up'}>
        <span
          style={{
            marginRight: 4,
          }}
        >
          {text}%
        </span>
      </Trend>
    ),
  },
];

const TopSearch = ({ loading, visitData2 }) => (
  <Card
    loading={loading}
    bordered={false}
    title='频道费用排行'
    style={{
      height: '100%',
    }}
  >
    {
      visitData2
      &&
      visitData2.costRank.map(
        (item, index) => {
          return (
            <Row gutter={24} type="flex">
              <Col
                sm={8}
                xs={8}
                style={{
                  marginBottom: 24,
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#975FE4' }}>{index+1}</span>
                <span style={{ marginLeft: '5px' }}>{item.name}</span>
              </Col>
              <Col
                sm={8}
                xs={8}
                style={{
                  marginBottom: 24,
                }}
              >
                <MiniProgress percent={item.percent} strokeWidth={8} color='#975FE4' />
              </Col>
              <Col
                sm={4}
                xs={4}
                style={{
                  marginBottom: 24,
                }}
              >
                { item.percent + '%'}
              </Col>
              <Col
                sm={2}
                xs={2}
                style={{
                  marginBottom: 24,
                }}
              >
                {'¥'+item.count}
              </Col>
          </Row>
          )
        }
      )
    }

  </Card>
);

export default TopSearch;
