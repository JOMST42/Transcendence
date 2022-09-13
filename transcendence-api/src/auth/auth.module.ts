import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FtStrategy, JwtStrategy } from './strategy';
import { SessionSerializer } from './session.serializer';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [AuthService, FtStrategy, JwtStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
