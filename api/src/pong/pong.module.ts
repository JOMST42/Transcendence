/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { PongGameModule } from './pong-game/pong-game.module';
import { PongServerModule } from './pong-server/pong-server.module';

@Module({
  imports: [PongGameModule, PongServerModule, AuthModule, UserModule],
})
export class PongModule {}
