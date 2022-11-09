import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChatRoom, User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guards';
import { ChatRoomWithMessages, CreateChatRoomDto } from './dto';
import { ChatService } from './chat.service';

@UseGuards(JwtGuard)
@Controller('chatrooms')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChatRooms(@GetUser() user: User): Promise<ChatRoom[]> {
    return await this.chatService.getRoomsForUser(user.id);
  }

  @Post()
  async createChatRoom(
    @GetUser() user: User,
    @Body() dto: CreateChatRoomDto,
  ): Promise<ChatRoom> {
    return await this.chatService.createRoom(dto, user.id);
  }

  @Get(':id')
  async getChatRoom(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<ChatRoomWithMessages> {
    return await this.chatService.getRoomWithMessages(user.id, id);
  }
}
