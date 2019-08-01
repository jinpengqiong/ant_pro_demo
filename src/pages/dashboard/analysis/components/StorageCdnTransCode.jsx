import { Col, Icon, Row, Tooltip } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from './Charts';
import Trend from './Trend';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const StorageCdnTransCode = ({ loading, visitData }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={visitData ? visitData.storage.title : ''}
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboard-analysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <br/>
            { visitData && visitData.storage.suffix ?  '单位：' + visitData.storage.suffix : '' }
          </Tooltip>
        }
        loading={loading}
        total={visitData ? visitData.storage.total : ''}
        footer={
          <Field label={visitData && visitData.storage.subTitle} value={visitData && visitData.storage.subTotal} />
        }
        contentHeight={50}
      >
        <MiniBar height={46} color="#975FE4" data={visitData && visitData.storage.data} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={visitData ? visitData.cdn.title : ''}
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboard-analysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <br/>
            { visitData && visitData.cdn.suffix ?  '单位：' + visitData.cdn.suffix : '' }
          </Tooltip>
        }
        total={visitData ? visitData.cdn.total : ''}
        footer={
          <Field
            label={visitData && visitData.cdn.subTitle}
            value={visitData && visitData.cdn.subTotal}
          />
        }
        contentHeight={50}
      >
        <MiniArea color="#975FE4" data={visitData && visitData.cdn.data} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={visitData ? visitData.transCode.title : ''}
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboard-analysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <br/>
            { visitData && visitData.transCode.suffix ?  '单位：' + visitData.transCode.suffix : ''  }
          </Tooltip>
        }
        total={visitData ? visitData.transCode.total : ''}
        footer={
          <Field
            label={visitData && visitData.transCode.subTitle}
            value={visitData && visitData.transCode.subTotal}
          />
        }
        contentHeight={50}
      >
        <MiniBar color="#975FE4" data={visitData && visitData.transCode.data} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={visitData ? visitData.recognition.title : ''}
        action={
          <Tooltip
            title={
              <FormattedMessage
                id="dashboard-analysis.analysis.introduce"
                defaultMessage="Introduce"
              />
            }
          >
            <br/>
            { visitData && visitData.recognition.suffix ?  '单位：' + visitData.recognition.suffix : '' }
          </Tooltip>
        }
        total={visitData ? visitData.recognition.total : ''}
        footer={
          <Field
            label={visitData && visitData.recognition.subTitle}
            value={visitData && visitData.recognition.subTotal}
          />
        }
        contentHeight={50}
      >
        <MiniArea color="#975FE4" data={visitData && visitData.recognition.data} />
      </ChartCard>
    </Col>
  </Row>
);

export default StorageCdnTransCode;
