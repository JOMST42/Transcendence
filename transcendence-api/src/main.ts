import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: '*',
    allowedHeaders: '*',
  });

  const configService = app.get(ConfigService);

  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 15,
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();
