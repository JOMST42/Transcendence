import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { jwtTokenConstants } from '../constants';

import { PrismaService } from '../prisma/prisma.service';
import { TokenPayload, UserDetails } from './utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(details: UserDetails): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: details.email,
      },
    });

    // If found, update user
    if (user) {
      delete details.displayName;
      return await this.prisma.user.update({
        data: {
          username: details.username.toLowerCase(),
          ...details,
        },
        where: {
          email: details.email,
        },
      });
    }

    // Else, create new user
    try {
      return await this.prisma.user.create({
        data: {
          username: details.username.toLowerCase(),
          normalizedName: details.displayName.toLowerCase(),
          ...details,
        },
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async signToken(payload: TokenPayload): Promise<string> {
    return this.jwt.signAsync(
      { ...payload },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: jwtTokenConstants.accessToken.expiresIn,
      },
    );
  }

  async decodeToken(token: string): Promise<TokenPayload> {
    return this.jwt.verifyAsync(token, {
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
