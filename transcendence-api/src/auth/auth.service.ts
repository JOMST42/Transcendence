import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Profile } from 'passport-42';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(profile: Profile): Promise<User | null> {
    const email = profile.email.slice();
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    // If found, update user
    if (user) {
      delete profile.email;
      return await this.prisma.user.update({
        data: {
          username: profile.username.toLowerCase(),
          ...profile,
        },
        where: {
          email,
        },
      });
    }

    // Else, create new user
    try {
      return await this.prisma.user.create({
        data: {
          username: profile.username.toLowerCase(),
          ...profile,
        },
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
