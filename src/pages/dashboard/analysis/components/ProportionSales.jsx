import { Card, Radio } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { Pie } from './Charts';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title='费用占比'
    style={{
      height: '100%',
    }}
  >
    <div>
      <Pie
        hasLegend
        subTitle='费用'
        total={() => <Yuan>{salesPieData && salesPieData.costRatio.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
        data={salesPieData && salesPieData.costRatio}
        valueFormat={value => <Yuan>{value}</Yuan>}
        height={248}
        lineWidth={4}
      />
    </div>
  </Card>
);

export default ProportionSales;
