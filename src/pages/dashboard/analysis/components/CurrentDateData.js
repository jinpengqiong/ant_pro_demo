import { Card, Row, Col } from 'antd';
import React from 'react';
import { Pie } from './Charts';
import styles from './_currentDateData.less';

const CurrentDateData = ({ loading, totalCount, genderData }) => (
  <Card
    loading={loading}
    // className={styles.salesCard}
    bordered={false}
    title="当日数据"
    style={{
      height: '100%',
    }}
  >
      <div>
          <div className={styles.box2}>
                <div>
                  <p className={styles.myTitle}>在线数</p>
                  <p className={styles.myContent}>
                    { totalCount ? totalCount.online_count: 0}
                  </p>
                </div>
          </div>
          <div className={styles.box1}>
            <div>
              <p className={styles.myTitle}>总人数</p>
              <p className={styles.myContent}>
                { totalCount ? totalCount.user_count : 0}
              </p>
            </div>
            <div>
              <p className={styles.myTitle}>消息数</p>
              <p className={styles.myContent}>
                { totalCount ? totalCount.msg_count : 0}
              </p>
            </div>
            <div>
                <p className={styles.myTitle}>点赞数</p>
                <p className={styles.myContent}>
                  { totalCount ? totalCount.like_count : 0}
                </p>
            </div>
          </div>
          <br/>
          <br/>
          <div className={styles.myBox}>
              <div>
                <Pie
                color="#975FE4"
                percent={ genderData ? (genderData[0].value*100).toFixed(2) : 0 }
                subTitle="男"
                total={ genderData ? (genderData[0].value*100).toFixed(2)+'%' : 0 }
                height={180} />
              </div>
              <div>
                <Pie
                color="orange"
                percent={ genderData ? (genderData[1].value*100).toFixed(2) : 0 }
                subTitle="女"
                total={ genderData ? (genderData[1].value*100).toFixed(2)+'%' : 0 }
                height={180} />
              </div>
          </div>
      </div>
  </Card>
);

export default CurrentDateData;
