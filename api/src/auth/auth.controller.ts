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
import { FtAuthGuard, JwtGuard } from './guards';
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
        isTwoFactorAuthEnabled: user.isTwoFactorAuthEnabled,
        isTwoFactorAuthenticated: false,
      }),
      {
        maxAge: cookieConstants.maxAge,
        httpOnly: false,
        sameSite: 'strict',
      },
    );
    if (user.isTwoFactorAuthEnabled) {
      res.redirect(this.config.get('CLIENT_URL_2FA'));
      return;
    }
    res.redirect(this.config.get('CLIENT_URL'));
  }

  @Post('2fa/generate')
  @UseGuards(JwtGuard)
  async register(@Res() res, @GetUser() user: User): Promise<string> {
    const otpAuthUrl = await this.authService.generateTwoFAuthSecret(user);
    return res.json(await this.authService.generateQrCode(otpAuthUrl));
  }

  @Post('2fa/turn-on')
  @UseGuards(JwtGuard)
  async turnOnTwoFAuth(@GetUser() user: User, @Body() body) {
    if (user.isTwoFactorAuthEnabled) {
      throw new UnauthorizedException('You already enable the 2FA');
    }
    const isCodeValid = this.authService.validateTwoFAuthCode(body.code, user);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.turnOnTwoFAuth(user.id);
  }

  @Post('2fa/authenticate')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(TwoFAGuard)
  async authenticate(
    @GetUser() user: User,
    @Body() body,
    @Res() res: Response,
  ) {
    const isCodeValid = this.authService.validateTwoFAuthCode(body.code, user);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return res.json(await this.authService.login2FA(user, res));
  }
}
