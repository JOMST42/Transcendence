import { BadRequestException, Injectable } from '@nestjs/common';
import { Friendship } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateFriendsDto } from './dto';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  async createFriendship(
    adresseeId: number,
    userId: number,
  ): Promise<Friendship | null> {
    const adressee = await this.prisma.user.findUnique({
      where: {
        id: adresseeId,
      },
    });
    if (!adressee) {
      throw new BadRequestException('Cannot find user');
    }
    const friend = await this.getFriendship(adresseeId, userId);
    if (!friend) {
      return await this.prisma.friendship.create({
        data: {
          adressee: { connect: { id: adressee.id } },
          requester: { connect: { id: userId } },
        },
      });
    }
    return null;
  }

  async updateFriendship(
    adresseeId: number,
    userId: number,
  ): Promise<Friendship> {
    const adressee = await this.prisma.user.findUnique({
      where: {
        id: adresseeId,
      },
    });
    if (!adressee) {
      throw new BadRequestException('Cannot find user');
    }
    return await this.prisma.friendship.update({
      where: {
        requesterId_adresseeId: {
          requesterId: userId,
          adresseeId: adressee.id,
        },
      },
      data: {
        accepted: true,
      },
    });
  }

  async removeFriendship(
    adresseeId: number,
    userId: number,
  ): Promise<Friendship> {
    const adressee = await this.prisma.user.findUnique({
      where: {
        id: adresseeId,
      },
    });
    if (!adressee) {
      throw new BadRequestException('Cannot fint user');
    }
    return await this.prisma.friendship.delete({
      where: {
        requesterId_adresseeId: {
          requesterId: userId,
          adresseeId: adressee.id,
        },
      },
    });
  }

  async blockFriend(adresseeId: number, userId: number): Promise<Friendship> {
    console.log('dans blocked friend back');
    const adressee = await this.prisma.user.findUnique({
      where: {
        id: adresseeId,
      },
    });
    if (!adressee) {
      throw new BadRequestException('Cannot find user');
    }
    return await this.prisma.friendship.update({
      where: {
        requesterId_adresseeId: {
          requesterId: userId,
          adresseeId: adressee.id,
        },
      },
      data: {
        blocked: true,
      },
    });
  }

  async unblockFriend(adresseeId: number, userId: number): Promise<Friendship> {
    const adressee = await this.prisma.user.findUnique({
      where: {
        id: adresseeId,
      },
    });
    if (!adressee) {
      throw new BadRequestException('Cannot find user');
    }
    return await this.prisma.friendship.update({
      where: {
        requesterId_adresseeId: {
          requesterId: userId,
          adresseeId: adressee.id,
        },
      },
      data: {
        blocked: false,
      },
    });
  }

  async getFriendship(
    adresseeId: number,
    requesterId: number,
  ): Promise<Friendship> {
    return await this.prisma.friendship.findFirst({
      where: {
        OR: [
          {
            adresseeId: adresseeId,
            requesterId: requesterId,
          },
          {
            adresseeId: requesterId,
            requesterId: adresseeId,
          },
        ],
      },
    });
  }

  async getFriendships(userId: number): Promise<Friendship[]> {
    return await this.prisma.friendship.findMany({
      where: {
        OR: [
          {
            adresseeId: userId,
          },
          {
            requesterId: userId,
          },
        ],
      },
    });
  }

  async getPendingInvitations(userId: number): Promise<Friendship[]> {
    return await this.prisma.friendship.findMany({
      where: {
        OR: [
          {
            adresseeId: userId,
            accepted: false,
          },
          {
            requesterId: userId,
            accepted: false,
          },
        ],
      },
    });
  }
}
