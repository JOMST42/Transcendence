import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server;

  handleDisconnect(socket: Socket) {
    socket.handshake.headers.authorization;
    console.log('Connect');
  }

  handleConnection(client: any, ...args: any[]) {
    this.server.emit('message', 'test');
    console.log('Disconnect');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
