import { Col, Row, DatePicker, Radio } from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';
import styles from './style.less';

const { RangePicker } = DatePicker;

const StorageCdnTransCode = React.lazy(() => import('./components/StorageCdnTransCode'));
const TheFiles = React.lazy(() => import('./components/TheFiles'));
const CostRank = React.lazy(() => import('./components/CostRank'));
const CostRatio = React.lazy(() => import('./components/CostRatio'));
const Surplus = React.lazy(() => import('./components/Surplus'));
const AuditFinals = React.lazy(() => import('./components/AuditFinals'));

@connect(({ dashboardAnalysis, loading }) => ({
  dashboardAnalysis,
  loading: loading.effects['dashboardAnalysis/fetch'],
}))
class Analysis extends Component {
  state = {
    salesType: 'all',
    rangePickerValue: getTimeDistance('month'),
    totalData: null,
    timeType: 'month',
    organizationId:''
  };

  reqRef = 0;

  timeoutId = 0;


  componentDidMount() {
    // console.log('location', this.getQueryString('organizationId'))
    let organizationId
    if (window.plus) {
      const url = window.plus.webView.currentWebview().getUrl()
      organizationId = this.getQueryString(url, 'organizationId')
      this.getTotalData(2, '', '', organizationId)
      this.setState({ organizationId })
    } else if (window) {
      organizationId = this.getQueryString(window.location.search, 'organizationId')
      this.getTotalData(2, '', '', organizationId)
      this.setState({ organizationId })
    }
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboardAnalysis/fetch',
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  getQueryString = (url, name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }


  getTotalData = (timeType, startTime = '', endTime = '', orgId = '8EF2F2CE-6481-4C39-BE69-56F3DF7AED86') => {
    const url = `http://studioapi.muzhiyun.cn/api/statistiDataGraphics/all/getStatistical?timeType=${timeType}&sourceType=1&id=${orgId}&startTime=${startTime}&endTime=${endTime}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log('responseJson',responseJson)
      this.setState({ totalData: responseJson.data })
    }).catch(err => console.log(err))
  }


  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    console.log('rangePickerValue', rangePickerValue)
    if (JSON.stringify(rangePickerValue) === '[]') {
      this.setState({ rangePickerValue: [] });
      return
    }
    const startTime = rangePickerValue[0].format('YYYY/MM/DD')
    const endTime = rangePickerValue[1].format('YYYY/MM/DD')
    this.setState({ rangePickerValue, timeType: 3 });
    this.getTotalData(3, startTime, endTime, this.state.organizationId)
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }

    return '';
  };

  handleSizeChange = e => {
    // console.log('e', e.target.value)
    this.setState({ timeType: e.target.value });
    this.setState({
      rangePickerValue: getTimeDistance(e.target.value),
    });
    switch (e.target.value) {
      case 'month':
          this.getTotalData(2, '', '', this.state.organizationId)
        break
      case 'week':
          this.getTotalData(1, '', '', this.state.organizationId)
        break
      default:
        return 1
    }
  }

  render() {
    const { rangePickerValue, salesType } = this.state;
    const { loading } = this.props;
    const { timeType, totalData } = this.state;
    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <div>
              <div className={styles.salesExtra}>
                <Radio.Group value={timeType} onChange={this.handleSizeChange} style={{ marginBottom: 10 }}>
                  <Radio.Button value="week">
                    本周
                  </Radio.Button>
                  <Radio.Button value="month">
                    本月
                  </Radio.Button>
                </Radio.Group>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={this.handleRangePickerChange}
                dropdownClassName={styles.thePicker}
                />
          </div>
          <br/>
          </Suspense>
          <Suspense fallback={<PageLoading />}>
            <StorageCdnTransCode loading={loading} visitData={totalData} />
          </Suspense>
          <Row
            gutter={24}
            type="flex"
            style={{ marginTop: 24 }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <CostRatio
                  salesType={salesType}
                  loading={loading}
                  salesPieData={totalData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <CostRank
                  loading={loading}
                  visitData2={totalData}
                />
              </Suspense>
            </Col>
          </Row>
          <Row
            gutter={24}
            type="flex"
            style={{
              marginTop: 24,
            }}
          >
            <Col xl={6} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <Surplus surplusData={totalData} loading={loading}/>
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <TheFiles myFiles={totalData} loading={loading}/>
              </Suspense>
            </Col>
            <Col xl={6} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <AuditFinals myAudit={totalData} loading={loading} />
              </Suspense>
            </Col>
          </Row>
          <br/>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
