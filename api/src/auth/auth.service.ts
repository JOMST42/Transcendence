import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { cookieConstants, jwtTokenConstants } from '../constants';
import { toDataURL } from 'qrcode';
import { Response } from 'express';

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
        //on ajoute les infos sur le 2FA
      },
    );
  }

  async decodeToken(token: string): Promise<TokenPayload> {
    return this.jwt.verifyAsync(token, {
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async login2FA(user: User, res: Response) {
    const payload = {
      sub: user.id,
      isTwoFactorAuthEnabled: user.isTwoFactorAuthEnabled,
      isTwoFactorAuthenticated: true,
    };
    res?.cookie('access_token', await this.signToken(payload), {
      maxAge: cookieConstants.maxAge,
      httpOnly: false,
      sameSite: 'strict',
    });
    return true;
  }

  async setTwoFAuthSecret(secret: string, userId: number) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFASecret: secret,
      },
    });
  }

  async generateTwoFAuthSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      'TRANSCENDENCE',
      secret,
    );
    await this.setTwoFAuthSecret(secret, user.id);
    return otpauthUrl;
  }

  async generateQrCode(otpAuthUrl: string): Promise<string> {
    return toDataURL(otpAuthUrl);
  }

  validateTwoFAuthCode(code: string, user: User): boolean {
    if (!user) return false;
    return authenticator.verify({
      token: code,
      secret: user.twoFASecret,
    });
  }
}
