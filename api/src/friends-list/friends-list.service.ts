import { BadRequestException, Injectable } from '@nestjs/common';
import { Friendship } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateFriendsListDto } from './dto';

@Injectable()
export class FriendsListService {
  constructor(private readonly prisma: PrismaService) {}

  async addFriend(
    requesterId: number,
    adresseeId: number,
    dto: UpdateFriendsListDto,
  ): Promise<Friendship> {
    const requester = this.prisma.user.findUnique({
      where: {
        id: requesterId,
      },
    });
    const adressee = this.prisma.user.findUnique({
      where: {
        id: adresseeId,
      },
    });
    if (!requester || !adressee) {
      throw new BadRequestException('requester ou adressee non valide');
    }
    return this.prisma.user.update({
      where: {
        friendsRequests.requester: requester,
      },
      data: {
        ...dto,
      },
    });
  }
}
