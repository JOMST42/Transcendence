import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient, Room } from '@prisma/client';
import { CreateRoomDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaClient) {}

  async createRoom(dto: CreateRoomDto): Promise<Room> {
    const owner = await this.prisma.user.findUnique({
      where: {
        id: dto.ownerId,
      },
    });

    if (!owner) {
      throw new BadRequestException("Room owner doesn't exist");
    }

    const room = await this.prisma.room.create({
      data: {
        name: dto.name,
        users: {
          create: [{ isOwner: true, user: { connect: owner.id } }],
        },
      },
    });

    return room;
  }

  async getRoomsForUser(userId): Promise<Room[]> {
    return this.prisma.room.findMany({
      where: { users: { some: { userId } } },
    });
  }
}
