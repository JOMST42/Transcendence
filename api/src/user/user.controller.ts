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

import { UpdateUserDto } from './dto';
import { Friendship, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guards';
import { UserService } from './services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserConnectionService } from './services/user-connection.service';
import { FriendService } from '../friends-list/friend.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly userConnectionService: UserConnectionService,
    private readonly friendService: FriendService,
  ) {}

  async onModuleInit() {
    await this.userConnectionService.deleteAll();
  }

  @Get('me')
  async getMe(@GetUser() user: User): Promise<User> {
    return user;
  }

  @Get('all')
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
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

  @Get(':id/friend/:friendId')
  async getFriendship(
    @Param('friendId', ParseIntPipe) adresseeId: number,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Friendship> {
    return await this.friendService.getFriendship(adresseeId, userId);
  }

  @Get(':id/pendingFriends')
  async getPendingInvitations(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Friendship[]> {
    return await this.friendService.getPendingInvitations(userId);
  }

  // lorsqu'on accepte une invitation, l'adressee est nous meme et le user est le friend
  @Patch(':id/addfriend/:friendId')
  async updateFriendship(
    @Param('friendId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) adresseeId: number,
  ): Promise<Friendship> {
    return await this.friendService.updateFriendship(adresseeId, userId);
  }

  @Patch(':id/removefriend/:friendId')
  async removeFriendship(
    @Param('friendId', ParseIntPipe) adresseeId: number,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Friendship> {
    return await this.friendService.removeFriendship(adresseeId, userId);
  }

  @Patch(':id/blockfriend/:friendId')
  async blockFriend(
    @Param('id', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) adresseeId: number,
  ): Promise<Friendship> {
    return await this.friendService.blockFriend(adresseeId, userId);
  }

  @Patch(':id/unblockfriend/:friendId')
  async unblockFriend(
    @Param('friendId', ParseIntPipe) adresseeId: number,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Friendship> {
    return await this.friendService.unblockFriend(adresseeId, userId);
  }

  @Post(':id/createfriend/:friendId')
  async createFrienship(
    @Param('friendId', ParseIntPipe) adresseeId: number,
    @Param('id', ParseIntPipe) userId: number,
  ) {
    return await this.friendService.createFriendship(adresseeId, userId);
  }
}
