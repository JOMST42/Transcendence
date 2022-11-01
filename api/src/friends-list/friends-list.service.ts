import { BadRequestException, Injectable } from '@nestjs/common';
import { Friendship } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsListService {
  constructor(private readonly prisma: PrismaService) {}

  async createFriendship(
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

    return await this.prisma.friendship.create({
      data: {
        adressee: { connect: { id: adressee.id } },
        requester: { connect: { id: userId } },
      },
    });
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
      throw new BadRequestException('Cannot fint user');
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

  async getFriendship(adresseeId: number, userId: number): Promise<boolean> {
    const adressee = await this.prisma.user.findUnique({
      where: {
        id: adresseeId,
      },
    });
    if (!adressee) {
      throw new BadRequestException('Cannot find user');
    }
    if (
      this.prisma.friendship.findFirst({
        where: {
          adresseeId: adressee.id,
          requesterId: userId,
          accepted: true,
        },
      })
    ) {
      return true;
    }
    return false;
  }
}
