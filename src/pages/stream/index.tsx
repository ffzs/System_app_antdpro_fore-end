import React, {Component, useRef, useState} from 'react';
import './App.css';
import {FlowableProcessor} from "rsocket-flowable";
import {Button, Col, Input, message, Row} from "antd";
import {Client} from './rsocketClient';
import {Weather} from './Weather';
import {PageContainer} from "@ant-design/pro-layout";
import {ActionType} from "@ant-design/pro-table";

const {TextArea} = Input;


const Stream: React.FC<{}> = () => {

  const [connect, setConnect] = useState(false);
  const [weatherData, setWeatherData] = useState<string[]>([]);
  const [inStream, setInStream] = useState(false);
  const actionRef = useRef<ActionType>();
  const [requestStreamSubscription, setRequestStreamSubscription] = useState();
  const [address, setAddress] = useState<string>('ws://localhost:8081');

  // const handleConnect = ()=>{
  //   if (!connect) {
  //     setClient(new Client(address));
  //     client?.connect().then(() => {
  //       setConnect(true);
  //       message.success(`成功连接到 ${address}`);
  //     })
  //   }
  //   else {
  //     client?.disconnect();
  //     setConnect(false);
  //     message.warning(`与 ${address} 断开连接`);
  //   }
  // };

  const handleRequestStream = async () => {
    if (inStream) {
      // @ts-ignore
      requestStreamSubscription.cancel();
      setInStream(false);
      message.info(`请求已经停止`);
    } else {
      const client = new Client(address);
      await client.connect().then(() => {
        setConnect(true);
        message.success(`成功连接到 ${address}`);
      });
      const requestCount = 10;
      let processedCount = 0;
      const msg = `请求 ${requestCount} 条信息`;
      message.warning(msg);
      window.alert(JSON.stringify(client));

      client.requestStream(msg, 'weather').subscribe({
        // @ts-ignore
        onSubscribe: sub => {
          setRequestStreamSubscription(sub);
          // @ts-ignore
          sub.request(requestCount);
          setInStream(true);
        },
        onError: error => {
          message.error(`请求出错: ${JSON.stringify(error)}`);
        },
        onNext: msg => {
          if (weatherData.length > 100) weatherData.pop();
          console.log(JSON.stringify(weatherData));
          setWeatherData([...weatherData, JSON.stringify(msg.data)]);
          processedCount += 1;
          actionRef.current.fetchMore();

          if (processedCount >= requestCount) {
            // this.appendLog(`REQUEST STREAM: request ${requestedMsg} Weathers`);
            // @ts-ignore
            sub.request(requestCount);
            processedCount = 0;
          }

        },
        onComplete: () => {
          message.success(`完成请求`);
        },
      });
    }
  };

  return (
    <PageContainer title={false}>
      <Row justify="center">
        <Col span={8}>
          <Input
            id="text-field-address"
            value={address}
            onChange={(e)=>setAddress(e.target.value)}
            placeholder="ws://localhost:8081"
            autoFocus
          />
        </Col>
        {/*<Col span={1}>*/}
        {/*  <Button*/}
        {/*    color="primary"*/}
        {/*    className="connect-btn"*/}
        {/*    onClick={()=>handleConnect()}*/}
        {/*  >*/}
        {/*    {connect ? '断开' : '连接'}*/}
        {/*  </Button>*/}
        {/*</Col>*/}
        <Col span={3}>
          <Button
            color="primary"
            className="connect-btn"
            onClick={()=>handleRequestStream()}
          >
            {inStream ? '断开流数据' : '连接流数据'}
          </Button>
        </Col>
      </Row>
      <Row>
        <TextArea
          ref={actionRef}
          disabled
          id="text-field-sent"
          rows={15}
          value={weatherData}
        />
      </Row>
    </PageContainer>
  )
};


export default Stream;
