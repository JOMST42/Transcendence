import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatRoom, ChatRoomVisibility } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChatRoomWithMessages, CreateChatRoomDto } from './dto';
import { ChatMessageWithAuthor, CreateChatMessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(dto: CreateChatRoomDto, ownerId: number): Promise<ChatRoom> {
    const owner = await this.prisma.user.findUnique({
      where: {
        id: ownerId,
      },
    });

    if (!owner) {
      throw new BadRequestException("Room owner doesn't exist");
    }

    return this.prisma.chatRoom.create({
      data: {
        name: dto.name,
        users: {
          create: [{ isOwner: true, user: { connect: { id: owner.id } } }],
        },
      },
    });
  }

  async getRoomsForUser(userId: number): Promise<ChatRoom[]> {
    return this.prisma.chatRoom.findMany({
      where: {
        OR: [
          { users: { some: { userId } } },
          { visibility: ChatRoomVisibility.PUBLIC },
        ],
      },
    });
  }

  async addUserToRoom(userId: number, roomId: string): Promise<ChatRoom> {
    await this.prisma.userChatRoom.create({ data: { userId, roomId } });
    return this.prisma.chatRoom.findUnique({ where: { id: roomId } });
  }

  async validateUserForRoom(userId: number, roomId: string): Promise<ChatRoom> {
    let room = await this.prisma.chatRoom.findFirst({
      where: {
        AND: {
          id: roomId,
          users: {
            some: { userId },
          },
        },
      },
    });

    if (!room) {
      room = await this.prisma.chatRoom.findFirst({
        where: { id: roomId, visibility: ChatRoomVisibility.PUBLIC },
      });
      if (room) {
        await this.addUserToRoom(userId, roomId);
      }
    }

    if (!room) {
      throw new UnauthorizedException("You can't access this chatroom");
    }

    return room;
  }

  async createMessage(
    userId: number,
    roomId: string,
    message: CreateChatMessageDto,
  ): Promise<ChatMessageWithAuthor> {
    console.log(roomId);

    const room = await this.validateUserForRoom(userId, roomId);

    return this.prisma.chatMessage.create({
      data: {
        ...message,
        author: { connect: { id: userId } },
        room: { connect: { id: room.id } },
      },
      include: { author: true },
    });
  }

  async getRoomWithMessages(
    userId: number,
    roomId: string,
  ): Promise<ChatRoomWithMessages> {
    await this.validateUserForRoom(userId, roomId);

    return this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
      include: {
        messages: {
          include: { author: true },
          orderBy: {
            createdAt: 'asc',
          },
        },
        users: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
