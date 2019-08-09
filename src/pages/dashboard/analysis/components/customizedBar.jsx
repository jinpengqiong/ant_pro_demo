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

const CumstomizedBar = ({ loading, customData }) => (
  <Card
    loading={loading}
    bordered={false}
    title="自定义区间（一个月内）"
    style={{
      height: '80%',
    }}
  >
    <div>
        <Chart height={400} data={customData} scale={cols} forceFit>
          <Legend />
          <Axis name="x"/>
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

export default CumstomizedBar;
