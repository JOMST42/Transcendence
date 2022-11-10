import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Game } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { EndGameDto } from './dto';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async getGameById(gameId: number): Promise<Game | null> {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    return game;
  }

  async getGames(): Promise<Game[] | null> {
    const games = await this.prisma.game.findMany();
    return games;
  }

  async getGamesByUserId(userId: number): Promise<Game[] | null> {
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            player1Id: userId,
          },
          {
            player2Id: userId,
          },
        ],
      },
    });
    return games;
  }

  async getGamesWonByUserId(userId: number): Promise<Game[] | null> {
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            player1Id: userId,
            winner: 'PLAYER1',
          },
          {
            player2Id: userId,
            winner: 'PLAYER2',
          },
        ],
      },
    });
    return games;
  }

  async getGamesLostByUserId(userId: number): Promise<Game[] | null> {
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            player1Id: userId,
            winner: 'PLAYER2',
          },
          {
            player2Id: userId,
            winner: 'PLAYER1',
          },
        ],
      },
    });
    return games;
  }

  async getGamesPlayedByUsers(
    userId1: number,
    userId2: number,
  ): Promise<Game[] | null> {
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          {
            player1Id: userId1,
            player2Id: userId2,
          },
          {
            player1Id: userId2,
            player2Id: userId1,
          },
        ],
      },
    });
    return games;
  }

  // updateUserById(gameId: number, dto: EndGameDto): Promise<Game | null> {
  //   const user = this.prisma.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //   });
  //   if (!user) {
  //     throw new ForbiddenException('user not found');
  //   }
  //   return this.prisma.user.update({
  //     where: {
  //       id: userId,
  //     },
  //     data: {
  //       ...dto,
  //     },
  //   });
  // }
}
