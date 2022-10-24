import { BadRequestException, Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(dto: CreateRoomDto, ownerId: number): Promise<Room> {
    const owner = await this.prisma.user.findUnique({
      where: {
        id: ownerId,
      },
    });

    if (!owner) {
      throw new BadRequestException("Room owner doesn't exist");
    }

    return this.prisma.room.create({
      data: {
        name: dto.name,
        users: {
          create: [{ isOwner: true, user: { connect: { id: owner.id } } }],
        },
      },
    });
  }

  async getRoomsForUser(userId: number): Promise<Room[]> {
    return this.prisma.room.findMany({
      where: { users: { some: { userId } } },
    });
  }

  async addUserToRoom(userId: number, roomId: number): Promise<Room> {
    await this.prisma.userRoom.create({ data: { userId, roomId } });
    return this.prisma.room.findUnique({ where: { id: roomId } });
  }
}
