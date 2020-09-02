import React, {Component} from 'react';
import './App.css';
import Plot from 'react-plotly.js';
import {Button, Col, Input, Row, Divider} from "antd";
import {Client} from './rsocketClient';
import {Weather} from './Weather';
import {PageContainer} from "@ant-design/pro-layout";

const {TextArea} = Input;

class Tmp extends Component {

  requestStreamSubscription;

  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      streamInProgress: false,
      // channelInProgress: false,
      address: 'ws://localhost:8081',
      data: [],
      date: []
    };

    this.handleConnect = this.handleConnect.bind(this);
    // this.handleRequestResponse = this.handleRequestResponse.bind(this);
    this.handleRequestStream = this.handleRequestStream.bind(this);
    // this.handleFireAndForget = this.handleFireAndForget.bind(this);
    // this.handleRequestChannel = this.handleRequestChannel.bind(this);
  }

  handleConnect() {
    if (!this.state.connected) {
      this.client = new Client(this.state.address);
      this.client.connect().then(() => {
        this.setState({connected: true});
        // this.appendLog(`Connected to ${this.state.address}`);
      });
    } else {
      this.client.disconnect();
      this.setState({connected: false});
      // this.appendLog(`Disconnected from ${this.state.address}`);
    }
  }

  handleRequestStream() {
    if (!this.state.streamInProgress) {
      const requestedMsg = 10;
      let processedMsg = 0;
      const msg = new Weather('client', 'request');
      // this.appendLog(`REQUEST STREAM, request: ${msg.toString()}`);

      this.client.requestStream(msg, 'weather').subscribe({
        onSubscribe: sub => {
          // this.appendLog('REQUEST STREAM: subscribed to stream');
          this.requestStreamSubscription = sub;
          // this.appendLog(`REQUEST STREAM: request ${requestedMsg} Weathers`);
          this.requestStreamSubscription.request(requestedMsg);
          this.setState({streamInProgress: true});
        },
        onError: error => {
          // this.appendLog(`REQUEST STREAM: error occurred: ${JSON.stringify(error)}`);
        },
        onNext: msg => {
          // this.appendLog(`REQUEST STREAM: new Weather arrived: ${new Weather().toObject(msg.data).toString()}`);
          console.log(msg.data);
          this.appendLog(msg.data);
          processedMsg += 1;

          if (processedMsg >= requestedMsg) {
            // this.appendLog(`REQUEST STREAM: request ${requestedMsg} Weathers`);
            this.requestStreamSubscription.request(requestedMsg);
            processedMsg = 0;
          }

        },
        onComplete: () => {
          // this.appendLog('REQUEST STREAM: stream completed');
        },
      });
    } else {
      this.requestStreamSubscription.cancel();
      this.setState({streamInProgress: false});
      // this.appendLog('REQUEST STREAM: stream cancelled');
    }
  }

  handleAddressChange(event) {
    this.setState({
      address: event.target.value,
    });
  }

  appendLog(log) {
    this.setState(state => ({
      data: [...state.data, log.temperature],
      date: [...state.date, log.date],
    }))
  }

  render() {
    return (
      <PageContainer title={false}>
        <Row gutter={16} justify="center">
          <Col span={8}>
            <Input
              id="text-field-address"
              value={this.state.address}
              onChange={this.handleAddressChange}
              placeholder="ws://localhost:8081"
              autoFocus
            />
          </Col>
          <Col span={1}>
            <Button
              color="primary"
              className="connect-btn"
              onClick={this.handleConnect}
            >
              {this.state.connected ? '断开' : '连接'}
            </Button>
          </Col>
          <Col span={3}>
            <Button
              color="primary"
              className="connect-btn"
              onClick={this.handleRequestStream}
            >
              {this.state.streamInProgress ? '断开流数据' : '连接流数据'}
            </Button>
          </Col>
        </Row>
        <Divider />
        <Row justify="center">
          <Col span={16} >
            <Plot
              data={[
                {
                  x: this.state.date,
                  y: this.state.data,
                  type: 'scatter',
                  mode: 'lines',
                  marker: {color: 'red'},
                },
              ]}
              layout={ {width:1300, height: 640, title: '温度'} }
            />
          </Col>
        </Row>
      </PageContainer>
    )
  }
}

export default Tmp;
