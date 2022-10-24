import { Injectable } from '@nestjs/common';
import { UserConnection } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserConnectionDto } from '../dto';

@Injectable()
export class UserConnectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    userConnection: CreateUserConnectionDto,
  ): Promise<UserConnection> {
    return this.prisma.userConnection.create({
      data: {
        ...userConnection,
        user: { connect: { id: userId } },
      },
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.userConnection.deleteMany({});
  }

  async deleteBySocketId(socketId: string): Promise<UserConnection> {
    return this.prisma.userConnection.delete({
      where: { socketId },
    });
  }
}
