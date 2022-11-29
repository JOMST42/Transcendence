import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FtStrategy, JwtStrategy } from './strategy';
import { UserModule } from '../user/user.module';
import { SessionSerializer } from './utils';
import { TwoFAStrategy } from './strategy/TwoFAstrategy';
@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [
    AuthService,
    FtStrategy,
    JwtStrategy,
    SessionSerializer,
    TwoFAStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
