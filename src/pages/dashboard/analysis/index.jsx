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
const CurrentDateData = React.lazy(() => import('./components/CurrentDateData'));

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
    roomId: '',
    currentDateData: null,
    currentDateHoursData: null,
    GenderData: null,
    RegionData: null,
  };

  reqRef = 0;

  timeoutId = 0;


  componentDidMount() {
    let roomId
    if (window.plus) {
      const url = window.plus.webView.currentWebview().getUrl()
      roomId = this.getQueryString(url, 'roomId')
      this.gatCurrentDataData(332808)
      this.timeoutId = setInterval(
        () => {
          this.gatCurrentDataData(332808)
        }, 300000)
      this.setState({ roomId })
    } else if (window) {
      roomId = this.getQueryString(window.location.search, 'roomId')
      this.gatCurrentDataData(332808)
      // this.timeoutId = setInterval(
      //   () => {
      //     this.gatCurrentDataData(332808)
      //   }, 3000)
      this.setState({ roomId })
    }
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboardAnalysis/fetch',
      });
    });
  }

  getQueryString = (url, name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  gatCurrentDataData = roomId => {
    const url = `http://ai.muzhiyun.cn/api/v1/room/totalCount?room_id=${roomId}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log('responseJson', responseJson)
      this.setState({ currentDateData: responseJson.response })
    }).catch(err => console.log(err))
  }

  gatCurrentDayHoursData = roomId => {
    const tsStart = parseInt((new Date(new Date().toLocaleDateString()).getTime())/1000)
    const tsEnd = parseInt((new Date().getTime())/1000)
    const url = `http://ai.muzhiyun.cn/api/v1/room/listHour?room_id=${roomId}&tsStart=${tsStart}&tsEnd=${tsEnd}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log('responseJson', responseJson)
      this.setState({ currentDateHoursData: responseJson.response })
    }).catch(err => console.log(err))
  }

  gatCurrentDateData = roomId => {
    const tsStart = parseInt((new Date(new Date(new Date().getTime() - 7*24*60*60*1000).toLocaleDateString()).getTime())/1000);
    const tsEnd = parseInt((new Date(new Date().toLocaleDateString()).getTime())/1000)
    const url = `http://ai.muzhiyun.cn/api/v1/room/listHour?room_id=${roomId}&tsStart=${tsStart}&tsEnd=${tsEnd}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log('responseJson', responseJson)
      this.setState({ currentDateHoursData: responseJson.response })
    }).catch(err => console.log(err))
  }

  gatGenderData = roomId => {
    const url = `http://aitest.muzhiyun.cn/api/v1/room/genderData?room_id=${roomId}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log('responseJson', responseJson)
      this.setState({ GenderData: responseJson })
    }).catch(err => console.log(err))
  }

  gatRegionData = roomId => {
    const url = `http://ai.muzhiyun.cn/api/v1/roomRegion/regionSort?roomid=${roomId}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log('responseJson', responseJson)
      this.setState({ RegionData: responseJson })
    }).catch(err => console.log(err))
  }


  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
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
    const { currentDateData } = this.state;
    return (
      <GridContent>
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <CurrentDateData loading={loading} CurrentDateData={currentDateData}/>
          </Suspense>
          <Row
            gutter={24}
            type="flex"
            style={{ marginTop: 24 }}
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                222
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                333
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
                4444
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                555
              </Suspense>
            </Col>
            <Col xl={6} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                666
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
