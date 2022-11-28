import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
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
import { UserService } from 'src/user/services/user.service';

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
        isTwoFactorAuthenticated: user.isTwoFactorAuthenticated,
      }),
      {
        maxAge: cookieConstants.maxAge,
        httpOnly: false,
        sameSite: 'strict',
      },
    );
    res.redirect(this.config.get('CLIENT_URL'));
  }

  //   @Post('login')
  //   @HttpCode(200)
  //   async login(@Request() req) {
  //     const user = req.user;
  //     return this.authService.login2FA(user);
  //   }

  @Post('2fa/generate')
  // @UseGuards(FtAuthGuard)
  async register(@Res() res, @Request() req) {
    const otpAuthUrl = await this.authService.generateTwoFAuthSecret(req.user);
    return res.json(await this.authService.generateQrCode(otpAuthUrl));
  }

  @Post('2fa/turn-on')
  //   @UseGuards(FtAuthGuard)
  async turnOnTwoFAuth(@Req() request, @Body() body) {
    const isCodeValid = this.authService.validateTwoFAuthCode(
      body.code,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authenticqtion code');
    }
    await this.userService.turnOnTwoFAuth(request.user.id);
  }

  @Post('2fa/authenticate')
  @HttpCode(200)
  //   @UseGuards(FtAuthGuard)
  async authenticate(@Request() request, @Body() body) {
    const isCodeValid = this.authService.validateTwoFAuthCode(
      body.code,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authenticqtion code');
    }
    return this.authService.login2FA(request.user);
  }
}
