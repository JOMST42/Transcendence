/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { PongServerGateway } from './pong-server/gateway/pong-server.gateway';
import { PongInviteService } from './pong-server/services/pong-invite.service';
import { PongQueueService } from './pong-server/services/pong-queue.service';
import { PongRoomService } from './pong-server/services/pong-room.service';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [
    PongRoomService,
    PongQueueService,
    PongInviteService,
    PongServerGateway,
    PongService,
  ],
  controllers: [PongController],
})
export class PongModule {}
