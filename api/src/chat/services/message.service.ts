import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Message } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMessageDto } from '../dto/message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(
    userId: number,
    roomId: string,
    message: CreateMessageDto,
  ): Promise<Message> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: { users: true },
    });

    if (!room.users.find((user) => user.userId === userId)) {
      throw new UnauthorizedException("You can't post in this chat room");
    }

    return this.prisma.message.create({
      data: {
        ...message,
        author: { connect: { id: userId } },
        room: { connect: { id: roomId } },
      },
    });
  }
}
