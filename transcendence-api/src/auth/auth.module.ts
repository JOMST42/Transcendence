import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FtStrategy } from './strategy';

@Module({
  providers: [AuthService, FtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
