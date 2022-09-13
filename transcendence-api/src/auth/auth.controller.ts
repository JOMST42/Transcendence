import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { FtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('ft/login')
  @UseGuards(FtAuthGuard)
  handleLogin() {
    return { msg: '42 api' };
  }

  @Get('ft/callback')
  @UseGuards(FtAuthGuard)
  async handleCallback(
    @GetUser() user: User,
  ): Promise<{ access_token: string }> {
    return {
      access_token: await this.authService.signToken({
        sub: user.id,
        displayName: user.displayName,
      }),
    };
  }
}
