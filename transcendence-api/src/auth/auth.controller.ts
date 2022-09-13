import { Controller, Get, UseGuards } from '@nestjs/common';
import { FtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  @Get('ft/login')
  @UseGuards(FtAuthGuard)
  handleLogin() {
    return { msg: '42 api' };
  }

  @Get('ft/callback')
  @UseGuards(FtAuthGuard)
  handleCallback() {
    return { msg: '42 callback' };
  }
}
