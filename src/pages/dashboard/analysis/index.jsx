import { Col, Row, Select, DatePicker, Radio } from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import styles from './style.less';
import { getTimeDistance } from './utils/utils';

const { RangePicker } = DatePicker;
const { Option } = Select;
const DayLineBar = React.lazy(() => import('./components/DayLineBar'));
const HourLineBar = React.lazy(() => import('./components/HourLineBar'));
const CustomizedBar = React.lazy(() => import('./components/customizedBar'));
const RagionList = React.lazy(() => import('./components/RagionList'));
const CurrentDateData = React.lazy(() => import('./components/CurrentDateData'));

@connect(({ dashboardAnalysis, loading }) => ({
  dashboardAnalysis,
  loading: loading.effects['dashboardAnalysis/fetch'],
}))
class Analysis extends Component {
  state = {
    salesType: 'all',
    rangePickerValue: '',
    timeType: '7days',
    roomId: '',
    allRoomId: '',
    totalCount: null,
    HoursData: null,
    DayData: null,
    customData: null,
    GenderData: null,
    RegionData: null,
    roomIds: null,
    orgId: '',
  };

  reqRef = 0;

  timeoutId1= 0;
  timeoutId2= 0;
  timeoutId3= 0;


  async componentDidMount() {
    let orgId
    let roomId = []
    if (window.plus) {
      const url = window.plus.webView.currentWebview().getUrl()
      orgId = this.getQueryString(url, 'orgId')
      this.setState({ orgId })
      await this.getRoomIds(orgId)
    } else if (window) {
      orgId = this.getQueryString(window.location.search, 'orgId')
      this.setState({ orgId })
      await this.getRoomIds(orgId)
      // console.log('state123', this.state.roomIds)
    }
    if (this.state.roomIds) {
      this.state.roomIds.map(
        item => {
          roomId.push((item.room_id + 1982) * 168)
        }
      )
      console.log('roomId', roomId.join(','))
      this.setState({ roomId: roomId.join(','), allRoomId: roomId.join(',')})
      this.setAllIntervals(roomId)
    }
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'dashboardAnalysis/fetch',
      });
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if(parseInt(nextState.roomId) !== parseInt(this.state.roomId)) {
      console.log('nextState', nextState)
      console.log('state', this.state)
      // this.setAllIntervals(nextState.roomId)
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAnalysis/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId1);
    clearTimeout(this.timeoutId2);
    clearTimeout(this.timeoutId3);
  }

  setAllIntervals = ID => {
    clearTimeout(this.timeoutId1);
    clearTimeout(this.timeoutId2);
    clearTimeout(this.timeoutId3);
    this.gatTotalCount(ID)
    this.gatGenderData(ID)
    this.gatHoursData(ID)
    this.gatDayData(ID)
    this.gatRegionData(ID)
    this.timeoutId1 = setInterval(
      () => {
        this.gatTotalCount(ID)
        this.gatGenderData(ID)
      }, 5000)
    this.timeoutId2 = setInterval(
      () => {
        this.gatHoursData(ID)
        this.gatRegionData(ID)
      }, 3600000)
    this.timeoutId3 = setInterval(
      () => {
        this.gatDayData(ID)
      }, 86400000)
  }

  getQueryString = (url, name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  gatTotalCount = roomId => {
    const url = `http://ai.muzhiyun.cn/api/v1/room/totalCount?room_id=${roomId}`
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(responseJson => {
      // console.log('responseJson', responseJson)
      this.setState({ totalCount: responseJson.response })
    }).catch(err => console.log(err))
  }

  gatHoursData = roomId => {
    const tsStart = parseInt((new Date(new Date().toLocaleDateString()).getTime())/1000)
    const tsEnd = parseInt((new Date().getTime())/1000)
    const url = `http://ai.muzhiyun.cn/api/v1/room/listHour?room_id=${roomId}&tsStart=${tsStart}&tsEnd=${tsEnd}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(responseJson => {
      if (!responseJson.error_code) {
        const arr1 = []
        const arr2 = []
        const arr3 = []
        responseJson.response.forEach(
          (item, i) => {
            arr1.push({ x: item.x, y: item.y1 })
            arr2.push({ x: item.x, y: item.y2 })
            arr3.push({ x: item.x, y: item.y3 })
          },
      )
      this.setState({ HoursData: { data1: arr1, data2: arr2, data3: arr3 } })
      }
    }).catch(err => console.log(err))
  }

  gatDayData = (
                roomId,
                tsStart = parseInt((new Date(new Date(new Date().getTime() - 7*24*60*60*1000).toLocaleDateString()).getTime())/1000),
                tsEnd = parseInt((new Date(new Date().toLocaleDateString()).getTime())/1000)
                ) => {
    const url = `http://ai.muzhiyun.cn/api/v1/room/listDay?room_id=${roomId}&tsStart=${tsStart}&tsEnd=${tsEnd}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(responseJson => {
      if (!responseJson.error_code) {
        const arr1 = []
        const arr2 = []
        const arr3 = []
        responseJson.response.forEach(
          (item, i) => {
            arr1.push({ x: item.x, y: item.y1 })
            arr2.push({ x: item.x, y: item.y2 })
            arr3.push({ x: item.x, y: item.y3 })
          },
        )
        if (this.state.timeType === 'customized') {
          console.log('aaaa', { data1: arr1, data2: arr2, data3: arr3 })
          this.setState({ customData: { data1: arr1, data2: arr2, data3: arr3 } })
        } else {
          this.setState({ DayData: { data1: arr1, data2: arr2, data3: arr3 } })
        }
      }
    }).catch(err => console.log(err))
  }

  gatGenderData = roomId => {
    const url = `http://ai.muzhiyun.cn/api/v1/room/genderData?room_id=${roomId}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(responseJson => {
      // console.log('responseJson', responseJson)
      this.setState({ GenderData: responseJson.response })
    }).catch(err => console.log(err))
  }

  gatRegionData = roomId => {
    const url = `http://ai.muzhiyun.cn/api/v1/roomRegion/regionSort?room_id=${roomId}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(responseJson => {
      // console.log('RegionData', responseJson)
      this.setState({ RegionData: responseJson })
    }).catch(err => console.log(err))
  }

  getRoomIds = orgId => {
    const url = `http://ai.muzhiyun.cn/api/v1/organization?org_id=${orgId}`
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(responseJson => {
      console.log('getRoomIds', responseJson)
      this.setState({ roomIds: responseJson.response })
    }).catch(err => console.log(err))
  }

  handleSelectChange = value => {
    console.log(`selected ${value}`);
    this.setState({ roomId: value })
    this.setAllIntervals(value)
  }

  handleSizeChange = e => {
    // console.log('e', e.target.value)
    this.setState({ timeType: e.target.value });
    switch (e.target.value) {
      case '1day':
          this.gatHoursData(this.state.roomId)
        break
      case '7days':
          this.gatDayData(this.state.roomId)
        break
      case 'customized':
          this.setState({ customData: null })
        break
      default:
        return '7days'
    }
  }

  handleRangePickerChange = rangePickerValue => {
    console.log('rangePickerValue', rangePickerValue)
    clearTimeout(this.timeoutId3);
    if (JSON.stringify(rangePickerValue) === '[]') {
      this.setState({ rangePickerValue: [] });
      return
    }
    const startTime = rangePickerValue[0].unix()
    const endTime = rangePickerValue[1].unix()
    console.log('startTime', startTime)
    console.log('endTime', endTime)
    this.gatDayData(this.state.roomId, startTime, endTime)
  };

  render() {
    const { loading } = this.props;
    const { totalCount, GenderData, HoursData, DayData, RegionData, customData, timeType, roomId, allRoomId } = this.state;
    return (
      <GridContent>
        <React.Fragment>
            <Suspense fallback={<PageLoading />}>
              选择直播间：{' '}
              <Select
                placeholder="选择直播间"
                style={{ width: 200 }}
                defaultValue={allRoomId}
                onChange={this.handleSelectChange}>
                  <Option value={allRoomId} key={allRoomId}>所有直播间</Option>
                  {
                    this.state.roomIds
                    &&
                    this.state.roomIds.map(
                      (v, i) => (<Option value={(v.room_id + 1982) * 168} key={(v.room_id + 1982) * 168}>{v.channel_name}</Option>)
                    )
                  }
              </Select>
            </Suspense>
          <Row
            gutter={24}
            type="flex"
          >
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginTop: 24 }}>
              <Suspense fallback={null}>
                <CurrentDateData loading={loading} totalCount={totalCount} genderData={GenderData}/>
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginTop: 24 }}>
              <div className={styles.salesExtra}>
                <Radio.Group value={timeType} onChange={this.handleSizeChange} style={{ marginBottom: 10 }}>
                  <Radio.Button value="1day">
                    一天
                  </Radio.Button>
                  <Radio.Button value="7days">
                    七天
                  </Radio.Button>
                  <Radio.Button value="customized">
                    自定义
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div>
                {
                  this.state.timeType === 'customized'
                  &&
                  <RangePicker
                  onChange={this.handleRangePickerChange}
                  dropdownClassName={styles.thePicker}
                  />
                }
              </div>
              <br/>
              {
                this.state.timeType === '1day'
                &&
                  <Suspense fallback={null}>
                    <HourLineBar loading={loading} HoursData={HoursData}/>
                  </Suspense>
              }
              {
                this.state.timeType === '7days'
                &&
                  <Suspense fallback={null}>
                    <DayLineBar loading={loading} DayData={DayData} />
                  </Suspense>
              }
              {
                this.state.timeType === 'customized'
                &&
                  <Suspense fallback={null}>
                    <CustomizedBar loading={loading} customData={customData} />
                  </Suspense>
              }
            </Col>
          </Row>
          <Row
            gutter={24}
            type="flex"
            >
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginTop: 24 }}>
              <Suspense fallback={null}>
                <RagionList loading={loading} RegionData={RegionData}/>
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
