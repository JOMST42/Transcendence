import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { cookieConstants } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('CLIENT_URL'),
    methods: '*',
    allowedHeaders: ['authorization', 'content-type'],
    credentials: true,
  });

  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: cookieConstants.maxAge,
        httpOnly: cookieConstants.httpOnly,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();