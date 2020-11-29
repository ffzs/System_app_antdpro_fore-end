import React, {Component} from 'react';
import {PageContainer} from "@ant-design/pro-layout";
import {getHost} from "@/utils/utils";
import Plot from 'react-plotly.js';
import {Button, Col, Row, message} from "antd";
import {Client} from './rsocketClient';

class Tmp extends Component {

  streamSub;

  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      inStream: false,
      address: `ws://${getHost()}:8081`,
      temperature: [],
      date: []
    };

    this.handleConnect = this.handleConnect.bind(this);
    this.handleRequestStream = this.handleRequestStream.bind(this);
  }

  handleConnect() {
    if (!this.state.connected) {
      this.client = new Client(this.state.address);
      this.client.connect().then(() => {
        this.setState({connected: true});
      });
      // message.success(`成功连接`)
    } else {
      this.client.disconnect();
      this.setState({connected: false});
    }
  }

  handleRequestStream() {
    if (!this.state.inStream) {
      const requestCount = 5;
      let processedCount = 0;
      const msg = `获取${requestCount}数据`;

      this.client.requestStream(msg, 'weather').subscribe({
        onSubscribe: sub => {
          this.streamSub = sub;
          this.streamSub.request(requestCount);
          this.setState({inStream: true});
        },
        onError: error => {
          message.error(`出现错误 ${error}`)
        },
        onNext: msg => {
          this.addData(msg.data);
          processedCount += 1;

          if (processedCount >= requestCount) {
            this.streamSub.request(requestCount);
            processedCount = 0;
          }

        },
        onComplete: () => {
        },
      });
    } else {
      this.streamSub.cancel();
      this.setState({inStream: false});
    }
  }


  addData(log) {
    if (this.state.date.length > 20) {
      this.state.temperature.shift();
      this.state.date.shift();
    }
    this.setState(state => ({
      temperature: [...state.temperature, log.temperature],
      date: [...state.date, log.date],
    }))
  }

  render() {
    return (
      <PageContainer title={false}>
        <Row justify="center">
          <Col>
            <Row justify="left">
              <Col>
                <Button
                  type={!this.state.connected ? "primary" : "danger"}
                  onClick={this.handleConnect}
                  disabled={this.state.inStream}
                >
                  {this.state.connected ? '断开服务' : '连接服务'}
                </Button>
              </Col>
              <Col>
                <Button
                  disabled={!this.state.connected}
                  type={!this.state.inStream ? "primary" : "danger"}
                  onClick={this.handleRequestStream}
                >
                  {this.state.inStream ? '断开流数据' : '连接流数据'}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Plot
                  data={[
                    {
                      x: this.state.date,
                      y: this.state.temperature,
                      type: 'scatter',
                      mode: 'lines',
                      marker: {color: 'rgba(197,84,118,0.71)'},
                    },
                  ]}
                  layout={{width: 1300,
                    height: 640,
                    title: '温度',
                    plot_bgcolor:"rgba(65,135,113,0.35)",
                    yaxis: {
                      rangemode:"tozero",
                    }
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </PageContainer>
    )
  }
}

export default Tmp;
