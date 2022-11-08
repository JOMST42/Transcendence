import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Body,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { EndGameDto } from './dto';
import { Game, User } from '@prisma/client';
import { GameService } from './game.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guards';
import { UpdateUserDto } from 'src/user/dto';

@UseGuards(JwtGuard)
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // @UseGuards(JwtGuard)
  // @Get(':id')
  // async getMe(@GetUser() game: Game): Promise<Game> {
  //   delete user.createdAt;
  //   delete user.updatedAt;
  //   return user;
  // }

  @Get(':id')
  async getGameById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Game | unknown> {
    return (await this.gameService.getGameById(id)) || {};
  }

  @Get('all')
  async getGames(): Promise<Game[] | unknown> {
    return (await this.gameService.getGames()) || {};
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

  @Get(':id/all')
  async getGamesWonByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Game[] | unknown> {
    return (await this.gameService.getGamesWonByUserId(id)) || {};
  }

  @Get(':id/all')
  async getGamesLostByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Game[] | unknown> {
    return (await this.gameService.getGamesLostByUserId(id)) || {};
  }

  // @Patch(':id')
  // async updateUserById(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() dto: UpdateUserDto,
  // ): Promise<User> {
  //   return await this.gameService.updateUserById(id, dto);
  // }

  // @Patch(':id')
  // async updateAvatarById(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() dto: UpdateUserDto,
  // ): Promise<User> {
  //   return await this.gameService.updateUserById(id, dto);
  // }
}
