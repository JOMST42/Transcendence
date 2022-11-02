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
import { FriendService } from '../friends-list/friend.service';
import { UpdateFriendsDto } from 'src/friends-list/dto';

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

  @Get(':id/friends_list')
  async getFriendships(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Friendship[]> {
    return await this.friendService.getFriendships(userId);
  }

  @Get(':id/friend')
  async getFriendship(
    @Body() dto: UpdateFriendsDto,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Friendship> {
    return await this.friendService.getFriendship(dto.adresseeId, userId);
  }

  @Get(':id/pending_friends')
  async getPendingInvitations(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Friendship[]> {
    return await this.friendService.getPendingInvitations(userId);
  }

  @Patch(':id/addfriend/friend_id')
  async updateFriendship(
    dto: UpdateFriendsDto,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Friendship> {
    return await this.friendService.updateFriendship(dto.adresseeId, userId);
  }

  @Patch(':id/removefriend/friend_id')
  async removeFriendship(
    dto: UpdateFriendsDto,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Friendship> {
    return await this.friendService.removeFriendship(dto.adresseeId, userId);
  }

  //   @Post(':id/createfriend')
  //   async createFrienship(
  //     dto: UpdateFriendsDto,
  //     @Param('id', ParseIntPipe) userId: number,
  //   ): Promise<Friendship> {
  //     console.log('dans controlleur du back');
  //     return await this.friendService.createFriendship(dto.adresseeId, userId);
  //   }
  @Post(':id/createfriend/:friendId')
  async createFrienship(
    @Param('friendId', ParseIntPipe) adresseeId: number,
    @Param('id', ParseIntPipe) userId: number,
  ) {
    console.log('dans controlleur du back');
    return await this.friendService.createFriendship(adresseeId, userId);
  }
}
