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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { UpdateUserDto } from './dto';
import { Friendship, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guards';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FriendService } from '../friends-list/friends-list.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly friendService: FriendService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@GetUser() user: User): Promise<User> {
    return user;
  }
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | unknown> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Empty body');
    }
    return await this.userService.updateUserById(id, dto);
  }

  /*To upload a single file, simply tie the FileInterceptor() 
	interceptor to the route handler and extract file from 
	the request using the @UploadedFile() decorator.*/
  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    const res = await this.userService.uploadImageToCloudinary(file);
    return this.userService.updateUserById(user.id, { avatarUrl: res.url });
  }

  @Get(':id/friends')
  async getFriendships(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Friendship[]> {
    return await this.friendService.getFriendships(id);
  }

  @Get(':id/friend')
  async getFriendship(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Friendship> {
    return await this.friendService.getFriendship(id, user.id);
  }

  @Patch(':id/friend/:adresseeId')
  async updateFriendship(
    adresseeId: number,
    requesterId: number,
  ): Promise<Friendship> {
    return await this.friendService.updateFriendship(adresseeId, requesterId);
  }

  @Patch('friendship')
  async removeFriendship(
    adresseeId: number,
    requesterId: number,
  ): Promise<Friendship> {
    return await this.friendService.removeFriendship(adresseeId, requesterId);
  }

  @Post('friendship')
  async createFrienship(
    adresseeId: number,
    requesterId: number,
  ): Promise<Friendship> {
    return await this.friendService.createFriendship(adresseeId, requesterId);
  }
}
