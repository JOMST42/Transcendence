import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async getUserById(userId: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user && !user.avatarUrl) {
      user.avatarUrl = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&rounded=true&bold=true&size=256`;
    }
    return user;
  }

  async getUsers(displayName?: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        normalizedName: {
          startsWith: displayName?.toLowerCase(),
        },
      },
    });
  }

  async updateUserById(
    userId: number,
    dto: UpdateUserDto,
  ): Promise<User | null> {
    const user = this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ForbiddenException('user not found');
    }
    if (dto.displayName) {
      const sameName = await this.prisma.user.findUnique({
        where: {
          normalizedName: dto.displayName.toLowerCase(),
        },
      });
      if (sameName) {
        throw new BadRequestException('Display name already taken');
      }
      dto.normalizedName = dto.displayName.toLowerCase();
    }
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
  }

  async getUserByName(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type');
    });
  }

  async turnOnTwoFAuth(userId: number) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isTwoFactorAuthEnabled: true,
      },
    });
  }

  async turnOffTwoFAuth(userId: number) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isTwoFactorAuthEnabled: false,
        twoFASecret: null,
      },
    });
  }
}
