import { Inject, Injectable, Logger, Module } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { PongGameModule } from '../pong-game/pong-game.module';
import { PongServerGateway } from './gateway/pong-server.gateway';
import { PongRoomService } from './services/pong-room.service';
import { PongQueueService } from './services/pong-queue.service';
import { AuthModule } from '../../auth/auth.module';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [PongGameModule, AuthModule, UserModule],
  providers: [PongRoomService, PongQueueService, PongServerGateway],
})
export class PongServerModule {}
