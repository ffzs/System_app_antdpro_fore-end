import {IdentitySerializer, JsonSerializer, RSocketClient, RSocketResumableTransport} from "rsocket-core";
import {message} from "antd";
import RSocketWebSocketClient from "rsocket-websocket-client";
import {v4} from 'uuid';
import {Weather} from "./Weather";

export class Client {

  constructor(address) {
    this.client = new RSocketClient({
      serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer
      },
      setup: {
        keepAlive: 10000,
        lifetime: 20000,
        dataMimeType: 'application/json',
        metadataMimeType: 'message/x.rsocket.routing.v0',
      },
      transport: new RSocketResumableTransport(
        () => new RSocketWebSocketClient({url: address}),
        {
          bufferSize: 200,
          // 这里类似token，session的东西，用于区分用户，鉴权，同一个resumeToken只能有一个获取数据
          resumeToken: v4('ffzs'),
        })
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.client.connect().subscribe({
        onComplete: s => {
          this.socket = s;
          this.socket.connectionStatus().subscribe(status => {
            message.info(`链接状态: ${JSON.stringify(status)}`)
          });

          resolve(this.socket);
        },
        onError: error => {
          reject(error);
        },
        onSubscribe: cancel => {
          this.cancel = cancel
        }
      });
    });
  }

  requestResponse(message, route) {
    return new Promise((resolve, reject) => {
      this.socket.requestResponse({
        data: message,
        metadata: String.fromCharCode(route.length) + route
      }).subscribe({
        onComplete: msg => {
          resolve(new Weather().toObject(msg.data))
        },
        onError: error => {
          reject(error)
        }
      });
    });
  }

  fireAndForget(message, route) {
    return this.socket.fireAndForget({
      data: message,
      metadata: `${String.fromCharCode(route.length)}${route}`
    });
  }

  requestStream(message, route) {
    return this.socket.requestStream({
      data: message,
      metadata: `${String.fromCharCode(route.length)}${route}`
    });
  }

  requestChannel(flow, route) {
    return this.socket.requestChannel(flow.map(msg => {
      return {
        data: msg,
        metadata: `${String.fromCharCode(route.length)}${route}`
      };
    }));
  }

  disconnect() {
    console.log('rsocketclientsocket', this.socket);
    console.log('rsocketclient', this.client);
    this.client.close();
  }

}
