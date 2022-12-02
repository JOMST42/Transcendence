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
import { UserService } from '../user/services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
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
      }),
      {
        maxAge: cookieConstants.maxAge,
        httpOnly: false,
        sameSite: 'strict',
      },
    );
    res.redirect(this.config.get('CLIENT_URL'));
  }

  @Get('ft/test')
  @HttpCode(HttpStatus.FOUND)
  async testUser(@Res() res: Response): Promise<void> {
    const user = await this.userService.getUserByName('olala');
    res.cookie(
      'access_token',
      await this.authService.signToken({
        sub: user.id,
      }),
      {
        maxAge: cookieConstants.maxAge,
        httpOnly: false,
        sameSite: 'strict',
      },
    );
    res.redirect(this.config.get('CLIENT_URL'));
  }
}
