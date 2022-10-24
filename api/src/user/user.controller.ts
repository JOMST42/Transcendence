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
  OnModuleInit,
} from '@nestjs/common';

import { UpdateUserDto } from './dto';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guards';
import { UserService } from './services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserConnectionService } from './services/user-connection.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController implements OnModuleInit {
  constructor(
    private readonly userService: UserService,
    private readonly userConnectionService: UserConnectionService,
  ) {}

  async onModuleInit() {
    await this.userConnectionService.deleteAll();
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@GetUser() user: User): Promise<User> {
    delete user.createdAt;
    delete user.updatedAt;
    return user;
  }
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | unknown> {
    return (await this.userService.getUserById(id)) || {};
  }

  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUserById(id, dto);
  }

  /*To upload a single file, simply tie the FileInterceptor() 
	interceptor to the route handler and extract file from 
	the request using the @UploadedFile() decorator.*/
  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadImageToCloudinary(file);
  }

  @Patch(':id')
  async updateAvatarById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUserById(id, dto);
  }
}
