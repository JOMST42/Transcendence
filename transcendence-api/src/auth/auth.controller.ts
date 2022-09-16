import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { FtAuthGuard } from './guards';
import { cookieConstants } from '../constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('ft/login')
  @UseGuards(FtAuthGuard)
  handleLogin() {
    return { msg: '42 api' };
  }

  @Get('ft/callback')
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(FtAuthGuard)
  async handleCallback(
    @Res() response: Response,
    @GetUser() user: User,
  ): Promise<void> {
    response.cookie(
      'access_token',
      await this.authService.signToken({
        sub: user.id,
      }),
      { maxAge: cookieConstants.maxAge, httpOnly: cookieConstants.httpOnly },
    );
    response.redirect(this.config.get('CLIENT_URL'));
  }
}
