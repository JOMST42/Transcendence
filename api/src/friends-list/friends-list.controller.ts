import { Controller, Get, Patch, Post } from '@nestjs/common';
import { Friendship } from '@prisma/client';
import { FriendsListService } from './friends-list.service';

@Controller('friendsList')
export class FriendsListController {
  constructor(private readonly friendList: FriendsListService) {}

  @Get('friendship')
  async getFriendship(
    adresseeId: number,
    requesterId: number,
  ): Promise<boolean> {
    return await this.friendList.getFriendship(adresseeId, requesterId);
  }

  @Patch('friendship')
  async updateFriendship(
    adresseeId: number,
    requesterId: number,
  ): Promise<Friendship> {
    return await this.friendList.updateFriendship(adresseeId, requesterId);
  }

  @Patch('friendship')
  async removeFriendship(
    adresseeId: number,
    requesterId: number,
  ): Promise<Friendship> {
    return await this.friendList.removeFriendship(adresseeId, requesterId);
  }

  @Post('friendship')
  async createFrienship(
    adresseeId: number,
    requesterId: number,
  ): Promise<Friendship> {
    return await this.friendList.createFriendship(adresseeId, requesterId);
  }
}
