import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
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
  handleLogin(): { msg: string } {
    return { msg: 'success' };
  }

  @Get('ft/callback')
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(FtAuthGuard)
  async handleCallback(
    @Res() res: Response,
    @GetUser() user: User,
  ): Promise<void> {
    res.cookie(
      'access_token',
      await this.authService.signToken({
        sub: user.id,
        isTwoFactorAuthEnabled: user.twoFAEnable,
        isTwoFactorAutehnticated: false,
      }),
      {
        maxAge: cookieConstants.maxAge,
        httpOnly: false,
        sameSite: 'strict',
      },
    );
    res.redirect(this.config.get('CLIENT_URL'));
  }

  @Post('2fa/turnOn')
  // @UseGuards(FtAuthGuard)
  async turnOnTwoFAuth(@GetUser() user: User, @Body() body: string) {
    const isValid = this.authService.validateTwoFAuthCode(body, user);
    if (!isValid) {
      throw new UnauthorizedException('Wrong authentification code');
    }
    return this.authService.logWith2FAuth(user);
  }

  // @Post('2fa/generate')
  // async
}
