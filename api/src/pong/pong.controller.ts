import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Body,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  OnModuleInit,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { Friendship, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { FriendService } from '../friends-list/friend.service';
import { UserService } from 'src/user/services/user.service';
import { Response } from './pong-server/data/interfaces';
import { PongService } from './pong.service';

@UseGuards(JwtGuard)
@Controller('pong')
export class PongController {
  constructor(
    private readonly userService: UserService,
    private readonly pongService: PongService,
  ) {}

  @Get(':id/userState')
  async getUserState(@Param('id', ParseIntPipe) id: number): Promise<Response> {
    const user = this.userService.getUserById(id);
    if (!user) return { code: 1, msg: 'Given user id is invalid' };
    const state = this.pongService.getUserState(id);
    return {
      code: 0,
      msg: 'state fetched',
      payload: this.pongService.getUserState(id),
    };
  }

  @Get(':id/canInvite')
  async getInviteState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response> {
    const user = this.userService.getUserById(id);
    if (!user) return { code: 1, msg: 'Given user id is invalid' };
    return this.pongService.canInvite(id);
  }

  @Get(':id/canQueue')
  async getQueueState(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response> {
    const user = this.userService.getUserById(id);
    if (!user) return { code: 1, msg: 'Given user id is invalid' };
    return this.pongService.canQueue(id);
  }

  @Get(':id/canJoinGame')
  async getJoinGame(@Param('id', ParseIntPipe) id: number): Promise<Response> {
    const user = this.userService.getUserById(id);
    if (!user) return { code: 1, msg: 'Given user id is invalid' };
    return this.pongService.canJoinGame(id);
  }
}
