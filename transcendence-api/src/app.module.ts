import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WeatherModule } from './weather/weather.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    WeatherModule,
    AuthModule,
    PassportModule.register({ session: true }),
    UserModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
