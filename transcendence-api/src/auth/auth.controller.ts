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
import { FtAuthGuard, RefreshTokenGuard } from './guards';
import { cookieConstants } from '../constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('ft/login')
  @UseGuards(FtAuthGuard)
  handleLogin(): { msg: string } {
    return { msg: 'success' };
  }

  private async addAuthCookies(userId: number, res: Response): Promise<void> {
    res.cookie(
      'access_token',
      await this.authService.signToken({
        sub: userId,
      }),
      {
        maxAge: cookieConstants.maxAge,
        httpOnly: cookieConstants.httpOnly,
        sameSite: 'strict',
      },
    );
    res.cookie(
      'refresh_token',
      await this.authService.getRefreshToken({
        sub: userId,
      }),
      {
        maxAge: cookieConstants.maxAge,
        httpOnly: false,
        sameSite: 'strict',
      },
    );
  }

  @Get('ft/callback')
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(FtAuthGuard)
  async handleCallback(
    @Res() res: Response,
    @GetUser() user: User,
  ): Promise<void> {
    await this.addAuthCookies(user.id, res);
    res.redirect(this.config.get('CLIENT_URL'));
  }

  @Get('refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ msg: string }> {
    await this.addAuthCookies(user.id, res);
    return { msg: 'success' };
  }
}
