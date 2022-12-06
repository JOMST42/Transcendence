import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatRoom, User, UserChatRoom } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guards';
import {
  ChangePasswordDto,
  ChangeRoleDto,
  ChatRoomWithMessages,
  CreateChatRoomDto,
  CreateDmDto,
} from './dto';
import { ChatService } from './chat.service';

@UseGuards(JwtGuard)
@Controller('chatrooms')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChatRooms(@GetUser() user: User): Promise<ChatRoom[]> {
    return await this.chatService.getRoomsForUser(user.id);
  }

  @Post('dm')
  async createDm(
    @GetUser() user: User,
    @Body() dto: CreateDmDto,
  ): Promise<ChatRoom> {
    try {
      return await this.chatService.createDm(user.id, dto.otherId);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new BadRequestException('Error');
    }
  }

  @Get('blocked')
  async getAllBlockedUsers(@GetUser() user: User): Promise<User[]> {
    return await this.chatService.getAllBlockedUsers(user.id);
  }

  @Post(':id')
  async connectToRoom(
    @GetUser() user: User,
    @Param('id') roomId: string,
    @Body() body: { password: string },
  ): Promise<UserChatRoom> {
    return await this.chatService.addUserToRoom(user.id, roomId, body.password);
  }

  @Post()
  async createChatRoom(
    @GetUser() user: User,
    @Body() dto: CreateChatRoomDto,
  ): Promise<ChatRoom> {
    try {
      return await this.chatService.createRoom(dto, user.id);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new BadRequestException('Error');
    }
  }

  @Get(':id')
  async getChatRoom(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<ChatRoomWithMessages> {
    return await this.chatService.getRoomWithMessages(user.id, id);
  }

  @Get(':id/user')
  async getUserChatRoom(
    @Param('id') roomId: string,
    @Query('userId') userId: number,
  ): Promise<UserChatRoom> {
    return await this.chatService.getUserChatRoom(userId, roomId);
  }

  @Delete(':id')
  async leaveRoom(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<void> {
    return await this.chatService.removeUserFromRoom(user.id, id);
  }

  @Post(':id/changepassword')
  async changePassword(
    @GetUser() user: User,
    @Param('id') roomId: string,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    console.log(dto);

    await this.chatService.changePassword(user.id, roomId, dto.password);
  }

  @Post(':id/changerole')
  async changeRole(
    @GetUser() user: User,
    @Param('id') roomId: string,
    @Body() dto: ChangeRoleDto,
  ): Promise<UserChatRoom> {
    return this.chatService.changeUserRole(
      user.id,
      dto.userId,
      roomId,
      dto.role,
    );
  }
}
