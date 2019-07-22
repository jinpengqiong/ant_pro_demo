import { Col, Dropdown, Icon, Menu, Row, Tabs, DatePicker, Radio } from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import { getTimeDistance } from './utils/utils';
import styles from './style.less';

const { RangePicker } = DatePicker;

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SalesCard = React.lazy(() => import('./components/SalesCard'));
const TopSearch = React.lazy(() => import('./components/TopSearch'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));
const OfflineData = React.lazy(() => import('./components/OfflineData'));

@connect(({ dashboardAnalysis, loading }) => ({
  dashboardAnalysis,
  loading: loading.effects['dashboardAnalysis/fetch'],
}))
class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('month'),
    totalData: null,
    timeType: 'month',
  };

  reqRef = 0;

  timeoutId = 0;

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboardAnalysis/fetch',
      });
    });
    this.getTotalData(2)
  }


  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  getTotalData = (timeType, startTime = '', endTime = '') => {
    const url = `http://studioapi.muzhiyun.cn/api/statistiDataGraphics/all/getStatistical?timeType=${timeType}&sourceType=1&id=8EF2F2CE-6481-4C39-BE69-56F3DF7AED86&startTime=${startTime}&endTime=${endTime}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('responseJson',responseJson)
      this.setState({ totalData: responseJson.data })
    }).catch(err => console.log(err))
  }


  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
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
    const { dispatch } = this.props;
    this.setState({ rangePickerValue, timeType: 3 });
    this.getTotalData(3, startTime, endTime)
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
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(e.target.value),
    });
    switch (e.target.value) {
      case 'month':
          this.getTotalData(2)
        break
      case 'week':
          this.getTotalData(1)
        break
      default:
        return 1
    }
  }

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { dashboardAnalysis, loading } = this.props;
    const { timeType, totalData } = this.state;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = dashboardAnalysis;
    let salesPieData;

    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }

    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );
    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );
    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);
    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <div>
              <div className={styles.salesExtra}>
                <Radio.Group value={timeType} onChange={this.handleSizeChange} style={{ marginBottom: 10 }}>
                  <Radio.Button value="week">
                    <FormattedMessage
                      id="dashboard-analysis.analysis.all-week"
                      defaultMessage="All Week"
                    />
                  </Radio.Button>
                  <Radio.Button value="month">
                    <FormattedMessage
                      id="dashboard-analysis.analysis.all-month"
                      defaultMessage="All Month"
                    />
                  </Radio.Button>
                </Radio.Group>
              </div>
            <RangePicker
              value={rangePickerValue}
              onChange={this.handleRangePickerChange}
              style={{ width: 256 }}
            />
          </div>
          <br/>
          </Suspense>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow loading={loading} visitData={totalData} />
          </Suspense>
          <Suspense fallback={null}>
            <SalesCard
              rangePickerValue={rangePickerValue}
              salesData={salesData}
              isActive={this.isActive}
              handleRangePickerChange={this.handleRangePickerChange}
              loading={loading}
              selectDate={this.selectDate}
            />
          </Suspense>
          <Row
            gutter={24}
            type="flex"
            style={{
              marginTop: 24,
            }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <TopSearch
                  loading={loading}
                  visitData2={visitData2}
                  searchData={searchData}
                  dropdownGroup={dropdownGroup}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={salesPieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
          </Row>
          <Suspense fallback={null}>
            <OfflineData
              activeKey={activeKey}
              loading={loading}
              offlineData={offlineData}
              offlineChartData={offlineChartData}
              handleTabChange={this.handleTabChange}
            />
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
