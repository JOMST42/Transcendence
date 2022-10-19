import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guards';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@GetUser() user: User): Promise<User> {
    return user;
  }
}
