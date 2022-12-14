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
import { PongServerInterceptor } from './pong-server.interceptor';
import { PongInviteService } from './services/pong-invite.service';
import { PongService } from '../pong.service';

@Module({
  imports: [PongGameModule, AuthModule, UserModule],
  providers: [
    PongRoomService,
    PongQueueService,
    PongInviteService,
    PongService,
    PongServerGateway,
    PongServerInterceptor,
  ],
})
export class PongServerModule {}
