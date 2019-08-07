import { Col, Row, Select } from 'antd';
import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';


const { Option } = Select;
const DayLineBar = React.lazy(() => import('./components/DayLineBar'));
const HourLineBar = React.lazy(() => import('./components/HourLineBar'));
const RagionList = React.lazy(() => import('./components/RagionList'));
const CurrentDateData = React.lazy(() => import('./components/CurrentDateData'));

@connect(({ dashboardAnalysis, loading }) => ({
  dashboardAnalysis,
  loading: loading.effects['dashboardAnalysis/fetch'],
}))
class Analysis extends Component {
  state = {
    roomId: '',
    totalCount: null,
    HoursData: null,
    DayData: null,
    GenderData: null,
    RegionData: null,
    roomIds: null,
    orgId:''
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
      console.log('state123', this.state.roomIds)
    }
    if (this.state.roomIds) {
      this.state.roomIds.map(
        item => {
          roomId.push(item.room_id)
        }
      )
      console.log('roomId', roomId.join(','))
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
    }).catch(err => console.log(err))
  }

  gatDayData = roomId => {
    const tsStart = parseInt((new Date(new Date(new Date().getTime() - 7*24*60*60*1000).toLocaleDateString()).getTime())/1000);
    const tsEnd = parseInt((new Date(new Date().toLocaleDateString()).getTime())/1000)
    const url = `http://ai.muzhiyun.cn/api/v1/room/listDay?room_id=${roomId}&tsStart=${tsStart}&tsEnd=${tsEnd}`
    fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(responseJson => {
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
      // console.log('responseJson', { data1: arr1, data2: arr2, data3: arr3 } )
      this.setState({ DayData: { data1: arr1, data2: arr2, data3: arr3 } })
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
      this.setState({ GenderData: responseJson })
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
  }


  render() {
    const { loading } = this.props;
    const { totalCount, GenderData, HoursData, DayData, RegionData } = this.state;
    return (
      <GridContent>
        <React.Fragment>
          选择直播间：{' '}
          <Select
            placeholder="选择直播间"
            style={{ width: 200 }}
            onChange={this.handleSelectChange}>
            {
              this.state.roomIds
              &&
              this.state.roomIds.map(
                (v, i) => (<Option value={v.room_id} key={v.room_id}>{v.channel_name}</Option>)
              )
            }
          </Select>
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
              <Suspense fallback={null}>
                <HourLineBar loading={loading} HoursData={HoursData}/>
              </Suspense>
            </Col>
          </Row>
          <Row
            gutter={24}
            type="flex"
            >
            <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{ marginTop: 24 }}>
              <Suspense fallback={null}>
                <DayLineBar loading={loading} DayData={DayData} />
              </Suspense>
            </Col>
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
