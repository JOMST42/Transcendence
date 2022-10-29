import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Room, User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guards';
import { CreateRoomDto } from './dto';
import { ChatService } from './services/chat.service';

@UseGuards(JwtGuard)
@Controller('chat-rooms')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChatRooms(@GetUser() user: User): Promise<Room[]> {
    return await this.chatService.getRoomsForUser(user.id);
  }

  @Post()
  async createChatRoom(
    @GetUser() user: User,
    @Body() dto: CreateRoomDto,
  ): Promise<Room> {
    return await this.chatService.createRoom(dto, user.id);
  }
}
