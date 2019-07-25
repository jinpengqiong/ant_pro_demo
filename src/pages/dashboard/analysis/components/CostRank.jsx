import { Card, Col, Icon, Row, Table, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import numeral from 'numeral';
import { MiniArea, MiniProgress } from './Charts';
import NumberInfo from './NumberInfo';
import Trend from './Trend';
import styles from '../style.less';


const CostRank = ({ loading, visitData2 }) => (
  <Card
    loading={loading}
    bordered={false}
    title="频道费用排行"
    style={{
      height: '100%',
    }}
  >
    {
      visitData2
      &&
      visitData2.costRank.map(
        (item, index) => (
            <Row gutter={24} type="flex" key={index}>
              <Col
                key={0}
                sm={8}
                xs={8}
                style={{
                  marginBottom: 24,
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#975FE4' }}>{index + 1}</span>
                <span style={{ marginLeft: '5px' }}>{item.name}</span>
              </Col>
              <Col
                key={1}
                sm={7}
                xs={7}
                style={{
                  marginBottom: 24,
                }}
              >
                <MiniProgress percent={item.percent} strokeWidth={8} color="#975FE4" />
              </Col>
              <Col
                key={2}
                sm={4}
                xs={4}
                style={{
                  marginBottom: 24,
                }}
              >
                { item.percent + '%'}
              </Col>
              <Col
                key={3}
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
      )
    }

  </Card>
);

export default CostRank;
