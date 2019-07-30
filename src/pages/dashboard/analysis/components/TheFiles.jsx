import { Card } from 'antd';
import React from 'react';
import { WaterWave } from './Charts';


const TheFiles = ({ loading, myFiles }) => (
  <Card
    loading={loading}
    bordered={false}
    title="素材占比率"
    style={{
      marginTop: 32,
      height:'100%',
      marginBottom: 30
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
      {
        myFiles && myFiles.files.map(
          (item, index) => (
            <div style={{ textAlign: 'center', marginLeft: '10px' }} key={index}>
              <p>{item.name}</p>
              <WaterWave
                height={161}
                color="#975FE4"
                title={item.count + '个'}
                percent={item.percent === 'NaN'? 0 : parseFloat(item.percent)} />
            </div>
          )
        )
      }
    </div>
  </Card>
);

export default TheFiles;
