import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { Game } from '@prisma/client';
import { GameService } from './game.service';

import { JwtGuard } from 'src/auth/guards';

@UseGuards(JwtGuard)
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('all')
  async getGames(): Promise<Game[] | unknown> {
    console.log('get all games');
    return (await this.gameService.getGames()) || {};
  }

  @Get(':id')
  async getGameById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Game | unknown> {
    return (await this.gameService.getGameById(id)) || {};
  }

  @Get(':id1/vs/:id2')
  async getGamesPlayedByUsers(
    @Param('id1', ParseIntPipe) id1: number,
    @Param('id2', ParseIntPipe) id2: number,
  ): Promise<Game[] | unknown> {
    return (await this.gameService.getGamesPlayedByUsers(id1, id2)) || {};
  }

  @Get(':id/all')
  async getGamesByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Game[] | unknown> {
    return (await this.gameService.getGamesByUserId(id)) || {};
  }

  @Get(':id/won')
  async getGamesWonByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Game[] | unknown> {
    return (await this.gameService.getGamesWonByUserId(id)) || {};
  }

  @Get(':id/lost')
  async getGamesLostByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Game[] | unknown> {
    return (await this.gameService.getGamesLostByUserId(id)) || {};
  }
}
