import { Card } from 'antd';
import React from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
const cols = {
  x: {
    range: [ 0, 1 ]
  }
}

const HourLineBar = ({ loading, HoursData }) => (
  <Card
    loading={loading}
    bordered={false}
    title="24小时实时数据"
    style={{
      height: '88%',
      padding:0
    }}
  >
    <div>
        <Chart height={400} data={HoursData} scale={cols} forceFit>
          <Legend />
          <Axis name="x" 
          label={{
              formatter: val => ''
            }}/>
          <Axis name="y"/>
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="line"
            position="x*y"
            size={2}
            color={"s"}
            shape={"smooth"}
          />
          <Geom
            type="point"
            position="x*y"
            size={4}
            shape={"circle"}
            color={"s"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>
      </div>
  </Card>
);

export default HourLineBar;
