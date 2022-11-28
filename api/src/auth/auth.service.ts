import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { jwtTokenConstants } from '../constants';
import { toDataURL } from 'qrcode';

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

  async setTwoFAuthSecret(secret: string, userId: number) {
    this.prisma.user.update({
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

  async turnOnTwoFAuth(userId: number) {
    this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        twoFAEnable: true,
      },
    });
  }

//   async generateQrCode(otpAuthUrl: string) {
//     return toDataURL(otpAuthUrl);
//   }

  validateTwoFAuthCode(code: string, user: User): boolean {
    return authenticator.verify({
      token: code,
      secret: user.twoFASecret,
    });
  }

  async logWith2FAuth(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      isTwoFactorAuthEnabled: user.twoFAEnable,
      isTwoFactorAutehnticated: true,
    };
    return { email: payload.email, access_token: this.jwt.sign(payload) };
  }
}
